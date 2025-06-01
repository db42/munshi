import { 
    ParsedForm26AS, 
    PartIDeductor, 
    PartITransaction,
    PartVICollector, // For TCS
    PartVITransaction, // For TCS transactions
    ChallanPaymentDetail, // For self-paid taxes (corrected PartIII)
    // PartIVDetails, PartVIIActualTransaction - these specific detail types might not be needed at top level if not used directly
} from '../types/form26AS';
import {
  ScheduleS,
  ScheduleTDS1,
  ScheduleTDS2,
  ScheduleTCS,
  ScheduleIT,
  ScheduleOS,
  ScheduleSI,
  TaxPayment,
  TDSonSalary,
  TDSOthThanSalaryDtls,
  Tc,
  EmployerOrDeductorOrCollectDetl, 
  TaxDeductCreditDtls,
  TDSCreditName,
  TDSOthThanSalaryDtlHeadOfIncome,
  SplCodeRateTax,
  SECCode,
  Salaries, 
  AddressDetail, 
  StateCode, 
  Salarys as SalaryDetailsType, 
  NatureOfEmployment,
  NatureOfDisability // Added for TCSCreditOwner
} from '../types/itr';
import { ParseResult } from '../utils/parserTypes';
import { getLogger, ILogger } from '../utils/logger';
import cloneDeep from 'lodash/cloneDeep';
import { initializeScheduleOS, initializeScheduleSI, initializeScheduleIT, initializeScheduleTCS, initializeScheduleTDS2, initializeScheduleTDS1, initializeScheduleS } from './initializers';

const logger: ILogger = getLogger('form26ASToITR');

export interface Form26ASITRSections {
  scheduleS?: ScheduleS;
  scheduleTDS1?: ScheduleTDS1;
  scheduleTDS2?: ScheduleTDS2;
  scheduleTCS?: ScheduleTCS;
  scheduleIT?: ScheduleIT;
  scheduleOS?: ScheduleOS;
  scheduleSI?: ScheduleSI;
}

const ensureSchedule = <T>(obj: T | undefined, defaultValue: T): T => {
  return obj ? cloneDeep(obj) : cloneDeep(defaultValue);
};

// Helper to filter deductors by section codes
const filterDeductorsBySection = (deductors: PartIDeductor[], sectionCodes: string[]): PartIDeductor[] => {
  return deductors.filter(deductor => 
    deductor.transactions.some(txn => sectionCodes.includes(txn.section))
  );
};

// Helper to filter deductors excluding specific section codes
const filterDeductorsExcludingSection = (deductors: PartIDeductor[], excludeSectionCodes: string[]): PartIDeductor[] => {
  return deductors.filter(deductor => 
    deductor.transactions.some(txn => !excludeSectionCodes.includes(txn.section))
  );
};

// Populator functions
// Each populator function will now create and return the specific schedule.
// They will take ParsedForm26AS and assessmentYear as input.

function populateScheduleSFromForm26AS(
  form26AS: ParsedForm26AS,
  assessmentYear: string
): ScheduleS {
  const scheduleS = initializeScheduleS();
  // PartI contains all TDS, including salary (if Form 16 not available or for other scenarios)
  const allDeductors = form26AS.partI?.deductors || [] as PartIDeductor[];
  
  // Filter for salary deductors (section 192)
  const salaryDeductors = filterDeductorsBySection(allDeductors, ['192']);

  if (salaryDeductors && salaryDeductors.length > 0) {
    scheduleS.Salaries = salaryDeductors.map((empSummary: PartIDeductor) => {
      // Calculate salary amounts only from section 192 transactions
      const salaryTransactions = empSummary.transactions.filter(txn => txn.section === '192');
      const totalSalary = salaryTransactions.reduce((sum, txn) => sum + txn.amountPaidCredited, 0);
      
      const salaryEntry: Salaries = {
        NameOfEmployer: empSummary.nameOfDeductor,
        TANofEmployer: empSummary.tanOfDeductor,
        Salarys: { 
            Salary: totalSalary,
            GrossSalary: totalSalary, 
            IncomeNotified89A: 0,
            IncomeNotifiedOther89A:0,
            ProfitsinLieuOfSalary: 0,
            ValueOfPerquisites: 0,
        },
        AddressDetail: { 
            AddrDetail: form26AS.header?.addressOfAssessee || 'N/A',
            CityOrTownOrDistrict: 'N/A', // Form 26AS address is usually a single string
            StateCode: StateCode.The99, 
            PinCode: 0, // Form 26AS usually doesn't have a separate pincode
        },
        NatureOfEmployment: NatureOfEmployment.Oth, 
      };
      return salaryEntry;
    });
    scheduleS.TotalGrossSalary = scheduleS.Salaries.reduce((sum, s) => sum + s.Salarys.GrossSalary, 0);
    scheduleS.TotIncUnderHeadSalaries = scheduleS.TotalGrossSalary; // Simplified, deductions not handled here
  }
  logger.info(`Populated Schedule S from Form 26AS for AY ${assessmentYear}`);
  return scheduleS;
}

function populateScheduleTDS1FromForm26AS(
  form26AS: ParsedForm26AS,
  assessmentYear: string
): ScheduleTDS1 {
  const scheduleTDS1 = initializeScheduleTDS1();
  const allDeductors = form26AS.partI?.deductors || [] as PartIDeductor[];
  
  // Filter for salary deductors (section 192) - should match Schedule S logic
  const salaryDeductors = filterDeductorsBySection(allDeductors, ['192']);

  if (salaryDeductors && salaryDeductors.length > 0) {
    scheduleTDS1.TDSonSalary = salaryDeductors
      .map((empSummary: PartIDeductor) => {
        // Calculate TDS only from section 192 transactions
        const salaryTransactions = empSummary.transactions.filter(txn => txn.section === '192');
        const totalSalaryAmount = salaryTransactions.reduce((sum, txn) => sum + txn.amountPaidCredited, 0);
        const totalTDSAmount = salaryTransactions.reduce((sum, txn) => sum + txn.taxDeducted, 0);
        
        if (totalTDSAmount > 0) { 
            const tdsDetail: TDSonSalary = {
                EmployerOrDeductorOrCollectDetl: {
                    TAN: empSummary.tanOfDeductor,
                    EmployerOrDeductorOrCollecterName: empSummary.nameOfDeductor,
                },
                IncChrgSal: totalSalaryAmount, 
                TotalTDSSal: totalTDSAmount, 
            };
            return tdsDetail;
        }
        return null; // Skip if no tax deducted
      }).filter(item => item !== null) as TDSonSalary[]; // Filter out nulls
    
    scheduleTDS1.TotalTDSonSalaries = scheduleTDS1.TDSonSalary.reduce((sum, entry) => sum + entry.TotalTDSSal, 0);
  }
  logger.info(`Populated Schedule TDS1 from Form 26AS for AY ${assessmentYear}`);
  return scheduleTDS1;
}

function populateScheduleTDS2FromForm26AS(
  form26AS: ParsedForm26AS,
  assessmentYear: string
): ScheduleTDS2 {
  const scheduleTDS2 = initializeScheduleTDS2();
  const allDeductors = form26AS.partI?.deductors || [] as PartIDeductor[];

  if (allDeductors && allDeductors.length > 0) {
    scheduleTDS2.TDSOthThanSalaryDtls = allDeductors
      .map((dedSummary: PartIDeductor) => {
        // Filter for non-salary transactions (excluding section 192)
        const nonSalaryTransactions = dedSummary.transactions.filter(txn => txn.section !== '192');
        
        if (nonSalaryTransactions.length > 0) { 
            const totalTaxDeducted = nonSalaryTransactions.reduce((sum, txn) => sum + txn.taxDeducted, 0);
            const totalTDSDeposited = nonSalaryTransactions.reduce((sum, txn) => sum + txn.tdsDeposited, 0);
            const totalIncome = nonSalaryTransactions.reduce((sum, txn) => sum + txn.amountPaidCredited, 0);
            
            if (totalTaxDeducted > 0) {
                const detail: TDSOthThanSalaryDtls = {
                    TANOfDeductor: dedSummary.tanOfDeductor,
                    AmtCarriedFwd: 0, 
                    TaxDeductCreditDtls: {
                        TaxDeductedOwnHands: totalTaxDeducted,
                        TaxClaimedOwnHands: totalTDSDeposited,
                        TaxDeductedIncome: totalIncome,
                    },
                    TDSCreditName: TDSCreditName.S, 
                    HeadOfIncome: TDSOthThanSalaryDtlHeadOfIncome.OS, // Default to OS, refine if section info available
                };
                return detail;
            }
        }
        return null; // Skip if no non-salary transactions or no tax
      }).filter(item => item !== null) as TDSOthThanSalaryDtls[];

    scheduleTDS2.TotalTDSonOthThanSals = scheduleTDS2.TDSOthThanSalaryDtls.reduce((sum, entry) => sum + (entry.TaxDeductCreditDtls.TaxClaimedOwnHands || 0),0);
  }
  logger.info(`Populated Schedule TDS2 from Form 26AS for AY ${assessmentYear}`);
  return scheduleTDS2;
}

function populateScheduleTCSFromForm26AS(
  form26AS: ParsedForm26AS,
  assessmentYear: string
): ScheduleTCS {
  const scheduleTCS = initializeScheduleTCS();
  const collectors = form26AS.partVI?.collectors || [] as PartVICollector[]; 

  if (collectors && collectors.length > 0) {
    scheduleTCS.TCS = collectors.map((collector: PartVICollector) => {
      const tcsEntry: Tc = {
        EmployerOrDeductorOrCollectTAN: collector.tanOfCollector,
        TCSCreditOwner: NatureOfDisability.The1, // Corrected: 1 for Self
        TCSCurrFYDtls: {
            TCSAmtCollOwnHand: collector.totalTaxCollected, 
        },
        TCSClaimedThisYearDtls: {
            TCSAmtCollOwnHand: collector.totalTCSDeposited, 
        }
      };
      return tcsEntry;
    });
    scheduleTCS.TotalSchTCS = collectors.reduce((sum, col) => sum + (col.totalTCSDeposited || 0), 0);
  }
  logger.info(`Populated Schedule TCS from Form 26AS for AY ${assessmentYear}`);
  return scheduleTCS;
}

function populateScheduleITFromForm26AS(
  form26AS: ParsedForm26AS,
  assessmentYear: string
): ScheduleIT {
  const scheduleIT = initializeScheduleIT();
  // Using corrected PartIIIDetails which has ChallanPaymentDetail for self-paid taxes
  const taxPayments = form26AS.partIII?.items || [] as ChallanPaymentDetail[];

  if (taxPayments && taxPayments.length > 0) {
    scheduleIT.TaxPayment = taxPayments.map((pmt: ChallanPaymentDetail) => {
      const taxPaymentEntry: TaxPayment = {
        DateDep: pmt.dateOfDeposit,
        SrlNoOfChaln: parseInt(pmt.challanSerialNumber || '0', 10) || 0, // Corrected: Parse to number, default to 0
        BSRCode: pmt.bsrCodeOfBankBranch || 'N/A', 
        Amt: pmt.totalTaxDeposited,
      };
      return taxPaymentEntry;
    });
    scheduleIT.TotalTaxPayments = taxPayments.reduce((sum, pmt) => sum + pmt.totalTaxDeposited, 0);
  }
  logger.info(`Populated Schedule IT from Form 26AS for AY ${assessmentYear}`);
  return scheduleIT;
}

function populateScheduleOSFromForm26AS(
  form26AS: ParsedForm26AS,
  assessmentYear: string
): ScheduleOS {
  const scheduleOS = initializeScheduleOS();
  const deductorSummaries = form26AS.partI?.deductors || [] as PartIDeductor[];

  let totalInterestFrom194A = 0;

  if (deductorSummaries) {
    deductorSummaries.forEach((dedSummary: PartIDeductor) => { // Corrected type
      dedSummary.transactions.forEach((txn: PartITransaction) => { 
        if (txn.section === '194A') { 
          totalInterestFrom194A += txn.amountPaidCredited;
        }
        // TODO: Add more mappings for other sections to relevant OS fields if applicable
        // e.g., winnings from lottery (194B), horse races (194BB) if not covered in SI
      });
    });
  }

  if (totalInterestFrom194A > 0) {
    // A more detailed mapping would require initializing and populating IncOthThanOwnRaceHorse.
    // For now, adding to IncChargeable and assuming it will be categorized by user or later processing.
    scheduleOS.IncChargeable = (scheduleOS.IncChargeable || 0) + totalInterestFrom194A; 
    
    // Example for deeper mapping (requires IncOthThanOwnRaceHorse to be initialized if not optional or handled by initializeScheduleOS)
    // if (!scheduleOS.IncOthThanOwnRaceHorse) {
    //   // scheduleOS.IncOthThanOwnRaceHorse = initializeIncOthThanOwnRaceHorse(); // Assuming such an initializer
    // }
    // if(scheduleOS.IncOthThanOwnRaceHorse) { // Check if it exists
    //    scheduleOS.IncOthThanOwnRaceHorse.InterestGross = (scheduleOS.IncOthThanOwnRaceHorse.InterestGross || 0) + totalInterestFrom194A;
    // }
  }
  // SFT transactions from PartIV could also inform ScheduleOS, but mapping is complex.

  logger.info(`Populated Schedule OS from Form 26AS for AY ${assessmentYear}`);
  return scheduleOS;
}

function populateScheduleSIFromForm26AS(
  form26AS: ParsedForm26AS,
  assessmentYear: string
): ScheduleSI {
  const scheduleSI = initializeScheduleSI();
  const deductorSummaries = form26AS.partI?.deductors || [] as PartIDeductor[];

  if (deductorSummaries) {
    deductorSummaries.forEach((dedSummary: PartIDeductor) => { // Corrected type
      dedSummary.transactions.forEach((txn: PartITransaction) => { 
        let specialIncomeEntry: SplCodeRateTax | undefined = undefined;
        if (txn.section === '194B') { // Winnings from lotteries etc. (usually 115BB)
          specialIncomeEntry = {
            SecCode: SECCode.The5Bb, 
            SplRatePercent: 30, 
            SplRateInc: txn.amountPaidCredited,
            SplRateIncTax: txn.taxDeducted, 
          };
        } else if (txn.section === '194BB') { // Winnings from horse races (usually 115BB)
            specialIncomeEntry = {
              SecCode: SECCode.The5Bb, 
              SplRatePercent: 30, 
              SplRateInc: txn.amountPaidCredited,
              SplRateIncTax: txn.taxDeducted,
            };
        }
        // Add more mappings if other sections in 26AS Part I can be directly mapped to SI special rates.
        
        if (specialIncomeEntry) {
          if (!scheduleSI.SplCodeRateTax) { // Ensure array is initialized
            scheduleSI.SplCodeRateTax = [];
          }
          scheduleSI.SplCodeRateTax.push(specialIncomeEntry);
        }
      });
    });
    if (scheduleSI.SplCodeRateTax && scheduleSI.SplCodeRateTax.length > 0) {
        scheduleSI.TotSplRateInc = scheduleSI.SplCodeRateTax.reduce((sum, entry) => sum + entry.SplRateInc, 0);
        scheduleSI.TotSplRateIncTax = scheduleSI.SplCodeRateTax.reduce((sum, entry) => sum + entry.SplRateIncTax, 0);
    }
  }

  logger.info(`Populated Schedule SI from Form 26AS for AY ${assessmentYear}`);
  return scheduleSI;
}

export const form26ASToITR = (
  form26AS: ParsedForm26AS,
  assessmentYear: string
): ParseResult<Form26ASITRSections> => {
  try {
    logger.info(`Starting ITR generation from Form 26AS for Assessment Year: ${assessmentYear}`);

    const itrSections: Form26ASITRSections = {
      scheduleS: populateScheduleSFromForm26AS(form26AS, assessmentYear),
      scheduleTDS1: populateScheduleTDS1FromForm26AS(form26AS, assessmentYear),
      scheduleTDS2: populateScheduleTDS2FromForm26AS(form26AS, assessmentYear),
      scheduleTCS: populateScheduleTCSFromForm26AS(form26AS, assessmentYear),
      scheduleIT: populateScheduleITFromForm26AS(form26AS, assessmentYear),
      scheduleOS: populateScheduleOSFromForm26AS(form26AS, assessmentYear),
      scheduleSI: populateScheduleSIFromForm26AS(form26AS, assessmentYear),
    };

    logger.info('Successfully generated ITR sections from Form 26AS.');
    return {
      success: true,
      data: itrSections,
    };
  } catch (error: any) {
    logger.error('Error generating ITR sections from Form 26AS:', error);
    return {
      success: false,
      error: `Failed to generate ITR sections from Form 26AS: ${error.message || error}`,
    };
  }
}; 