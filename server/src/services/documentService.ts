import { Pool } from 'pg';
import { Document, DocumentState } from '../types/document';

// Helper function to map database row to Document type
const mapDbRowToDocument = (row: any): Document => ({
    id: row.id,
    originalFilename: row.original_filename,
    storedFilename: row.stored_filename,
    filepath: row.filepath,
    fileSize: row.file_size,
    mimeType: row.mime_type,
    documentType: row.document_type,
    state: row.state,
    stateMessage: row.state_message,
    ownerId: row.owner_id,
    assessmentYear: row.assessment_year,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    processedAt: row.processed_at
});

// Save a new document
export const saveDocument = (pool: Pool) => async (
    document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'processedAt'>
): Promise<Document> => {
    const query = `
        INSERT INTO documents (
            original_filename, stored_filename, filepath, file_size,
            mime_type, state, owner_id, assessment_year
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;

    const values = [
        document.originalFilename,
        document.storedFilename,
        document.filepath,
        document.fileSize,
        document.mimeType,
        document.state,
        document.ownerId,
        document.assessmentYear
    ];

    const result = await pool.query(query, values);
    return mapDbRowToDocument(result.rows[0]);
};

// Get all documents for a user
export const getDocumentsByUser = (pool: Pool) => async (
    userId: string
): Promise<Document[]> => {
    const query = `
        SELECT * FROM documents 
        WHERE owner_id = $1 
        ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows.map(mapDbRowToDocument);
};

// Get a single document by ID
export const getDocumentById = (pool: Pool) => async (
    documentId: string
): Promise<Document | null> => {
    const query = `
        SELECT * FROM documents 
        WHERE id = $1
    `;

    const result = await pool.query(query, [documentId]);
    return result.rows.length > 0 ? mapDbRowToDocument(result.rows[0]) : null;
};

// Update document state
export const updateDocumentState = (pool: Pool) => async (
    documentId: string,
    state: DocumentState,
    message?: string
): Promise<void> => {
    const query = `
        UPDATE documents 
        SET state = $1, state_message = $2,
            processed_at = CASE WHEN $1 = 'processed' THEN CURRENT_TIMESTAMP ELSE processed_at END
        WHERE id = $3
    `;

    await pool.query(query, [state, message || null, documentId]);
};

// Get documents by assessment year
export const getDocumentsByAssessmentYear = (pool: Pool) => async (
    userId: string,
    assessmentYear: string
): Promise<Document[]> => {
    const query = `
        SELECT * FROM documents 
        WHERE owner_id = $1 AND assessment_year = $2
        ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId, assessmentYear]);
    return result.rows.map(mapDbRowToDocument);
};