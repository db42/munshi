import pool from '../config/database';
import * as parsedDocumentService from './parsedDocumentService';

export const parsedDocuments = {
    create: parsedDocumentService.createParsedDocument(pool),
    getById: parsedDocumentService.getParsedDocumentById(pool),
    getByDocumentId: parsedDocumentService.getParsedDocumentsByDocumentId(pool),
    getBySchemaType: parsedDocumentService.getParsedDocumentsBySchemaType(pool),
    updateState: parsedDocumentService.updateParsedDocumentState(pool),
    updateData: parsedDocumentService.updateParsedDocumentData(pool),
    delete: parsedDocumentService.deleteParsedDocument(pool),
    getSuccessful: parsedDocumentService.getSuccessfulParsedDocuments(pool),
    getForm16: parsedDocumentService.getForm16ParsedData(pool)
};