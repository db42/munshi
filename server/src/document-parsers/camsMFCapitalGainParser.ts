import fs from 'fs';
import * as XLSX from 'xlsx';
import { ParseResult } from '../utils/parserTypes';
import { logger } from '../utils/logger';

/**
 * Interface for a single mutual fund transaction from CAMS statement
 */
export interface CAMSMutualFundTransaction {
  folioNo: string;
  fundName: string;
  schemeName: string;
  isin: string;
  transactionType: string; // Usually "Redemption" or similar
  units: number;
  navOnSale: number;
  saleValue: number;
  saleDate: Date;
  purchaseDate: Date;
  purchaseNav: number;
  acquisitionValue: number;
  holdingPeriodDays: number;
  gainOrLoss: number;
  capitalGainType: 'STCG' | 'LTCG';
  assetCategory: 'Equity' | 'Debt' | 'Hybrid';
}

/**
 * Interface for CAMS capital gain statement data
 */
export interface CAMSMFCapitalGainData {
  investorDetails: {
    name: string;
    pan: string;
  };
  statementPeriod: {
    fromDate: string;
    toDate: string;
  };
  transactions: CAMSMutualFundTransaction[];
  schemeWiseSummary?: SchemeWiseSummary[];
  summary: {
    equityStcg: number;
    equityLtcg: number;
    debtStcg: number;
    debtLtcg: number;
    totalGainLoss: number;
  };
}

/**
 * Interface for scheme-wise summary data
 */
export interface SchemeWiseSummary {
  schemeName: string;
  folioNo?: string;
  isin?: string;
  units: number;
  totalAmount: number;
  costOfAcquisition: number;
  shortTermGain: number;
  longTermGainWithIndex?: number;
  longTermGainWithoutIndex: number;
  assetCategory: 'Equity' | 'Debt' | 'Hybrid';
}

/**
 * Determines if a mutual fund is equity, debt, or hybrid based on its name
 * 
 * @param schemeName Name of the mutual fund scheme
 * @returns Asset category classification
 */
function determineAssetCategory(schemeName: string): 'Equity' | 'Debt' | 'Hybrid' {
  const lowerName = schemeName.toLowerCase();
  
  if (lowerName.includes('debt') || 
      lowerName.includes('banking and psu') ||
      lowerName.includes('liquid') || 
      lowerName.includes('ultra short') ||
      lowerName.includes('money market') ||
      lowerName.includes('corporate bond') ||
      lowerName.includes('gilt') ||
      lowerName.includes('overnight')) {
    return 'Debt';
  } else if (lowerName.includes('hybrid') || 
             lowerName.includes('balanced advantage') || 
             lowerName.includes('asset allocation') ||
             lowerName.includes('equity savings')) {
    return 'Hybrid';
  } else {
    // Default to equity if not clearly debt or hybrid
    return 'Equity';
  }
}

/**
 * Parses a CAMS Mutual Fund Capital Gain Statement XLS file
 * 
 * @param filePath Path to the XLS file
 * @returns ParseResult containing the structured data
 */
export const parseCAMSCapitalGainStatement = async (
  filePath: string
): Promise<ParseResult<CAMSMFCapitalGainData>> => {
  try {
    logger.info(`Starting to parse CAMS Capital Gain Statement: ${filePath}`);
    
    // Read the file using SheetJS which supports both XLS and XLSX formats
    const workbook = XLSX.readFile(filePath);
    
    // Get all worksheets
    const sheetNames = workbook.SheetNames;
    if (sheetNames.length === 0) {
      return {
        success: false,
        error: 'No sheets found in the Excel file'
      };
    }
    
    logger.info(`Found sheets: ${sheetNames.join(', ')}`);
    
    // Find relevant sheets by name patterns
    const investorDetailsSheetName = sheetNames.find(name => 
      name.toUpperCase().includes('INVESTOR') || name.toUpperCase().includes('DETAILS'));
    const transactionSheetName = sheetNames.find(name => 
      name.toUpperCase().includes('TRXN') || name.toUpperCase().includes('TRANSACTION'));
    const summarySheetName = sheetNames.find(name => 
      name.toUpperCase().includes('SUMMARY') || name.toUpperCase().includes('OVERALL'));
    const schemeWiseSheetName = sheetNames.find(name => 
      name.toUpperCase().includes('SCHEME') || name.toUpperCase().includes('FUND'));

    // Extract investor details (will include statement period temporarily)
    let extractedInfo = {
      name: '', pan: '', fromDate: '', toDate: ''
    };

    // 1. Try dedicated investor sheet first
    if (investorDetailsSheetName) {
      const investorSheet = workbook.Sheets[investorDetailsSheetName];
      if (investorSheet) {
        logger.info(`Attempting direct cell extraction from investor sheet: "${investorDetailsSheetName}"`);
        extractedInfo = extractInvestorDetails(investorSheet);
        // Log success based on name or date found
        if (extractedInfo.name || extractedInfo.fromDate) { 
           logger.info(`Successfully extracted some details using direct cell access from "${investorDetailsSheetName}". Name: ${extractedInfo.name || 'Not Found'}, Period: ${extractedInfo.fromDate || 'Not Found'} to ${extractedInfo.toDate || 'Not Found'}`);
        } else {
          logger.warn(`Direct cell access failed to find name AND date range in expected cells on sheet "${investorDetailsSheetName}".`);
        }
      } else {
        logger.warn(`Sheet named "${investorDetailsSheetName}" found but could not be loaded.`);
      }
    } else {
       logger.warn('No sheet found with a name like "INVESTOR" or "DETAILS". Cannot attempt primary direct cell access method.');
    }

    // Separate extracted info into final structure
    const investorDetails: CAMSMFCapitalGainData['investorDetails'] = {
        name: extractedInfo.name,
        pan: extractedInfo.pan
    };
    const statementPeriod: CAMSMFCapitalGainData['statementPeriod'] = {
        fromDate: extractedInfo.fromDate,
        toDate: extractedInfo.toDate
    };

    // Log final result, even if empty
    if (!investorDetails.name && !statementPeriod.fromDate) {
        logger.error('Investor details (name and date range) could not be extracted from the statement using the expected direct cell access method.');
    }
    logger.info(`Final Investor Details: ${JSON.stringify(investorDetails)}, Statement Period: ${JSON.stringify(statementPeriod)}`);
          
    // --- Transaction Extraction --- 
    let transactions: CAMSMutualFundTransaction[] = [];
    let usedSheetNameForTransactions: string | null = null;

    if (transactionSheetName) {
        usedSheetNameForTransactions = transactionSheetName;
        const transactionSheetData = XLSX.utils.sheet_to_json(workbook.Sheets[transactionSheetName]);
        transactions = extractTransactions(transactionSheetData);
        logger.info(`Parsed ${transactions.length} transactions from dedicated sheet "${transactionSheetName}"`);
    } else if (sheetNames.length > 0) {
        // Fallback to first sheet for transactions
        usedSheetNameForTransactions = sheetNames[0];
        const firstSheetData = XLSX.utils.sheet_to_json(workbook.Sheets[usedSheetNameForTransactions]);
        transactions = extractTransactions(firstSheetData);
        logger.info(`Parsed ${transactions.length} transactions from first sheet "${usedSheetNameForTransactions}"`);
    }

    // --- Summary Extraction --- (Using JSON approach for simplicity)
    let summary = {
      equityStcg: 0,
      equityLtcg: 0,
      debtStcg: 0,
      debtLtcg: 0,
      totalGainLoss: 0
    };

    if (summarySheetName) {
      try {
        const summarySheet = XLSX.utils.sheet_to_json(workbook.Sheets[summarySheetName]);
        summary = extractSummaryFromSheet(summarySheet);
        logger.info(`Extracted summary from ${summarySheetName}: ${JSON.stringify(summary)}`);
      } catch (error) {
        logger.warn(`Error extracting summary from ${summarySheetName}: ${error}`);
        // Fall back to calculating from transactions
        summary = calculateSummary(transactions);
      }
    } else {
      // Calculate summary from transactions if no summary sheet
      summary = calculateSummary(transactions);
    }

    logger.info(`Final summary: ${JSON.stringify(summary)}`);
    
    // Extract scheme-wise summary
    let schemeWiseSummary: SchemeWiseSummary[] = [];

    if (schemeWiseSheetName) {
      try {
        const schemeWiseSheet = XLSX.utils.sheet_to_json(workbook.Sheets[schemeWiseSheetName]);
        schemeWiseSummary = extractSchemeWiseSummary(schemeWiseSheet);
        logger.info(`Extracted ${schemeWiseSummary.length} scheme-wise entries`);
      } catch (error) {
        logger.warn(`Error extracting scheme-wise summary: ${error}`);
      }
    }

    return {
      success: true,
      data: {
        investorDetails,
        statementPeriod,
        transactions,
        schemeWiseSummary: schemeWiseSummary.length > 0 ? schemeWiseSummary : undefined,
        summary
      }
    };
  } catch (error) {
    logger.error(`Error parsing CAMS Capital Gain Statement: ${error}`);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing Excel file'
    };
  }
};

/**
 * Extracts investor details from the worksheet using direct cell access (fixed structure).
 */
function extractInvestorDetails(worksheet: XLSX.WorkSheet): { name: string; pan: string; fromDate: string; toDate: string } {
  let name = '';
  let pan = ''; // PAN not expected in this format
  let fromDate = '';
  let toDate = '';

  // Define cell refs outside try blocks to be accessible in catch
  const dateRangeCellRef = 'E2';
  const nameCellRef = 'B5';

  try {
    // 1. Extract Date Range from cell E2
    const dateRangeCell = worksheet[dateRangeCellRef];
    //log all cells in the worksheet
    logger.info(`All cells in the worksheet: ${JSON.stringify(worksheet)}`);
    const dateRangeString = dateRangeCell ? (dateRangeCell.w || String(dateRangeCell.v)) : null;

    if (dateRangeString) {
      const dateMatch = dateRangeString.match(/(\d{2}-\w{3}-\d{4}) to (\d{2}-\w{3}-\d{4})/);
      if (dateMatch && dateMatch.length === 3) {
        fromDate = dateMatch[1];
        toDate = dateMatch[2];
        logger.info(`Parsed date range from ${dateRangeCellRef}: ${fromDate} to ${toDate}`);
      } else {
        logger.warn(`Could not parse date pattern in cell ${dateRangeCellRef}: ${dateRangeString}`);
      }
    } else {
      logger.warn(`Date range cell 'E2' not found or empty.`);
    }
  } catch (e) {
    logger.error(`Error extracting date range from cell ${dateRangeCellRef}: ${e}`);
  }

  try {
    // 2. Extract Name from cell B5
    const nameCell = worksheet[nameCellRef];
    if (nameCell) {
      name = (nameCell.w || String(nameCell.v)).trim();
      logger.info(`Extracted name from ${nameCellRef}: ${name}`);
    } else {
      logger.warn(`Name cell ${nameCellRef} not found or empty.`);
    }
  } catch (e) {
    logger.error(`Error extracting name from cell B5: ${e}`);
  }
  
  // PAN extraction is skipped for this fixed format

  return {
    name,
    pan,
    fromDate,
    toDate
  };
}

/**
 * Calculate summary statistics from transactions
 */
function calculateSummary(transactions: CAMSMutualFundTransaction[]): CAMSMFCapitalGainData['summary'] {
  let equityStcg = 0;
  let equityLtcg = 0;
  let debtStcg = 0;
  let debtLtcg = 0;
  
  for (const transaction of transactions) {
    if (transaction.assetCategory === 'Equity') {
      if (transaction.capitalGainType === 'STCG') {
        equityStcg += transaction.gainOrLoss;
      } else {
        equityLtcg += transaction.gainOrLoss;
      }
    } else {
      if (transaction.capitalGainType === 'STCG') {
        debtStcg += transaction.gainOrLoss;
      } else {
        debtLtcg += transaction.gainOrLoss;
      }
    }
  }
  
  const totalGainLoss = equityStcg + equityLtcg + debtStcg + debtLtcg;
  
  return {
    equityStcg,
    equityLtcg,
    debtStcg,
    debtLtcg,
    totalGainLoss
  };
}

/**
 * Helper function to parse dates from various formats
 */
function parseDate(dateInput: string | number): Date {
  let dateStr = String(dateInput);
  // Check for Excel date serial number (simple check for numbers > 25569 which is 1970-01-01)
  if (typeof dateInput === 'number' && dateInput > 25569) {
    try {
        const excelEpoch = new Date(1899, 11, 30); // Excel epoch starts Dec 30, 1899
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const date = new Date(excelEpoch.getTime() + dateInput * millisecondsPerDay);
        // Adjust for potential timezone offset if needed, assuming UTC for now
        if (!isNaN(date.getTime())) {
             logger.debug(`Parsed Excel date serial number ${dateInput} to ${date.toISOString()}`);
            return date;
        }
    } catch (e) {
        logger.warn(`Failed to parse potential Excel date number ${dateInput}: ${e}`);
    }
  }

  // Try direct parsing first (handles YYYY-MM-DD, ISO formats etc.)
  let date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    // Basic validation: Ensure year seems reasonable (e.g., > 1900)
    if (date.getFullYear() > 1900) {
       return date;
    }
  }
  
  // Try common formats with regex (DD/MM/YYYY, DD-Mon-YYYY, etc.)
  const formats = [
    /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/, // DD/MM/YYYY or DD-MM-YYYY
    /^(\d{1,2})[\/\-](\w{3})[\/\-](\d{4})$/,   // DD/Mon/YYYY or DD-Mon-YYYY
    /^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/, // YYYY/MM/DD or YYYY-MM-DD
  ];
  const monthMap: { [key: string]: number } = { 
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, 
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 
  };

  for (const regex of formats) {
    const parts = dateStr.match(regex);
    if (parts) {
      try {
          let day: number, month: number, year: number;
          
          if (regex.source.includes('\w{3}')) { // Format with month abbreviation
              day = parseInt(parts[1], 10);
              month = monthMap[parts[2].toLowerCase()];
              year = parseInt(parts[3], 10);
          } else if (regex.source.startsWith('^(\\d{4})')) { // YYYY first
              year = parseInt(parts[1], 10);
              month = parseInt(parts[2], 10) - 1;
              day = parseInt(parts[3], 10);
          } else { // DD first
              day = parseInt(parts[1], 10);
              month = parseInt(parts[2], 10) - 1; // Months are 0-indexed in JS
              year = parseInt(parts[3], 10);
          }
          
          if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 0 && month <= 11 && day >= 1 && day <= 31 && year > 1900) {
            date = new Date(year, month, day);
            if (!isNaN(date.getTime())) return date;
          }
      } catch (e) { /* Ignore parsing errors for this format */ }
    }
  }
  
  // Return current date as fallback
  logger.warn(`Could not parse date: "${dateStr}", using current date as fallback`);
  return new Date();
}

/**
 * Helper function to find a field in the row based on possible names
 */
function findField(row: any, possibleNames: string[]): string | null {
  if (typeof row !== 'object' || row === null) return null; // Add null/type check for row
  const keys = Object.keys(row);
  for (const name of possibleNames) {
    const lowerName = name.toLowerCase();
    // Find key that *contains* the possible name (case-insensitive)
    const matchingKey = keys.find(key => 
      key.toLowerCase().includes(lowerName));
    if (matchingKey) {
      return matchingKey;
    }
  }
  return null;
}

/**
 * Helper function to extract a value from a row with a fallback
 */
function extractValue(row: any, field: string | null, fallback: any): any {
  if (field === null || row[field] === undefined || row[field] === null) {
    return fallback;
  }
  // Trim strings to remove leading/trailing whitespace
  return typeof row[field] === 'string' ? row[field].trim() : row[field];
}

/**
 * Extracts transaction data from the XLS rows
 */
function extractTransactions(jsonData: any[]): CAMSMutualFundTransaction[] {
  const transactions: CAMSMutualFundTransaction[] = [];
  
  // Find the header row that indicates the start of transaction data
  let headerRowIndex = -1;
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    // Handle cases where row might not be an object or has no keys
    if (typeof row !== 'object' || row === null || Object.keys(row).length === 0) {
       logger.debug(`Skipping non-object or empty row at index ${i}`);
       continue; 
    }
    const rowKeys = Object.keys(row);
    
    // Look for typical header patterns
    if (rowKeys.some(key => 
        key.toLowerCase().includes('folio') || 
        key.toLowerCase().includes('scheme') || 
        key.toLowerCase().includes('transaction') ||
        key.toLowerCase().includes('units') || // Add more potential header keywords
        key.toLowerCase().includes('amount') ||
        key.toLowerCase().includes('nav')
      )) {
      headerRowIndex = i;
      logger.info(`Found potential transaction header row at index ${i}`);
      break;
    }
  }
  
  if (headerRowIndex === -1) {
    logger.warn('Could not find transaction header row based on common keywords. Data extraction might be incomplete.');
    // Optional: Attempt to process from row 0 if no header found?
    // headerRowIndex = -1; // To start loop below from 0
    return []; // Current behavior: return empty if no header
  }
  
  // Process rows after the header
  for (let i = headerRowIndex + 1; i < jsonData.length; i++) {
    const row = jsonData[i];
    
    try {
      // Skip empty or non-object rows
      if (!row || typeof row !== 'object' || Object.keys(row).length === 0 || 
          Object.values(row).every(val => !val)) {
        continue;
      }
      
      // Skip rows that appear to be subtotals/footers (heuristic)
      const rowStr = JSON.stringify(row).toLowerCase();
      if (rowStr.includes('total') || rowStr.includes('summary') || rowStr.includes('sub-total')) {
         logger.debug(`Skipping potential total/summary row at index ${i}`);
        continue;
      }
      
      // Extract values from the row
      const transaction = mapRowToTransaction(row);
      if (transaction) {
        transactions.push(transaction);
      }
    } catch (error) {
      logger.warn(`Error processing transaction row ${i}: ${error}`);
    }
  }
  
  return transactions;
}

/**
 * Maps a row from the XLS to a transaction object
 */
function mapRowToTransaction(row: any): CAMSMutualFundTransaction | null {
  // This function needs to be adapted to the specific CAMS format
  // The field names below are examples and should be adjusted
  
  try {
    // Find column name variations for important fields using findField
    const folioField = findField(row, ['folio', 'folio no', 'folio number']);
    const schemeField = findField(row, ['scheme', 'scheme name', 'fund', 'fund name', 'security name']);
    const isinField = findField(row, ['isin', 'isin code']);
    const transactionTypeField = findField(row, ['transaction', 'transaction type', 'type', 'description']);
    const unitsField = findField(row, ['units', 'quantity', 'qty']);
    const navOnSaleField = findField(row, ['nav', 'sale nav', 'nav on sale', 'price']);
    const saleValueField = findField(row, ['sale value', 'sale amount', 'redemption value', 'redemption amount', 'amount']);
    const saleDateField = findField(row, ['sale date', 'redemption date', 'transaction date', 'date']);
    const purchaseDateField = findField(row, ['purchase date', 'acquisition date']);
    const purchaseNavField = findField(row, ['purchase nav', 'acquisition nav', 'cost price']);
    const acquisitionValueField = findField(row, ['acquisition value', 'purchase value', 'cost', 'cost value']);
    const holdingPeriodField = findField(row, ['holding period', 'days', 'period']);
    const gainLossField = findField(row, ['gain', 'loss', 'profit', 'gain/loss', 'short term', 'long term']); // Broader search for gain
    const capitalGainTypeField = findField(row, ['stcg/ltcg', 'capital gain type', 'gain type']);
    
    if (!schemeField || !unitsField || !saleValueField || !saleDateField) {
       logger.debug(`Skipping row due to missing essential fields (scheme, units, sale value, or sale date): ${JSON.stringify(row)}`);
      return null; // Skip rows without essential data
    }
    
    // Extract values with fallbacks
    const folioNo = extractValue(row, folioField, '') as string;
    let fundName = extractValue(row, schemeField, '') as string; // Use scheme initially
    let schemeName = fundName;
    
    // Sometimes fund name and scheme name are separate
    const fundNameField = findField(row, ['fund name', 'fund']);
    if (fundNameField && fundNameField !== schemeField) {
       // If a distinct 'fund name' field exists, use it and keep scheme separate
      fundName = extractValue(row, fundNameField, '') as string;
      schemeName = extractValue(row, schemeField, '') as string; 
    }
    
    const isin = extractValue(row, isinField, '') as string;
    let transactionType = extractValue(row, transactionTypeField, 'Redemption') as string;
    // Refine transaction type if possible (e.g., based on gain/loss presence)
    if (gainLossField === null && transactionType.toLowerCase() === 'redemption') {
        // If no gain/loss found, might not be a capital gain transaction
        // transactionType = 'Unknown'; // Or handle differently
    }

    const units = parseFloat(String(extractValue(row, unitsField, 0)).replace(/,/g, ''));
    const navOnSale = parseFloat(String(extractValue(row, navOnSaleField, 0)).replace(/,/g, ''));
    const saleValue = parseFloat(String(extractValue(row, saleValueField, 0)).replace(/,/g, ''));
    
    // Parse dates
    let saleDate: Date;
    const saleDateStr = extractValue(row, saleDateField, null);
    if (saleDateStr !== null) {
      saleDate = parseDate(String(saleDateStr));
    } else {
       logger.warn(`Missing sale date for row: ${JSON.stringify(row)}`);
      return null; // Essential field missing
    }
    
    let purchaseDate: Date | null = null;
    const purchaseDateStr = extractValue(row, purchaseDateField, null);
    if (purchaseDateStr !== null) {
      purchaseDate = parseDate(String(purchaseDateStr));
    } else {
       logger.debug(`Purchase date missing, will estimate if possible. Row: ${JSON.stringify(row)}`);
      // Defaulting handled later based on holding period
    }
    
    const purchaseNav = parseFloat(String(extractValue(row, purchaseNavField, 0)).replace(/,/g, ''));
    let acquisitionValue = parseFloat(String(extractValue(row, acquisitionValueField, 0)).replace(/,/g, ''));

    // If acquisition value is missing but purchase NAV and units are present, calculate it
    if (acquisitionValue === 0 && purchaseNav !== 0 && units !== 0) {
        acquisitionValue = purchaseNav * units;
        logger.debug(`Calculated acquisition value (${acquisitionValue}) from purchase NAV (${purchaseNav}) and units (${units})`);
    }
    
    // Calculate or extract holding period
    let holdingPeriodDays: number = 0; // Initialize to 0
    const holdingPeriodValue = extractValue(row, holdingPeriodField, null);
    if (holdingPeriodValue !== null) {
      holdingPeriodDays = parseInt(String(holdingPeriodValue), 10);
      // Estimate purchase date if missing and holding period is known
      if (purchaseDate === null && holdingPeriodDays > 0) {
          purchaseDate = new Date(saleDate);
          purchaseDate.setDate(saleDate.getDate() - holdingPeriodDays);
          logger.debug(`Estimated purchase date (${purchaseDate.toISOString()}) from sale date and holding period (${holdingPeriodDays} days)`);
      }
    } else if (purchaseDate !== null) {
      // Calculate days between purchase and sale if both dates are known
      const daysDiff = Math.floor((saleDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
      holdingPeriodDays = daysDiff >= 0 ? daysDiff : 0; // Ensure non-negative
    } else {
       logger.warn(`Could not determine holding period (missing purchase date and period field) for row: ${JSON.stringify(row)}`);
        // Cannot determine gain type without holding period
    }
    
    // Default purchase date if still null (e.g., 1 year before sale date)
    if (purchaseDate === null) {
        purchaseDate = new Date(saleDate);
        purchaseDate.setFullYear(purchaseDate.getFullYear() - 1);
        logger.debug(`Defaulted purchase date to 1 year before sale date: ${purchaseDate.toISOString()}`);
    }

    // Extract or calculate gain/loss
    let gainOrLoss: number;
    const gainLossValue = extractValue(row, gainLossField, null);
    if (gainLossValue !== null) {
      gainOrLoss = parseFloat(String(gainLossValue).replace(/,/g, ''));
      // Handle cases where gain/loss might be split (e.g., Short Term / Long Term columns)
      // If gainLossField was 'short term', check for 'long term' as well, etc.
      // This part might need refinement based on specific statement formats.
    } else if (saleValue !== 0 && acquisitionValue !== 0) {
      gainOrLoss = saleValue - acquisitionValue;
    } else {
      logger.warn(`Could not determine gain/loss for row: ${JSON.stringify(row)}`);
      gainOrLoss = 0; // Default to 0 if cannot calculate
    }
    
    // Determine capital gain type
    let capitalGainType: 'STCG' | 'LTCG';
    const capitalGainTypeValue = extractValue(row, capitalGainTypeField, null);
    const assetCategory = determineAssetCategory(schemeName); // Determine category first

    if (capitalGainTypeValue !== null) {
      const cgTypeStr = String(capitalGainTypeValue).toUpperCase();
      capitalGainType = cgTypeStr.includes('STCG') || cgTypeStr.includes('SHORT') ? 'STCG' : 'LTCG';
    } else if (holdingPeriodDays > 0) { // Can only determine type if holding period is known
      // For equity mutual funds, LTCG is > 12 months holding period
      // For debt mutual funds, LTCG is > 36 months holding period
      const threshold = assetCategory === 'Debt' ? (3 * 365) : 365;
      capitalGainType = holdingPeriodDays > threshold ? 'LTCG' : 'STCG';
    } else {
      // Cannot determine type if holding period is unknown
      // Decide on a default or handle as error? Defaulting to LTCG for now.
      capitalGainType = 'LTCG'; 
       logger.warn(`Could not determine capital gain type due to unknown holding period. Defaulting to LTCG. Row: ${JSON.stringify(row)}`);
    }
    
    // Asset category already determined above
    
    return {
      folioNo,
      fundName,
      schemeName,
      isin,
      transactionType,
      units,
      navOnSale,
      saleValue,
      saleDate,
      purchaseDate, // Now guaranteed non-null
      purchaseNav,
      acquisitionValue,
      holdingPeriodDays,
      gainOrLoss,
      capitalGainType,
      assetCategory
    };
  } catch (error) {
    logger.warn(`Error mapping row to transaction: ${error}. Row data: ${JSON.stringify(row)}`);
    return null;
  }
}

/**
 * Extract summary information from the OVERALL_SUMMARY_EQUITY sheet
 */
function extractSummaryFromSheet(jsonData: any[]): CAMSMFCapitalGainData['summary'] {
  let equityStcg = 0;
  let equityLtcg = 0;
  let debtStcg = 0;
  let debtLtcg = 0;
  let totalGainLoss = 0;
  
  logger.info(`Processing ${jsonData.length} rows from summary sheet`);
  
  // Debug: Log potential capital gain rows to help with format identification
  jsonData.forEach((row, index) => {
    const rowStr = JSON.stringify(row).toLowerCase();
    if (rowStr.includes('capital') && rowStr.includes('gain')) {
      logger.info(`Potential capital gain row[${index}]: ${JSON.stringify(row)}`);
    }
  });

  // First, look for the specific format where "LongTermWithOutIndex-CapitalGain/Loss" is a key
  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];
    
    // Skip empty rows
    if (!row || Object.keys(row).length === 0) continue;
    
    // Convert row to string for easier searching
    const rowString = JSON.stringify(row).toLowerCase();
    
    // Look for exact match from the log format
    if (row.__EMPTY === "Short Term Capital Gain/Loss" && row.__EMPTY_5 !== undefined) {
      equityStcg = typeof row.__EMPTY_5 === 'number' ? row.__EMPTY_5 : 0;
      logger.info(`Found STCG in exact format: ${equityStcg}`);
    }
    
    if (row.__EMPTY === "LongTermWithOutIndex-CapitalGain/Loss" && row.__EMPTY_5 !== undefined) {
      equityLtcg = typeof row.__EMPTY_5 === 'number' ? row.__EMPTY_5 : 0;
      logger.info(`Found LTCG in exact format: ${equityLtcg}`);
    }
    
    // Also look for other variations of CAMS format
    if (row.__EMPTY && typeof row.__EMPTY === 'string') {
      const fieldName = row.__EMPTY.toLowerCase();
      
      // Check various short-term gain formats
      if (fieldName.includes('short term') && fieldName.includes('capital gain')) {
        if (row.__EMPTY_5 !== undefined && typeof row.__EMPTY_5 === 'number') {
          equityStcg = row.__EMPTY_5;
          logger.info(`Found STCG in variation format: ${equityStcg}`);
        }
      }
      
      // Check various long-term gain formats (without index)
      if ((fieldName.includes('long term') || fieldName.includes('longterm')) && 
          (fieldName.includes('without index') || fieldName.includes('withoutindex'))) {
        if (row.__EMPTY_5 !== undefined && typeof row.__EMPTY_5 === 'number') {
          equityLtcg = row.__EMPTY_5;
          logger.info(`Found LTCG in variation format: ${equityLtcg}`);
        }
      }
    }
  }
  
  // If we haven't found anything in the structured format, try a more generic approach
  if (equityStcg === 0 && equityLtcg === 0) {
    logger.info("Using generic approach to find capital gains in summary sheet");
    
    for (const row of jsonData) {
      // Convert row to string for easier searching
      const rowString = JSON.stringify(row).toLowerCase();
      
      // Look for short term capital gain entries
      if (rowString.includes('short term') || rowString.includes('stcg')) {
        // Look through all columns for a total value
        for (const key in row) {
          // Check for total column or last column
          if ((key.includes('total') || key === '__EMPTY_5') && typeof row[key] === 'number') {
            equityStcg = row[key];
            logger.info(`Found STCG in generic format: ${equityStcg}`);
            break;
          } else if (typeof row[key] === 'number' && row[key] !== 0) {
            // If no specific total column, use any numeric value (less reliable)
            equityStcg = row[key];
          }
        }
      }
      
      // Look for long term capital gain entries
      if (rowString.includes('long term') || 
          rowString.includes('ltcg') || 
          rowString.includes('without index')) {
        // Look through all columns for a total value
        for (const key in row) {
          // Check for total column or last column
          if ((key.includes('total') || key === '__EMPTY_5') && typeof row[key] === 'number') {
            equityLtcg = row[key];
            logger.info(`Found LTCG in generic format: ${equityLtcg}`);
            break;
          } else if (typeof row[key] === 'number' && row[key] !== 0) {
            // If no specific total column, use any numeric value (less reliable)
            equityLtcg = row[key];
          }
        }
      }
    }
  }
  
  // Calculate total gain/loss
  totalGainLoss = equityStcg + equityLtcg + debtStcg + debtLtcg;
  
  logger.info(`Extracted from summary sheet: STCG=${equityStcg}, LTCG=${equityLtcg}, Total=${totalGainLoss}`);
  
  return {
    equityStcg,
    equityLtcg,
    debtStcg,
    debtLtcg,
    totalGainLoss
  };
}

/**
 * Extract scheme-wise summary from the SCHEMEWISE_EQUITY sheet
 */
function extractSchemeWiseSummary(jsonData: any[]): SchemeWiseSummary[] {
  const schemeWiseSummaries: SchemeWiseSummary[] = [];
  
  // Skip header rows - find the row that has column headers
  let startIndex = 0;
  for (let i = 0; i < Math.min(10, jsonData.length); i++) {
    const rowStr = JSON.stringify(jsonData[i]).toLowerCase();
    if (rowStr.includes('scheme') && (rowStr.includes('folio') || rowStr.includes('units'))) {
      startIndex = i + 1;
      break;
    }
  }
  
  // Start processing from the row after headers
  for (let i = startIndex; i < jsonData.length; i++) {
    const row = jsonData[i];
    
    // Skip empty rows or summary rows
    if (!row || Object.keys(row).length === 0) continue;
    const rowStr = JSON.stringify(row).toLowerCase();
    if (rowStr.includes('total') && !rowStr.includes('scheme')) continue;
    
    try {
      // Find column names
      const schemeNameCol = findField(row, ['Scheme']) || findField(row, ['Fund']);
      const folioNoCol = findField(row, ['Folio']);
      const isinCol = findField(row, ['ISIN']);
      const unitsCol = findField(row, ['Units']) || findField(row, ['Count']);
      const amountCol = findField(row, ['Amount']) || findField(row, ['Value']);
      const costCol = findField(row, ['Cost']);
      const shortTermCol = findField(row, ['Short Term']);
      const longTermWithIndexCol = findField(row, ['With Index']);
      const longTermWithoutIndexCol = findField(row, ['Without Index']);
      
      // Skip row if essential columns are missing
      if (!schemeNameCol || (!amountCol && !costCol)) continue;
      
      // Extract values
      const schemeName = schemeNameCol ? row[schemeNameCol] : '';
      const folioNo = folioNoCol ? row[folioNoCol] : '';
      const isin = isinCol ? row[isinCol] : '';
      const units = unitsCol ? parseFloat(row[unitsCol] || '0') : 0;
      const totalAmount = amountCol ? parseFloat(row[amountCol] || '0') : 0;
      const costOfAcquisition = costCol ? parseFloat(row[costCol] || '0') : 0;
      const shortTermGain = shortTermCol ? parseFloat(row[shortTermCol] || '0') : 0;
      const longTermGainWithIndex = longTermWithIndexCol ? parseFloat(row[longTermWithIndexCol] || '0') : 0;
      const longTermGainWithoutIndex = longTermWithoutIndexCol ? parseFloat(row[longTermWithoutIndexCol] || '0') : 0;
      
      // Determine asset category from scheme name
      const assetCategory = determineAssetCategory(schemeName);
      
      schemeWiseSummaries.push({
        schemeName,
        folioNo,
        isin,
        units,
        totalAmount,
        costOfAcquisition,
        shortTermGain,
        longTermGainWithIndex,
        longTermGainWithoutIndex,
        assetCategory
      });
    } catch (error) {
      logger.warn(`Error processing scheme-wise row ${i}: ${error}`);
    }
  }
  
  return schemeWiseSummaries;
} 