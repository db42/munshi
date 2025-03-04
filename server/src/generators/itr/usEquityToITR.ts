import { CapitalGainSummary, USCGEquityTransaction, USEquityStatement } from '../../types/usEquityStatement';
import { ScheduleCGFor23, CapGain, ShortTerm, LongTerm } from '../../types/itr';
import { ConversionResult } from './types';
import { processUSEquityForITR as generateScheduleCGFromUSEquity, USEquityITRSections } from './processUSEquity';


/**
 * Generates Capital Gains section for PartB-TI from US equity data
 * 
 * @param scheduleCG - Schedule CG data containing capital gains information
 * @returns CapGain object with capital gains information for PartB-TI
 */
const generatePartBTICapitalGains = (scheduleCG: ScheduleCGFor23): CapGain => {
  const shortTermGains = scheduleCG.ShortTermCapGainFor23.TotalSTCG || 0;
  const longTermGains = scheduleCG.LongTermCapGain23.TotalLTCG || 0;
  
  const shortTerm: ShortTerm = {
    ShortTerm15Per: shortTermGains,
    ShortTerm30Per: 0,
    ShortTermAppRate: 0,
    ShortTermSplRateDTAA: 0,
    TotalShortTerm: shortTermGains
  };
  
  const longTerm: LongTerm = {
    LongTerm10Per: longTermGains,
    LongTerm20Per: 0,
    LongTermSplRateDTAA: 0,
    TotalLongTerm: longTermGains
  };
  
  return {
    ShortTerm: shortTerm,
    LongTerm: longTerm,
    ShortTermLongTermTotal: shortTermGains + longTermGains,
    TotalCapGains: shortTermGains + longTermGains,
    CapGains30Per115BBH: 0
  };
};

/**
 * Generates foreign tax credit information from US equity data for PartB-TTI
 * 
 * @param usEquityData - Parsed US equity statement data
 * @returns Foreign tax credit amount for PartB-TTI
 */
const generatePartBTTIForeignTaxCredit = (usEquityData: USEquityStatement): number => {
  // Get the tax withheld on capital gains directly from the source data
  const capitalGainsTaxWithheld = usEquityData.taxWithheld?.capitalGainsTax || 0;
  
  // Log the foreign tax credit calculation
  console.log(`Foreign Tax Credit Calculation:`);
  console.log(`  Capital Gains Tax Withheld: ${capitalGainsTaxWithheld}`);
  
  // In a real implementation, you would calculate the allowable foreign tax credit
  // based on the tax treaty between India and the US
  // Typically, the foreign tax credit is limited to the lower of:
  // 1. The foreign tax paid
  // 2. The domestic tax payable on the foreign income
  
  // For now, we'll just return the tax withheld
  return capitalGainsTaxWithheld;
};

/**
 * Converts US equity capital gains statement data to ITR-2 format
 * 
 * This function takes US equity statement data and generates ITR sections without modifying any existing ITR.
 * 
 * @param usEquityData - Parsed US equity statement data
 * @returns Object containing the generated ITR sections
 */
export const convertUSEquityToITR = (usEquityData: USEquityStatement): ConversionResult<USEquityITRSections> => {
  // Generate Schedule CG
  const scheduleCG = generateScheduleCGFromUSEquity(usEquityData);
  
  // Generate Part B-TI Capital Gains
  const partBTICapitalGains = generatePartBTICapitalGains(scheduleCG);
  
  // Generate Part B-TTI Foreign Tax Credit
  const partBTTIForeignTaxCredit = generatePartBTTIForeignTaxCredit(usEquityData);
  
  return {
    success: true,
    data: {
      scheduleCG,
      partBTICapitalGains,
      partBTTIForeignTaxCredit
    }
  };
}; 