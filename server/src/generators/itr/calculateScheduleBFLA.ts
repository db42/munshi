import { Itr2, ScheduleBFLA, ScheduleCFL, IncBFLA, SalaryOthSrcIncBFLA, TotalBFLossSetOff, ScheduleCYLA, ScheduleS, ScheduleHP, ScheduleCGFor23, ScheduleOS, CarryFwdLossDetail, CarryFwdWithoutLossDetail } from '../../types/itr';
import { getLogger, ILogger } from '../../utils/logger';
import cloneDeep from 'lodash/cloneDeep';

// Create a named logger instance for this module
const logger: ILogger = getLogger('calculateScheduleBFLA');

// Initialize a default IncBFLA structure
const initializeIncBFLADefault = (): IncBFLA => ({
    IncOfCurYrUndHeadFromCYLA: 0,
    BFlossPrevYrUndSameHeadSetoff: 0,
    IncOfCurYrAfterSetOffBFLosses: 0,
});

// Specific initializer for SalaryOthSrcIncBFLA
const initializeSalaryOthSrcIncBFLADefault = (): SalaryOthSrcIncBFLA => ({
    IncOfCurYrUndHeadFromCYLA: 0,
    IncOfCurYrAfterSetOffBFLosses: 0,
});

// Moved helper function to top-level
// Explicitly check for BFlossPrevYrUndSameHeadSetoff as it's not in SalaryOthSrcIncBFLA
const setOffLossAgainstIncome = (
    incomeField: { IncBFLA: IncBFLA | SalaryOthSrcIncBFLA } | undefined,
    lossToApply: number,
    isSameHeadLoss: boolean
): { utilized: number, remainingLoss: number } => {
    if (!incomeField || !incomeField.IncBFLA) {
        return { utilized: 0, remainingLoss: lossToApply };
    }

    const currentHeadIncome = incomeField.IncBFLA.IncOfCurYrAfterSetOffBFLosses;
    const lossUtilizedThisHead = Math.min(currentHeadIncome, lossToApply);

    if (lossUtilizedThisHead > 0) {
        incomeField.IncBFLA.IncOfCurYrAfterSetOffBFLosses = currentHeadIncome - lossUtilizedThisHead;
        if (isSameHeadLoss && 'BFlossPrevYrUndSameHeadSetoff' in incomeField.IncBFLA) {
            (incomeField.IncBFLA as IncBFLA).BFlossPrevYrUndSameHeadSetoff =
                ((incomeField.IncBFLA as IncBFLA).BFlossPrevYrUndSameHeadSetoff || 0) + lossUtilizedThisHead; // Ensure init if undefined
        }
    }
    return { utilized: lossUtilizedThisHead, remainingLoss: lossToApply - lossUtilizedThisHead };
};

// --- Dedicated Handler Functions for Each B/F Loss Type ---

function _handleBroughtForwardHPLoss(
    scheduleBFLA: ScheduleBFLA,
    bfHPLossForYear: number
): number {
    let remainingHPLoss = bfHPLossForYear;
    let totalHPLossUtilizedThisYear = 0;
    let result: { utilized: number, remainingLoss: number };

    if (remainingHPLoss <= 0) return 0;

    // 1. Set off against HP Income (Same Head)
    result = setOffLossAgainstIncome(scheduleBFLA.HP, remainingHPLoss, true);
    totalHPLossUtilizedThisYear += result.utilized;
    remainingHPLoss = result.remainingLoss;
    if (remainingHPLoss <= 0) return totalHPLossUtilizedThisYear;

    // 2. Inter-head set-off (Order can be strategic)
    // Against Salary
    result = setOffLossAgainstIncome(scheduleBFLA.Salary, remainingHPLoss, false);
    totalHPLossUtilizedThisYear += result.utilized;
    remainingHPLoss = result.remainingLoss;
    if (remainingHPLoss <= 0) return totalHPLossUtilizedThisYear;

    // Against Other Sources (Excl Race Horse)
    result = setOffLossAgainstIncome(scheduleBFLA.OthSrcExclRaceHorse, remainingHPLoss, false);
    totalHPLossUtilizedThisYear += result.utilized;
    remainingHPLoss = result.remainingLoss;
    if (remainingHPLoss <= 0) return totalHPLossUtilizedThisYear;
    
    // Against Capital Gains (LTCG then STCG)
    const cgHeadsForHPLoss = [
        scheduleBFLA.LTCG10Per, scheduleBFLA.LTCG20Per, scheduleBFLA.LTCGDTAARate,
        scheduleBFLA.STCG15Per, scheduleBFLA.STCG30Per, scheduleBFLA.STCGAppRate, scheduleBFLA.STCGDTAARate
    ];
    for (const cgHead of cgHeadsForHPLoss) {
        if (remainingHPLoss <= 0) break;
        result = setOffLossAgainstIncome(cgHead, remainingHPLoss, false);
        totalHPLossUtilizedThisYear += result.utilized;
        remainingHPLoss = result.remainingLoss;
    }

    return totalHPLossUtilizedThisYear;
}

function _handleBroughtForwardSTCLLoss(
    scheduleBFLA: ScheduleBFLA,
    bfSTCLLossForYear: number
): number {
    let remainingSTCLLoss = bfSTCLLossForYear;
    let totalSTCLUtilizedThisYear = 0;
    let result: { utilized: number, remainingLoss: number };

    if (remainingSTCLLoss <= 0) return 0;

    // Against STCG heads (same head)
    const stcgHeads = [scheduleBFLA.STCG15Per, scheduleBFLA.STCG30Per, scheduleBFLA.STCGAppRate, scheduleBFLA.STCGDTAARate];
    for (const head of stcgHeads) {
        if (remainingSTCLLoss <= 0) break;
        result = setOffLossAgainstIncome(head, remainingSTCLLoss, true);
        totalSTCLUtilizedThisYear += result.utilized;
        remainingSTCLLoss = result.remainingLoss;
    }
    if (remainingSTCLLoss <= 0) return totalSTCLUtilizedThisYear;

    // Against LTCG heads (STCL can be set off against LTCG)
    const ltcgHeads = [scheduleBFLA.LTCG10Per, scheduleBFLA.LTCG20Per, scheduleBFLA.LTCGDTAARate];
    for (const head of ltcgHeads) {
        if (remainingSTCLLoss <= 0) break;
        // Consider STCL vs LTCG as "same head" for BFLA form tracking, though technically inter-category of CG
        result = setOffLossAgainstIncome(head, remainingSTCLLoss, true); 
        totalSTCLUtilizedThisYear += result.utilized;
        remainingSTCLLoss = result.remainingLoss;
    }
    return totalSTCLUtilizedThisYear;
}

function _handleBroughtForwardLTCLLoss(
    scheduleBFLA: ScheduleBFLA,
    bfLTCLLossForYear: number
): number {
    let remainingLTCLLoss = bfLTCLLossForYear;
    let totalLTCLUtilizedThisYear = 0;
    let result: { utilized: number, remainingLoss: number };

    if (remainingLTCLLoss <= 0) return 0;

    // ONLY Against LTCG heads (same head)
    const ltcgHeads = [scheduleBFLA.LTCG10Per, scheduleBFLA.LTCG20Per, scheduleBFLA.LTCGDTAARate];
    for (const head of ltcgHeads) {
        if (remainingLTCLLoss <= 0) break;
        result = setOffLossAgainstIncome(head, remainingLTCLLoss, true);
        totalLTCLUtilizedThisYear += result.utilized;
        remainingLTCLLoss = result.remainingLoss;
    }
    return totalLTCLUtilizedThisYear;
}

function _handleBroughtForwardRaceHorseLoss(
    scheduleBFLA: ScheduleBFLA,
    bfRaceHorseLossForYear: number
): number {
    if (bfRaceHorseLossForYear <= 0) return 0;
    
    // Only against OthSrcRaceHorse income
    const result = setOffLossAgainstIncome(scheduleBFLA.OthSrcRaceHorse, bfRaceHorseLossForYear, true);
    // Loss from owning and maintaining race horses is typically fully set-off or not at all against its own income head.
    return result.utilized; 
}

// Type guard for BFLA income head structures
interface BFLAHeadWithIncObject {
    IncBFLA: IncBFLA | SalaryOthSrcIncBFLA;
}
function isBFLAHeadWithIncObject(item: any): item is BFLAHeadWithIncObject {
    return item && typeof item === 'object' && item.IncBFLA && typeof item.IncBFLA === 'object';
}

/**
 * Calculates Schedule BFLA (Brought Forward Loss Adjustment).
 * This function takes the ITR object after Schedule CYLA has been computed
 * and uses the user-provided Schedule CFL (for previous year losses)
 * to set off brought forward losses against current year incomes.
 *
 * @param itr - The ITR object, expected to have ScheduleCYLA computed and ScheduleCFL populated
 *              with brought forward losses from previous years (from user input).
 * @returns The computed ScheduleBFLA object.
 */
export const calculateScheduleBFLA = (itr: Itr2): ScheduleBFLA => {
    logger.info('Calculating Schedule BFLA...');

    // Instead of reusing the same object instances, we'll create factory functions
    // that return fresh objects each time they're called
    
    const computedBFLA: ScheduleBFLA = {
        IncomeOfCurrYrAftCYLABFLA: 0,
        TotalBFLossSetOff: { TotBFLossSetoff: 0 },
        Salary: { IncBFLA: initializeSalaryOthSrcIncBFLADefault() },
        HP: { IncBFLA: initializeIncBFLADefault() },
        STCG15Per: { IncBFLA: initializeIncBFLADefault() },
        STCG30Per: { IncBFLA: initializeIncBFLADefault() },
        STCGAppRate: { IncBFLA: initializeIncBFLADefault() },
        STCGDTAARate: { IncBFLA: initializeIncBFLADefault() },
        LTCG10Per: { IncBFLA: initializeIncBFLADefault() },
        LTCG20Per: { IncBFLA: initializeIncBFLADefault() },
        LTCGDTAARate: { IncBFLA: initializeIncBFLADefault() },
        OthSrcExclRaceHorse: { IncBFLA: initializeSalaryOthSrcIncBFLADefault() },
        OthSrcRaceHorse: { IncBFLA: initializeIncBFLADefault() },
    };

    const scheduleCFL = cloneDeep(itr.ScheduleCFL);
    const scheduleCYLA = cloneDeep(itr.ScheduleCYLA);

    if (!scheduleCFL || !scheduleCFL.LossCFFromPrev8thYearFromAY || !scheduleCYLA) {
        logger.warn('ScheduleCFL (previous years losses) or ScheduleCYLA is not available or incomplete. Cannot calculate ScheduleBFLA effectively.');
        return computedBFLA;
    }

    // Step 1: Populate IncOfCurYrUndHeadFromCYLA and IncOfCurYrAfterSetOffBFLosses from ScheduleCYLA
    // (This part remains the same - ensuring computedBFLA starts with correct CYLA incomes)
    computedBFLA.Salary.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.Salary?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.Salary.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.Salary.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    computedBFLA.HP!.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.HP?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.HP!.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.HP!.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    computedBFLA.LTCG10Per.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.LTCG10Per?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.LTCG10Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.LTCG10Per.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    computedBFLA.LTCG20Per.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.LTCG20Per?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.LTCG20Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.LTCG20Per.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    computedBFLA.LTCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.LTCGDTAARate?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.LTCGDTAARate.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.LTCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    computedBFLA.STCG15Per.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.STCG15Per?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.STCG15Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.STCG15Per.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    computedBFLA.STCG30Per.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.STCG30Per?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.STCG30Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.STCG30Per.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    computedBFLA.STCGAppRate.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.STCGAppRate?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.STCGAppRate.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.STCGAppRate.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    computedBFLA.STCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.STCGDTAARate?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.STCGDTAARate.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.STCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    computedBFLA.OthSrcExclRaceHorse!.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.OthSrcExclRaceHorse?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.OthSrcExclRaceHorse!.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.OthSrcExclRaceHorse!.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    computedBFLA.OthSrcRaceHorse!.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.OthSrcRaceHorse?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.OthSrcRaceHorse!.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.OthSrcRaceHorse!.IncBFLA.IncOfCurYrUndHeadFromCYLA;

    let totalBFLAdjustedThisYear = 0;
    type LossDetailType = CarryFwdLossDetail | CarryFwdWithoutLossDetail | undefined;

    const lossYearAccessors: ((cfl: ScheduleCFL) => LossDetailType)[] = [
        (cfl) => cfl.LossCFFromPrev8thYearFromAY?.CarryFwdLossDetail, 
        (cfl) => cfl.LossCFFromPrev7thYearFromAY?.CarryFwdLossDetail, 
        (cfl) => cfl.LossCFFromPrev6thYearFromAY?.CarryFwdLossDetail, 
        (cfl) => cfl.LossCFFromPrev5thYearFromAY?.CarryFwdLossDetail, 
        (cfl) => cfl.LossCFFromPrev4thYearFromAY?.CarryFwdLossDetail, 
        (cfl) => cfl.LossCFFromPrev3rdYearFromAY?.CarryFwdLossDetail, 
        (cfl) => cfl.LossCFFromPrev2ndYearFromAY?.CarryFwdLossDetail, 
        (cfl) => cfl.LossCFFromPrevYrToAY?.CarryFwdLossDetail,        
    ];

    logger.info("initializeBFLA", computedBFLA);

    for (const getLossDetail of lossYearAccessors) {
        const lossDetail = getLossDetail(scheduleCFL);
        if (!lossDetail) continue;

        logger.info("lossDetail", lossDetail);

        // --- House Property Loss ---
        const hpLossFromCFL = lossDetail.TotalHPPTILossCF || 0;
        if (hpLossFromCFL > 0) {
            const hpLossUtilized = _handleBroughtForwardHPLoss(computedBFLA, hpLossFromCFL);
            totalBFLAdjustedThisYear += hpLossUtilized;
        }

        // --- Short Term Capital Loss ---
        const stclFromCFL = lossDetail.TotalSTCGPTILossCF || 0;
        if (stclFromCFL > 0) {
            const stclUtilized = _handleBroughtForwardSTCLLoss(computedBFLA, stclFromCFL);
            totalBFLAdjustedThisYear += stclUtilized;
        }

        // --- Long Term Capital Loss ---
        const ltclFromCFL = lossDetail.TotalLTCGPTILossCF || 0;
        if (ltclFromCFL > 0) {
            const ltclUtilized = _handleBroughtForwardLTCLLoss(computedBFLA, ltclFromCFL);
            totalBFLAdjustedThisYear += ltclUtilized;
        }
        
        // --- Other Sources Loss (Race Horse) ---
        // Check if lossDetail is of type CarryFwdLossDetail, which contains OthSrcLossRaceHorseCF
        // This implicitly handles the 4-year carry forward for race horse loss if ScheduleCFL types are correct.
        if ('OthSrcLossRaceHorseCF' in lossDetail) {
            const raceHorseLossFromCFL = (lossDetail as CarryFwdLossDetail).OthSrcLossRaceHorseCF || 0;
            if (raceHorseLossFromCFL > 0) {
                const raceHorseLossUtilized = _handleBroughtForwardRaceHorseLoss(computedBFLA, raceHorseLossFromCFL);
                totalBFLAdjustedThisYear += raceHorseLossUtilized;
            }
        }

        // TODO: Add calls to handlers for Business Loss, Unabsorbed Depreciation etc.
        // Example for Business Loss (Needs a _handleBroughtForwardBusinessLoss function):
        // const businessLossFromCFL = lossDetail.TotalBusLossCF || (lossDetail as CarryFwdWithoutLossDetail)?.BusLossTotCF || 0;
        // if (businessLossFromCFL > 0) {
        //     const businessLossUtilized = _handleBroughtForwardBusinessLoss(computedBFLA, businessLossFromCFL);
        //     totalBFLAdjustedThisYear += businessLossUtilized;
        // }
    }

    // Update TotalBFLossSetOff
    computedBFLA.TotalBFLossSetOff.TotBFLossSetoff = totalBFLAdjustedThisYear;

    // Recalculate IncomeOfCurrYrAftCYLABFLA after all BFLA set-offs
    let finalTotalIncomeAfterBFLA = 0;
    Object.values(computedBFLA).forEach((value: ScheduleBFLA[keyof ScheduleBFLA]) => {
        if (isBFLAHeadWithIncObject(value) && 'IncOfCurYrAfterSetOffBFLosses' in value.IncBFLA) {
            const incomeForHead = value.IncBFLA.IncOfCurYrAfterSetOffBFLosses || 0;
             if (incomeForHead > 0) { // Only sum positive incomes
                finalTotalIncomeAfterBFLA += incomeForHead;
            }
        }
    });
    computedBFLA.IncomeOfCurrYrAftCYLABFLA = finalTotalIncomeAfterBFLA;
    
    logger.info('Schedule BFLA calculation completed.');
    return computedBFLA;
};