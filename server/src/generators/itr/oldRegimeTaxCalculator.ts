// oldRegimeTaxCalculator.ts
import { Form16 } from '../../types/form16';
import { PartBTTI, AssetOutIndiaFlag, TaxRescertifiedFlag } from '../../types/itr';
import { TaxSlab, calculatePercentage, logCalculation, calculateSurcharge, calculateTaxForSlabs } from './taxUtils';

const OLD_REGIME_SLABS: TaxSlab[] = [
    { threshold: 250000, rate: 0 },
    { threshold: 500000, rate: 0.05 },
    { threshold: 1000000, rate: 0.20 },
    { threshold: Infinity, rate: 0.30 }
];

const calculateRebate87A = (totalIncome: number, tax: number): number => {
    console.log('\n--- Rebate 87A Calculation (Old Regime) ---');
    let rebate = 0;
    
    if (totalIncome <= 500000) {
        rebate = Math.min(12500, tax);
        console.log(`Income eligible for rebate: ₹${totalIncome.toLocaleString('en-IN')}`);
        console.log(`Rebate amount: ₹${rebate.toLocaleString('en-IN')}`);
    } else {
        console.log('Income exceeds ₹5,00,000 - No rebate applicable');
    }
    
    console.log('--- End Rebate 87A Calculation ---\n');
    return rebate;
};

export const calculateOldRegimeTax = (form16: Form16): PartBTTI => {
    console.log('\n=== Starting Old Regime Tax Calculation ===\n');

    // Calculate total income
    const grossSalary = form16.salaryDetails.grossSalary.total;
    const exemptions = form16.salaryDetails.exemptAllowances.totalExemption || 0;
    const deductions = form16.salaryDetails.deductionsUnderSection16.totalDeductions || 0;
    
    logCalculation('Gross Salary', grossSalary);
    logCalculation('Total Exemptions', exemptions);
    logCalculation('Total Deductions', deductions);
    
    const totalIncome = grossSalary - exemptions - deductions;
    logCalculation('Total Taxable Income', totalIncome);
    
    // Calculate tax
    const taxOnIncome = calculateTaxForSlabs(totalIncome, OLD_REGIME_SLABS, 'Old Regime');
    logCalculation('Tax on Income (before surcharge)', taxOnIncome);
    
    const surcharge = calculateSurcharge(taxOnIncome, totalIncome);
    const healthAndEducationCess = calculatePercentage(taxOnIncome + surcharge, 0.04);
    
    logCalculation('Health and Education Cess', healthAndEducationCess);
    
    const rebate87A = calculateRebate87A(totalIncome, taxOnIncome);
    const totalTaxPayable = Math.max(0, taxOnIncome + surcharge + healthAndEducationCess - rebate87A);
    
    logCalculation('Total Tax Payable', totalTaxPayable);
    
    const tdsPaid = form16.totalTaxDeducted || 0;
    logCalculation('TDS Already Paid', tdsPaid);

    const refundDue = tdsPaid > totalTaxPayable ? tdsPaid - totalTaxPayable : 0;
    logCalculation('Refund Due', refundDue);

    console.log('\n=== End Old Regime Tax Calculation ===\n');

    return {
        TaxPayDeemedTotIncUs115JC: 0,
        TotalTaxPayablDeemedTotInc: 0,

        ComputationOfTaxLiability: {
            TaxPayableOnTI: {
                TaxAtNormalRatesOnAggrInc: taxOnIncome,
                TaxAtSpecialRates: 0,
                RebateOnAgriInc: 0,
                TaxPayableOnTotInc: taxOnIncome
            },
            
            Rebate87A: rebate87A,
            TaxPayableOnRebate: Math.max(0, taxOnIncome - rebate87A),
            
            Surcharge25ofSI: 0,
            SurchargeOnAboveCrore: surcharge,
            Surcharge25ofSIBeforeMarginal: 0,
            SurchargeOnAboveCroreBeforeMarginal: surcharge,
            TotalSurcharge: surcharge,
            
            EducationCess: healthAndEducationCess,
            
            GrossTaxLiability: totalTaxPayable,
            GrossTaxPayable: totalTaxPayable,
            
            CreditUS115JD: 0,
            TaxPayAfterCreditUs115JD: totalTaxPayable,
            
            TaxRelief: {
                Section89: 0,
                TotTaxRelief: 0
            },
            
            NetTaxLiability: totalTaxPayable,
            
            IntrstPay: {
                IntrstPayUs234A: 0,
                IntrstPayUs234B: 0,
                IntrstPayUs234C: 0,
                LateFilingFee234F: 0,
                TotalIntrstPay: 0
            },
            
            AggregateTaxInterestLiability: totalTaxPayable
        },

        Surcharge: surcharge,
        HealthEduCess: healthAndEducationCess,

        TaxPaid: {
            TaxesPaid: {
                AdvanceTax: 0,
                TDS: tdsPaid,
                TCS: 0,
                SelfAssessmentTax: 0,
                TotalTaxesPaid: tdsPaid
            },
            BalTaxPayable: Math.max(0, totalTaxPayable - tdsPaid)
        },

        Refund: {
            RefundDue: refundDue,
            BankAccountDtls: {
                BankDtlsFlag: TaxRescertifiedFlag.N,
            }
        },

        AssetOutIndiaFlag: AssetOutIndiaFlag.No,
    };
};