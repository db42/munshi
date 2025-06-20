import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { documents } from '../services/document';
import { parsedDocuments } from '../services/parsedDocument';
import { loadPDFGemini } from '../document-parsers/geminiForm16PDFParser';
import { DocumentType, DocumentState } from '../types/document';
import { parseUSEquityPDFWithGemini } from '../document-parsers/geminiUSEquityPDFParser';
import { parseCharlesSchwabCSV } from '../document-parsers/charlesSchwabCSVParser';
import { parseUSEquityCGStatementCSV } from '../document-parsers/usEquityCGStatementCSVParser';
import { parseUSEquityDividendCSV } from '../document-parsers/usEquityDividendCSVParser';
import { parseAISPDFWithGemini } from '../document-parsers/geminiAISPDFParser';
import { parseForm26ASPDFWithGemini } from '../document-parsers/form26ASPDFParser';
import { parseCAMSCapitalGainStatement } from '../document-parsers/camsMFCapitalGainParser';
import { getLogger, ILogger } from '../utils/logger';

const logger: ILogger = getLogger('documentsRouteHandler');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store files in uploads directory by assessment year
    const uploadDir = path.join(__dirname, '../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueId}${extension}`);
  }
});

// Configure file filter
const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
  logger.debug("file-mimetype", file.mimetype);
  const allowedMimes = [
    'application/pdf', 
    'image/jpeg', 
    'image/png',
    'text/csv',                   // Add CSV mime type
    'application/vnd.ms-excel',   // Excel files (XLS format)
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel files (XLSX format)
    'text/plain'                  // Some CSVs might be uploaded as text
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types: PDF, JPEG, PNG, CSV, XLS, XLSX'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = express.Router();

// Validation middleware
const validateUploadRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.debug("a", req.body);
  logger.debug("b", req.file);
  const { ownerId, assessmentYear, documentType } = req.body;

  if (!ownerId || !assessmentYear) {
    return res.status(400).json({ 
      message: 'Missing required fields: ownerId and assessmentYear are required' 
    });
  }

  // Validate assessment year format (YYYY-YY)
  const yearPattern = /^\d{4}-\d{2}$/;
  if (!yearPattern.test(assessmentYear)) {
    return res.status(400).json({ 
      message: 'Invalid assessment year format. Expected: YYYY-YY' 
    });
  }
  
  // Validate document type if provided
  if (documentType) {
    // Check if the provided documentType is a valid value from the enum
    const validDocumentTypes = Object.values(DocumentType);
    if (!validDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        message: `Invalid document type. Allowed types: ${validDocumentTypes.join(', ')}`
      });
    }
  }

  next();
};

// create new endpoint /process to process an already uploaded pdf file. this function will call 
// loadPDFGemini function from pdfParserGemini service. it'll insert the extracted json to table called processed_document
router.post('/process', async (req: express.Request, res: express.Response) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({
        message: 'Missing required field: documentId'
      });
    }

    // Get document details from database
    const document = await documents.getById(documentId);
    
    if (!document) {
      return res.status(400).json({
        message: 'Document not found'
      });
    }

    // Allow reprocessing of documents that are in UPLOADED, PROCESSED, or FAILED states
    const allowedStates = [DocumentState.UPLOADED, DocumentState.PROCESSED, DocumentState.FAILED];
    if (!allowedStates.includes(document.state)) {
      return res.status(400).json({
        message: `Document cannot be processed in its current state: ${document.state}`
      });
    }

    // Update document state to processing
    await documents.updateState(documentId, DocumentState.PROCESSING);

    // Choose parser based on document type
    let extractedData;
    logger.info("Processing document:", document);

    // Get taxpayer info from user service or use ownerId as fallback
    const taxpayerInfo = {
      name: document.ownerId, // Replace with actual user name lookup if available
      pan: '' // Replace with actual PAN lookup if available
    };

    switch (document.documentType) {
      case DocumentType.FORM_16:
        extractedData = await loadPDFGemini(document.filepath);
        break;
      
      case DocumentType.US_EQUITY_CG_STATEMENT:
        extractedData = await parseUSEquityPDFWithGemini(
          document.filepath,
          taxpayerInfo
        );
        logger.debug("extractedData", JSON.stringify(extractedData, null, 2));
        break;
      
      case DocumentType.US_EQUITY_STATEMENT:
        // Use the new CSV parser for Charles Schwab statements
        extractedData = await parseCharlesSchwabCSV(
          document.filepath
        );
        logger.debug("Extracted CSV data:", JSON.stringify(extractedData, null, 2));
        break;
      
      case DocumentType.US_EQUITY_CG_STATEMENT_CSV:
        // Use the dedicated parser for capital gain CSV statements
        extractedData = await parseUSEquityCGStatementCSV(
          document.filepath,
          document.assessmentYear
        );
        // console.log("Extracted Capital Gain CSV data:", JSON.stringify(extractedData, null, 2));
        break;
      
      case DocumentType.US_EQUITY_DIVIDEND_CSV:
        // Use the dedicated parser for dividend CSV statements
        extractedData = await parseUSEquityDividendCSV(
          document.filepath,
          document.assessmentYear
        );
        logger.debug("Extracted Dividend CSV data:", JSON.stringify(extractedData, null, 2));
        break;
      // --- Add AIS Case ---
      case DocumentType.AIS:
          logger.info(`Using Gemini AIS PDF parser for document ${documentId}`);
          extractedData = await parseAISPDFWithGemini(document.filepath);
          logger.debug("Extracted AIS data:", JSON.stringify(extractedData, null, 2));
        break;
      
      case DocumentType.FORM_26AS:
        logger.info(`Using Gemini Form 26AS PDF parser for document ${documentId}`);
        extractedData = await parseForm26ASPDFWithGemini(document.filepath);
        logger.debug("Extracted Form 26AS data:", JSON.stringify(extractedData, null, 2));
        break;

      case DocumentType.CAMS_MF_CAPITAL_GAIN:
        // Import the CAMS MF Capital Gain parser
        extractedData = await parseCAMSCapitalGainStatement(document.filepath);
        break;
      
      default:
        await documents.updateState(documentId, DocumentState.FAILED, 'No parser available for this document type');
        return res.status(400).json({
          message: `No parser available for document type: ${document.documentType}`
        });
    }

    if (!extractedData || extractedData.success === false) {
      const errorMessage = extractedData?.error || 'Unknown parsing error';
      logger.error('Error parsing document:', errorMessage);
      
      await documents.updateState(documentId, DocumentState.FAILED, errorMessage);
      
      return res.status(500).json({
        message: 'Error processing document',
        error: errorMessage
      });
    }

    // Save the parsed data
    await parsedDocuments.create({
      document_id: documentId,
      json_schema_type: document.documentType,
      json_schema_version: 'v1',
      parsed_data: extractedData,
      parser_version: 'v1',
    });

    // Update document state to processed
    await documents.updateState(documentId, DocumentState.PROCESSED);

    res.status(200).json({
      message: 'Document processed successfully',
      documentId
    });

  } catch (error) {
    logger.error('Error processing document:', error);
    
    // Update document state to failed
    try {
      if (req.body.documentId) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await documents.updateState(
          req.body.documentId, 
          DocumentState.FAILED, 
          errorMessage
        );
      }
    } catch (stateUpdateError) {
      logger.error('Failed to update document state:', stateUpdateError);
    }
    
    res.status(500).json({
      message: 'Error processing document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});


// Document upload route
router.post('/upload', 
  upload.single('file'),
  validateUploadRequest,
  async (req: express.Request, res: express.Response) => {
    try {
      const file = req.file;
      const { ownerId, assessmentYear, documentType } = req.body;

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

    //   logger.info({
    //     message: 'Processing document upload',
    //     fileName: file.originalname,
    //     ownerId,
    //     assessmentYear
    //   });

      // Save document record in database
      const document = await documents.save({
        originalFilename: file.originalname,
        storedFilename: file.filename,
        filepath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        state: DocumentState.UPLOADED,
        ownerId,
        assessmentYear,
        documentType: documentType as DocumentType // Add documentType to save
      });

    //   logger.info({
    //     message: 'Document uploaded successfully',
    //     documentId: document.id
    //   });

      res.status(200).json({
        message: 'Document uploaded successfully',
        documentId: document.id
      });

    } catch (error) {
      logger.error('Error uploading document', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });

      // Clean up file if database save failed
      if (req.file) {
        try {
          await fs.promises.unlink(req.file.path);
        } catch (unlinkError) {
          logger.error('Error cleaning up file after failed upload', unlinkError);
        }
      }

      if (error instanceof multer.MulterError) {
        return res.status(400).json({ 
          message: 'File upload error',
          error: error.message 
        });
      }

      res.status(500).json({ 
        message: 'Internal server error while processing document' 
      });
    }
  }
);

// Get all documents for a user
router.get('/user/:userId', async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        message: 'Missing required parameter: userId' 
      });
    }

    // Get documents for the user
    const userDocuments = await documents.getByUser(userId);
    
    res.status(200).json({
      message: 'Documents retrieved successfully',
      documents: userDocuments
    });
  } catch (error) {
    logger.error('Error retrieving documents:', error);
    res.status(500).json({ 
      message: 'Error retrieving documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get documents for a user by assessment year
router.get('/user/:userId/year/:assessmentYear', async (req: express.Request, res: express.Response) => {
  try {
    const { userId, assessmentYear } = req.params;
    
    if (!userId || !assessmentYear) {
      return res.status(400).json({ 
        message: 'Missing required parameters: userId and assessmentYear' 
      });
    }

    // Validate assessment year format (YYYY-YY)
    const yearPattern = /^\d{4}-\d{2}$/;
    if (!yearPattern.test(assessmentYear)) {
      return res.status(400).json({ 
        message: 'Invalid assessment year format. Expected: YYYY-YY' 
      });
    }

    // Get documents for the user and assessment year
    const userDocuments = await documents.getByYear(userId, assessmentYear);
    
    res.status(200).json({
      message: 'Documents retrieved successfully',
      documents: userDocuments
    });
  } catch (error) {
    logger.error('Error retrieving documents:', error);
    res.status(500).json({ 
      message: 'Error retrieving documents',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get a single document by ID
router.get('/:documentId', async (req: express.Request, res: express.Response) => {
  try {
    const { documentId } = req.params;
    
    if (!documentId) {
      return res.status(400).json({ 
        message: 'Missing required parameter: documentId' 
      });
    }

    // Get document by ID
    const document = await documents.getById(documentId);
    
    if (!document) {
      return res.status(404).json({ 
        message: 'Document not found' 
      });
    }
    
    res.status(200).json({
      message: 'Document retrieved successfully',
      document
    });
  } catch (error) {
    logger.error('Error retrieving document:', error);
    res.status(500).json({ 
      message: 'Error retrieving document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get parsed document data by document ID
router.get('/:documentId/parsed-data', async (req: express.Request, res: express.Response) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({ 
        message: 'Missing required parameter: documentId' 
      });
    }

    const parsedDocument = await parsedDocuments.getByDocumentId(documentId);

    res.status(200).json({
      message: 'Parsed document retrieved successfully',
      parsedDocument
    });
  } catch (error) {
    logger.error('Error retrieving parsed document:', error);
    res.status(500).json({ 
      message: 'Error retrieving parsed document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});



// Serve document file
router.get('/:documentId/file', async (req: express.Request, res: express.Response) => {
  try {
    const { documentId } = req.params;
    
    if (!documentId) {
      return res.status(400).json({ 
        message: 'Missing required parameter: documentId' 
      });
    }

    // Get document by ID
    const document = await documents.getById(documentId);
    
    if (!document) {
      return res.status(404).json({ 
        message: 'Document not found' 
      });
    }

    // Check if file exists
    if (!fs.existsSync(document.filepath)) {
      return res.status(404).json({ 
        message: 'Document file not found on server' 
      });
    }

    // Set appropriate content type
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${document.originalFilename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(document.filepath);
    fileStream.pipe(res);
  } catch (error) {
    logger.error('Error serving document file:', error);
    res.status(500).json({ 
      message: 'Error serving document file',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete a document
router.delete('/:documentId', async (req: express.Request, res: express.Response) => {
  try {
    const { documentId } = req.params;
    
    if (!documentId) {
      return res.status(400).json({ 
        message: 'Missing required parameter: documentId' 
      });
    }

    // Get document by ID to check if it exists and get the filepath
    const document = await documents.getById(documentId);
    
    if (!document) {
      return res.status(404).json({ 
        message: 'Document not found' 
      });
    }

    // Delete any associated parsed documents first
    try {
      // This is a soft dependency, so we don't want to fail if it fails
      await parsedDocuments.delete(documentId);
    } catch (parseError) {
      logger.error('Error deleting parsed document data:', parseError);
      // Continue with document deletion even if parsed data deletion fails
    }

    // Delete the document from the database
    await documents.delete(documentId);
    
    // Delete the file from the filesystem
    try {
      if (fs.existsSync(document.filepath)) {
        await fs.promises.unlink(document.filepath);
      }
    } catch (fileError) {
      logger.error('Error deleting document file:', fileError);
      // We've already deleted from DB, so just log the error
    }
    
    res.status(200).json({
      message: 'Document deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting document:', error);
    res.status(500).json({ 
      message: 'Error deleting document',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;