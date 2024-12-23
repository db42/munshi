export type DocumentState = 'uploaded' | 'classifying' | 'classified' | 'processing' | 'processed' | 'failed';

export interface Document {
    id: string;
    originalFilename: string;
    storedFilename: string;
    filepath: string;
    fileSize: number;
    mimeType: string;
    documentType?: string;
    state: DocumentState;
    stateMessage?: string;
    ownerId: string;
    assessmentYear: string;
    createdAt: Date;
    updatedAt: Date;
    processedAt?: Date;
}