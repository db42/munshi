// src/services/documents.ts
import pool from '../config/database';
import * as documentService from './documentService';

export const documents = {
    save: documentService.saveDocument(pool),
    getByUser: documentService.getDocumentsByUser(pool),
    getById: documentService.getDocumentById(pool),
    updateState: documentService.updateDocumentState(pool),
    getByYear: documentService.getDocumentsByAssessmentYear(pool),
    delete: documentService.deleteDocument(pool)
};
