import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { ParseResult } from '../utils/parserTypes';
import { 
  USEquityStatement, 
  USCGEquityTransaction, 
  CapitalGainSummary
} from '../types/usEquityStatement';
import { calculateCapitalGains } from '../generators/itr/usCGEquityToITR';
import { parseDate, parseNumericValue } from '../utils/formatters';
import { removeQuotes } from '../utils/stringUtils';

// Define interface for raw CSV record (as parsed from CSV)
interface RawCapitalGainRecord {
  Symbol: string;
  Name: string;
  'Closed Date': string;
  'Opened Date': string;
  Quantity: string;
  'Proceeds Per Share': string;
  'Cost Per Share': string;
  Proceeds: string;
  'Cost Basis (CB)': string;
  'Gain/Loss ($)': string;
  'Gain/Loss (%)': string;
  'Long Term Gain/Loss': string;
  'Short Term Gain/Loss': string;
  Term: string;
  'Unadjusted Cost Basis': string;
  'Wash Sale?': string;
  'Disallowed Loss': string;
  [key: string]: string; // Allow for additional fields
}

// Define interface for processed record with proper types
interface ProcessedCapitalGainRecord {
  symbol: string;
  securityName: string;
  sellDate: Date; // Closed Date
  acquisitionDate: Date; // Opened Date
  quantity: number;
  proceedsPerShare: number;
  costPerShare: number;
  totalProceeds: number;
  totalCost: number; // Cost Basis
  gainLoss: number;
  gainLossPercent: number;
  longTermGainLoss: number;
  shortTermGainLoss: number;
  term: string; // "Long Term" or "Short Term"
  isWashSale: boolean;
  disallowedLoss: number;
  [key: string]: any; // Allow for additional fields
}

/**
 * Parses a US Equity Capital Gain Statement CSV file and returns data in USEquityStatement format
 * 
 * @param filePath - Path to the CSV file
 * @returns Parsed data in USEquityStatement format
 */
export const parseUSEquityCGStatementCSV = async (
  filePath: string,
  assessmentYear: string
): Promise<ParseResult<USEquityStatement>> => {
  try {
    console.log(`[CG_PARSER] Starting to parse file: ${filePath}`);
    
    // Parse CSV into records
    const records = await parseCSVFile(filePath);
    console.log(`[CG_PARSER] Parsed ${records.length} valid capital gain records from CSV`);
    
    if (records.length === 0) {
      return {
        success: false,
        error: 'No valid capital gain records found in CSV file'
      };
    }
    
    // Transform records into USEquityStatement format
    const usEquityStatement = convertToUSEquityStatement(records, assessmentYear);
    console.log(`[CG_PARSER] Successfully converted to USEquityStatement format`);
    
    return {
      success: true,
      data: usEquityStatement
    };
  } catch (error) {
    console.error('Error parsing US Equity CG Statement CSV:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing CSV'
    };
  }
};

/**
 * Parses the CSV file into capital gain records
 * 
 * @param filePath - Path to the CSV file
 * @returns Array of processed capital gain records
 */
async function parseCSVFile(filePath: string): Promise<ProcessedCapitalGainRecord[]> {
  // Read the CSV file
  const csvContent = await fs.promises.readFile(filePath, 'utf-8');
  
  console.log(`[CG_PARSER] Reading CSV file: ${filePath}`);
  
  // Split content by lines to handle the specific file structure
  const lines = csvContent.split('\n');
  
  if (lines.length < 3) {
    console.log(`[CG_PARSER] CSV file has insufficient lines (needs at least 3, found ${lines.length})`);
    return [];
  }
  
  // First line is metadata, second line is headers, data starts from third line
  const metadataLine = lines[0];
  const headerLine = lines[1];
  const dataLines = lines.slice(2);
  
  console.log(`[CG_PARSER] Metadata line: ${metadataLine}`);
  console.log(`[CG_PARSER] Header line: ${headerLine}`);
  console.log(`[CG_PARSER] Found ${dataLines.length} data lines`);
  
  // Reconstruct CSV with just headers and data
  const cleanCsv = [headerLine, ...dataLines].join('\n');
  
  // Parse CSV content
  const rawRecords = parse(cleanCsv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true // Allow varying column counts
  }) as RawCapitalGainRecord[];
  
  console.log(`[CG_PARSER] Found ${rawRecords.length} raw records in CSV`);
  
  if (rawRecords.length > 0) {
    console.log(`[CG_PARSER] First record sample:`, JSON.stringify(rawRecords[0]));
    console.log(`[CG_PARSER] Available fields:`, Object.keys(rawRecords[0]).join(', '));
  }
  
  // Convert raw records to properly typed records
  const processedRecords = rawRecords.map((rawRecord: RawCapitalGainRecord, index: number): ProcessedCapitalGainRecord => {
    try {
      // Parse dates
      const sellDate = parseDate(rawRecord['Closed Date']);
      const acquisitionDate = parseDate(rawRecord['Opened Date']);
      
      // Process numeric values
      const quantity = parseNumericValue(rawRecord.Quantity);
      const proceedsPerShare = parseNumericValue(rawRecord['Proceeds Per Share']);
      const costPerShare = parseNumericValue(rawRecord['Cost Per Share']);
      const totalProceeds = parseNumericValue(rawRecord.Proceeds);
      const totalCost = parseNumericValue(rawRecord['Cost Basis (CB)']);
      const gainLoss = parseNumericValue(rawRecord['Gain/Loss ($)']);
      const gainLossPercent = parseNumericValue(rawRecord['Gain/Loss (%)']);
      const longTermGainLoss = parseNumericValue(rawRecord['Long Term Gain/Loss'] || '0');
      const shortTermGainLoss = parseNumericValue(rawRecord['Short Term Gain/Loss'] || '0');
      
      // Determine if it's a wash sale
      const isWashSale = (rawRecord['Wash Sale?'] || '').toLowerCase() === 'yes';
      const disallowedLoss = parseNumericValue(rawRecord['Disallowed Loss'] || '0');

      // Parse term
      let term = rawRecord.Term || '';
      if (term.toLowerCase().includes('long')) {
        term = 'Long Term';
      } else if (term.toLowerCase().includes('short')) {
        term = 'Short Term';
      }
      
      return {
        symbol: removeQuotes(rawRecord.Symbol || ''),
        securityName: removeQuotes(rawRecord.Name || ''),
        sellDate,
        acquisitionDate,
        quantity,
        proceedsPerShare,
        costPerShare,
        totalProceeds,
        totalCost,
        gainLoss,
        gainLossPercent,
        longTermGainLoss,
        shortTermGainLoss,
        term,
        isWashSale,
        disallowedLoss
      };
    } catch (error) {
      console.log(`[CG_PARSER] Error processing record ${index}:`, error);
      // Return a placeholder with the raw data to aid debugging
      return {
        symbol: '',
        securityName: '',
        sellDate: new Date(0),
        acquisitionDate: new Date(0),
        quantity: 0,
        proceedsPerShare: 0,
        costPerShare: 0,
        totalProceeds: 0,
        totalCost: 0,
        gainLoss: 0,
        gainLossPercent: 0,
        longTermGainLoss: 0,
        shortTermGainLoss: 0,
        term: '',
        isWashSale: false,
        disallowedLoss: 0,
        _rawData: rawRecord
      };
    }
  });
  
  // Filter out invalid records
  const validRecords = processedRecords.filter((record, index) => {
    const isValid = 
      record.symbol && 
      record.securityName && 
      record.sellDate.getTime() !== 0 &&
      record.quantity > 0;
    
    if (!isValid) {
      console.log(`[CG_PARSER] Filtering out invalid record ${index}:`, JSON.stringify(record));
    }
    
    return isValid;
  });
  
  console.log(`[CG_PARSER] After validation, ${validRecords.length} valid records remain`);
  
  // Sort records by sell date (most recent first)
  return [...validRecords].sort((a, b) => b.sellDate.getTime() - a.sellDate.getTime());
}

/**
 * Converts processed capital gain records to USEquityStatement format
 * 
 * @param records - Processed capital gain records
 * @param accountNumber - Broker account number
 * @returns Data in USEquityStatement format
 */
function convertToUSEquityStatement(
  records: ProcessedCapitalGainRecord[],
  assessmentYear: string
): USEquityStatement {
  // Create USCGEquityTransaction array
  const transactions: USCGEquityTransaction[] = records.map((record, index) => {
    return {
      transactionId: `CG-${index + 1}`,
      securityName: record.securityName,
      symbol: record.symbol,
      acquisitionDate: record.acquisitionDate,
      sellDate: record.sellDate,
      quantity: record.quantity,
      totalProceeds: record.totalProceeds,
      totalCost: record.totalCost,
      feesBrokerage: 0 // Not available directly in this format
    };
  });
  
  
  // Extract date range from transactions
  const dates = records.map(record => record.sellDate);
  const startDate = new Date(Math.min(...dates.map(date => date.getTime())));
  const endDate = new Date(Math.max(...dates.map(date => date.getTime())));
  
  console.log(`[CG_PARSER] Statement period: ${startDate.toISOString()} to ${endDate.toISOString()}`);

  
  console.log(`[CG_PARSER] Determined assessment year: ${assessmentYear}`);

  // Calculate capital gains using helper function
  const capitalGains = calculateCapitalGains(transactions, assessmentYear);
  
  // Extract short term and long term summaries
  const shortTermGainSummary = capitalGains.shortTerm || {
    totalProceeds: 0,
    totalCostBasis: 0,
    totalGain: 0,
    totalForeignTaxPaid: 0
  };
  
  const longTermGainSummary = capitalGains.longTerm || {
    totalProceeds: 0,
    totalCostBasis: 0,
    totalGain: 0,
    totalForeignTaxPaid: 0
  };
  
  console.log(`[CG_PARSER] Short-term gains: ${shortTermGainSummary.totalGain}, Long-term gains: ${longTermGainSummary.totalGain}`);
  
  // Create the USEquityStatement
  return {
    taxpayerName: '',
    taxpayerPAN: '',
    brokerName: 'Charles Schwab',
    brokerAccountNumber: '',
    statementPeriod: {
      startDate,
      endDate
    },
    transactions,
    dividends: [], // No dividend data in capital gains CSV
    capitalGains: {
      shortTerm: shortTermGainSummary,
      longTerm: longTermGainSummary
    },
    taxWithheld: {
      dividendTax: 0,
      capitalGainsTax: 0
    }
  };
} 