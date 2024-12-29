import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { documents } from '../services/document';
import { logger } from '../utils/logger';
import { loadPDF } from '../services/pdfParserTabula';
import { parsedDocuments } from '../services/parsedDocument';

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
const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
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
  console.log("a", req.body);
  console.log("b", req.file);
  const { ownerId, assessmentYear } = req.body;

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

  next();
};

// create new endpoint /process to process an already uploaded pdf file. this function will call 
// loadPDF function from pdfParserTabula service. it'll insert the extracted json to table called processed_document
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

    if (document.state !== 'uploaded') {
      return res.status(400).json({
        message: 'Document is not in uploaded state'
      });
    }

    // Update document state to processing
    // await documents.updateState(documentId, 'processing');

    // Process PDF and extract data
    const extractedData = await loadPDF(document.filepath);

    parsedDocuments.create({
      document_id: documentId,
      json_schema_type: 'FORM_16',
      json_schema_version: 'v1',
      parsed_data: extractedData,
      parser_version: 'v1',
    });

    // Update document state to processed
    // await documents.updateState(documentId, 'processed');

    res.status(200).json({
      message: 'Document processed successfully',
      documentId
    });

  } catch (error) {
    console.error('Error processing document:', error);
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
      const { ownerId, assessmentYear } = req.body;

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
        state: 'uploaded',
        ownerId,
        assessmentYear
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
      console.log("e", error);
    //   logger.error('Error uploading document', {
    //     error: error instanceof Error ? error.message : 'Unknown error',
    //     stack: error instanceof Error ? error.stack : undefined
    //   });

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

export default router;