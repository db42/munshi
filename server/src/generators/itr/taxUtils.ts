import { AssetOutIndiaFlag, TaxRescertifiedFlag } from '../../types/itr';
import { getLogger, ILogger } from '../../utils/logger';

// Create a named logger instance for this module
const logger: ILogger = getLogger('taxUtils');

export interface TaxSlab {
  threshold: number;
  rate: number;
}

export const NEW_REGIME_SLABS: TaxSlab[] = [
  { threshold: 300000, rate: 0 },
  { threshold: 600000, rate: 0.05 },
  { threshold: 900000, rate: 0.10 },
  { threshold: 1200000, rate: 0.15 },
  { threshold: 1500000, rate: 0.20 },
  { threshold: Infinity, rate: 0.30 }
];

export const OLD_REGIME_SLABS: TaxSlab[] = [
  { threshold: 250000, rate: 0 },
  { threshold: 500000, rate: 0.05 },
  { threshold: 1000000, rate: 0.20 },
  { threshold: Infinity, rate: 0.30 }
];

export const calculatePercentage = (amount: number, percentage: number): number => {
  return amount * percentage;
};

export const logCalculation = (step: string, value: number) => {
    logger.info(`${step}: ₹${value.toLocaleString('en-IN')}`);
};

export const calculateSurcharge = (taxAmount: number, totalIncome: number): number => {
    logger.info('\n--- Surcharge Calculation ---');
    let surchargePercentage = 0;
    
    if (totalIncome <= 5000000) {
        surchargePercentage = 0;
    } else if (totalIncome <= 10000000) {
        surchargePercentage = 10;
    } else if (totalIncome <= 20000000) {
        surchargePercentage = 15;
    } else if (totalIncome <= 50000000) {
        surchargePercentage = 25;
    } else {
        surchargePercentage = 37;
    }

    logger.info(`Income: ₹${totalIncome.toLocaleString('en-IN')}`);
    logger.info(`Applicable surcharge rate: ${surchargePercentage}%`);
    
    const surcharge = calculatePercentage(taxAmount, surchargePercentage / 100);
    logger.info(`Calculated surcharge: ₹${surcharge.toLocaleString('en-IN')}`);
    logger.info('--- End Surcharge Calculation ---\n');
    
    return surcharge;
};

export const calculateTaxForSlabs = (totalIncome: number, slabs: TaxSlab[], regimeName: string): number => {
    logger.info(`\n--- Tax Slab Calculation (${regimeName}) ---`);
    let tax = 0;
    let remainingIncome = totalIncome;
    
    for (let i = slabs.length - 1; i >= 0; i--) {
        const currentSlab = slabs[i];
        const previousThreshold = i > 0 ? slabs[i-1].threshold : 0;
        
        if (remainingIncome > previousThreshold) {
            const taxableInThisSlab = Math.min(
                remainingIncome - previousThreshold, 
                currentSlab.threshold - previousThreshold
            );
            const taxForThisSlab = calculatePercentage(taxableInThisSlab, currentSlab.rate);
            
            tax += taxForThisSlab;
            logger.info(
                `Tax at ${currentSlab.rate * 100}% for income ` +
                `${previousThreshold.toLocaleString('en-IN')}-${currentSlab.threshold.toLocaleString('en-IN')}: ` +
                `₹${taxForThisSlab.toLocaleString('en-IN')} (on ₹${taxableInThisSlab.toLocaleString('en-IN')})`
            );
        }
    }

    logger.info(`Total tax before rebate: ₹${tax.toLocaleString('en-IN')}`);
    logger.info('--- End Tax Slab Calculation ---\n');

    return tax;
};

export const calculateRebate87A = (totalIncome: number, tax: number, isNewRegime: boolean): number => {
    logger.info('\n--- Section 87A Rebate Calculation ---');
    let rebate = 0;
    
    // Rebate limits differ between regimes
    const rebateIncomeLimit = isNewRegime ? 700000 : 500000;
    const maxRebateAmount = isNewRegime ? 25000 : 12500;
    
    if (totalIncome <= rebateIncomeLimit) {
        rebate = Math.min(tax, maxRebateAmount);
        logger.info(`Income eligible for 87A rebate (≤ ₹${rebateIncomeLimit.toLocaleString('en-IN')})`);
        logger.info(`Rebate amount: ₹${rebate.toLocaleString('en-IN')}`);
    } else {
        logger.info(`Income not eligible for 87A rebate (> ₹${rebateIncomeLimit.toLocaleString('en-IN')})`);
    }
    
    logger.info('--- End Section 87A Rebate Calculation ---\n');
    return rebate;
};

export const createEmptyPartBTTI = () => {
    return {
        TaxPayDeemedTotIncUs115JC: 0,
        TotalTaxPayablDeemedTotInc: 0,
        ComputationOfTaxLiability: {
            TaxPayableOnTI: {
                TaxAtNormalRatesOnAggrInc: 0,
                TaxAtSpecialRates: 0,
                RebateOnAgriInc: 0,
                TaxPayableOnTotInc: 0
            },
            Rebate87A: 0,
            TaxPayableOnRebate: 0,
            Surcharge25ofSI: 0,
            SurchargeOnAboveCrore: 0,
            Surcharge25ofSIBeforeMarginal: 0,
            SurchargeOnAboveCroreBeforeMarginal: 0,
            TotalSurcharge: 0,
            EducationCess: 0,
            GrossTaxLiability: 0,
            GrossTaxPayable: 0,
            CreditUS115JD: 0,
            TaxPayAfterCreditUs115JD: 0,
            TaxRelief: {
                Section89: 0,
                Section90: 0,
                Section91: 0,
                TotTaxRelief: 0
            },
            NetTaxLiability: 0,
            IntrstPay: {
                IntrstPayUs234A: 0,
                IntrstPayUs234B: 0,
                IntrstPayUs234C: 0,
                LateFilingFee234F: 0,
                TotalIntrstPay: 0
            },
            AggregateTaxInterestLiability: 0
        },
        Surcharge: 0,
        HealthEduCess: 0,
        TaxPaid: {
            TaxesPaid: {
                AdvanceTax: 0,
                TDS: 0,
                TCS: 0,
                SelfAssessmentTax: 0,
                TotalTaxesPaid: 0
            },
            BalTaxPayable: 0
        },
        Refund: {
            RefundDue: 0,
            BankAccountDtls: {
                BankDtlsFlag: TaxRescertifiedFlag.N,
            }
        },
        AssetOutIndiaFlag: AssetOutIndiaFlag.No,
    };
};