import { Form16 } from '../../types/form16';
import { Itr2, PartBTI } from '../../types/itr';
import { logger } from '../../utils/logger';

/**
 * Processes Part B-TI (Computation of Total Income) of ITR-2
 * 
 * Part B-TI is a crucial section in ITR-2 that computes the total taxable income by:
 * 1. Aggregating income from all sources (Salary, House Property, Capital Gains, Other Sources)
 * 2. Adjusting for current year losses
 * 3. Setting off brought forward losses
 * 4. Applying Chapter VI-A deductions
 * 
 * @param form16 - Form 16 data from employer
 * @returns PartBTI object containing complete income computation
 */
export const processPartBTI = (form16: Form16): PartBTI => {
    // Step 1: Calculate Income from Salary
    // This includes gross salary minus exempt allowances and standard deduction
    const salaryIncome = form16.salaryDetails.grossSalary.total;
    const exemptAllowances = form16.salaryDetails.exemptAllowances.totalExemption || 0;
    const deductions = form16.salaryDetails.deductionsUnderSection16.totalDeductions || 0;
    const netSalaryIncome = salaryIncome - exemptAllowances - deductions;

    // Step 2: Calculate Income from House Property
    // Will be populated when processing Form 26AS or rent receipts
    const housePropertyIncome = 0;

    // Step 3: Calculate Capital Gains
    // Will be populated when processing trading statements
    const shortTermCapitalGains = 0;
    const longTermCapitalGains = 0;

    // Step 4: Calculate Income from Other Sources
    // Includes interest income, dividends etc.
    const otherSourcesIncome = 0;

    // Step 5: Calculate Gross Total Income
    const grossTotalIncome = netSalaryIncome + 
        housePropertyIncome + 
        shortTermCapitalGains + 
        longTermCapitalGains + 
        otherSourcesIncome;

    // Step 6: Calculate Current Year Losses
    // For example, loss from house property can be set off against other heads
    const currentYearLoss = 0;

    // Step 7: Calculate Balance After Set-off
    const balanceAfterSetOff = Math.max(0, grossTotalIncome - currentYearLoss);

    // Step 8: Apply Brought Forward Losses
    // These are losses from previous years that can be carried forward
    const broughtForwardLossesSetOff = 0;

    return {
        // 1. Income from Salary 
        // (as computed in Schedule S)
        Salaries: netSalaryIncome,

        // 2. Income from House Property
        // (as computed in Schedule HP)
        IncomeFromHP: housePropertyIncome,

        // 3. Capital Gains
        // (as computed in Schedule CG)
        CapGain: {
            ShortTermLongTermTotal: 0,
            CapGains30Per115BBH: 0,
            ShortTerm: {
                // Short-term gains taxed at 15% (equity shares, equity mutual funds)
                ShortTerm15Per: 0,
                // Short-term gains taxed at 30% (debt funds held < 3 years)
                ShortTerm30Per: 0,
                // Short-term gains taxed at slab rates
                ShortTermAppRate: shortTermCapitalGains,
                // Special rates as per DTAA
                ShortTermSplRateDTAA: 0,
                TotalShortTerm: shortTermCapitalGains
            },
            LongTerm: {
                // Long-term gains taxed at 10% (equity shares > 1 year)
                LongTerm10Per: 0,
                // Long-term gains taxed at 20% with indexation
                LongTerm20Per: longTermCapitalGains,
                // Special rates as per DTAA
                LongTermSplRateDTAA: 0,
                TotalLongTerm: longTermCapitalGains
            },
            TotalCapGains: shortTermCapitalGains + longTermCapitalGains
        },

        // 4. Income from Other Sources
        // (as computed in Schedule OS)
        IncFromOS: {
            // Regular income like interest, dividends
            OtherSrcThanOwnRaceHorse: otherSourcesIncome,
            // Income taxable at special rates
            IncChargblSplRate: 0,
            // Income from owning and maintaining race horses
            FromOwnRaceHorse: 0,
            TotIncFromOS: otherSourcesIncome
        },

        // 5. Total of All Heads of Income
        TotalTI: grossTotalIncome,

        // 6. Current Year Loss Adjustment
        // Losses under any head to be adjusted against income under other heads
        CurrentYearLoss: currentYearLoss,
        
        // 7. Balance After Set-off of Current Year Losses
        BalanceAfterSetoffLosses: balanceAfterSetOff,

        // 8. Brought Forward Losses
        // Previous years' losses to be adjusted against current year income
        BroughtFwdLossesSetoff: broughtForwardLossesSetOff,

        // 9. Gross Total Income
        // (7 - 8)
        GrossTotalIncome: Math.max(0, balanceAfterSetOff - broughtForwardLossesSetOff),

        // 10. Income Chargeable to Tax at Special Rates
        // Income like STCG on equity (15%), LTCG on equity (10%)
        IncChargeTaxSplRate111A112: 0,

        // 11. Deductions under Chapter VI-A
        // Includes 80C, 80D, etc. deductions
        DeductionsUnderScheduleVIA: 0,

        // 12. Total Income
        // (9 - 11)
        TotalIncome: Math.max(0, balanceAfterSetOff - broughtForwardLossesSetOff),

        // 13. Income chargeable to tax at special rates
        IncChargeableTaxSplRates: 0,

        // 14. Net agricultural income
        // Used for rate purpose when agricultural income > 5000
        NetAgricultureIncomeOrOtherIncomeForRate: 0,

        // 15. Aggregate Income
        // (12 + 14)
        AggregateIncome: Math.max(0, balanceAfterSetOff - broughtForwardLossesSetOff),

        // 16. Losses to be Carried Forward
        // Current year losses that couldn't be set off
        LossesOfCurrentYearCarriedFwd: currentYearLoss > grossTotalIncome ? currentYearLoss - grossTotalIncome : 0,

        // 17. Deemed Total Income under AMT
        // Adjusted Total Income for AMT calculation
        DeemedIncomeUs115JC: 0
    };
};

/**
 * Calculates PartB_TI based on all merged ITR sections
 * 
 * This centralized function calculates income totals across all sections:
 * - Salary income from ScheduleS
 * - Income from Other Sources (dividends, interest) from ScheduleOS
 * - Capital Gains from ScheduleCG
 * 
 * @param itr - The ITR object with merged sections
 * @returns The calculated PartB_TI section
 */
export const calculatePartBTI = (itr: Itr2): PartBTI => {
    // Start with a base PartB_TI
    const partBTI: PartBTI = {
        TotalIncome: 0,
        CurrentYearLoss: 0,
        GrossTotalIncome: 0,
        AggregateIncome: 0,
        BalanceAfterSetoffLosses: 0,
        BroughtFwdLossesSetoff: 0,
        CapGain: {
            CapGains30Per115BBH: 0,
            LongTerm: {
                LongTerm10Per: 0,
                LongTerm20Per: 0,
                LongTermSplRateDTAA: 0,
                TotalLongTerm: 0
            },
            ShortTerm: {
                ShortTerm15Per: 0,
                ShortTerm30Per: 0,
                ShortTermAppRate: 0,
                ShortTermSplRateDTAA: 0,
                TotalShortTerm: 0
            },
            ShortTermLongTermTotal: 0,
            TotalCapGains: 0
        },
        DeductionsUnderScheduleVIA: 0,
        DeemedIncomeUs115JC: 0,
        IncChargeTaxSplRate111A112: 0,
        IncChargeableTaxSplRates: 0,
        IncFromOS: {
            FromOwnRaceHorse: 0,
            IncChargblSplRate: 0,
            OtherSrcThanOwnRaceHorse: 0,
            TotIncFromOS: 0
        },
        IncomeFromHP: 0,
        LossesOfCurrentYearCarriedFwd: 0,
        NetAgricultureIncomeOrOtherIncomeForRate: 0,
        Salaries: 0,
        TotalTI: 0
    };
    
    // Calculate income from salary (ScheduleS)
    let salaryIncome = 0;
    if (itr.ScheduleS) {
        // Extract salary income from ScheduleS using TotIncUnderHeadSalaries
        salaryIncome = itr.ScheduleS.TotIncUnderHeadSalaries || 0;
        
        // If TotIncUnderHeadSalaries isn't available, calculate from other fields
        if (salaryIncome === 0 && itr.ScheduleS.TotalGrossSalary !== undefined) {
            const grossSalary = itr.ScheduleS.TotalGrossSalary || 0;
            const deductions = itr.ScheduleS.DeductionUS16 || 0;
            salaryIncome = Math.max(0, grossSalary - deductions);
        }
    }
    
    // Calculate income from other sources (ScheduleOS)
    let incomeFromOS = 0;
    if (itr.ScheduleOS) {
        // Extract income from other sources
        incomeFromOS = itr.ScheduleOS.IncChargeable || 0;
        
        // Update PartB_TI structure for other sources
        partBTI.IncFromOS.OtherSrcThanOwnRaceHorse = incomeFromOS;
        partBTI.IncFromOS.TotIncFromOS = incomeFromOS;
    }
    
    // Calculate capital gains (ScheduleCGFor23)
    let capitalGains = 0;
    let shortTermCapitalGains = 0;
    let longTermCapitalGains = 0;
    if (itr.ScheduleCGFor23) {
        // Use the total capital gains directly from the schedule
        capitalGains = itr.ScheduleCGFor23.SumOfCGIncm || 0;
        
        // Extract short-term and long-term gains separately
        shortTermCapitalGains = itr.ScheduleCGFor23.ShortTermCapGainFor23?.TotalSTCG || 0;
        longTermCapitalGains = itr.ScheduleCGFor23.LongTermCapGain23?.TotalLTCG || 0;
        
        // Update total capital gains in PartB_TI
        partBTI.CapGain.TotalCapGains = capitalGains;
        partBTI.CapGain.ShortTermLongTermTotal = capitalGains;
        partBTI.CapGain.ShortTerm.TotalShortTerm = shortTermCapitalGains;
        partBTI.CapGain.LongTerm.TotalLongTerm = longTermCapitalGains;
    }
    
    // Update PartB_TI values
    partBTI.Salaries = salaryIncome;
    
    // Process brought forward losses from ScheduleCFL
    let broughtForwardLosses = 0;
    
    if (itr.ScheduleCFL?.TotalOfBFLossesEarlierYrs?.LossSummaryDetail) {
        const lossSummary = itr.ScheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail;
        
        // Extract brought forward losses by category
        const bfHousePropertyLoss = lossSummary.TotalHPPTILossCF || 0;
        const bfShortTermCapitalLoss = lossSummary.TotalSTCGPTILossCF || 0;
        const bfLongTermCapitalLoss = lossSummary.TotalLTCGPTILossCF || 0;
        const bfOtherSourcesLoss = lossSummary.OthSrcLossRaceHorseCF || 0;
        
        logger.info('Processing brought forward losses from Schedule CFL');
        logger.info(`House Property Loss: ${bfHousePropertyLoss}, STCG Loss: ${bfShortTermCapitalLoss}, LTCG Loss: ${bfLongTermCapitalLoss}, Other Sources Loss: ${bfOtherSourcesLoss}`);
        
        // Apply short-term capital losses (first against STCG, then against LTCG if remaining)
        let stcgLossToApply = Math.min(bfShortTermCapitalLoss, shortTermCapitalGains);
        shortTermCapitalGains -= stcgLossToApply;
        broughtForwardLosses += stcgLossToApply;
        
        // If there are remaining short-term losses, they can offset long-term gains
        let remainingSTCGLoss = bfShortTermCapitalLoss - stcgLossToApply;
        if (remainingSTCGLoss > 0) {
            let stcgLossAgainstLTCG = Math.min(remainingSTCGLoss, longTermCapitalGains);
            longTermCapitalGains -= stcgLossAgainstLTCG;
            broughtForwardLosses += stcgLossAgainstLTCG;
        }
        
        // Apply long-term capital losses (only against LTCG)
        let ltcgLossToApply = Math.min(bfLongTermCapitalLoss, longTermCapitalGains);
        longTermCapitalGains -= ltcgLossToApply;
        broughtForwardLosses += ltcgLossToApply;
        
        // Update the capital gains figures after loss set-off
        partBTI.CapGain.ShortTerm.TotalShortTerm = shortTermCapitalGains;
        partBTI.CapGain.LongTerm.TotalLongTerm = longTermCapitalGains;
        partBTI.CapGain.TotalCapGains = shortTermCapitalGains + longTermCapitalGains;
        partBTI.CapGain.ShortTermLongTermTotal = partBTI.CapGain.TotalCapGains;
        
        // Apply house property loss (can be set off against other income heads)
        let hpLossToApply = 0;
        if (bfHousePropertyLoss > 0) {
            // House property loss can typically be set off against other income heads
            // The actual limit is ₹2,00,000 per year
            const HP_LOSS_SETOFF_LIMIT = 200000;
            hpLossToApply = Math.min(bfHousePropertyLoss, HP_LOSS_SETOFF_LIMIT);
            broughtForwardLosses += hpLossToApply;
        }
        
        // Apply other sources loss (from race horses)
        // This is typically only allowed to be set off against income from owning and maintaining race horses
        // For simplicity, we're not applying this loss unless there's specific race horse income
        
        logger.info(`Total brought forward losses applied: ${broughtForwardLosses}`);
    }
    
    partBTI.BroughtFwdLossesSetoff = broughtForwardLosses;
    
    // Calculate final total income
    partBTI.AggregateIncome = salaryIncome + incomeFromOS;
    partBTI.TotalTI = salaryIncome + incomeFromOS + capitalGains;
    partBTI.BalanceAfterSetoffLosses = salaryIncome + incomeFromOS + capitalGains;

    partBTI.GrossTotalIncome = salaryIncome + incomeFromOS + capitalGains - broughtForwardLosses;
    partBTI.TotalIncome = salaryIncome + incomeFromOS + capitalGains - broughtForwardLosses;
    return partBTI;
};
