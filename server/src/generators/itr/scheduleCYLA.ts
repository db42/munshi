import {
    ScheduleCYLA,
    ScheduleS,
    ScheduleHP,
    ScheduleCGFor23,
    ScheduleOS,
    Itr2 // Import Itr2 type
} from '../../types/itr';
import { getLogger, ILogger } from '../../utils/logger';

// Create a named logger instance for this module
const logger: ILogger = getLogger('scheduleCYLA');

/**
 * Input structure containing net income/loss figures from primary schedules
 * before inter-head adjustments.
 */
interface HeadwiseIncomeLoss { // Keep this internal interface
    salary: number;          // Net income from Schedule S
    houseProperty: number;   // Net income/loss from Schedule HP
    stcg15Percent: number;  // STCG taxable @ 15% (Sec 111A)
    stcg30Percent: number;  // STCG taxable @ 30% (relevant for some assets)
    stcgAppRate: number;    // STCG taxable at applicable rates
    stcgDtaaRate: number;   // STCG taxable at DTAA rates
    ltcg10Percent: number;  // LTCG taxable @ 10% (Sec 112A - excess over 1L)
    ltcg20Percent: number;  // LTCG taxable @ 20% (Sec 112 - with/without indexation)
    ltcgDtaaRate: number;   // LTCG taxable at DTAA rates
    otherSources: number;    // Net income/loss from Schedule OS (excluding race horses, lottery)
}

/**
 * Extracts headwise income/loss figures from the merged ITR object.
 * This is used as input for the CYLA calculation.
 */
function extractHeadwiseIncomeLoss(itr: Itr2): HeadwiseIncomeLoss {
    logger.debug('Extracting headwise income/loss from merged ITR sections for CYLA input.');

    const getNum = (val: number | undefined | null): number => val ?? 0;

    const cg = itr.ScheduleCGFor23;
    const cgCurrYrLosses = cg?.CurrYrLosses;

    const stcg15 = getNum(cgCurrYrLosses?.InStcg15Per?.CurrYrCapGain); 
    const stcgApp = getNum(cgCurrYrLosses?.InStcgAppRate?.CurrYrCapGain);
    const stcg30 = getNum(cgCurrYrLosses?.InStcg30Per?.CurrYrCapGain); 
    const stcgDtaa = 0;

    const ltcg10 = getNum(cgCurrYrLosses?.InLtcg10Per?.CurrYrCapGain);
    const ltcg20 = getNum(cgCurrYrLosses?.InLtcg20Per?.CurrYrCapGain);
    const ltcgDtaa = 0;
    
    const salaryIncome = getNum(itr.ScheduleS?.TotIncUnderHeadSalaries);
    const hpIncomeLoss = getNum(itr.ScheduleHP?.TotalIncomeChargeableUnHP);
    const osIncomeLoss = getNum(itr.ScheduleOS?.IncOthThanOwnRaceHorse?.InterestGross) + 
                         getNum(itr.ScheduleOS?.IncOthThanOwnRaceHorse?.DividendGross);

    const incomeLoss: HeadwiseIncomeLoss = {
        salary: salaryIncome,
        houseProperty: hpIncomeLoss,
        stcg15Percent: stcg15,
        stcg30Percent: stcg30,
        stcgAppRate: stcgApp,
        stcgDtaaRate: stcgDtaa,
        ltcg10Percent: ltcg10,
        ltcg20Percent: ltcg20,
        ltcgDtaaRate: ltcgDtaa,
        otherSources: osIncomeLoss,
    };

    logger.debug('Refined extracted headwise income/loss for CYLA:', incomeLoss);
    return incomeLoss;
}

// Helper function to apply a given loss to a specific income head
function _applyLossToIncomeHead(
    currentLossAmountToApply: number,
    currentTotalLossSetOffForType: number,
    incomeHead: { IncCYLA: { IncOfCurYrAfterSetOff: number, [key: string]: any } }, // The target income head's CYLA part
    specificLossFieldKey?: string // e.g., 'HPlossCurYrSetoff' or 'OthSrcLossNoRaceHorseSetoff'
): { newLossAmountToApply: number, newTotalLossSetOffForType: number, amountActuallySetOff: number } {
    if (currentLossAmountToApply <= 0 || !incomeHead || !incomeHead.IncCYLA || incomeHead.IncCYLA.IncOfCurYrAfterSetOff <= 0) {
        return {
            newLossAmountToApply: currentLossAmountToApply,
            newTotalLossSetOffForType: currentTotalLossSetOffForType,
            amountActuallySetOff: 0
        };
    }

    const amountToSetOff = Math.min(currentLossAmountToApply, incomeHead.IncCYLA.IncOfCurYrAfterSetOff);

    incomeHead.IncCYLA.IncOfCurYrAfterSetOff -= amountToSetOff;
    if (specificLossFieldKey && typeof incomeHead.IncCYLA[specificLossFieldKey] === 'number') {
        incomeHead.IncCYLA[specificLossFieldKey] += amountToSetOff;
    } else if (specificLossFieldKey && incomeHead.IncCYLA[specificLossFieldKey] === undefined) {
        incomeHead.IncCYLA[specificLossFieldKey] = amountToSetOff;
    }

    return {
        newLossAmountToApply: currentLossAmountToApply - amountToSetOff,
        newTotalLossSetOffForType: currentTotalLossSetOffForType + amountToSetOff,
        amountActuallySetOff: amountToSetOff
    };
}

// Handles the set-off of House Property Loss
function _handleHousePropertyLossSetOffs(
    scheduleCYLA: ScheduleCYLA,
    initialHPLoss: number,
    maxHPLossSetOffLimit: number
): number {
    if (initialHPLoss <= 0) return 0;

    const hpLossEligibleForInterHeadSetOff = Math.min(initialHPLoss, maxHPLossSetOffLimit);
    let hpLossRemaining = hpLossEligibleForInterHeadSetOff;
    let totalHPLossSetOffThisYear = 0;

    // 1. Against Other Sources Income (Excluding Race Horse)
    if (hpLossRemaining > 0 && scheduleCYLA.OthSrcExclRaceHorse) {
        const result = _applyLossToIncomeHead(hpLossRemaining, totalHPLossSetOffThisYear, scheduleCYLA.OthSrcExclRaceHorse, 'HPlossCurYrSetoff');
        hpLossRemaining = result.newLossAmountToApply;
        totalHPLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    // 2. Against Salary Income
    if (hpLossRemaining > 0 && scheduleCYLA.Salary) {
        const result = _applyLossToIncomeHead(hpLossRemaining, totalHPLossSetOffThisYear, scheduleCYLA.Salary, 'HPlossCurYrSetoff');
        hpLossRemaining = result.newLossAmountToApply;
        totalHPLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    // 3. Against LTCG Incomes
    if (hpLossRemaining > 0 && scheduleCYLA.LTCG10Per) {
        const result = _applyLossToIncomeHead(hpLossRemaining, totalHPLossSetOffThisYear, scheduleCYLA.LTCG10Per, 'HPlossCurYrSetoff');
        hpLossRemaining = result.newLossAmountToApply;
        totalHPLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    if (hpLossRemaining > 0 && scheduleCYLA.LTCG20Per) {
        const result = _applyLossToIncomeHead(hpLossRemaining, totalHPLossSetOffThisYear, scheduleCYLA.LTCG20Per);
        hpLossRemaining = result.newLossAmountToApply;
        totalHPLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    if (hpLossRemaining > 0 && scheduleCYLA.LTCGDTAARate) {
        const result = _applyLossToIncomeHead(hpLossRemaining, totalHPLossSetOffThisYear, scheduleCYLA.LTCGDTAARate);
        hpLossRemaining = result.newLossAmountToApply;
        totalHPLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    // 4. Against STCG Incomes
    if (hpLossRemaining > 0 && scheduleCYLA.STCG15Per) {
        const result = _applyLossToIncomeHead(hpLossRemaining, totalHPLossSetOffThisYear, scheduleCYLA.STCG15Per);
        hpLossRemaining = result.newLossAmountToApply;
        totalHPLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    if (hpLossRemaining > 0 && scheduleCYLA.STCG30Per) {
        const result = _applyLossToIncomeHead(hpLossRemaining, totalHPLossSetOffThisYear, scheduleCYLA.STCG30Per);
        hpLossRemaining = result.newLossAmountToApply;
        totalHPLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    if (hpLossRemaining > 0 && scheduleCYLA.STCGAppRate) {
        const result = _applyLossToIncomeHead(hpLossRemaining, totalHPLossSetOffThisYear, scheduleCYLA.STCGAppRate);
        hpLossRemaining = result.newLossAmountToApply;
        totalHPLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    if (hpLossRemaining > 0 && scheduleCYLA.STCGDTAARate) {
        const result = _applyLossToIncomeHead(hpLossRemaining, totalHPLossSetOffThisYear, scheduleCYLA.STCGDTAARate);
        hpLossRemaining = result.newLossAmountToApply;
        totalHPLossSetOffThisYear = result.newTotalLossSetOffForType;
    }

    return totalHPLossSetOffThisYear;
}

// Handles the set-off of Other Sources Loss (No Race Horse)
function _handleOtherSourcesLossSetOffs(
    scheduleCYLA: ScheduleCYLA,
    initialOSLoss: number
): number {
    if (initialOSLoss <= 0) return 0;

    let osLossRemaining = initialOSLoss; 
    let totalOSLossSetOffThisYear = 0;

    // 1. Against House Property Income
    if (osLossRemaining > 0 && scheduleCYLA.HP) {
        const result = _applyLossToIncomeHead(osLossRemaining, totalOSLossSetOffThisYear, scheduleCYLA.HP, 'OthSrcLossNoRaceHorseSetoff');
        osLossRemaining = result.newLossAmountToApply;
        totalOSLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    // 2. Against Salary Income
    if (osLossRemaining > 0 && scheduleCYLA.Salary) {
        const result = _applyLossToIncomeHead(osLossRemaining, totalOSLossSetOffThisYear, scheduleCYLA.Salary, 'OthSrcLossNoRaceHorseSetoff');
        osLossRemaining = result.newLossAmountToApply;
        totalOSLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    // 3. Against LTCG Incomes
    if (osLossRemaining > 0 && scheduleCYLA.LTCG10Per) {
        const result = _applyLossToIncomeHead(osLossRemaining, totalOSLossSetOffThisYear, scheduleCYLA.LTCG10Per, 'OthSrcLossNoRaceHorseSetoff');
        osLossRemaining = result.newLossAmountToApply;
        totalOSLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    if (osLossRemaining > 0 && scheduleCYLA.LTCG20Per) {
        const result = _applyLossToIncomeHead(osLossRemaining, totalOSLossSetOffThisYear, scheduleCYLA.LTCG20Per);
        osLossRemaining = result.newLossAmountToApply;
        totalOSLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    if (osLossRemaining > 0 && scheduleCYLA.LTCGDTAARate) {
        const result = _applyLossToIncomeHead(osLossRemaining, totalOSLossSetOffThisYear, scheduleCYLA.LTCGDTAARate);
        osLossRemaining = result.newLossAmountToApply;
        totalOSLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    // 4. Against STCG Incomes
    if (osLossRemaining > 0 && scheduleCYLA.STCG15Per) {
        const result = _applyLossToIncomeHead(osLossRemaining, totalOSLossSetOffThisYear, scheduleCYLA.STCG15Per);
        osLossRemaining = result.newLossAmountToApply;
        totalOSLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    if (osLossRemaining > 0 && scheduleCYLA.STCG30Per) {
        const result = _applyLossToIncomeHead(osLossRemaining, totalOSLossSetOffThisYear, scheduleCYLA.STCG30Per);
        osLossRemaining = result.newLossAmountToApply;
        totalOSLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    if (osLossRemaining > 0 && scheduleCYLA.STCGAppRate) {
        const result = _applyLossToIncomeHead(osLossRemaining, totalOSLossSetOffThisYear, scheduleCYLA.STCGAppRate);
        osLossRemaining = result.newLossAmountToApply;
        totalOSLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    if (osLossRemaining > 0 && scheduleCYLA.STCGDTAARate) {
        const result = _applyLossToIncomeHead(osLossRemaining, totalOSLossSetOffThisYear, scheduleCYLA.STCGDTAARate);
        osLossRemaining = result.newLossAmountToApply;
        totalOSLossSetOffThisYear = result.newTotalLossSetOffForType;
    }
    
    return totalOSLossSetOffThisYear;
}

/**
 * Calculates Schedule CYLA (Current Year Loss Adjustment) based on income/loss
 * figures from various heads and applies inter-head set-off rules as per IT Act.
 *
 * @param itr - The partially merged Itr2 object containing results from primary schedules.
 * @returns The calculated ScheduleCYLA object.
 */
export function calculateScheduleCYLA(itr: Itr2): ScheduleCYLA {
    logger.info('Calculating Schedule CYLA with structured set-off logic...');
    
    const incomeLoss = extractHeadwiseIncomeLoss(itr);
    logger.debug('Input Headwise Income/Loss extracted:', incomeLoss);

    const scheduleCYLA: ScheduleCYLA = initializeScheduleCYLA(incomeLoss);
    logger.debug('Initial ScheduleCYLA before set-off:', scheduleCYLA);

    // --- Apply Inter-Head Set-off Logic (Section 71) ---
    
    let totalHPLossSetOffThisYear = 0;
    let totalOSLossSetOffThisYear = 0;
    
    // 1. Set off House Property Loss
    // As per Sec 71(3A), HP loss can be set off against other heads up to ₹2,00,000.
    const maxHPLossSetOffLimit = 200000; 
    const currentHPLossToSetOff = scheduleCYLA.TotalCurYr.TotHPlossCurYr;
    if (currentHPLossToSetOff > 0) {
        logger.debug(`Attempting to set off House Property Loss of ${currentHPLossToSetOff}, limit ${maxHPLossSetOffLimit}`);
        totalHPLossSetOffThisYear = _handleHousePropertyLossSetOffs(
            scheduleCYLA, 
            currentHPLossToSetOff, 
            maxHPLossSetOffLimit
        );
        logger.debug(`Total House Property Loss set off: ${totalHPLossSetOffThisYear}`);
    }

    // 2. Set off Other Sources Loss (No Race Horse)
    // As per Sec 71, loss from 'Other Sources' (excluding loss from owning and maintaining race horses)
    // can be set off against any other head of income.
    const currentOSLossToSetOff = scheduleCYLA.TotalCurYr.TotOthSrcLossNoRaceHorse;
    if (currentOSLossToSetOff > 0) {
        logger.debug(`Attempting to set off Other Sources Loss of ${currentOSLossToSetOff}`);
        totalOSLossSetOffThisYear = _handleOtherSourcesLossSetOffs(
            scheduleCYLA, 
            currentOSLossToSetOff
        );
        logger.debug(`Total Other Sources Loss set off: ${totalOSLossSetOffThisYear}`);
    }

    // TODO: Implement set-off for Business Loss (Non-speculative) - Sec 71(1)
    // Cannot be set off against Salary income.

    // TODO: Implement set-off for Short Term Capital Loss (STCL) - Sec 71(2) & Sec 74
    // Can be set off against STCG and LTCG.

    // TODO: Implement set-off for Long Term Capital Loss (LTCL) - Sec 71(2) & Sec 74
    // Can ONLY be set off against LTCG.

    // --- Update Totals and Balances in scheduleCYLA ---
    scheduleCYLA.TotalLossSetOff.TotHPlossCurYrSetoff = totalHPLossSetOffThisYear;
    scheduleCYLA.TotalLossSetOff.TotOthSrcLossNoRaceHorseSetoff = totalOSLossSetOffThisYear;

    // Update remaining loss to be carried forward
    const originalTotalHPLoss = incomeLoss.houseProperty < 0 ? -incomeLoss.houseProperty : 0;
    scheduleCYLA.LossRemAftSetOff.BalHPlossCurYrAftSetoff = Math.max(0, originalTotalHPLoss - totalHPLossSetOffThisYear);

    const originalTotalOSLoss = incomeLoss.otherSources < 0 ? -incomeLoss.otherSources : 0;
    scheduleCYLA.LossRemAftSetOff.BalOthSrcLossNoRaceHorseAftSetoff = Math.max(0, originalTotalOSLoss - totalOSLossSetOffThisYear);
    
    logger.info('Schedule CYLA calculation complete with structured set-off logic.');
    logger.debug('Final Calculated Schedule CYLA:', scheduleCYLA);

    return scheduleCYLA;
}

/**
 * Initializes the ScheduleCYLA structure based on the input income/loss figures.
 * This sets the starting point before applying inter-head adjustments.
 */
function initializeScheduleCYLA(incomeLoss: HeadwiseIncomeLoss): ScheduleCYLA {
     const safeIncome = (val: number) => Math.max(0, val);
     const safeLoss = (val: number) => Math.max(0, -val); // Loss represented as positive

     // Note: These totals are not directly used in the CYLA schedule itself,
     // but were likely for debugging in the original extraction logic.
     // const totalSTCG = incomeLoss.stcg15Percent + incomeLoss.stcg30Percent + incomeLoss.stcgAppRate + incomeLoss.stcgDtaaRate;
     // const totalLTCG = incomeLoss.ltcg10Percent + incomeLoss.ltcg20Percent + incomeLoss.ltcgDtaaRate;

     return {
        Salary: {
            IncCYLA: {
                IncOfCurYrUnderThatHead: safeIncome(incomeLoss.salary),
                HPlossCurYrSetoff: 0,
                OthSrcLossNoRaceHorseSetoff: 0,
                IncOfCurYrAfterSetOff: safeIncome(incomeLoss.salary), // Initial value
            }
        },
        HP: {
            IncCYLA: {
                IncOfCurYrUnderThatHead: safeIncome(incomeLoss.houseProperty),
                OthSrcLossNoRaceHorseSetoff: 0, 
                IncOfCurYrAfterSetOff: safeIncome(incomeLoss.houseProperty), // Initial value
            }
        },
        STCG15Per: { IncCYLA: { IncOfCurYrUnderThatHead: safeIncome(incomeLoss.stcg15Percent), IncOfCurYrAfterSetOff: safeIncome(incomeLoss.stcg15Percent) }},
        STCG30Per: { IncCYLA: { IncOfCurYrUnderThatHead: safeIncome(incomeLoss.stcg30Percent), IncOfCurYrAfterSetOff: safeIncome(incomeLoss.stcg30Percent) }},
        STCGAppRate: { IncCYLA: { IncOfCurYrUnderThatHead: safeIncome(incomeLoss.stcgAppRate), IncOfCurYrAfterSetOff: safeIncome(incomeLoss.stcgAppRate) }},
        STCGDTAARate: { IncCYLA: { IncOfCurYrUnderThatHead: safeIncome(incomeLoss.stcgDtaaRate), IncOfCurYrAfterSetOff: safeIncome(incomeLoss.stcgDtaaRate) }},
        LTCG10Per: {
            IncCYLA: {
                IncOfCurYrUnderThatHead: safeIncome(incomeLoss.ltcg10Percent),
                HPlossCurYrSetoff: 0,
                OthSrcLossNoRaceHorseSetoff: 0,
                IncOfCurYrAfterSetOff: safeIncome(incomeLoss.ltcg10Percent), // Initial value
            }
        },
        LTCG20Per: { IncCYLA: { IncOfCurYrUnderThatHead: safeIncome(incomeLoss.ltcg20Percent), IncOfCurYrAfterSetOff: safeIncome(incomeLoss.ltcg20Percent) }},
        LTCGDTAARate: { IncCYLA: { IncOfCurYrUnderThatHead: safeIncome(incomeLoss.ltcgDtaaRate), IncOfCurYrAfterSetOff: safeIncome(incomeLoss.ltcgDtaaRate) }},
        OthSrcExclRaceHorse: {
             IncCYLA: {
                 IncOfCurYrUnderThatHead: safeIncome(incomeLoss.otherSources),
                 HPlossCurYrSetoff: 0,
                 IncOfCurYrAfterSetOff: safeIncome(incomeLoss.otherSources), // Initial value
             }
         },
         OthSrcRaceHorse: {
             IncCYLA: {
                 IncOfCurYrUnderThatHead: 0,
                 HPlossCurYrSetoff: 0,
                 OthSrcLossNoRaceHorseSetoff: 0,
                 IncOfCurYrAfterSetOff: 0,
             }
         },
         TotalCurYr: {
             TotHPlossCurYr: safeLoss(incomeLoss.houseProperty),
             TotOthSrcLossNoRaceHorse: safeLoss(incomeLoss.otherSources),
         },
         TotalLossSetOff: { 
             TotHPlossCurYrSetoff: 0,
             TotOthSrcLossNoRaceHorseSetoff: 0,
         },
         LossRemAftSetOff: { 
             BalHPlossCurYrAftSetoff: safeLoss(incomeLoss.houseProperty), // Initial value
             BalOthSrcLossNoRaceHorseAftSetoff: safeLoss(incomeLoss.otherSources), // Initial value
         },
     };
}

// TODO: Implement detailed set-off logic according to Section 71 rules. 