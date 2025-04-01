import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { ParseResult } from '../utils/parserTypes';
import { USInvestmentIncome, DividendIncome } from '../types/usEquityStatement';
import { parseDate, parseNumericValue } from '../utils/formatters';

/**
 * Interface for raw investment income record as parsed from CSV
 */
interface RawInvestmentIncomeRecord {
  'Transaction Date': string;
  'Account Number': string;
  'Account Name': string;
  'Account Type': string;
  'Security Description': string;
  'Symbol': string;
  'Security Type': string;
  'Transaction Type': string;
  'Transaction Amount': string;
  'Income Type': string;
  [key: string]: string; // Allow additional fields
}

/**
 * Interface for processed investment income record with proper types
 */
interface ProcessedInvestmentIncomeRecord {
  date: Date;
  symbol: string;
  securityName: string;
  amount: number;
  incomeType: string;
  transactionType: string;
  isDividend: boolean;
  isInterest: boolean;
  accountNumber: string;
}

/**
 * Interface for summary data of investment income
 */
interface InvestmentIncomeSummary {
  totalDividends: number;
  totalQualifiedDividends: number;
  totalNonQualifiedDividends: number;
  totalInterest: number;
  totalIncome: number;
  dividendsBySymbol: Record<string, number>;
  interestBySource: Record<string, number>;
}

/**
 * Parses a US Equity Dividend CSV file and returns data in a structured format
 * 
 * @param filePath - Path to the CSV file
 * @param assessmentYear - Assessment year in format YYYY-YY
 * @returns Parsed data in USEquityStatement format
 */
export const parseUSEquityDividendCSV = async (
  filePath: string,
  assessmentYear: string
): Promise<ParseResult<USInvestmentIncome>> => {
  try {
    console.log(`[DIVIDEND_PARSER] Starting to parse file: ${filePath}`);
    
    // Parse CSV into records
    const records = await parseCSVFile(filePath);
    console.log(`[DIVIDEND_PARSER] Parsed ${records.length} valid investment income records from CSV`);
    
    if (records.length === 0) {
      return {
        success: false,
        error: 'No valid investment income records found in CSV file'
      };
    }
    
    // Calculate summary
    const summary = calculateSummary(records);
    console.log(`[DIVIDEND_PARSER] Calculated investment income summary`);
    console.log(`[DIVIDEND_PARSER] Total dividends: ${summary.totalDividends}`);
    console.log(`[DIVIDEND_PARSER] Total qualified dividends: ${summary.totalQualifiedDividends}`);
    console.log(`[DIVIDEND_PARSER] Total non-qualified dividends: ${summary.totalNonQualifiedDividends}`);
    console.log(`[DIVIDEND_PARSER] Total interest: ${summary.totalInterest}`);
    console.log(`[DIVIDEND_PARSER] Total income: ${summary.totalIncome}`);
    
    // Transform records into USInvestmentIncome format
    const investmentIncome = convertToUSInvestmentIncome(records, summary, assessmentYear);
    console.log(`[DIVIDEND_PARSER] Successfully converted to USInvestmentIncome format`);
    
    return {
      success: true,
      data: investmentIncome
    };
  } catch (error) {
    console.error('Error parsing US Equity Dividend CSV:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing CSV'
    };
  }
};

/**
 * Parses the CSV file into investment income records
 * 
 * @param filePath - Path to the CSV file
 * @returns Array of processed investment income records
 */
async function parseCSVFile(filePath: string): Promise<ProcessedInvestmentIncomeRecord[]> {
  // Read the CSV file
  const csvContent = await fs.promises.readFile(filePath, 'utf-8');
  
  console.log(`[DIVIDEND_PARSER] Reading CSV file: ${filePath}`);
  
  // Split content by lines to handle the specific file structure
  const lines = csvContent.split('\n');
  
  if (lines.length < 3) {
    console.log(`[DIVIDEND_PARSER] CSV file has insufficient lines (needs at least 3, found ${lines.length})`);
    return [];
  }
  
  // First line is metadata, second line is headers, data starts from third line
  const metadataLine = lines[0];
  const headerLine = lines[1];
  const dataLines = lines.slice(2);
  
  console.log(`[DIVIDEND_PARSER] Metadata line: ${metadataLine}`);
  console.log(`[DIVIDEND_PARSER] Header line: ${headerLine}`);
  console.log(`[DIVIDEND_PARSER] Found ${dataLines.length} data lines`);
  
  // Reconstruct CSV with just headers and data
  const cleanCsv = [headerLine, ...dataLines].join('\n');
  
  // Parse CSV content
  const rawRecords = parse(cleanCsv, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true // Allow varying column counts
  }) as RawInvestmentIncomeRecord[];
  
  console.log(`[DIVIDEND_PARSER] Found ${rawRecords.length} raw records in CSV`);
  
  if (rawRecords.length > 0) {
    console.log(`[DIVIDEND_PARSER] First record sample:`, JSON.stringify(rawRecords[0]));
    console.log(`[DIVIDEND_PARSER] Available fields:`, Object.keys(rawRecords[0]).join(', '));
  }
  
  // Filter out invalid records and convert to properly typed records
  const processedRecords = rawRecords
    .filter(record => record['Transaction Date'] && record['Transaction Amount'])
    .map(processRecord);
  
  return processedRecords;
}

/**
 * Processes a raw record into a typed record
 * 
 * @param rawRecord - Raw record from CSV
 * @returns Processed record with proper types
 */
function processRecord(rawRecord: RawInvestmentIncomeRecord): ProcessedInvestmentIncomeRecord {
  const transactionType = (rawRecord['Transaction Type'] || '').trim();
  const symbol = (rawRecord['Symbol'] || '').replace(/"/g, '').trim();
  const securityName = (rawRecord['Security Description'] || '').replace(/"/g, '').trim();
  
  return {
    date: parseDate(rawRecord['Transaction Date']),
    symbol: symbol,
    securityName: securityName,
    amount: parseNumericValue(rawRecord['Transaction Amount']),
    incomeType: (rawRecord['Income Type'] || '').trim(),
    transactionType: transactionType,
    isDividend: transactionType.toLowerCase().includes('dividend'),
    isInterest: transactionType.toLowerCase().includes('interest'),
    accountNumber: (rawRecord['Account Number'] || '').replace(/"/g, '').trim()
  };
}

/**
 * Calculates summary information from processed records
 * 
 * @param records - Processed investment income records
 * @returns Summary information
 */
function calculateSummary(records: ProcessedInvestmentIncomeRecord[]): InvestmentIncomeSummary {
  const dividendRecords = records.filter(r => r.isDividend);
  const interestRecords = records.filter(r => r.isInterest);
  const qualifiedDividendRecords = records.filter(r => 
    r.transactionType.toLowerCase().includes('qualified dividend'));
  const nonQualifiedDividendRecords = records.filter(r => 
    r.isDividend && !r.transactionType.toLowerCase().includes('qualified'));
  
  // Calculate total amounts
  const totalDividends = sumAmounts(dividendRecords);
  const totalQualifiedDividends = sumAmounts(qualifiedDividendRecords);
  const totalNonQualifiedDividends = sumAmounts(nonQualifiedDividendRecords);
  const totalInterest = sumAmounts(interestRecords);
  const totalIncome = sumAmounts(records);
  
  // Calculate dividends by symbol
  const dividendsBySymbol: Record<string, number> = {};
  for (const record of dividendRecords) {
    const symbol = record.symbol || 'Unknown';
    dividendsBySymbol[symbol] = (dividendsBySymbol[symbol] || 0) + record.amount;
  }
  
  // Calculate interest by source
  const interestBySource: Record<string, number> = {};
  for (const record of interestRecords) {
    const source = record.securityName || 'Unknown';
    interestBySource[source] = (interestBySource[source] || 0) + record.amount;
  }
  
  return {
    totalDividends,
    totalQualifiedDividends,
    totalNonQualifiedDividends,
    totalInterest,
    totalIncome,
    dividendsBySymbol,
    interestBySource
  };
}

/**
 * Helper function to sum amounts from records
 * 
 * @param records - Records containing amount field
 * @returns Sum of amounts
 */
function sumAmounts(records: { amount: number }[]): number {
  return records.reduce((sum, record) => sum + record.amount, 0);
}

/**
 * Converts processed records and summary to USInvestmentIncome format
 * 
 * @param records - Processed investment income records
 * @param summary - Summary information
 * @param assessmentYear - Assessment year
 * @returns USInvestmentIncome formatted data
 */
function convertToUSInvestmentIncome(
  records: ProcessedInvestmentIncomeRecord[],
  summary: InvestmentIncomeSummary,
  assessmentYear: string
): USInvestmentIncome {
  // Extract account info from first record
  const firstRecord = records[0] || { accountNumber: '', date: new Date() };
  
  // Extract date range from records
  const dates = records.map(record => record.date);
  const startDate = new Date(Math.min(...dates.map(date => date.getTime())));
  const endDate = new Date(Math.max(...dates.map(date => date.getTime())));
  
  // Convert dividend records to DividendIncome format with new fields
  const dividends: DividendIncome[] = records
    .filter(r => r.isDividend)
    .map(record => ({
      securityName: record.securityName,
      symbol: record.symbol,
      paymentDate: record.date,
      grossAmount: record.amount,
      taxWithheld: 0, // Tax withholding info not available in this CSV format
      netAmount: record.amount, // Assuming net is same as gross when tax info not available
      incomeType: 'dividend',
      isQualifiedDividend: record.transactionType.toLowerCase().includes('qualified'),
      isInterest: false,
      sourceDescription: record.transactionType
    }));
  
  // Convert interest records to DividendIncome format with new fields
  // While not technically dividends, we're storing interest in the same array
  const interestIncomes: DividendIncome[] = records
    .filter(r => r.isInterest)
    .map(record => ({
      securityName: record.securityName,
      symbol: record.symbol || 'INTEREST', // Use placeholder for missing symbols
      paymentDate: record.date,
      grossAmount: record.amount,
      taxWithheld: 0, // Tax withholding info not available in this CSV format
      netAmount: record.amount, // Assuming net is same as gross when tax info not available
      incomeType: 'interest',
      isQualifiedDividend: false,
      isInterest: true,
      sourceDescription: record.securityName
    }));
  
  // Create the USInvestmentIncome statement
  const statement: USInvestmentIncome = {
    // Basic account information
    taxpayerName: '', // Not available in CSV
    taxpayerPAN: '', // Not available in CSV
    brokerName: 'US Broker', // Generic placeholder
    brokerAccountNumber: firstRecord.accountNumber,
    statementPeriod: {
      startDate,
      endDate
    },
    
    // Combine dividend and interest records
    dividends: [...dividends, ...interestIncomes],
    
    // Tax withholding (not available in CSV)
    taxWithheld: {
      dividendTax: 0,
      interestTax: 0
    },
    
    // Investment income summary
    summary: {
      totalDividends: summary.totalDividends,
      totalQualifiedDividends: summary.totalQualifiedDividends,
      totalNonQualifiedDividends: summary.totalNonQualifiedDividends,
      totalInterestIncome: summary.totalInterest,
      dividendsBySymbol: summary.dividendsBySymbol,
      interestBySource: summary.interestBySource,
      totalInvestmentIncome: summary.totalIncome
    },
    
    // Metadata
    assessmentYear: assessmentYear,
    parserVersion: '1.0',
    sourceFileType: 'Investment Income CSV'
  };
  
  console.log(`[DIVIDEND_PARSER] Processed ${dividends.length} dividend records`);
  console.log(`[DIVIDEND_PARSER] Processed ${interestIncomes.length} interest records`);
  console.log(`[DIVIDEND_PARSER] Total investment income: ${summary.totalIncome}`);
  
  return statement;
}
