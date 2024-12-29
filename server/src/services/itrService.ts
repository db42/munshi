import { Pool } from 'pg';
import pool from '../config/database';
// import { documents } from './documentService';
import { parsedDocuments } from './parsedDocument';
import { convertForm16ToITR } from '../generators/itr/form16ToITR';

export interface ITRData {
    // Define your ITR structure here
    assessmentYear: string;
    userId: number;
    // Add other ITR fields
}

export const generateITR = () => async (
    userId: number,
    assessmentYear: string
): Promise<ITRData> => {
    // 1. Get Form 16 data
    const form16Docs = await parsedDocuments.getForm16(userId, assessmentYear);
    
    console.log(form16Docs?.parsed_data.data);
    // 2. Compute ITR from Form 16 data
    const itrData = convertForm16ToITR(form16Docs?.parsed_data.data);
    
    return {
        assessmentYear,
        userId,
        ...itrData
    };
};


// Create the service wrapper
export const itrService = {
    // getForm16Data: getForm16Data(pool),
    generateITR: generateITR()
};