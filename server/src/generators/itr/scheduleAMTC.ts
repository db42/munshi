import { Itr2, ScheduleAMTC, ScheduleAMTCDtls, AssYr } from '../../types/itr';
import { getLogger, ILogger } from '../../utils/logger';

const logger: ILogger = getLogger('scheduleAMTCGenerator');

/**
 * Calculates Schedule AMTC (Alternative Minimum Tax Credit) 
 * This schedule handles AMT credits carried forward from previous years
 * 
 * @param itr - The ITR object with other sections populated
 * @returns The calculated ScheduleAMTC section
 */
export function calculateScheduleAMTC(itr: Itr2): ScheduleAMTC {
    logger.debug('Calculating Schedule AMTC for Alternative Minimum Tax Credit.');
    
    // Start with empty AMTC structure
    const scheduleAMTC: ScheduleAMTC = {
        AmtLiabilityAvailable: 0,
        AmtTaxCreditAvailable: 0,
        CurrYrAmtCreditFwd: 0,
        CurrYrCreditCarryFwd: 0,
        TaxOthProvisions: 0,
        TaxSection115JC: 0,
        TaxSection115JD: 0,
        TotAMTGross: 0,
        TotBalAMTCreditCF: 0,
        TotBalBF: 0,
        TotSetOffEys: 0,
        // TODO: In the future, implement loading of previous year AMT credit data
        ScheduleAMTCDtls: []
    };

    // Check if tax is calculated
    if (!itr["PartB-TI"]) {
        return scheduleAMTC;
    }
    
    // TODO: In future, implement fetching previous year's AMT credit information
    // This could come from a database call, API, or user input
    // For now, we'll use placeholder empty data
    
    // Get current year tax calculation from PartB-TTI
    const regularTax = itr.PartB_TTI?.ComputationOfTaxLiability?.TaxPayableOnTI?.TaxPayableOnTotInc || 0;
    
    // Get AMT calculation from ScheduleAMT (if present)
    const amtPayable = itr.ScheduleAMT?.TaxPayableUnderSec115JC || 0;
    
    // If regular tax is higher than AMT, AMT credit can be utilized
    const creditUtilizable = Math.max(0, regularTax - amtPayable);
    
    // Placeholder for previous year's credit information
    // TODO: Replace with actual data source in future implementation
    const previousYearCredits: ScheduleAMTCDtls[] = [];
    
    // Example of what the structure would look like when we have actual data
    /*
    const previousYearCredits: ScheduleAMTCDtls[] = [
        {
            AssYr: AssYr.The202223,
            Gross: 10000,
            AmtCreditSetOfEy: 2000,
            AmtCreditBalBroughtFwd: 8000, 
            AmtCreditUtilized: 0,
            BalAmtCreditCarryFwd: 8000
        }
    ];
    */
    
    // Calculate total brought forward credit
    let totalBroughtForwardCredit = 0;
    previousYearCredits.forEach(credit => {
        totalBroughtForwardCredit += credit.AmtCreditBalBroughtFwd;
    });
    
    // Credit utilized cannot exceed brought forward amount
    const creditUtilized = Math.min(creditUtilizable, totalBroughtForwardCredit);
    
    // Distribute credit utilization across previous years' credits (FIFO order)
    let remainingCreditToUtilize = creditUtilized;
    const updatedCredits: ScheduleAMTCDtls[] = previousYearCredits.map(credit => {
        if (remainingCreditToUtilize <= 0) {
            // No more credit to utilize
            return credit;
        }
        
        // Calculate how much credit can be utilized from this entry
        const creditToUtilizeFromThisEntry = Math.min(remainingCreditToUtilize, credit.AmtCreditBalBroughtFwd);
        remainingCreditToUtilize -= creditToUtilizeFromThisEntry;
        
        // Return updated credit details
        return {
            ...credit,
            AmtCreditUtilized: creditToUtilizeFromThisEntry,
            BalAmtCreditCarryFwd: credit.AmtCreditBalBroughtFwd - creditToUtilizeFromThisEntry
        };
    });
    
    // Calculate balance carried forward to next year
    const balanceCarriedForward = totalBroughtForwardCredit - creditUtilized;
    
    // Build and return the complete AMTC schedule
    return {
        AmtLiabilityAvailable: amtPayable > 0 ? 1 : 0, // Flag indicating AMT liability exists
        AmtTaxCreditAvailable: Math.max(0, amtPayable - regularTax),
        CurrYrAmtCreditFwd: amtPayable > regularTax ? amtPayable - regularTax : 0,
        CurrYrCreditCarryFwd: amtPayable > regularTax ? amtPayable - regularTax : 0,
        TaxOthProvisions: regularTax,
        TaxSection115JC: amtPayable,
        TaxSection115JD: creditUtilized,
        TotAMTGross: totalBroughtForwardCredit,
        TotBalBF: totalBroughtForwardCredit,
        TotSetOffEys: 0, // Credits set off in earlier years
        TotAmtCreditUtilisedCY: creditUtilized,
        TotBalAMTCreditCF: balanceCarriedForward,
        ScheduleAMTCDtls: updatedCredits.length > 0 ? updatedCredits : undefined
    };
}

/**
 * Determines if Alternative Minimum Tax is applicable to the taxpayer
 * 
 * AMT typically applies to individuals with:
 * - Specific deductions or exemptions
 * - Income from certain specified sources
 * 
 * @param itr - The ITR object with sections populated
 * @returns Boolean indicating if AMT is applicable
 */
export const isAMTApplicable = (itr: Itr2): boolean => {
    // Check if Schedule AMT is already populated
    if (itr.ScheduleAMT) {
        return true;
    }
    
    // Check for specific deductions that trigger AMT
    // Using Section80GGA and Section80G as examples, replace with appropriate sections when known
    const section80GGA = itr.ScheduleVIA?.DeductUndChapVIA?.Section80GGA ?? 0;
    const section80G = itr.ScheduleVIA?.DeductUndChapVIA?.Section80G ?? 0;
    const hasSpecialDeductions = (section80GGA > 0 || section80G > 0);
    
    // Check for previous year AMT credits
    const hasPreviousAMTCredits = (itr.ScheduleAMTC?.TotBalBF ?? 0) > 0;
    
    return hasSpecialDeductions || hasPreviousAMTCredits;
}; 