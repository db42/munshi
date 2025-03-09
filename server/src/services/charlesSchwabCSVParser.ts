import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { ParseResult } from '../utils/parserTypes';
import { USCGEquityTransaction } from '../types/usEquityStatement';

interface TaxpayerInfo {
  name: string;
  pan: string;
}
// Define enum for transaction actions
export enum TransactionAction {
  Buy = 'Buy',
  Sell = 'Sell',
  QualifiedDividend = 'Qualified Dividend',
  NonQualifiedDividend = 'Non-Qualified Div',
  SpecialQualifiedDividend = 'Special Qual Div',
  NRATaxAdjustment = 'NRA Tax Adj',
  CreditInterest = 'Credit Interest',
  WireReceived = 'Wire Received',
  ADRMgmtFee = 'ADR Mgmt Fee',
  // Add other actions as needed
}

// Define interface for raw Charles Schwab CSV record (as parsed from CSV)
 interface RawCharlesSchwabRecord {
  Date: string;
  Action: string;
  Symbol: string;
  Description: string;
  Quantity: string;
  Price: string;
  'Fees & Comm': string;
  Amount: string;
  [key: string]: string; // Allow for additional fields
}

// Export the interface for use in other files
export interface CharlesSchwabCSVData {
  records: CharlesSchwabRecord[];
  accountNumber: string;
}

// Define interface for processed Charles Schwab record with proper types
export interface CharlesSchwabRecord {
  date: Date;
  action: TransactionAction;
  symbol: string;
  description: string;
  quantity: number;
  price: number;
  fees: number;
  amount: number;
  [key: string]: any; // Allow for additional fields with any type
}

/**
 * Parses a Charles Schwab CSV file and extracts the data needed for Schedule FA
 * Focuses on extracting holdings data for Schedule FA reporting
 * 
 * @param filePath - Path to the CSV file
 * @param financialYear - Financial year (e.g., '2023-24') for which to process the data
 * @returns Parsed data for Schedule FA
 */
export const parseCharlesSchwabCSV = async (
  filePath: string
): Promise<ParseResult<CharlesSchwabCSVData>> => {
  try {
    
    // Step 2: Parse CSV into transactions
    const records = await parseCSVFile(filePath);

    // Step 3: Extract account number from filename
    const accountMatch = filePath.match(/Individual_([A-Z0-9]+)_/);
    const accountNumber = accountMatch ? accountMatch[1] : 'Unknown';

    return {
      success: true,
      data: {
        records,
        accountNumber
      }
    }
  
  } catch (error) {
    console.error('Error parsing Charles Schwab CSV:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing CSV'
    };
  }
};

/**
 * Parses the CSV file into records
 * 
 * @param filePath - Path to the CSV file
 * @returns Object containing the parsed records and account number
 */
async function parseCSVFile(filePath: string): Promise< CharlesSchwabRecord[]> {
  // Read the CSV file
  const csvContent = await fs.promises.readFile(filePath, 'utf-8');
  
  // Parse CSV content
  const rawRecords = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  }) as RawCharlesSchwabRecord[];
  
  // Convert raw records to properly typed records
  const processedRecords = rawRecords.map((rawRecord: RawCharlesSchwabRecord): CharlesSchwabRecord => {
    // Validate action is a valid enum value
    let action: TransactionAction;
    if (Object.values(TransactionAction).includes(rawRecord.Action as TransactionAction)) {
      action = rawRecord.Action as TransactionAction;
    } else {
      console.warn(`Unknown action type: ${rawRecord.Action}, defaulting to Buy`);
      action = TransactionAction.Buy;
    }
    
    return {
      date: new Date(rawRecord.Date),
      action,
      symbol: rawRecord.Symbol,
      description: rawRecord.Description,
      quantity: parseFloat(rawRecord.Quantity),
      price: parseNumericValue(rawRecord.Price),
      fees: parseNumericValue(rawRecord['Fees & Comm']),
      amount: parseNumericValue(rawRecord.Amount),
      // Copy any additional fields
      ...Object.entries(rawRecord)
        .filter(([key]) => !['Date', 'Action', 'Symbol', 'Description', 'Quantity', 'Price', 'Fees & Comm', 'Amount'].includes(key))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
    };
  });
  
  // Sort records by date (oldest first)
  const sortedRecords = [...processedRecords].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  console.log(`Found ${rawRecords.length} total records`);
  
  return sortedRecords;
}


/**
 * Helper function to parse numeric values from strings
 * Handles dollar signs, commas, and other formatting
 */
function parseNumericValue(value: string): number {
  if (!value) return 0;
  
  // Remove dollar signs, commas, and other non-numeric characters except decimal point and minus sign
  const cleanedValue = value.replace(/[$,]/g, '');
  return parseFloat(cleanedValue);
}