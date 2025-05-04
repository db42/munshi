import { DocumentType } from '../types/document';
import { Pool, QueryResult } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { CharlesSchwabCSVData } from '../document-parsers/charlesSchwabCSVParser';
import { ParseResult } from '../utils/parserTypes';
import { USInvestmentIncome, DividendIncome } from '../types/usEquityStatement';
import { 
  AISTdsTcsDetail, 
  AISTransactionLine, 
  AISTaxPaymentDetail, 
  AISSftDetail, 
  AISSftBreakdownLine,
  AISDemandRefundDetail,
  AISOtherInformation
} from '../types/ais';
import { convertDateStringsToDates } from '../document-parsers/aisUtils';
import { logger } from '../utils/logger';
import { CAMSMFCapitalGainData } from '../document-parsers/camsMFCapitalGainParser';

// Types
export type ParsedDocumentState = 'pending' | 'success' | 'error';

export interface ParsedDocument {
  id: string;
  document_id: string;
  json_schema_type: DocumentType;
  json_schema_version: string;
  parsed_data: any;
  parser_version: string;
  state: ParsedDocumentState;
  state_message?: string;
  created_at: Date;
  updated_at: Date;
  processed_at?: Date;
}

type CreateParsedDocumentInput = Omit<ParsedDocument, 
  'id' | 'state' | 'state_message' | 'created_at' | 'updated_at' | 'processed_at'
>;

// Helper function for executing queries
const executeQuery = async (
  pool: Pool, 
  query: string, 
  values?: any[]
): Promise<QueryResult> => {
  try {
    return await pool.query(query, values);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Create a new parsed document
export const createParsedDocument = (pool: Pool) => async (
  input: CreateParsedDocumentInput
): Promise<ParsedDocument> => {
  const query = `
    INSERT INTO parsed_documents (
      id,
      document_id,
      json_schema_type,
      json_schema_version,
      parsed_data,
      parser_version,
      state
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    uuidv4(),
    input.document_id,
    input.json_schema_type,
    input.json_schema_version,
    input.parsed_data,
    input.parser_version,
    'pending'
  ];

  const result = await executeQuery(pool, query, values);
  return result.rows[0];
};

// Get a parsed document by ID
export const getParsedDocumentById = (pool: Pool) => async (
  id: string
): Promise<ParsedDocument | null> => {
  const query = 'SELECT * FROM parsed_documents WHERE id = $1';
  const result = await executeQuery(pool, query, [id]);
  return result.rows[0] || null;
};

// Get all parsed documents for a specific document
export const getParsedDocumentsByDocumentId = (pool: Pool) => async (
  documentId: string
): Promise<ParsedDocument | null> => {
  const query = `
    SELECT * FROM parsed_documents 
    WHERE document_id = $1 
    ORDER BY created_at DESC
  `;
  const result = await executeQuery(pool, query, [documentId]);
  return result.rows[0] || null;
};

// Get all parsed documents of a specific schema type
export const getParsedDocumentsBySchemaType = (pool: Pool) => async (
  schemaType: DocumentType
): Promise<ParsedDocument[]> => {
  const query = `
    SELECT * FROM parsed_documents 
    WHERE json_schema_type = $1 
    ORDER BY created_at DESC
  `;
  const result = await executeQuery(pool, query, [schemaType]);
  return result.rows;
};

// Update the state of a parsed document
export const updateParsedDocumentState = (pool: Pool) => async (
  id: string,
  state: ParsedDocumentState,
  stateMessage?: string
): Promise<ParsedDocument> => {
  const query = `
    UPDATE parsed_documents 
    SET 
      state = $2, 
      state_message = $3,
      processed_at = CASE WHEN $2 = 'success' THEN CURRENT_TIMESTAMP ELSE processed_at END
    WHERE id = $1
    RETURNING *
  `;

  const result = await executeQuery(pool, query, [id, state, stateMessage]);
  return result.rows[0];
};

// Update the parsed data of a document
export const updateParsedDocumentData = (pool: Pool) => async (
  id: string,
  parsedData: any,
  schemaVersion?: string
): Promise<ParsedDocument> => {
  const query = `
    UPDATE parsed_documents 
    SET 
      parsed_data = $2,
      json_schema_version = COALESCE($3, json_schema_version),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `;

  const result = await executeQuery(pool, query, [id, parsedData, schemaVersion]);
  return result.rows[0];
};

// Delete a parsed document
export const deleteParsedDocument = (pool: Pool) => async (
  documentId: string
): Promise<void> => {
  const query = `
    DELETE FROM parsed_documents 
    WHERE document_id = $1
  `;
  await executeQuery(pool, query, [documentId]);
};

// Get all successful parsed documents for a set of document IDs
export const getSuccessfulParsedDocuments = (pool: Pool) => async (
  documentIds: string[]
): Promise<ParsedDocument[]> => {
  const query = `
    SELECT * FROM parsed_documents 
    WHERE document_id = ANY($1) 
    AND state = 'success'
    ORDER BY created_at DESC
  `;
  
  const result = await executeQuery(pool, query, [documentIds]);
  return result.rows;
};

// Get Form 16 parsed data for a user and assessment year
export const getForm16ParsedData = (pool: Pool) => async (
  userId: number,
  assessmentYear: string
): Promise<ParsedDocument | null> => {
  const query = `
    SELECT pd.* 
    FROM parsed_documents pd
    JOIN documents d ON pd.document_id = d.id
    WHERE d.owner_id = $1
    AND d.assessment_year = $2
    AND pd.json_schema_type = '${DocumentType.FORM_16}'
    ORDER BY pd.updated_at DESC
    LIMIT 1
  `;
  // const query = `
  //   SELECT pd.* 
  //   FROM parsed_documents pd
  //   JOIN documents d ON pd.document_id = d.id
  //   WHERE d.owner_id = 123
  //   AND d.assessment_year = '2024-25'
  //   AND pd.json_schema_type = '${DocumentType.FORM_16}'
  //   AND pd.state = 'success'
  //   ORDER BY pd.updated_at DESC
  //   LIMIT 1
  // `;

  const result = await executeQuery(pool, query, [userId, assessmentYear]);
  return result.rows[0] || null;
};

// get USEquityCapitalGainStatement parsed data for a user and assessment year
export const getUSEquityCapitalGainStatementParsedData = (pool: Pool) => async (
  userId: number,
  assessmentYear: string
): Promise<ParsedDocument | null> => {
  const query = `
    SELECT pd.* 
    FROM parsed_documents pd
    JOIN documents d ON pd.document_id = d.id
    WHERE d.owner_id = $1
    AND d.assessment_year = $2
    AND pd.json_schema_type = '${DocumentType.US_EQUITY_CG_STATEMENT}'
    ORDER BY pd.updated_at DESC
    LIMIT 1
  `;

  const result = await executeQuery(pool, query, [userId, assessmentYear]);
  return result.rows[0] || null;
};

// get USEquityCapitalGainStatementCSV parsed data for a user and assessment year
export const getUSEquityCapitalGainStatementCSVData = (pool: Pool) => async (
  userId: number,
  assessmentYear: string
): Promise<ParsedDocument | null> => {
  const query = `
    SELECT pd.* 
    FROM parsed_documents pd
    JOIN documents d ON pd.document_id = d.id
    WHERE d.owner_id = $1
    AND d.assessment_year = $2
    AND pd.json_schema_type = '${DocumentType.US_EQUITY_CG_STATEMENT_CSV}'
    ORDER BY pd.updated_at DESC
    LIMIT 1
  `;

  const result = await executeQuery(pool, query, [userId, assessmentYear]);
  return result.rows[0] || null;
};

// Get Charles Schwab CSV parsed data for a user and assessment year
export const getCharlesSchwabCSVData = (pool: Pool) => async (
  userId: number,
  assessmentYear: string
): Promise<ParseResult<CharlesSchwabCSVData>> => {
  const query = `
    SELECT pd.* 
    FROM parsed_documents pd
    JOIN documents d ON pd.document_id = d.id
    WHERE d.owner_id = $1
    AND d.assessment_year = $2
    AND pd.json_schema_type = '${DocumentType.US_EQUITY_STATEMENT}'
    ORDER BY pd.updated_at DESC
    LIMIT 1
  `;

  const result = await executeQuery(pool, query, [userId, assessmentYear]);
  if (result.rows.length && result.rows[0].parsed_data.data) {
    let charlesSchwabCSVData: CharlesSchwabCSVData = result.rows[0].parsed_data.data;
    charlesSchwabCSVData = {
      ...charlesSchwabCSVData,
      records: charlesSchwabCSVData.records.map((record) => ({
        ...record,
        date: new Date(record.date)
      }))
    }
    return {
      success: true,
      data: charlesSchwabCSVData
    };
  }
  return {
    success: false,
    error: 'No data found'
  };
};

// Get Charles Schwab CSV parsed data for a user and assessment year
export const getCharlesSchwabCSVData1 = (pool: Pool) => async (
  userId: number,
  assessmentYear: string
): Promise<ParseResult<CharlesSchwabCSVData>> => {
  const query = `
    SELECT pd.id, pd.document_id, pd.json_schema_type, pd.json_schema_version, pd.parser_version, pd.state, pd.state_message, pd.created_at, pd.updated_at, pd.processed_at,
          jsonb_set(
           pd.parsed_data,
           '{date}',
           to_jsonb(to_timestamp((pd.parsed_data->>'date'), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'))
         ) as parsed_data
    FROM parsed_documents pd
    JOIN documents d ON pd.document_id = d.id
    WHERE d.owner_id = $1
    AND d.assessment_year = $2
    AND pd.json_schema_type = '${DocumentType.US_EQUITY_STATEMENT}'
    ORDER BY pd.updated_at DESC
    LIMIT 1
  `;

  const result = await executeQuery(pool, query, [userId, assessmentYear]);
  console.log(result);
  if (result.rows.length && result.rows[0].parsed_data.data) {
    let charlesSchwabCSVData: CharlesSchwabCSVData = result.rows[0].parsed_data.data;
    charlesSchwabCSVData = {
      ...charlesSchwabCSVData,
      records: charlesSchwabCSVData.records.map((record) => ({
        ...record,
        // date: new Date(record.date)
      }))
    }
    return {
      success: true,
      data: charlesSchwabCSVData
    };
  }
  return {
    success: false,
    error: 'No data found'
  };
};

// Get US Equity Dividend Income data for a user and assessment year
export const getUSEquityDividendIncome = (pool: Pool) => async (
  userId: number,
  assessmentYear: string
): Promise<ParseResult<USInvestmentIncome>> => {
  const query = `
    SELECT pd.* 
    FROM parsed_documents pd
    JOIN documents d ON pd.document_id = d.id
    WHERE d.owner_id = $1
    AND d.assessment_year = $2
    AND pd.json_schema_type = '${DocumentType.US_EQUITY_DIVIDEND_CSV}'
    ORDER BY pd.updated_at DESC
    LIMIT 1
  `;

  const result = await executeQuery(pool, query, [userId, assessmentYear]);
  if (result.rows.length && result.rows[0].parsed_data.data) {
    // Get the parsed investment income data
    const investmentIncomeData: USInvestmentIncome = result.rows[0].parsed_data.data;
    
    // Ensure dates are properly formatted as Date objects
    const formattedData = {
      ...investmentIncomeData,
      statementPeriod: {
        startDate: new Date(investmentIncomeData.statementPeriod.startDate),
        endDate: new Date(investmentIncomeData.statementPeriod.endDate)
      },
      // Format dividend payment dates
      dividends: investmentIncomeData.dividends.map((dividend: DividendIncome) => ({
        ...dividend,
        paymentDate: new Date(dividend.paymentDate)
      }))
    };
    
    return {
      success: true,
      data: formattedData
    };
  }
  
  return {
    success: false,
    error: 'No US investment income data found'
  };
  
};

// Get AIS (Annual Information Statement) parsed data for a user and assessment year
export const getAISData = (pool: Pool) => async (
  userId: number,
  assessmentYear: string
): Promise<ParsedDocument | null> => {
  try {
    const query = `
      SELECT pd.* 
      FROM parsed_documents pd
      JOIN documents d ON pd.document_id = d.id
      WHERE d.owner_id = $1
      AND d.assessment_year = $2
      AND pd.json_schema_type = '${DocumentType.AIS}'
      ORDER BY pd.updated_at DESC
      LIMIT 1
    `;
    
    const result = await executeQuery(pool, query, [userId, assessmentYear]);
    
    if (result.rows.length > 0 && result.rows[0].parsed_data?.data) {
      // Format dates in AIS data
      const aisData = result.rows[0].parsed_data.data;
      
      // Convert all date strings to Date objects
      convertDateStringsToDates(aisData);
      
      // Update the parsed_data with formatted dates
      result.rows[0].parsed_data.data = aisData;
    }
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error retrieving AIS data:', error);
    return null;
  }
};

// Function to get CAMS MF Capital Gain Statement data for ITR generation
export const getCAMSMFCapitalGainData = (pool: Pool) => async (
  userId: number,
  assessmentYear: string
): Promise<ParseResult<CAMSMFCapitalGainData> | null> => {
  try {
    const query = `
      SELECT pd.parsed_data 
      FROM parsed_documents pd
      JOIN documents d ON d.id = pd.document_id
      WHERE d.owner_id = $1 
      AND d.assessment_year = $2
      AND d.document_type = $3
      ORDER BY pd.created_at DESC
      LIMIT 1
    `;

    const result = await executeQuery(pool, query, [
      userId.toString(), 
      assessmentYear,
      DocumentType.CAMS_MF_CAPITAL_GAIN
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].parsed_data;
  } catch (error) {
    logger.error(`Error retrieving CAMS MF Capital Gain data: ${error}`);
    return null;
  }
};
