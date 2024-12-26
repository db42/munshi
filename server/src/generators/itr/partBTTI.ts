import { Form16 } from '../../types/form16';
import { PartBTTI, AssetOutIndiaFlag, TaxRescertifiedFlag } from '../../types/itr';

export const processPartBTTI = (form16: Form16): PartBTTI => {
    // Calculate regular tax
    const totalIncome = form16.salaryDetails.grossSalary.total - 
        (form16.salaryDetails.allowanceExemptSection10 || 0) -
        (form16.deductions?.total || 0);
    
    const taxOnIncome = calculateTaxOnIncome(totalIncome);
    const surcharge = calculateSurcharge(taxOnIncome, totalIncome);
    const surchargeBeforeMarginalRelief = surcharge;  // For now, same as surcharge
    const healthAndEducationCess = Math.round((taxOnIncome + surcharge) * 0.04);
    const totalTaxPayable = taxOnIncome + surcharge + healthAndEducationCess;
    
    // Get tax payments from Form 16
    const tdsPaid = form16.taxDeduction?.totalTaxDeducted || 0;

    // Calculate refund
    const refundDue = tdsPaid > totalTaxPayable ? tdsPaid - totalTaxPayable : 0;

    return {
        // Deemed income tax under section 115JC (AMT)
        TaxPayDeemedTotIncUs115JC: 0,
        TotalTaxPayablDeemedTotInc: 0,

        // Regular tax computation
        ComputationOfTaxLiability: {
            // Tax calculation
            TaxPayableOnTI: {
                TaxAtNormalRatesOnAggrInc: taxOnIncome,
                TaxAtSpecialRates: 0,
                RebateOnAgriInc: 0,
                TaxPayableOnTotInc: taxOnIncome
            },
            
            // Rebate u/s 87A
            Rebate87A: calculateRebate87A(totalIncome, taxOnIncome),
            TaxPayableOnRebate: Math.max(0, taxOnIncome - calculateRebate87A(totalIncome, taxOnIncome)),
            
            // Surcharge calculations
            Surcharge25ofSI: 0,  // For special incomes u/s 115BBE
            SurchargeOnAboveCrore: surcharge,
            // Added missing properties for surcharge before marginal relief
            Surcharge25ofSIBeforeMarginal: 0,
            SurchargeOnAboveCroreBeforeMarginal: surchargeBeforeMarginalRelief,
            TotalSurcharge: surcharge,
            
            // Education Cess
            EducationCess: healthAndEducationCess,
            
            // Gross tax calculations
            GrossTaxLiability: totalTaxPayable,
            GrossTaxPayable: totalTaxPayable,
            
            // AMT credit and other adjustments
            CreditUS115JD: 0,
            TaxPayAfterCreditUs115JD: totalTaxPayable,
            
            // Tax relief
            TaxRelief: {
                Section89: 0,
                TotTaxRelief: 0
            },
            
            // Final tax liability
            NetTaxLiability: totalTaxPayable,
            
            // Interest and fees
            IntrstPay: {
                IntrstPayUs234A: 0,
                IntrstPayUs234B: 0,
                IntrstPayUs234C: 0,
                LateFilingFee234F: 0,
                TotalIntrstPay: 0
            },
            
            AggregateTaxInterestLiability: totalTaxPayable
        },

        // Summary level fields
        Surcharge: surcharge,
        HealthEduCess: healthAndEducationCess,

        // Tax payments and balance
        TaxPaid: {
            TaxesPaid: {
                AdvanceTax: 0,
                TDS: tdsPaid,
                TCS: 0,
                SelfAssessmentTax: 0,
                TotalTaxesPaid: tdsPaid
            },
            BalTaxPayable: totalTaxPayable - tdsPaid
        },

        // Refund details
        Refund: {
            RefundDue: refundDue,
            BankAccountDtls: {
                BankDtlsFlag: TaxRescertifiedFlag.N,
            }
        },

        // Foreign assets declaration
        AssetOutIndiaFlag: AssetOutIndiaFlag.No,
    };
};

const calculateTaxOnIncome = (totalIncome: number): number => {
    let tax = 0;
    let remainingIncome = totalIncome;

    if (remainingIncome > 1000000) {
        tax += (remainingIncome - 1000000) * 0.3;
        remainingIncome = 1000000;
    }
    if (remainingIncome > 500000) {
        tax += (remainingIncome - 500000) * 0.2;
        remainingIncome = 500000;
    }
    if (remainingIncome > 250000) {
        tax += (remainingIncome - 250000) * 0.05;
    }

    return Math.round(tax);
};

const calculateSurcharge = (taxAmount: number, totalIncome: number): number => {
    if (totalIncome <= 5000000) return 0;
    if (totalIncome <= 10000000) return Math.round(taxAmount * 0.10);
    if (totalIncome <= 20000000) return Math.round(taxAmount * 0.15);
    if (totalIncome <= 50000000) return Math.round(taxAmount * 0.25);
    return Math.round(taxAmount * 0.37);
};

const calculateRebate87A = (totalIncome: number, tax: number): number => {
    if (totalIncome <= 500000) {
        return Math.min(12500, tax);
    }
    return 0;
};