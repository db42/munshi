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
    getForm16: parsedDocumentService.getForm16ParsedData(pool),
    getUSEquityCapitalGainStatement: parsedDocumentService.getUSEquityCapitalGainStatementParsedData(pool), //can be deprecated
    getUSEquityCapitalGainStatementCSV: parsedDocumentService.getUSEquityCapitalGainStatementCSVData(pool),
    getCharlesSchwabCSVData: parsedDocumentService.getCharlesSchwabCSVData(pool),
    getUSEquityDividendIncome: parsedDocumentService.getUSEquityDividendIncome(pool),
    getAISData: parsedDocumentService.getAISData(pool),
    getForm26ASData: parsedDocumentService.getForm26ASData(pool),
    getCAMSMFCapitalGainData: parsedDocumentService.getCAMSMFCapitalGainData(pool)
};