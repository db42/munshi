import { Form16 } from '../types/form16';
import {
    Capacity,
    Verification,
    ScheduleS,
    ScheduleTDS1,
    ScheduleTDS2,
    ScheduleTCS,
    ScheduleIT,
    ScheduleOS,
    ScheduleSI,
    DateRangeType
} from '../types/itr';

/**
 * Initializes Schedule BFLA (Brought Forward Loss Adjustment)
 * This schedule is for setting off brought forward losses against current year income
 */
// export const initializeScheduleBFLA = (): ScheduleBFLA => ({
    // Current year income after CYLA (Current Year Loss Adjustment)
    // IncomeOfCurrYrAftCYLABFLA: 0,
    
    // // Long Term Capital Gains at different rates
    // LTCG10Per: 0,           // LTCG taxable at 10%
    // LTCG20Per: 0,           // LTCG taxable at 20%
    // LTCGDTAARate: 0,        // LTCG taxable at special rates as per DTAA
    
    // // Short Term Capital Gains at different rates
    // STCG15Per: 0,           // STCG taxable at 15%
    // STCG30Per: 0,           // STCG taxable at 30%
    // STCGAppRate: 0,         // STCG taxable at applicable rates
    // STCGDTAARate: 0,        // STCG taxable at special rates as per DTAA
    
    // // Other income sources
    // OthersInc: 0,           // Other income sources
    // TotalBFLA: 0            // Total Brought Forward Loss Adjustment
// });

/**
 * Initializes Schedule CYLA (Current Year Loss Adjustment)
 * This schedule is for setting off loss from one head against income from another head
 */
// export const initializeScheduleCYLA = (): ScheduleCYLA => ({
//     // TODO: Add required CYLA properties based on interface
// });

// Helper to initialize DateRangeType for ScheduleOS
const initializeDateRangeType = (): DateRangeType => ({
    DateRange: {
        Up16Of12To15Of3: 0,
        Up16Of3To31Of3: 0,
        Up16Of9To15Of12: 0,
        Upto15Of6: 0,
        Upto15Of9: 0,
    },
});

// This helper is for the structure within IncOthThanOwnRaceHorse if needed, but not directly for ScheduleOS
// const initializeIncOthThanOwnRaceHorseTotal = (): { Deductions: number; GrossAmount: number; NetAmount: number } => ({
//     Deductions: 0,
//     GrossAmount: 0,
//     NetAmount: 0,
// });

/**
 * Initializes Verification section
 * Contains details about the person verifying the return
 */
export const initializeVerification = (form16: Form16): Verification => ({
  Capacity: Capacity.A,
  Date: new Date().toISOString().split('T')[0],
  Declaration: {
    AssesseeVerName: form16.employee.name,
    AssesseeVerPAN:  form16.employee.pan,
    FatherName:      'XXX', // Placeholder
  },
  Place: 'Mumbai' // Placeholder
});

// New Initializers Added Below

export const initializeScheduleS = (): ScheduleS => ({
  Salaries: [], 
  AllwncExtentExemptUs10: 0,
  DeductionUS16: 0,
  DeductionUnderSection16ia: 0,
  EntertainmntalwncUs16ii: 0,
  NetSalary: 0,
  ProfessionalTaxUs16iii: 0,
  TotIncUnderHeadSalaries: 0,
  TotalGrossSalary: 0,
});

export const initializeScheduleTDS1 = (): ScheduleTDS1 => ({
  TDSonSalary: [], 
  TotalTDSonSalaries: 0, 
});

export const initializeScheduleTDS2 = (): ScheduleTDS2 => ({
  TDSOthThanSalaryDtls: [], 
  TotalTDSonOthThanSals: 0, 
});

export const initializeScheduleTCS = (): ScheduleTCS => ({
  TCS: [],
  TotalSchTCS: 0, 
});

export const initializeScheduleIT = (): ScheduleIT => ({
  TaxPayment: [], 
  TotalTaxPayments: 0, 
});

export const initializeScheduleOS = (): ScheduleOS => ({
    IncChargeable: 0,
    // Mandatory DateRangeType fields from ScheduleOS definition:
    DividendDTAA: initializeDateRangeType(),
    DividendIncUs115A1ai: initializeDateRangeType(),
    DividendIncUs115AC: initializeDateRangeType(),
    DividendIncUs115ACA: initializeDateRangeType(),
    DividendIncUs115AD1i: initializeDateRangeType(), // Corrected from ...AD to ...AD1i
    DividendIncUs115BBDA: initializeDateRangeType(), // Corrected from ...BBD to ...BBDA
    IncFrmLottery: initializeDateRangeType(), // This covers winnings
    NOT89A: initializeDateRangeType(),

    // Optional complex fields like IncFromOwnHorse and IncOthThanOwnRaceHorse are not initialized here by default
    // If they were mandatory, they would need their own initializers.
    // For example, if IncOthThanOwnRaceHorse was mandatory:
    // IncOthThanOwnRaceHorse: {
    //     DividendGross: 0,
    //     InterestGross: 0,
    //     FamilyPension: 0,
    //     RentFromMachPlantBldgs: 0,
    //     GrossIncChrgblTaxAtAppRate: 0,
    //     Deductions: { DeductUs57iia: 0, Depreciation: 0, Expenses: 0, TotDeductions: 0 },
    //     // ... and many other fields ...
    //     AnyOtherIncome: 0, 
    //     AmtBrwdRepaidOnHundiUs69D: 0,
    //     CashCreditsUs68: 0,
    //     Immovpropinadeqcons562x: 0,
    //     Immovpropwithoutcons562x: 0,
    //     IncChargeableSpecialRates: 0,
    //     IncChrgblUs115BBE: 0,        
    //     IncomeNotified89AOS: 0, 
    //     LtryPzzlChrgblUs115BB: 0, 
    //     NatofPassThrghIncome: 0,
    //     OthersGross: 0, 
    //     PassThrIncOSChrgblSplRate: 0, 
    //     TaxAccumulatedBalRecPF: { Amount: 0, TaxRate: 0 }, // Assuming structure
    //     Tot562x: 0, 
    //     UnDsclsdInvstmntsUs69B: 0, 
    //     UnExplndExpndtrUs69C: 0, 
    //     UnExplndInvstmntsUs69: 0, 
    //     UnExplndMoneyUs69A: 0,
    //     Anyotherpropinadeqcons562x:0,
    //     Anyotherpropwithoutcons562x:0,
    //     IntrstFrmIncmTaxRefund: 0,
    //     IntrstFrmOthers: 0,
    //     IntrstFrmSavingBank: 0,
    //     IntrstFrmTermDeposit: 0
    // },
    // DividendIncUs115A1aA is optional, so not initialized
    // IncFrmOnGames is optional
    // TotOthSrcNoRaceHorse is optional
});

export const initializeScheduleSI = (): ScheduleSI => ({
  SplCodeRateTax: [],
  TotSplRateInc: 0,    
  TotSplRateIncTax: 0, 
});