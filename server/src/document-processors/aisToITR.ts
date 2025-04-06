import { AISData, AISSftDetail, SftCode } from '../types/ais';
import { ScheduleOS, DateRangeType } from '../types/itr';
import { ParseResult } from '../utils/parserTypes';
import { logger } from '../utils/logger';

/**
 * Interface for ITR sections generated from AIS data
 */
export interface AISITRSections {
  // Only include Schedule OS for now, other sections will be added later
  scheduleOS: Partial<ScheduleOS>;
  
  // TODO: Add these sections as they are implemented
  // scheduleTDS1: Partial<ScheduleTDS1>;  // For TDS details
  // scheduleTR1: Partial<ScheduleTR1>;    // For tax payment details
  // scheduleCG: Partial<ScheduleCG>;      // For capital gains
  // scheduleHP: Partial<ScheduleHP>;      // For house property income
  // scheduleS: Partial<ScheduleS>;        // For salary
  // scheduleVIA: Partial<ScheduleVIA>;    // For deductions
}

/**
 * Creates a DateRangeType object for Schedule OS
 * This is used to represent income distributed across quarters
 */
function createEmptyDateRange(): DateRangeType {
  return {
    DateRange: {
      Up16Of12To15Of3: 0,  // Q4: 16 Dec to 15 Mar
      Up16Of3To31Of3: 0,   // End of FY: 16 Mar to 31 Mar
      Up16Of9To15Of12: 0,  // Q3: 16 Sep to 15 Dec
      Upto15Of6: 0,        // Q1: 1 Apr to 15 Jun
      Upto15Of9: 0         // Q2: 16 Jun to 15 Sep
    }
  };
}

/**
 * Creates a DateRangeType with the specified amount in Q4 (default)
 * Most income data in AIS doesn't specify exact dates/quarters
 */
function createDateRangeWithAmount(amount: number): DateRangeType {
  return {
    DateRange: {
      Up16Of12To15Of3: amount, // Default to Q4 when specific date distribution isn't available
      Up16Of3To31Of3: 0,
      Up16Of9To15Of12: 0,
      Upto15Of6: 0,
      Upto15Of9: 0
    }
  };
}

/**
 * Extract interest income from AIS SFT details
 */
function extractInterestIncome(sftDetails: AISSftDetail[] = []): number {
  return sftDetails
    .filter(sft => sft.sftCode === SftCode.SFT_016 || 
                  (sft.description.toLowerCase().includes('interest') && 
                   !sft.description.toLowerCase().includes('dividend')))
    .reduce((sum, sft) => sum + sft.transactionValue, 0);
}

/**
 * Extract dividend income from AIS SFT details and other information
 */
function extractDividendIncome(sftDetails: AISSftDetail[] = [], otherInformation: any[] = []): number {
  const sftDividends = sftDetails
    .filter(sft => sft.sftCode === SftCode.SFT_017 || 
                  sft.description.toLowerCase().includes('dividend'))
    .reduce((sum, sft) => sum + sft.transactionValue, 0);
  
  const otherDividends = (otherInformation || [])
    .filter(info => info.description?.toLowerCase().includes('dividend'))
    .reduce((sum, info) => sum + (info.amount || 0), 0);
  
  return sftDividends + otherDividends;
}

/**
 * Generate Schedule OS from AIS data
 */
function generateScheduleOS(aisData: AISData): Partial<ScheduleOS> {
  logger.info('Generating Schedule OS from AIS data');
  
  // Extract interest income from SFT details (code SFT-016)
  const interestIncome = extractInterestIncome(aisData.sftDetails);
  logger.debug(`Interest income from AIS: ${interestIncome}`);
  
  // Extract dividend income from SFT details (code SFT-017) and other information
  const dividendIncome = extractDividendIncome(aisData.sftDetails, aisData.otherInformation);
  logger.debug(`Dividend income from AIS: ${dividendIncome}`);
  
  // Total income from other sources
  const totalIncome = interestIncome + dividendIncome;
  
  // Create Schedule OS
  return {
    // Populate dividend fields
    DividendDTAA: createDateRangeWithAmount(0), // No foreign dividends in AIS typically
    DividendIncUs115A1ai: createEmptyDateRange(),
    DividendIncUs115AC: createEmptyDateRange(),
    DividendIncUs115ACA: createEmptyDateRange(),
    DividendIncUs115AD1i: createEmptyDateRange(),
    DividendIncUs115BBDA: createDateRangeWithAmount(dividendIncome), // Most Indian dividends go here
    
    // Income from lottery/gambling - not typically in AIS but required by Schedule OS
    IncFrmLottery: createEmptyDateRange(),
    NOT89A: createEmptyDateRange(),
    
    // Total income chargeable under Other Sources
    IncChargeable: totalIncome
  };
}

/**
 * Convert AIS data to ITR sections
 * 
 * For now, this function only processes Schedule OS (Other Sources).
 * Other schedules will be added as TODOs in future versions.
 * 
 * @param aisData - Parsed AIS data
 * @param assessmentYear - Assessment year in format YYYY-YY
 * @returns ParseResult containing the generated ITR sections
 */
export const convertAISToITRSections = (
  aisData: AISData,
  assessmentYear?: string
): ParseResult<AISITRSections> => {
  try {
    // Use provided assessment year or from AIS data
    const ayToUse = assessmentYear || aisData.assessmentYear;
    logger.info(`Processing AIS data for assessment year: ${ayToUse}`);
    
    // Generate Schedule OS for interest and dividend income
    const scheduleOS = generateScheduleOS(aisData);
    
    // TODO: Generate Schedule TDS1 from TDS details
    // TODO: Generate Schedule TR1 from tax payment details
    // TODO: Generate Schedule CG from capital gains transactions (SFT-008, SFT-010, SFT-018)
    // TODO: Generate Schedule HP from house property information
    // TODO: Generate Schedule S from salary information (TDS with section code 192)
    // TODO: Generate Schedule VIA from deduction-related information
    
    // Return the generated ITR sections
    return {
      success: true,
      data: {
        scheduleOS
      }
    };
  } catch (error) {
    logger.error("Error generating ITR sections from AIS data:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}; 