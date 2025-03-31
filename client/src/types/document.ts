export enum DocumentState {
    UPLOADED = 'uploaded',
    CLASSIFYING = 'classifying',
    CLASSIFIED = 'classified',
    PROCESSING = 'processing',
    PROCESSED = 'processed',
    FAILED = 'failed'
}

export enum DocumentType {
    FORM_16 = 'form-16',
    US_EQUITY_CG_STATEMENT = 'USEquityCapitalGainStatement',
    US_EQUITY_CG_STATEMENT_CSV = 'USEquityCapitalGainStatementCSV',
    FORM_26AS = 'form26AS',
    BANK_STATEMENT = 'bankStatement',
    RENT_RECEIPT = 'rentReceipt',
    INSURANCE_PREMIUM = 'insurancePremium',
    PPF_RECEIPT = 'ppfReceipt',
    MUTUAL_FUND_STATEMENT = 'mutualFundStatement',
    OTHER = 'other',
    US_EQUITY_STATEMENT = 'USEquityStatement'
}

export interface Document {
    id: string;
    originalFilename: string;
    storedFilename: string;
    filepath: string;
    fileSize: number;
    mimeType: string;
    documentType?: DocumentType;
    state: DocumentState;
    stateMessage?: string;
    ownerId: string;
    assessmentYear: string;
    createdAt: Date;
    updatedAt: Date;
    processedAt?: Date;
}

// API response types
export interface DocumentsResponse {
    message: string;
    documents: Document[];
}

export interface DocumentResponse {
    message: string;
    document: Document;
}

export interface UploadDocumentResponse {
    message: string;
    documentId: string;
}

export interface ProcessDocumentResponse {
    message: string;
    documentId: string;
}

export interface ErrorResponse {
    message: string;
    error?: string;
} 