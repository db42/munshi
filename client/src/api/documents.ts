import { ENDPOINTS, DEFAULT_HEADERS, DEFAULT_ASSESSMENT_YEAR } from './config';
import type {
  Document, 
  DocumentsResponse, 
  DocumentResponse, 
  UploadDocumentResponse, 
  ProcessDocumentResponse,
  ErrorResponse,
  DocumentType
} from '../types/document';

/**
 * Fetch all documents for a user
 * @param userId - The user ID
 * @returns Promise with the documents
 */
export const getDocumentsByUser = async (userId: number): Promise<Document[]> => {
  try {
    const response = await fetch(ENDPOINTS.DOCUMENTS_BY_USER(String(userId)), {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || 'Failed to fetch documents');
    }

    const data: DocumentsResponse = await response.json();
    return data.documents;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

/**
 * Fetch documents for a user by assessment year
 * @param userId - The user ID
 * @param year - The assessment year (format: YYYY-YY)
 * @returns Promise with the documents
 */
export const getDocumentsByUserAndYear = async (
  userId: number, 
  year: string
): Promise<Document[]> => {
  try {
    const response = await fetch(ENDPOINTS.DOCUMENTS_BY_USER_AND_YEAR(String(userId), year), {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || 'Failed to fetch documents');
    }

    const data: DocumentsResponse = await response.json();
    return data.documents;
  } catch (error) {
    console.error('Error fetching documents by year:', error);
    throw error;
  }
};

/**
 * Fetch a single document by ID
 * @param documentId - The document ID
 * @returns Promise with the document
 */
export const getDocumentById = async (documentId: string): Promise<Document> => {
  try {
    const response = await fetch(ENDPOINTS.DOCUMENT_BY_ID(documentId), {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || 'Failed to fetch document');
    }

    const data: DocumentResponse = await response.json();
    return data.document;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

/**
 * Upload a document
 * @param file - The file to upload
 * @param ownerId - The owner ID
 * @param assessmentYear - The assessment year (format: YYYY-YY)
 * @param documentType - Optional document type
 * @returns Promise with the upload response
 */
export const uploadDocument = async (
  file: File,
  ownerId: number,
  assessmentYear: string,
  documentType?: DocumentType
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ownerId', String(ownerId));
    formData.append('assessmentYear', assessmentYear);
    
    if (documentType) {
      formData.append('documentType', documentType);
    }

    const response = await fetch(ENDPOINTS.UPLOAD_DOCUMENT, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || 'Failed to upload document');
    }

    const data: UploadDocumentResponse = await response.json();
    return data.documentId;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Process a document
 * @param documentId - The document ID to process
 * @returns Promise with the process response
 */
export const processDocument = async (documentId: string): Promise<string> => {
  try {
    const response = await fetch(ENDPOINTS.PROCESS_DOCUMENT, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ documentId }),
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || 'Failed to process document');
    }

    const data: ProcessDocumentResponse = await response.json();
    return data.documentId;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
};

/**
 * Delete a document
 * @param documentId - The document ID to delete
 * @returns Promise with the delete response
 */
export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    const response = await fetch(ENDPOINTS.DOCUMENT_BY_ID(documentId), {
      method: 'DELETE',
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(errorData.message || 'Failed to delete document');
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}; 