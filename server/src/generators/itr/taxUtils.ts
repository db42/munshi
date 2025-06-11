import { AssetOutIndiaFlag, TaxRescertifiedFlag, Itr2, SECCode } from '../../types/itr';
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

export const calculateSurchargeWithCappedRates = (itr: Itr2, totalTaxBeforeSurcharge: number, totalIncome: number): { surcharge: number, surchargeBeforeMarginal: number } => {
    logger.info('\n--- Surcharge Calculation (with Capped Rates) ---');
    let surchargeRate = 0;

    if (totalIncome <= 5000000) { 
        surchargeRate = 0;
    } else if (totalIncome <= 10000000) {
        surchargeRate = 10;
    } else if (totalIncome <= 20000000) {
        surchargeRate = 15;
    } else if (totalIncome <= 50000000) {
        surchargeRate = 25;
    } else {
        surchargeRate = 37;
    }

    logger.info(`Total Income: ₹${totalIncome.toLocaleString('en-IN')}`);
    logger.info(`Applicable Surcharge Rate: ${surchargeRate}%`);

    if (surchargeRate <= 15) {
        const surcharge = calculatePercentage(totalTaxBeforeSurcharge, surchargeRate / 100);
        logger.info(`Surcharge calculated at a flat rate: ₹${surcharge.toLocaleString('en-IN')}`);
        // NOTE: Marginal relief calculation is not implemented yet.
        return { surcharge, surchargeBeforeMarginal: surcharge };
    }

    // --- Logic for surcharge rates > 15% (25% and 37%) ---
    let taxOnCappedIncome = 0;
    const cappedRateSecCodes = [
        SECCode.The1A,      // STCG u/s 111A @ 15%
        SECCode.The2A,      // LTCG u/s 112A @ 10%
        SECCode.The21,      // LTCG u/s 112 @ 20% (on specified assets like property)
        SECCode.The5ACA1B,  // LTCG on other assets (unlisted shares, etc.)
        SECCode.The5A1AI,   // Assumed to be dividend income for this calculation
    ];

    if (itr.ScheduleSI?.SplCodeRateTax) {
        for (const specialTax of itr.ScheduleSI.SplCodeRateTax) {
            if (cappedRateSecCodes.includes(specialTax.SecCode)) {
                taxOnCappedIncome += specialTax.SplRateIncTax || 0;
            }
        }
    }

    logger.info(`Tax on income with capped surcharge (CGs & Dividends): ₹${taxOnCappedIncome.toLocaleString('en-IN')}`);

    const surchargeOnCapped = calculatePercentage(taxOnCappedIncome, 0.15);
    logger.info(`Surcharge on capped portion (at 15%): ₹${surchargeOnCapped.toLocaleString('en-IN')}`);
    
    const taxOnUncappedIncome = totalTaxBeforeSurcharge - taxOnCappedIncome;
    logger.info(`Tax on remaining income: ₹${taxOnUncappedIncome.toLocaleString('en-IN')}`);

    const surchargeOnUncapped = calculatePercentage(taxOnUncappedIncome, surchargeRate / 100);
    logger.info(`Surcharge on remaining portion (at ${surchargeRate}%): ₹${surchargeOnUncapped.toLocaleString('en-IN')}`);

    const totalSurcharge = surchargeOnCapped + surchargeOnUncapped;
    logger.info(`Total Surcharge (before marginal relief): ₹${totalSurcharge.toLocaleString('en-IN')}`);

    // TODO: Implement marginal relief calculation.
    // For now, the surcharge before and after marginal relief are the same.
    const surchargeBeforeMarginal = totalSurcharge;
    const finalSurcharge = totalSurcharge; 

    logger.info('--- End Surcharge Calculation ---\n');

    return { surcharge: finalSurcharge, surchargeBeforeMarginal };
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

export const calculateRebate87A = (incomeForLimitCheck: number, taxPayableBeforeRebate: number, isNewRegime: boolean): number => {
    logger.info('\n--- Section 87A Rebate Calculation ---');
    let rebate = 0;
    
    // Rebate limits differ between regimes
    const rebateIncomeLimit = isNewRegime ? 700000 : 500000;
    const maxRebateAmount = isNewRegime ? 25000 : 12500;
    
    logger.info(`Checking for rebate eligibility with income: ₹${incomeForLimitCheck.toLocaleString('en-IN')}`);
    if (incomeForLimitCheck <= rebateIncomeLimit) {
        rebate = Math.min(taxPayableBeforeRebate, maxRebateAmount);
        logger.info(`Income eligible for 87A rebate (≤ ₹${rebateIncomeLimit.toLocaleString('en-IN')})`);
        logger.info(`Tax payable before rebate: ₹${taxPayableBeforeRebate.toLocaleString('en-IN')}`);
        logger.info(`Rebate amount: ₹${rebate.toLocaleString('en-IN')}`);
    } else {
        logger.info(`Income not eligible for 87A rebate (> ₹${rebateIncomeLimit.toLocaleString('en-IN')})`);
    }
    
    logger.info('--- End Section 87A Rebate Calculation ---\n');
    return rebate;
};

/**
 * Calculates tax based on income and tax slabs without logging the process.
 * Used for internal checks where logging is not desired.
 *
 * @param totalIncome - The income to be taxed.
 * @param slabs - The tax slabs to apply.
 * @returns The calculated tax amount.
 */
export const getSlabTax = (totalIncome: number, slabs: TaxSlab[]): number => {
    let tax = 0;
    let remainingIncome = totalIncome;

    for (let i = slabs.length - 1; i >= 0; i--) {
        const currentSlab = slabs[i];
        const previousThreshold = i > 0 ? slabs[i-1].threshold : 0;

        if (remainingIncome > previousThreshold) {
            const taxableInSlab = remainingIncome - previousThreshold;
            tax += taxableInSlab * currentSlab.rate;
            remainingIncome = previousThreshold;
        }
    }
    return tax;
};

/**
 * Generates a formatted string array representing the tax slab calculation breakdown.
 * This is a presentation function, separate from the calculation logic.
 *
 * @param totalIncome - The income to be taxed at slab rates.
 * @param slabs - The tax slabs to apply (e.g., NEW_REGIME_SLABS).
 * @param regimeName - The name of the regime for the header.
 * @returns An array of strings forming a readable table.
 */
export const getSlabCalculationBreakdownText = (totalIncome: number, slabs: TaxSlab[], regimeName: string): string[] => {
    const breakdown: string[] = [];
    let remainingIncome = totalIncome;

    breakdown.push(`\n   Calculation Breakdown (${regimeName}):`);
    breakdown.push("   ┌──────────────────────────────────┬──────────────────────┬──────────────────────┐");

    for (let i = slabs.length - 1; i >= 0; i--) {
        const currentSlab = slabs[i];
        const previousThreshold = i > 0 ? slabs[i-1].threshold : 0;

        if (remainingIncome > previousThreshold) {
            const taxableInSlab = remainingIncome - previousThreshold;
            const taxForSlab = taxableInSlab * currentSlab.rate;
            
            const slabLabel = `   Slab @ ${`${(currentSlab.rate * 100).toFixed(0)}%`.padEnd(3)}`;
            const taxableAmountStr = `₹${Math.round(taxableInSlab).toLocaleString('en-IN')}`.padStart(20);
            const taxOwedStr = `₹${Math.round(taxForSlab).toLocaleString('en-IN')}`.padStart(20);

            breakdown.push(`   │ ${slabLabel.padEnd(10)} │ ${taxableAmountStr} │ ${taxOwedStr} │`);

            remainingIncome = previousThreshold;
        }
    }

    breakdown.push("   └──────────────────────────────────┴──────────────────────┴──────────────────────┘");
    return breakdown;
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
            GrossTaxPay: {
                TaxDeferred17: 0,
                TaxDeferredPayableCY: 0,
                TaxInc17: 0
            },
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