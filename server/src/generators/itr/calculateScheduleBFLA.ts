import { Itr2, ScheduleBFLA, ScheduleCFL, IncBFLA, SalaryOthSrcIncBFLA, TotalBFLossSetOff, ScheduleCYLA, ScheduleS, ScheduleHP, ScheduleCGFor23, ScheduleOS, CarryFwdLossDetail, CarryFwdWithoutLossDetail } from '../../types/itr';
import { logger } from '../../utils/logger';
import cloneDeep from 'lodash/cloneDeep';

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
                (incomeField.IncBFLA as IncBFLA).BFlossPrevYrUndSameHeadSetoff + lossUtilizedThisHead;
        }
        // Removed direct modification of totalBFLAdjustedThisYear from here
    }
    return { utilized: lossUtilizedThisHead, remainingLoss: lossToApply - lossUtilizedThisHead };
};

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

    const defaultIncBFLA = initializeIncBFLADefault();
    const defaultSalaryOthSrcIncBFLA = initializeSalaryOthSrcIncBFLADefault();

    const scheduleCFL = cloneDeep(itr.ScheduleCFL);
    const scheduleCYLA = cloneDeep(itr.ScheduleCYLA);

    const computedBFLA: ScheduleBFLA = {
        IncomeOfCurrYrAftCYLABFLA: 0,
        TotalBFLossSetOff: { TotBFLossSetoff: 0 },
        Salary: { IncBFLA: defaultSalaryOthSrcIncBFLA },
        HP: { IncBFLA: defaultIncBFLA },
        STCG15Per: { IncBFLA: defaultIncBFLA },
        STCG30Per: { IncBFLA: defaultIncBFLA },
        STCGAppRate: { IncBFLA: defaultIncBFLA },
        STCGDTAARate: { IncBFLA: defaultIncBFLA },
        LTCG10Per: { IncBFLA: defaultIncBFLA },
        LTCG20Per: { IncBFLA: defaultIncBFLA },
        LTCGDTAARate: { IncBFLA: defaultIncBFLA },
        OthSrcExclRaceHorse: { IncBFLA: defaultSalaryOthSrcIncBFLA },
        OthSrcRaceHorse: { IncBFLA: defaultIncBFLA },
    };

    if (!scheduleCFL || !scheduleCFL.LossCFFromPrev8thYearFromAY || !scheduleCYLA) {
        logger.warn('ScheduleCFL (previous years losses) or ScheduleCYLA is not available or incomplete. Cannot calculate ScheduleBFLA effectively.');
        return computedBFLA;
    }

    // Step 1: Populate IncOfCurYrUndHeadFromCYLA and IncOfCurYrAfterSetOffBFLosses (initially same as IncOfCurYrUndHeadFromCYLA)
    // Salary
    computedBFLA.Salary.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.Salary?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.Salary.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.Salary.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    
    // House Property (HP)
    computedBFLA.HP!.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.HP?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.HP!.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.HP!.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    
    // Long Term Capital Gains (LTCG) - 10%
    computedBFLA.LTCG10Per.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.LTCG10Per?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.LTCG10Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.LTCG10Per.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    
    // LTCG - 20%
    computedBFLA.LTCG20Per.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.LTCG20Per?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.LTCG20Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.LTCG20Per.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    
    // LTCG - DTAA Rate
    computedBFLA.LTCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.LTCGDTAARate?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.LTCGDTAARate.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.LTCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    
    // Short Term Capital Gains (STCG) - 15%
    computedBFLA.STCG15Per.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.STCG15Per?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.STCG15Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.STCG15Per.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    
    // STCG - 30%
    computedBFLA.STCG30Per.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.STCG30Per?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.STCG30Per.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.STCG30Per.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    
    // STCG - Applicable Rate
    computedBFLA.STCGAppRate.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.STCGAppRate?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.STCGAppRate.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.STCGAppRate.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    
    // STCG - DTAA Rate
    computedBFLA.STCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.STCGDTAARate?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.STCGDTAARate.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.STCGDTAARate.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    
    // Other Sources (Excluding Race Horse)
    computedBFLA.OthSrcExclRaceHorse!.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.OthSrcExclRaceHorse?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.OthSrcExclRaceHorse!.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.OthSrcExclRaceHorse!.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    
    // Other Sources (Race Horse)
    computedBFLA.OthSrcRaceHorse!.IncBFLA.IncOfCurYrUndHeadFromCYLA = itr.ScheduleCYLA?.OthSrcRaceHorse?.IncCYLA.IncOfCurYrAfterSetOff || 0;
    computedBFLA.OthSrcRaceHorse!.IncBFLA.IncOfCurYrAfterSetOffBFLosses = computedBFLA.OthSrcRaceHorse!.IncBFLA.IncOfCurYrUndHeadFromCYLA;
    // ***** END OF DATA POPULATION FROM ScheduleCYLA *****

    // Step 3 & 4: Implement Loss Set-off Logic and update totals

    let totalBFLAdjustedThisYear = 0;

    // Helper function to set off losses - MOVED TO TOP LEVEL
    
    type LossDetailType = CarryFwdLossDetail | CarryFwdWithoutLossDetail | undefined;

    const lossYearAccessors: ((cfl: ScheduleCFL) => LossDetailType)[] = [
        (cfl) => cfl.LossCFFromPrev8thYearFromAY?.CarryFwdLossDetail, // AY-8 (uses CarryFwdWithoutLossDetail)
        (cfl) => cfl.LossCFFromPrev7thYearFromAY?.CarryFwdLossDetail, // AY-7 (uses CarryFwdWithoutLossDetail)
        (cfl) => cfl.LossCFFromPrev6thYearFromAY?.CarryFwdLossDetail, // AY-6 (uses CarryFwdWithoutLossDetail)
        (cfl) => cfl.LossCFFromPrev5thYearFromAY?.CarryFwdLossDetail, // AY-5 (uses CarryFwdWithoutLossDetail)
        (cfl) => cfl.LossCFFromPrev4thYearFromAY?.CarryFwdLossDetail, // AY-4 (uses CarryFwdLossDetail)
        (cfl) => cfl.LossCFFromPrev3rdYearFromAY?.CarryFwdLossDetail, // AY-3 (uses CarryFwdLossDetail)
        (cfl) => cfl.LossCFFromPrev2ndYearFromAY?.CarryFwdLossDetail, // AY-2 (uses CarryFwdLossDetail)
        (cfl) => cfl.LossCFFromPrevYrToAY?.CarryFwdLossDetail,        // AY-1 (uses CarryFwdLossDetail)
    ];

    for (const getLossDetail of lossYearAccessors) {
        const lossDetail = getLossDetail(scheduleCFL);
        if (!lossDetail) continue;

        let result: { utilized: number, remainingLoss: number };

        // 1. House Property Loss
        let bfHPLoss = lossDetail.TotalHPPTILossCF || 0;
        if (bfHPLoss > 0) {
            result = setOffLossAgainstIncome(computedBFLA.HP, bfHPLoss, true); // Same head
            if(result.utilized > 0) totalBFLAdjustedThisYear += result.utilized;
            bfHPLoss = result.remainingLoss;
            if (bfHPLoss > 0) { // Inter-head set-off for HP loss
                result = setOffLossAgainstIncome(computedBFLA.Salary, bfHPLoss, false);
                if(result.utilized > 0) totalBFLAdjustedThisYear += result.utilized;
                bfHPLoss = result.remainingLoss;
            }
            if (bfHPLoss > 0) {
                result = setOffLossAgainstIncome(computedBFLA.OthSrcExclRaceHorse, bfHPLoss, false);
                if(result.utilized > 0) totalBFLAdjustedThisYear += result.utilized;
                bfHPLoss = result.remainingLoss;
            }
            // Set off HP Loss against Capital Gains (LTCG then STCG)
            const cgHeadsForHPLoss = [computedBFLA.LTCG10Per, computedBFLA.LTCG20Per, computedBFLA.LTCGDTAARate, computedBFLA.STCG15Per, computedBFLA.STCG30Per, computedBFLA.STCGAppRate, computedBFLA.STCGDTAARate];
            for (const cgHead of cgHeadsForHPLoss) {
                if (bfHPLoss <= 0) break;
                result = setOffLossAgainstIncome(cgHead, bfHPLoss, false);
                if(result.utilized > 0) totalBFLAdjustedThisYear += result.utilized;
                bfHPLoss = result.remainingLoss;
            }
        }

        // 2. Short Term Capital Loss
        let bfSTCGLoss = lossDetail.TotalSTCGPTILossCF || 0;
        if (bfSTCGLoss > 0) {
            // Against STCG heads
            const stcgHeads = [computedBFLA.STCG15Per, computedBFLA.STCG30Per, computedBFLA.STCGAppRate, computedBFLA.STCGDTAARate];
            for (const head of stcgHeads) {
                if (bfSTCGLoss <= 0) break;
                result = setOffLossAgainstIncome(head, bfSTCGLoss, true);
                if(result.utilized > 0) totalBFLAdjustedThisYear += result.utilized;
                bfSTCGLoss = result.remainingLoss;
            }
            // Against LTCG heads
            if (bfSTCGLoss > 0) {
                const ltcgHeads = [computedBFLA.LTCG10Per, computedBFLA.LTCG20Per, computedBFLA.LTCGDTAARate];
                for (const head of ltcgHeads) {
                    if (bfSTCGLoss <= 0) break;
                    result = setOffLossAgainstIncome(head, bfSTCGLoss, true); // STCL vs LTCG is considered "same head" for BFLA set off purposes
                    if(result.utilized > 0) totalBFLAdjustedThisYear += result.utilized;
                    bfSTCGLoss = result.remainingLoss;
                }
            }
        }

        // 3. Long Term Capital Loss
        let bfLTCGLoss = lossDetail.TotalLTCGPTILossCF || 0;
        if (bfLTCGLoss > 0) {
            // ONLY Against LTCG heads
            const ltcgHeads = [computedBFLA.LTCG10Per, computedBFLA.LTCG20Per, computedBFLA.LTCGDTAARate];
            for (const head of ltcgHeads) {
                if (bfLTCGLoss <= 0) break;
                result = setOffLossAgainstIncome(head, bfLTCGLoss, true);
                if(result.utilized > 0) totalBFLAdjustedThisYear += result.utilized;
                bfLTCGLoss = result.remainingLoss;
            }
        }
        
        // 4. Other Sources Loss (Race Horse) - only from last 4 assessment years (AY-1 to AY-4)
        // Check if lossDetail is of type CarryFwdLossDetail, which contains OthSrcLossRaceHorseCF
        if ('OthSrcLossRaceHorseCF' in lossDetail) {
            let bfRaceHorseLoss = (lossDetail as CarryFwdLossDetail).OthSrcLossRaceHorseCF || 0;
            if (bfRaceHorseLoss > 0) {
                 result = setOffLossAgainstIncome(computedBFLA.OthSrcRaceHorse, bfRaceHorseLoss, true);
                 if(result.utilized > 0) totalBFLAdjustedThisYear += result.utilized;
                 bfRaceHorseLoss = result.remainingLoss; // Though it should be fully set-off or not at all here
            }
        }
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