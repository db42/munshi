// newRegimeTaxCalculator.ts
import { Form16 } from '../../types/form16';
import { PartBTTI, AssetOutIndiaFlag, TaxRescertifiedFlag } from '../../types/itr';
import { TaxSlab, calculatePercentage, logCalculation, calculateSurcharge, calculateTaxForSlabs } from './taxUtils';

const NEW_REGIME_SLABS: TaxSlab[] = [
    { threshold: 300000, rate: 0 },
    { threshold: 600000, rate: 0.05 },
    { threshold: 900000, rate: 0.10 },
    { threshold: 1200000, rate: 0.15 },
    { threshold: 1500000, rate: 0.20 },
    { threshold: Infinity, rate: 0.30 }
];

const calculateRebate87A = (totalIncome: number, tax: number): number => {
    console.log('\n--- Rebate 87A Calculation (New Regime) ---');
    let rebate = 0;
    
    if (totalIncome <= 700000) {
        rebate = Math.min(25000, tax);
        console.log(`Income eligible for rebate: ₹${totalIncome.toLocaleString('en-IN')}`);
        console.log(`Rebate amount: ₹${rebate.toLocaleString('en-IN')}`);
    } else {
        console.log('Income exceeds ₹7,00,000 - No rebate applicable');
    }
    
    console.log('--- End Rebate 87A Calculation ---\n');
    return rebate;
};

export const calculateNewRegimeTax = (form16: Form16): PartBTTI => {
    console.log('\n=== Starting New Regime Tax Calculation ===\n');

    // Calculate total income
    const grossSalary = form16.salaryDetails.grossSalary.total;
    logCalculation('Gross Salary', grossSalary);
    
    // In new regime, only standard deduction is allowed
    const standardDeduction = Math.min(50000, form16.salaryDetails.deductionsUnderSection16.totalDeductions || 0);
    logCalculation('Standard Deduction', standardDeduction);
    
    const totalIncome = grossSalary - standardDeduction;
    logCalculation('Total Taxable Income', totalIncome);
    
    // Calculate tax
    const taxOnIncome = calculateTaxForSlabs(totalIncome, NEW_REGIME_SLABS, 'New Regime');
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

    console.log('\n=== End New Regime Tax Calculation ===\n');

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