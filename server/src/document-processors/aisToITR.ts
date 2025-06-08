import { AISData, AISSftDetail, AISTdsTcsDetail, SftCode } from '../types/ais';
import {
  ScheduleOS,
  DateRangeType,
  ScheduleTDS2,
  TDSOthThanSalaryDtls,
  TDSOthThanSalaryDtlHeadOfIncome,
  TDSCreditName
} from '../types/itr';
import { ParseResult } from '../utils/parserTypes';
import { getLogger, ILogger } from '../utils/logger';

const logger: ILogger = getLogger('aisToITRProcessor');

/**
 * Interface for ITR sections generated from AIS data
 */
export interface AISITRSections {
  // Only include Schedule OS for now, other sections will be added later
  scheduleOS: ScheduleOS;
  scheduleTDS2: ScheduleTDS2;
  
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
 * Extract interest income from AIS SFT details with source breakdown
 * @returns Object containing different types of interest income
 */
function extractInterestIncomeDetailed(sftDetails: AISSftDetail[] = [], tdsDetails: AISTdsTcsDetail[] = []): {
  savingsBank: number;
  termDeposit: number;
  incomeTaxRefund: number;
  epfInterest: number;  // Added EPF interest as a separate category
  others: number;
  total: number;
} {
  let savingsBank = 0;
  let termDeposit = 0;
  let incomeTaxRefund = 0;
  let epfInterest = 0;  // Track EPF interest separately
  let others = 0;

  // Process SFT details
  sftDetails
    .filter(sft => sft.sftCode === SftCode.SFT_016 || 
                  (sft.description.toLowerCase().includes('interest') && 
                   !sft.description.toLowerCase().includes('dividend')))
    .forEach(sft => {
      const desc = sft.description.toLowerCase();
      if (desc.includes('saving') || desc.includes('savings')) {
        savingsBank += sft.transactionValue;
      } else if (desc.includes('deposit') || desc.includes('fd') || desc.includes('fixed')) {
        termDeposit += sft.transactionValue;
      } else if (desc.includes('refund') || desc.includes('income tax')) {
        incomeTaxRefund += sft.transactionValue;
      } else if (desc.includes('epf') || desc.includes('e.p.f') || desc.includes('provident fund')) {
        epfInterest += sft.transactionValue;
      } else {
        others += sft.transactionValue;
      }
    });
  
  // Process TDS details for EPF interest income (Section 194A)
  (tdsDetails || [])
    .filter(tds => 
      tds.description?.toLowerCase().includes('interest') && 
      tds.sectionCode === '194A' &&
      (tds.deductorCollectorName?.toLowerCase().includes('e.p.f') || 
       tds.deductorCollectorName?.toLowerCase().includes('provident fund'))
    )
    .forEach(tds => {
      epfInterest += tds.amountPaidCredited || 0;
    });
  
  const total = savingsBank + termDeposit + incomeTaxRefund + epfInterest + others;
  
  return {
    savingsBank,
    termDeposit,
    incomeTaxRefund,
    epfInterest,
    others,
    total
  };
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
 * Creates a DateRangeType with amounts distributed according to quarters from transaction data
 */
function createDateRangeWithQuarterDistribution(transactionBreakdown: any[] = [], totalAmount: number = 0): DateRangeType {
  // Initialize empty date range
  const dateRange = {
    Up16Of12To15Of3: 0,  // Q4: 16 Dec to 15 Mar
    Up16Of3To31Of3: 0,   // End of FY: 16 Mar to 31 Mar
    Up16Of9To15Of12: 0,  // Q3: 16 Sep to 15 Dec
    Upto15Of6: 0,        // Q1: 1 Apr to 15 Jun
    Upto15Of9: 0         // Q2: 16 Jun to 15 Sep
  };
  
  // If we have transaction breakdown, distribute by quarter
  if (transactionBreakdown && transactionBreakdown.length > 0) {
    transactionBreakdown.forEach(transaction => {
      const quarter = transaction.quarter;
      const amount = transaction.amountPaidCredited || 0;
      
      // Map quarter information to DateRange structure
      if (quarter?.includes('Q1') || quarter?.includes('Apr-Jun')) {
        dateRange.Upto15Of6 += amount;
      } else if (quarter?.includes('Q2') || quarter?.includes('Jul-Sep')) {
        dateRange.Upto15Of9 += amount;
      } else if (quarter?.includes('Q3') || quarter?.includes('Oct-Dec')) {
        dateRange.Up16Of9To15Of12 += amount;
      } else if (quarter?.includes('Q4') || quarter?.includes('Jan-Mar')) {
        // Need to handle the division between regular Q4 and end of FY
        // For simplicity, put it all in regular Q4
        dateRange.Up16Of12To15Of3 += amount;
      }
    });
  } else if (totalAmount > 0) {
    // If no breakdown but we have a total, default to Q4
    dateRange.Up16Of12To15Of3 = totalAmount;
  }
  
  return { DateRange: dateRange };
}

/**
 * Generate Schedule OS from AIS data
 */
function generateScheduleOS(aisData: AISData): ScheduleOS {
  logger.info('Generating Schedule OS from AIS data');
  
  // Extract interest income from SFT details and TDS details with breakdown
  const interestDetails = extractInterestIncomeDetailed(aisData.sftDetails, aisData.tdsDetails);
  logger.debug(`Interest income breakdown from AIS: ${JSON.stringify(interestDetails)}`);
  
  // Extract dividend income from SFT details and other information
  const dividendIncome = extractDividendIncome(aisData.sftDetails, aisData.otherInformation);
  logger.debug(`Dividend income from AIS: ${dividendIncome}`);
  
  // Find EPF interest TDS information for quarterly distribution
  const epfInterestTdsInfo = (aisData.tdsDetails || [])
    .filter(tds => 
      tds.description?.toLowerCase().includes('interest') && 
      tds.sectionCode === '194A' &&
      (tds.deductorCollectorName?.toLowerCase().includes('e.p.f') || 
       tds.deductorCollectorName?.toLowerCase().includes('provident fund'))
    );
  
  // Create quarterly distribution for EPF interest
  let epfInterestDistribution = createEmptyDateRange();
  
  if (epfInterestTdsInfo.length > 0) {
    const breakdowns = epfInterestTdsInfo.flatMap(tds => tds.transactionBreakdown || []);
    
    if (breakdowns.length > 0) {
      // Initialize distribution object
      const distribution = {
        Up16Of12To15Of3: 0,  // Q4: 16 Dec to 15 Mar
        Up16Of3To31Of3: 0,   // End of FY: 16 Mar to 31 Mar
        Up16Of9To15Of12: 0,  // Q3: 16 Sep to 15 Dec
        Upto15Of6: 0,        // Q1: 1 Apr to 15 Jun
        Upto15Of9: 0         // Q2: 16 Jun to 15 Sep
      };
      
      // Map quarter information to DateRange structure
      breakdowns.forEach(transaction => {
        const quarter = transaction.quarter;
        const amount = transaction.amountPaidCredited || 0;
        
        if (quarter?.includes('Q1') || quarter?.includes('Apr-Jun')) {
          distribution.Upto15Of6 += amount;
        } else if (quarter?.includes('Q2') || quarter?.includes('Jul-Sep')) {
          distribution.Upto15Of9 += amount;
        } else if (quarter?.includes('Q3') || quarter?.includes('Oct-Dec')) {
          distribution.Up16Of9To15Of12 += amount;
        } else if (quarter?.includes('Q4') || quarter?.includes('Jan-Mar')) {
          // Need to handle the division between regular Q4 and end of FY
          // For simplicity, put it all in regular Q4
          distribution.Up16Of12To15Of3 += amount;
        }
      });
      
      epfInterestDistribution = { DateRange: distribution };
    }
  }
  
  // Total income from other sources
  const totalIncome = interestDetails.total + dividendIncome;
  
  // Create Schedule OS with detailed breakdown
  return {
    // Populate dividend fields with proper quarterly distribution
    DividendDTAA: createEmptyDateRange(),  // No foreign dividends in AIS typically
    DividendIncUs115A1aA: createEmptyDateRange(),
    DividendIncUs115A1ai: createEmptyDateRange(),
    DividendIncUs115AC: createEmptyDateRange(),
    DividendIncUs115ACA: createEmptyDateRange(),
    DividendIncUs115AD1i: createEmptyDateRange(),
    DividendIncUs115BBDA: createDateRangeWithAmount(dividendIncome),  // Most Indian dividends go here
    
    // Income from lottery/gambling - not typically in AIS but required by Schedule OS
    IncFrmLottery: createEmptyDateRange(),
    NOT89A: createEmptyDateRange(),
    
    // Total income chargeable under Other Sources
    IncChargeable: totalIncome,

    IncFrmOnGames: createEmptyDateRange(),
    IncFromOwnHorse: {
      BalanceOwnRaceHorse: 0,
      DeductSec57: 0,
      Receipts: 0
    },
    
    // Detailed breakdown for Income Other Than Own Race Horse
    IncOthThanOwnRaceHorse: {
      // Interest income breakdown
      InterestGross: interestDetails.total,
      IntrstFrmSavingBank: interestDetails.savingsBank,
      IntrstFrmTermDeposit: interestDetails.termDeposit,
      IntrstFrmIncmTaxRefund: interestDetails.incomeTaxRefund,
      // EPF interest goes into "others" for ITR schema compatibility
      // but we've tracked it separately for reference
      IntrstFrmOthers: interestDetails.others + interestDetails.epfInterest,
      
      // Dividend income
      DividendGross: dividendIncome,
      
      // Other required fields with zero values
      GrossIncChrgblTaxAtAppRate: totalIncome,
      RentFromMachPlantBldgs: 0,
      Tot562x: 0,
      Aggrtvaluewithoutcons562x: 0,
      Immovpropwithoutcons562x: 0,
      Immovpropinadeqcons562x: 0,
      Anyotherpropwithoutcons562x: 0,
      Anyotherpropinadeqcons562x: 0,
      FamilyPension: 0,
      IncomeNotified89AOS: 0,
      IncomeNotifiedOther89AOS: 0,
      IncomeNotifiedPrYr89AOS: 0,
      AnyOtherIncome: 0,
      IncChargeableSpecialRates: 0,
      LtryPzzlChrgblUs115BB: 0,
      IncChrgblUs115BBE: 0,
      CashCreditsUs68: 0,
      UnExplndInvstmntsUs69: 0,
      UnExplndMoneyUs69A: 0,
      UnDsclsdInvstmntsUs69B: 0,
      UnExplndExpndtrUs69C: 0,
      AmtBrwdRepaidOnHundiUs69D: 0,
      NatofPassThrghIncome: 0,
      OthersGross: 0,
      PassThrIncOSChrgblSplRate: 0,
      
      // Deductions section
      Deductions: {
        Expenses: 0,
        DeductionUs57iia: 0,
        Depreciation: 0,
        TotDeductions: 0
      },
      
      // Balance after deductions
      BalanceNoRaceHorse: totalIncome,
      
      // Special sections (filled with zeros as they're not normally in AIS)
      TaxAccumulatedBalRecPF: {
        TotalIncomeBenefit: 0,
        TotalTaxBenefit: 0
      }
    },
    
    // Set total for OS other than race horse
    TotOthSrcNoRaceHorse: totalIncome
  };
}

/**
 * Generate Schedule TDS2 for TDS on Income Other Than Salary (Focusing on EPF Interest)
 * @param aisData - Parsed AIS data
 * @returns Partial ScheduleTDS2 containing EPF interest TDS details
 */
function generateScheduleTDS2(aisData: AISData): ScheduleTDS2 {
  logger.info('Generating Schedule TDS2 for EPF interest TDS from AIS data');

  const epfTdsDetails = (aisData.tdsDetails || [])
    .filter(tds =>
      tds.sectionCode === '194A'
    );

  if (epfTdsDetails.length === 0) {
    logger.debug('No EPF interest TDS details found in AIS data.');
    return { TotalTDSonOthThanSals: 0 }; // Return empty schedule if no relevant TDS found
  }

  const tdsEntries: TDSOthThanSalaryDtls[] = epfTdsDetails.map(tds => {
    const totalTDS = tds.transactionBreakdown?.filter(tb => tb.status !== 'Inactive').reduce((sum, line) => sum + (line.taxDeductedCollected || 0), 0) || 0;
    const grossAmount = tds.amountPaidCredited || 0;

    return {
      TANOfDeductor: tds.deductorCollectorTan || 'N/A', // Use TAN from AIS
      // DeductorName is not directly available in TDSOthThanSalaryDtls, but we have it in aisData
      // This might need adjustment depending on how downstream processing uses this data
      GrossAmount: grossAmount,
      AmtCarriedFwd: 0, // Assume no carry forward for now
      BroughtFwdTDSAmt: 0, // Assume no brought forward for now
      HeadOfIncome: TDSOthThanSalaryDtlHeadOfIncome.OS, // EPF interest is 'Other Sources'
      TDSCreditName: TDSCreditName.S, // Assuming credit is for Self
      TaxDeductCreditDtls: {
        TaxDeductedOwnHands: totalTDS,
        TaxDeductedIncome: grossAmount, // Income against which TDS was deducted
        TaxDeductedTDS: totalTDS, // TDS deducted this year
        TaxClaimedOwnHands: totalTDS, // Claiming the full TDS amount
        TaxClaimedIncome: grossAmount, // Claiming against the full income amount
        TaxClaimedTDS: totalTDS // TDS claimed this year
        // Other fields (Spouse/Other Person) default to undefined/not applicable
      }
    };
  });

  const totalTDS = tdsEntries.reduce((sum, entry) => sum + (entry.TaxDeductCreditDtls.TaxClaimedOwnHands || 0), 0);

  logger.debug(`Generated Schedule TDS2 with ${tdsEntries.length} entries. Total TDS: ${totalTDS}`);

  return {
    TDSOthThanSalaryDtls: tdsEntries,
    TotalTDSonOthThanSals: totalTDS
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

    // Generate Schedule TDS2 for EPF interest TDS
    const scheduleTDS2 = generateScheduleTDS2(aisData);
    
    // TODO: Generate Schedule TDS1 from TDS details (Salary - Section 192)
    // TODO: Generate Schedule TR1 from tax payment details
    // TODO: Generate Schedule CG from capital gains transactions (SFT-008, SFT-010, SFT-018)
    // TODO: Generate Schedule HP from house property information
    // TODO: Generate Schedule S from salary information (TDS with section code 192)
    // TODO: Generate Schedule VIA from deduction-related information
    
    // Return the generated ITR sections
    return {
      success: true,
      data: {
        scheduleOS,
        scheduleTDS2
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