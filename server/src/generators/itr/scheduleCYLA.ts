import {
    ScheduleCYLA,
    ScheduleS,
    ScheduleHP,
    ScheduleCGFor23,
    ScheduleOS,
    Itr2 // Import Itr2 type
} from '../../types/itr';
import { logger } from '../../utils/logger';

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

    const sumNestedArrayField = <T, K extends keyof T, N extends keyof NonNullable<T[K]>>(
        arr: T[] | undefined,
        outerField: K,
        innerField: N
    ): number => {
        return arr?.reduce((sum, item) => {
            const outerValue = item[outerField];
            const innerValue = outerValue ? (outerValue as NonNullable<T[K]>)[innerField] : undefined;
            return sum + getNum(innerValue as number | undefined);
        }, 0) ?? 0;
    };
    
    const cg = itr.ScheduleCGFor23;

    const stcg15 = sumNestedArrayField(
        cg?.ShortTermCapGainFor23?.EquityMFonSTT?.filter(s => s.MFSectionCode === '1A'),
        'EquityMFonSTTDtls',
        'CapgainonAssets'
    );
    const stcgApp = getNum(cg?.ShortTermCapGainFor23?.SaleOnOtherAssets?.CapgainonAssets);
    const stcg30 = 0; 
    const stcgDtaa = 0; 
    const ltcg10 = getNum(cg?.LongTermCapGain23?.SaleOfEquityShareUs112A?.CapgainonAssets);
    const ltcg20 = getNum(cg?.LongTermCapGain23?.SaleofBondsDebntr?.CapgainonAssets) +
                   getNum(cg?.LongTermCapGain23?.SaleofAssetNA?.CapgainonAssets);
    const ltcgDtaa = 0; 
    const salaryIncome = getNum(itr.ScheduleS?.TotIncUnderHeadSalaries);
    const hpIncomeLoss = getNum(itr.ScheduleHP?.TotalIncomeChargeableUnHP);
    const osIncomeLoss = getNum(itr.ScheduleOS?.IncOthThanOwnRaceHorse?.InterestGross) + getNum(itr.ScheduleOS?.IncOthThanOwnRaceHorse?.DividendGross); 

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

    logger.debug('Final extracted headwise income/loss for CYLA:', incomeLoss);
    return incomeLoss;
}

/**
 * Calculates Schedule CYLA (Current Year Loss Adjustment) based on income/loss
 * figures from various heads and applies inter-head set-off rules as per IT Act.
 *
 * @param itr - The partially merged Itr2 object containing results from primary schedules.
 * @returns The calculated ScheduleCYLA object.
 */
export function calculateScheduleCYLA(itr: Itr2): ScheduleCYLA {
    logger.info('Calculating Schedule CYLA...');
    
    // Extract income/loss figures first
    const incomeLoss = extractHeadwiseIncomeLoss(itr);
    logger.debug('Input Headwise Income/Loss extracted:', incomeLoss);

    // Initialize Schedule CYLA structure based on extracted figures
    const scheduleCYLA: ScheduleCYLA = initializeScheduleCYLA(incomeLoss);

    // --- Apply Set-off Logic (Section 71) --- 
    // TODO: Implement actual set-off logic here, modifying scheduleCYLA object.
    // Example (Conceptual - needs proper implementation with limits):
    // let remainingHPLoss = incomeLoss.houseProperty < 0 ? Math.min(200000, -incomeLoss.houseProperty) : 0;
    // if (remainingHPLoss > 0 && scheduleCYLA.Salary.IncCYLA.IncOfCurYrUnderThatHead > 0) { ... apply loss ... }

    logger.info('Schedule CYLA calculation complete (set-off logic pending).');
    logger.debug('Calculated Schedule CYLA:', scheduleCYLA);

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