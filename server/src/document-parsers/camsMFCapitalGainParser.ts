import fs from 'fs';
import * as XLSX from 'xlsx';
import { ParseResult } from '../utils/parserTypes';
import { logger } from '../utils/logger';
import { parseNumericValue } from '../utils/formatters';

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
  investorName: string;
  investorStatus: string;
  investorPAN: string;
  guardianPAN: string;
  stt: number;
  purchaseDescription: string;
  purchaseUnits: number;
  redemptionUnits: number;
  indexedCost: number;
  grandfatheredUnits: number;
  grandfatheredNAV: number;
  grandfatheredValue: number;
  shortTermGain: number;
  longTermWithIndexGain: number;
  longTermWithoutIndexGain: number;
  taxPercentage: number;
  taxDeducted: number;
  taxSurcharge: number;
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
        logger.info(`Transaction sheet data: ${JSON.stringify(transactionSheetData)}`);
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
  
  // Validate CAMS report structure
  if (jsonData.length < 2) {
    logger.error("CAMS report data has insufficient rows");
    return [];
  }
  
  // Validation 1: Check report title
  const firstRow = jsonData[0];
  if (!firstRow || 
      !firstRow["Capital Gain / Loss Statement"]) {
    logger.error("CAMS report doesn't have expected 'Capital Gain / Loss Statement' header");
    logger.debug(`First row structure: ${JSON.stringify(firstRow)}`);
    return [];
  }
  
  // Validation 2: Check header structure
  const headerRow = jsonData[1];
  
  // 2.1: Verify header row exists and is an object
  if (!headerRow || typeof headerRow !== 'object') {
    logger.error("Header row is missing or not an object");
    return [];
  }
  
  // 2.2: Check essential column headers exist
  const requiredColumns = ["__EMPTY", "__EMPTY_1", "__EMPTY_7", "__EMPTY_8", "__EMPTY_9", 
                           "__EMPTY_10", "__EMPTY_11", "__EMPTY_12", "__EMPTY_14", 
                           "__EMPTY_16", "__EMPTY_17", "__EMPTY_24"];
  
  const missingColumns = requiredColumns.filter(col => !(col in headerRow));
  if (missingColumns.length > 0) {
    logger.error(`CAMS report is missing expected columns: ${missingColumns.join(', ')}`);
    logger.debug(`Header row structure: ${JSON.stringify(headerRow)}`);
    return [];
  }
  
  // 2.3: Validate header content matches expected pattern
  const headerValidation = [
    { field: "__EMPTY", expectedContent: "AMC Name" },
    { field: "__EMPTY_1", expectedContent: "Folio No" },
    { field: "__EMPTY_2", expectedContent: "ASSET CLASS" },
    { field: "__EMPTY_3", expectedContent: "NAME" },
    { field: "__EMPTY_4", expectedContent: "STATUS" },
    { field: "__EMPTY_5", expectedContent: "PAN" },
    { field: "__EMPTY_6", expectedContent: "GUARDIAN_PAN" },
    { field: "__EMPTY_7", expectedContent: "Scheme Name" },
    { field: "__EMPTY_8", expectedContent: "Desc" },
    { field: "__EMPTY_9", expectedContent: "Date" },
    { field: "__EMPTY_10", expectedContent: "Units" },
    { field: "__EMPTY_11", expectedContent: "Amount" },
    { field: "__EMPTY_12", expectedContent: "Price" },
    { field: "__EMPTY_13", expectedContent: "STT" },
    { field: "Capital Gain / Loss Statement", expectedContent: "Desc_1" },
    { field: "__EMPTY_14", expectedContent: "Date_1" },
    { field: "__EMPTY_15", expectedContent: "PurhUnit" },
    { field: "__EMPTY_16", expectedContent: "RedUnits" },
    { field: "__EMPTY_17", expectedContent: "Unit Cost" },
    { field: "__EMPTY_18", expectedContent: "Indexed Cost" },
    { field: "__EMPTY_19", expectedContent: "Units As On 31/01/2018" },
    { field: "__EMPTY_20", expectedContent: "NAV As On 31/01/2018" },
    { field: "__EMPTY_21", expectedContent: "Market Value As On 31/01/2018" },
    { field: "__EMPTY_22", expectedContent: "Short Term" },
    { field: "__EMPTY_23", expectedContent: "Long Term With Index" },
    { field: "__EMPTY_24", expectedContent: "Long Term Without Index" },
    { field: "__EMPTY_25", expectedContent: "Tax Perc" },
    { field: "__EMPTY_26", expectedContent: "Tax Deduct" },
    { field: "__EMPTY_27", expectedContent: "Tax Surcharge" }
  ];
  
  const contentErrors = headerValidation
    .filter(item => !headerRow[item.field] || 
                  !String(headerRow[item.field]).includes(item.expectedContent))
    .map(item => `${item.field} should contain "${item.expectedContent}" but found "${headerRow[item.field]}"`);
  
  if (contentErrors.length > 0) {
    logger.error(`CAMS report header structure doesn't match expected pattern:`);
    contentErrors.forEach(err => logger.error(`- ${err}`));
    logger.debug(`Full header row: ${JSON.stringify(headerRow)}`);
    
    // If more than half of validations fail, reject the file
    if (contentErrors.length > headerValidation.length / 2) {
      logger.error("Too many header validation failures, aborting parser");
      return [];
    }
    
    // Otherwise just warn but continue
    logger.warn("Continuing with parsing despite some header validation errors");
  }
  
  // 2.4: Check if there are data rows after the header
  if (jsonData.length < 3) {
    logger.error("CAMS report doesn't contain any transaction data rows after the header");
    return [];
  }
  
  // 2.5: Validate structure of first data row as sanity check
  const firstDataRow = jsonData[2];
  if (!firstDataRow.__EMPTY || !firstDataRow.__EMPTY_8 || !firstDataRow.__EMPTY_9) {
    logger.error("First data row doesn't have expected structure");
    logger.debug(`First data row: ${JSON.stringify(firstDataRow)}`);
    return [];
  }
  
  // If we've made it here, validation passed
  logger.info("Validated CAMS capital gains report structure, processing transactions");
  
  // Process each transaction row (skip first two rows)
  for (let i = 2; i < jsonData.length; i++) {
    const row = jsonData[i];
    
    // Skip empty rows
    if (!row || typeof row !== 'object') continue;
    
    // Check if this is a redemption transaction
    const transactionType = row.__EMPTY_8;
    if (!transactionType || 
        (!transactionType.includes('Redemption') && 
         !transactionType.includes('Redem'))) {
      continue;
    }
    
    try {
      // Extract ISIN from scheme name if present
      const schemeName = row.__EMPTY_7 || '';
      let isin = '';
      if (schemeName.includes('ISIN :')) {
        const parts = schemeName.split('ISIN :');
        isin = parts[1]?.trim() || '';
      }
      
      // Extract numeric values with more readable variable names
      const units = parseNumericValue(String(row.__EMPTY_10));  // Units
      const navOnSale = parseNumericValue(String(row.__EMPTY_12));      // Price/NAV
      const sttPaid = parseNumericValue(String(row.__EMPTY_13));        // STT
      
      const purchaseUnits = parseNumericValue(String(row.__EMPTY_15));  // PurhUnit
      const lotRedeemedUnits = parseNumericValue(String(row.__EMPTY_16)); // RedUnits
      const purchaseNav = parseNumericValue(String(row.__EMPTY_17));       // Unit Cost/Purchase NAV
      const indexedCost = parseNumericValue(String(row.__EMPTY_18));    // Indexed Cost
      const saleValue = navOnSale * lotRedeemedUnits;
      
      const shortTermGain = parseNumericValue(String(row.__EMPTY_22));  // Short Term
      const longTermWithIndexGain = parseNumericValue(String(row.__EMPTY_23)); // Long Term With Index
      const longTermWithoutIndexGain = parseNumericValue(String(row.__EMPTY_24)); // Long Term Without Index
      
      // Tax information
      const taxPercentage = parseNumericValue(String(row.__EMPTY_25));  // Tax Perc
      const taxDeducted = parseNumericValue(String(row.__EMPTY_26));    // Tax Deduct
      const taxSurcharge = parseNumericValue(String(row.__EMPTY_27));   // Tax Surcharge
      
      // Create transaction object with mapped fields
      const transaction: CAMSMutualFundTransaction = {
        folioNo: row.__EMPTY_1 || '',
        fundName: row.__EMPTY || '', // AMC Name
        schemeName: schemeName.split(',')[0] || '', // Take just the scheme name part
        isin,
        transactionType: row.__EMPTY_8 || 'Redemption',
        units,
        navOnSale,
        saleValue,
        saleDate: parseDate(row.__EMPTY_9 || ''),
        purchaseDate: parseDate(row.__EMPTY_14 || ''),
        purchaseNav,
        acquisitionValue: lotRedeemedUnits * purchaseNav, // Cost of acquisition = redeemed units * unit cost
        holdingPeriodDays: 0, // Calculate from dates
        gainOrLoss: longTermWithoutIndexGain || shortTermGain, // Try LTCG first, then STCG
        capitalGainType: longTermWithoutIndexGain > 0 ? 'LTCG' : 'STCG',
        assetCategory: row.__EMPTY_2 === 'EQUITY' ? 'Equity' : 'Debt',
        
        // Additional fields captured from the report
        investorName: row.__EMPTY_3 || '',
        investorStatus: row.__EMPTY_4 || '',
        investorPAN: row.__EMPTY_5 || '',
        guardianPAN: row.__EMPTY_6 || '',
        stt: sttPaid,
        purchaseDescription: row["Capital Gain / Loss Statement"] || '',
        purchaseUnits: purchaseUnits,
        redemptionUnits: lotRedeemedUnits,
        indexedCost: indexedCost,
        grandfatheredUnits: parseNumericValue(String(row.__EMPTY_19)),
        grandfatheredNAV: parseNumericValue(String(row.__EMPTY_20)),
        grandfatheredValue: parseNumericValue(String(row.__EMPTY_21)),
        shortTermGain,
        longTermWithIndexGain,
        longTermWithoutIndexGain,
        taxPercentage,
        taxDeducted,
        taxSurcharge
      };
      
      // Calculate holding period
      const msPerDay = 24 * 60 * 60 * 1000;
      transaction.holdingPeriodDays = Math.floor(
        (transaction.saleDate.getTime() - transaction.purchaseDate.getTime()) / msPerDay
      );
      
      // Skip transactions with no gain or invalid data
      if (isNaN(transaction.gainOrLoss) || (transaction.gainOrLoss === 0 && transaction.shortTermGain === 0)) {
        logger.debug(`Skipping transaction with zero or invalid gain: ${JSON.stringify(transaction)}`);
        continue;
      }
      
      transactions.push(transaction);
      logger.debug(`Extracted transaction: ${JSON.stringify(transaction)}`);
  } catch (error) {
      logger.warn(`Error processing row ${i}: ${error}. Row data: ${JSON.stringify(row)}`);
  }
  }
  
  logger.info(`Extracted ${transactions.length} transactions from CAMS report`);
  return transactions;
}

/**
 * Extract summary information from the CAMS summary sheet
 * Based on the standard CAMS report format structure
 */
function extractSummaryFromSheet(jsonData: any[]): CAMSMFCapitalGainData['summary'] {
  // Default values
  let equityStcg = 0;
  let equityLtcg = 0;
  let debtStcg = 0;
  let debtLtcg = 0;
  
  // Skip if the sheet is empty or too small
  if (!jsonData || jsonData.length < 13) {
    logger.warn("Summary sheet has insufficient rows, expected at least 13 rows");
    return { equityStcg, equityLtcg, debtStcg, debtLtcg, totalGainLoss: 0 };
  }
  
  // 1. Validate header row (row index 1)
  const headerRow = jsonData[1];
  if (!headerRow || !headerRow.__EMPTY || headerRow.__EMPTY !== "Summary Of Capital Gains") {
    logger.warn("Summary sheet doesn't have expected header 'Summary Of Capital Gains'");
    logger.debug(`Header row content: ${JSON.stringify(headerRow)}`);
    return { equityStcg, equityLtcg, debtStcg, debtLtcg, totalGainLoss: 0 };
  }
  
  logger.info("Validated CAMS summary sheet header, extracting values from fixed positions");
  
  // 2. Extract STCG from row index 4 (Short Term Capital Gain/Loss)
  const stcgRow = jsonData[4];
  if (stcgRow && stcgRow.__EMPTY === "Short Term Capital Gain/Loss") {
    equityStcg = parseNumericValue(String(stcgRow.__EMPTY_5));
    logger.info(`Found STCG in row 4: ${equityStcg}`);
  } else {
    logger.warn("Could not find expected Short Term Capital Gain/Loss row at index 4");
  }
  
  // 3. Extract LTCG from row index 12 (LongTermWithOutIndex-CapitalGain/Loss)
  const ltcgRow = jsonData[12];
  if (ltcgRow && ltcgRow.__EMPTY === "LongTermWithOutIndex-CapitalGain/Loss") {
    equityLtcg = parseNumericValue(String(ltcgRow.__EMPTY_5));
    logger.info(`Found LTCG in row 12: ${equityLtcg}`);
  } else {
    logger.warn("Could not find expected LongTermWithOutIndex-CapitalGain/Loss row at index 12");
  }
  
  // Calculate total gain/loss
  const totalGainLoss = equityStcg + equityLtcg + debtStcg + debtLtcg;
  
  logger.info(`Summary totals: STCG=${equityStcg}, LTCG=${equityLtcg}, Total=${totalGainLoss}`);
  
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