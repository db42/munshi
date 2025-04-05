import { USInvestmentIncome, DividendIncome } from '../../types/usEquityStatement';
import { ParseResult } from '../../utils/parserTypes';
import { DateRangeType, ScheduleOS, ScheduleTR1, ScheduleTR, ScheduleFSI, ScheduleFSIDtls, 
         ScheduleFSIIncType, TotalScheduleFSIIncType, CountryCodeExcludingIndia, 
         ReliefClaimedUsSection, AssetOutIndiaFlag, IncFromOS } from '../../types/itr';

/**
 * Interface for ITR sections generated from US investment income data
 */
export interface USInvestmentIncomeITRSections {
  scheduleOS: Partial<ScheduleOS>;
  scheduleTR1: Partial<ScheduleTR1>;
  scheduleFSI: ScheduleFSI;
  partBTIIncomeFromOS: IncFromOS;
}

/**
 * Creates a DTAA DateRangeType object for Schedule OS
 */
function createEmptyDateRange(): DateRangeType {
  return {
    DateRange: {
      Up16Of12To15Of3: 0,
      Up16Of3To31Of3: 0,
      Up16Of9To15Of12: 0,
      Upto15Of6: 0,
      Upto15Of9: 0
    }
  };
}

/**
 * Creates a DTAA DateRangeType object for Schedule OS with the specified amount
 */
function createDateRangeWithAmount(amount: number): DateRangeType {
  return {
    DateRange: {
      Up16Of12To15Of3: amount,
      Up16Of3To31Of3: 0,
      Up16Of9To15Of12: 0,
      Upto15Of6: 0,
      Upto15Of9: 0
    }
  };
}

/**
 * Generate Schedule OS from US investment income data
 */
function generateScheduleOS(investmentIncomeData: USInvestmentIncome): Partial<ScheduleOS> {
  // Calculate total dividend income
  const totalDividendIncome = investmentIncomeData.summary.totalDividends || 
    investmentIncomeData.dividends
      .filter(div => !div.isInterest)
      .reduce((sum, div) => sum + div.grossAmount, 0);
  
  // Calculate total interest income
  const totalInterestIncome = investmentIncomeData.summary.totalInterestIncome || 
    investmentIncomeData.dividends
      .filter(div => div.isInterest)
      .reduce((sum, div) => sum + div.grossAmount, 0);
  
  // Calculate total investment income
  const totalInvestmentIncome = totalDividendIncome + totalInterestIncome;
  
  // Create Schedule OS
  return {
    DividendDTAA: createDateRangeWithAmount(totalDividendIncome),
    DividendIncUs115A1ai: createEmptyDateRange(),
    DividendIncUs115AC: createEmptyDateRange(),
    DividendIncUs115ACA: createEmptyDateRange(),
    DividendIncUs115AD1i: createEmptyDateRange(),
    DividendIncUs115BBDA: createEmptyDateRange(),
    IncChargeable: totalInvestmentIncome,
    IncFrmLottery: createEmptyDateRange(),
    NOT89A: createEmptyDateRange()
  };
}

/**
 * Generate Schedule TR1 from US investment income data
 */
function generateScheduleTR1(investmentIncomeData: USInvestmentIncome): Partial<ScheduleTR1> {
  // Calculate total tax withheld in the US
  const totalTaxWithheld = 
    investmentIncomeData.taxWithheld.dividendTax + 
    investmentIncomeData.taxWithheld.interestTax;
  
  // Create Schedule TR1
  return {
    TaxReliefOutsideIndiaDTAA: totalTaxWithheld,
    TaxReliefOutsideIndiaNotDTAA: 0,
    TotalTaxPaidOutsideIndia: totalTaxWithheld,
    TotalTaxReliefOutsideIndia: totalTaxWithheld,
    TaxPaidOutsideIndFlg: 'YES' as AssetOutIndiaFlag,
    ScheduleTR: [{
      CountryCodeExcludingIndia: 'US' as CountryCodeExcludingIndia,
      CountryName: 'UNITED STATES OF AMERICA',
      TaxIdentificationNo: 'NA',
      TaxPaidOutsideIndia: totalTaxWithheld,
      TaxReliefOutsideIndia: totalTaxWithheld,
      ReliefClaimedUsSection: '90A' as ReliefClaimedUsSection
    }]
  };
}

/**
 * Generate Schedule FSI from US investment income data
 */
function generateScheduleFSI(investmentIncomeData: USInvestmentIncome): ScheduleFSI {
  // Calculate total investment income
  const totalDividendIncome = investmentIncomeData.summary.totalDividends || 
    investmentIncomeData.dividends
      .filter(div => !div.isInterest)
      .reduce((sum, div) => sum + div.grossAmount, 0);
  
  const totalInterestIncome = investmentIncomeData.summary.totalInterestIncome || 
    investmentIncomeData.dividends
      .filter(div => div.isInterest)
      .reduce((sum, div) => sum + div.grossAmount, 0);
  
  const totalInvestmentIncome = totalDividendIncome + totalInterestIncome;
  
  // Calculate total tax withheld in the US
  const totalTaxWithheld = 
    investmentIncomeData.taxWithheld.dividendTax + 
    investmentIncomeData.taxWithheld.interestTax;
  
  // Create Schedule FSI
  return {
    ScheduleFSIDtls: [{
      CountryCodeExcludingIndia: 'US' as CountryCodeExcludingIndia,
      CountryName: 'UNITED STATES OF AMERICA',
      TaxIdentificationNo: 'NA',
      IncFromSal: {
        IncFrmOutsideInd: 0,
        TaxPaidOutsideInd: 0,
        TaxPayableinInd: 0,
        TaxReliefinInd: 0
      },
      IncFromHP: {
        IncFrmOutsideInd: 0,
        TaxPaidOutsideInd: 0,
        TaxPayableinInd: 0,
        TaxReliefinInd: 0
      },
      IncCapGain: {
        IncFrmOutsideInd: 0,
        TaxPaidOutsideInd: 0,
        TaxPayableinInd: 0,
        TaxReliefinInd: 0
      },
      IncOthSrc: {
        IncFrmOutsideInd: totalInvestmentIncome,
        TaxPaidOutsideInd: totalTaxWithheld,
        TaxPayableinInd: Math.floor(totalInvestmentIncome * 0.3), // 30% tax rate in India
        TaxReliefinInd: Math.min(totalTaxWithheld, Math.floor(totalInvestmentIncome * 0.3)),
        DTAAReliefUs90or90A: '90A'
      },
      TotalCountryWise: {
        IncFrmOutsideInd: totalInvestmentIncome,
        TaxPaidOutsideInd: totalTaxWithheld,
        TaxPayableinInd: Math.floor(totalInvestmentIncome * 0.3),
        TaxReliefinInd: Math.min(totalTaxWithheld, Math.floor(totalInvestmentIncome * 0.3))
      }
    }]
  };
}

/**
 * Generate Part B-TI Income from Other Sources
 */
function generatePartBTIIncomeFromOS(investmentIncomeData: USInvestmentIncome): IncFromOS {
  // Calculate total investment income
  const totalDividendIncome = investmentIncomeData.summary.totalDividends || 
    investmentIncomeData.dividends
      .filter(div => !div.isInterest)
      .reduce((sum, div) => sum + div.grossAmount, 0);
  
  const totalInterestIncome = investmentIncomeData.summary.totalInterestIncome || 
    investmentIncomeData.dividends
      .filter(div => div.isInterest)
      .reduce((sum, div) => sum + div.grossAmount, 0);
  
  const totalInvestmentIncome = totalDividendIncome + totalInterestIncome;
  
  // Create Part B-TI Income from Other Sources
  return {
    FromOwnRaceHorse: 0,
    OtherSrcThanOwnRaceHorse: totalInvestmentIncome,
    IncChargblSplRate: 0,
    TotIncFromOS: totalInvestmentIncome
  };
}

/**
 * Convert US Investment Income data to ITR sections
 * 
 * This function creates complete ITR schedule objects that can be
 * directly merged into the main ITR structure.
 * 
 * @param investmentIncomeData - Parsed US investment income data
 * @param assessmentYear - Assessment year in format YYYY-YY
 * @returns Object containing complete ITR sections
 */
export const convertUSInvestmentIncomeToITRSections = (
  investmentIncomeData: USInvestmentIncome,
  assessmentYear: string
): ParseResult<USInvestmentIncomeITRSections> => {
  try {
    console.log(`[INV_INCOME_TO_ITR] Processing investment income for ${assessmentYear}`);
    
    // Generate all ITR sections
    const scheduleOS = generateScheduleOS(investmentIncomeData);
    const scheduleTR1 = generateScheduleTR1(investmentIncomeData);
    const scheduleFSI = generateScheduleFSI(investmentIncomeData);
    const partBTIIncomeFromOS = generatePartBTIIncomeFromOS(investmentIncomeData);
    
    // Calculate totals for logging
    const totalDividendIncome = investmentIncomeData.summary.totalDividends || 
      investmentIncomeData.dividends
        .filter(div => !div.isInterest)
        .reduce((sum, div) => sum + div.grossAmount, 0);
    
    const totalInterestIncome = investmentIncomeData.summary.totalInterestIncome || 
      investmentIncomeData.dividends
        .filter(div => div.isInterest)
        .reduce((sum, div) => sum + div.grossAmount, 0);
    
    const totalTaxWithheld = 
      investmentIncomeData.taxWithheld.dividendTax + 
      investmentIncomeData.taxWithheld.interestTax;
    
    // Create the result object with complete ITR sections
    const result: USInvestmentIncomeITRSections = {
      scheduleOS,
      scheduleTR1,
      scheduleFSI,
      partBTIIncomeFromOS
    };
    
    console.log(`[INV_INCOME_TO_ITR] Generated complete ITR sections for investment income`);
    console.log(`[INV_INCOME_TO_ITR] Total dividend income: ${totalDividendIncome}`);
    console.log(`[INV_INCOME_TO_ITR] Total interest income: ${totalInterestIncome}`);
    console.log(`[INV_INCOME_TO_ITR] Total tax withheld: ${totalTaxWithheld}`);
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error(`[INV_INCOME_TO_ITR] Error converting investment income to ITR:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error processing investment income'
    };
  }
}; 