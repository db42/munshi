import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { ParseResult } from '../utils/parserTypes';
import { USCGEquityTransaction } from '../types/usEquityStatement';

interface TaxpayerInfo {
  name: string;
  pan: string;
}
// {
//     "Country": "United States",
//     "Name_of_Entity": "Charles Schwab",
//     "Address_of_Entity": "One Pickwick Plaza, Greenwich, CT, USA",
//     "Zip_Code": "06830",
//     "Nature_of_Asset": "Stocks",
//     "Date_of_Acquisition": "2024-01-01",
//     "Initial_Investment_INR": 779000,
//     "Peak_Value_INR": 779000,
//     "Closing_Value_INR": 710000
//     "Total_Gross_Amount_INR": 710000
//     "Sales_proceeds_or_redemption_amount_INR": 710000
// }
// Interface for year-end holdings (for Schedule FA)
export interface SecurityHolding {
  symbol: string;
  securityName: string;
  address: string;
  zipCode: string;
  natureOfAsset: string;
  dateOfAcquisition: Date;
  initialInvestmentINR: number;
  peakValueINR: number;
  closingValueINR: number;
  totalGrossAmountINR: number;
  salesProceedsOrRedemptionAmountINR: number; // in INR
}

// Define enum for transaction actions
enum TransactionAction {
  Buy = 'Buy',
  Sell = 'Sell',
  QualifiedDividend = 'Qualified Dividend',
  NonQualifiedDividend = 'Non-Qualified Div',
  SpecialQualifiedDividend = 'Special Qual Div',
  NRATaxAdjustment = 'NRA Tax Adj',
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

// Define interface for processed Charles Schwab record with proper types
interface CharlesSchwabRecord {
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

// Interface for a buy transaction lot
interface BuyLot {
  date: Date;
  quantity: number;
  price: number;
  cost: number;
  sellQuantity?: number; // Remaining quantity after FIFO matching
  sellDate?: Date;
}

// Interface for tracking security holdings
interface SecurityInfo {
  symbol: string;
  securityName: string;
  buyLots: BuyLot[];
}

// Define the output interface specifically for Schedule FA
interface ScheduleFAData {
  taxpayerName: string;
  taxpayerPAN: string;
  brokerName: string;
  brokerAccountNumber: string;
  calendarYear: number;
  holdings: SecurityHolding[];
}

/**
 * Parses a Charles Schwab CSV file and extracts the data needed for Schedule FA
 * Focuses on extracting holdings data for Schedule FA reporting
 * 
 * @param filePath - Path to the CSV file
 * @param taxpayerInfo - Information about the taxpayer (name, PAN)
 * @param financialYear - Financial year (e.g., '2023-24') for which to process the data
 * @returns Parsed data for Schedule FA
 */
export const parseCharlesSchwabCSV = async (
  filePath: string,
  taxpayerInfo: TaxpayerInfo,
  financialYear: string
): Promise<ParseResult<ScheduleFAData>> => {
  try {
    // Step 1: Identify current calendar year from financial year
    const calendarYear = identifyCalendarYear(financialYear);
    const { calendarYearStart, calendarYearEnd } = getRelevantDates(calendarYear);
    
    // Step 2: Parse CSV into transactions
    const records = await parseCSVFile(filePath);

    // Step 3: Extract account number from filename
    const accountMatch = filePath.match(/Individual_([A-Z0-9]+)_/);
    const accountNumber = accountMatch ? accountMatch[1] : 'Unknown';
  
    
    // Step 3: Apply FIFO to process transactions
    const securities = processTransactions(records, calendarYearStart, calendarYearEnd);
    
    // Step 4: Build Schedule FA entries
    const holdings = buildScheduleFAEntries(securities, calendarYearStart, calendarYearEnd);
    
    // Create the ScheduleFAData object
    const scheduleFAData: ScheduleFAData = {
      taxpayerName: taxpayerInfo.name,
      taxpayerPAN: taxpayerInfo.pan,
      brokerName: 'Charles Schwab',
      brokerAccountNumber: accountNumber,
      calendarYear,
      holdings
    };
    
    return {
      success: true,
      data: scheduleFAData
    };
  } catch (error) {
    console.error('Error parsing Charles Schwab CSV:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing CSV'
    };
  }
};

/**
 * Identifies the calendar year from the financial year
 * 
 * @param financialYear - Financial year in format 'YYYY-YY'
 * @returns The calendar year
 */
function identifyCalendarYear(financialYear: string): number {
  const match = financialYear.match(/^(\d{4})-\d{2}$/);
  if (!match) {
    throw new Error(`Invalid financial year format: ${financialYear}. Expected format: 'YYYY-YY'`);
  }
  
  // For financial year 2023-24, the relevant calendar year is 2023
  const calendarYear = parseInt(match[1]);
  
  console.log(`Processing for Financial Year: ${financialYear} (April 1 to March 31)`);
  console.log(`Relevant Calendar Year for Schedule FA: ${calendarYear} (January 1 to December 31)`);
  
  return calendarYear;
}

/**
 * Gets the relevant date ranges for processing
 * 
 * @param calendarYear - The calendar year
 * @returns Object containing the relevant date ranges
 */
function getRelevantDates(calendarYear: number) {
  const calendarYearStart = new Date(`${calendarYear}-01-01`);
  const calendarYearEnd = new Date(`${calendarYear}-12-31`);
  
  return { calendarYearStart, calendarYearEnd };
}

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
  
  // Filter for only Buy and Sell transactions
  const filteredRawRecords = rawRecords.filter((record: RawCharlesSchwabRecord) => 
    record.Action === TransactionAction.Buy || record.Action === TransactionAction.Sell
  );
  
  // Convert raw records to properly typed records
  const processedRecords = filteredRawRecords.map((rawRecord: RawCharlesSchwabRecord): CharlesSchwabRecord => {
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
  console.log(`Filtered to ${filteredRawRecords.length} Buy/Sell transactions`);
  
  return sortedRecords;
}

/**
 * Processes transactions using FIFO method
 * 
 * @param records - Sorted CSV records
 * @param calendarYearStart - Start of calendar year
 * @param calendarYearEnd - End of calendar year
 * @returns Processed securities
 */
function processTransactions(
  records: CharlesSchwabRecord[],
  calendarYearStart: Date,
  calendarYearEnd: Date
) {
  // Initialize data structures
  const securities: Record<string, SecurityInfo> = {};

  //filter out invalid records
  const filteredRecords = records.filter(record => {
    return !isNaN(record.quantity) && !isNaN(record.price) && !isNaN(record.amount);
  });

  
  // Process all records chronologically
  filteredRecords.forEach(record => {
    const isInCalendarYear = record.date >= calendarYearStart && record.date <= calendarYearEnd;

    
    switch(record.action) {
      case TransactionAction.Buy:
        processBuyTransaction(record, securities);
        break;
        
      case TransactionAction.Sell:
        processSellTransaction(record, securities);
        break;
    }
  });
  
  console.log(`Processed ${records.length} records`);
  console.log(`Found ${Object.keys(securities).length} unique securities`);
  
  return securities;
}

/**
 * Processes a buy transaction
 */
function processBuyTransaction(
  record: CharlesSchwabRecord,
  securities: Record<string, SecurityInfo>,
) {
  
  // Initialize security if not exists
  if (!securities[record.symbol]) {
    securities[record.symbol] = {
      symbol: record.symbol,
      securityName: record.description,
      buyLots: [],
    };
  }

  // Add buy lot
  securities[record.symbol].buyLots.push({
    date: record.date,
    quantity: record.quantity,
    price: record.price,
    cost: Math.abs(record.amount) + record.fees, // Include fees in cost basis
  });
}

/**
 * Processes a sell transaction using FIFO
 */
function processSellTransaction(
  sellRecord: CharlesSchwabRecord,
  securities: Record<string, SecurityInfo>,
) {
  // Skip if security doesn't exist (shouldn't happen with proper data)
  if (!securities[sellRecord.symbol]) {
    console.warn(`Sell transaction for unknown security: ${sellRecord.symbol}`);
    return;
  }

  let soldQuantity = sellRecord.quantity;
  
  // Sort buy lots by date (oldest first) to implement FIFO
  securities[sellRecord.symbol].buyLots.sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Match sell with buy lots
  for (const lot of securities[sellRecord.symbol].buyLots) {
    if (soldQuantity < lot.quantity) {
      //break down lot into smaller lots - create and push a new buylot with remaining quantity
      const remainingQuantity = lot.quantity - soldQuantity;
      const newBuyLot: BuyLot = {
        date: lot.date,
        quantity: remainingQuantity,
        price: lot.price,
        cost: (lot.cost / lot.quantity) * remainingQuantity,
      };
      securities[sellRecord.symbol].buyLots.push(newBuyLot);

      //update the original lot with the remaining quantity
      lot.sellQuantity = soldQuantity;
      lot.sellDate = sellRecord.date;
      soldQuantity = 0;
      break;

    } else {
      //fully sell the lot
      lot.sellDate = sellRecord.date;
      lot.sellQuantity = lot.quantity;
      soldQuantity -= lot.quantity;
    }
  }
  
  // Log warning if we couldn't match all shares
  if (soldQuantity > 0) {
    console.warn(`Could not match all shares for sell transaction of ${sellRecord.symbol}: ${soldQuantity} shares unmatched`);
  }
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

/**
 * Builds Schedule FA entries from processed securities
 * 
 * @param securities - Processed securities
 * @param calendarYearStart - Start of calendar year
 * @param calendarYearEnd - End of calendar year
 * @returns Array of SecurityHolding objects for Schedule FA
 */
function buildScheduleFAEntries(
  securities: Record<string, SecurityInfo>,
  calendarYearStart: Date,
  calendarYearEnd: Date
): SecurityHolding[] {
  const yearEndHoldings: SecurityHolding[] = [];
  
  // Count statistics for reporting
  let holdingsOnDecember31 = 0;
  let transactedInCY = 0;
  
  // Process each security
  Object.values(securities).forEach(security => {

    //filter buy lots where either quantity-sellQuantity > 0 or sellDate is in the calendar year
    const remainingLots = security.buyLots.filter(lot => {
      const hasRemainingQuantity = lot.quantity - (lot.sellQuantity || 0) > 0;
      const wasSoldInYear = lot.sellDate && lot.sellDate >= calendarYearStart && lot.sellDate <= calendarYearEnd;
      return hasRemainingQuantity || wasSoldInYear;
    });

    //create security holding object for each remaining lot
    remainingLots.forEach(lot => {
      const remainingQuantity = lot.quantity - (lot.sellQuantity || 0);
      const marketValue = remainingQuantity * (lot.price || 0);
      const salesProceedsOrRedemptionAmountINR = (lot.sellQuantity || 0) * (lot.price || 0);
      
      yearEndHoldings.push({
        symbol: security.symbol,
        securityName: security.securityName,
        address: '',
        zipCode: '',
        natureOfAsset: '',
        dateOfAcquisition: lot.date,
        initialInvestmentINR: lot.cost,
        peakValueINR: 0,
        closingValueINR: marketValue,
        totalGrossAmountINR: marketValue,
        salesProceedsOrRedemptionAmountINR: salesProceedsOrRedemptionAmountINR
      });
    });

  });
  
  console.log(`\n===== SCHEDULE FA HOLDINGS =====`);
  const calendarYear = calendarYearStart.getFullYear();
  console.log(`Holdings that existed on December 31, ${calendarYear}: ${holdingsOnDecember31}`);
  console.log(`Holdings transacted within ${calendarYear}: ${transactedInCY}`);
  console.log(`Total holdings for Schedule FA: ${yearEndHoldings.length}`);
  
  return yearEndHoldings;
} 