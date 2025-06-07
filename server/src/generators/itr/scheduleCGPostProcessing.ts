import cloneDeep from 'lodash/cloneDeep';
import { 
    ScheduleCGFor23, 
    CurrYrLosses, 
    InLossSetOff, 
    ShortTermCapGainFor23, 
    LongTermCapGain23,
    InStcg15Per,
    InStcg30Per,
    InStcgAppRate,
    InStcgDTAARate,
    InLtcg10Per,
    InLtcg20Per,
    InLtcgDTAARate
} from '../../types/itr';
import { getLogger, ILogger } from '../../utils/logger';

// Create a named logger instance for this module
const logger: ILogger = getLogger('scheduleCGPostProcessing');

// Enum for distinct capital gain/loss tax categories
export enum CapitalGainTaxCategory {
    STCG_15_PER = 'STCG_15_PER',         // Sec 111A (STT paid equity)
    STCG_30_PER = 'STCG_30_PER',         // e.g., certain STCG for FIIs without STT, or specific assets
    STCG_APP_RATE = 'STCG_APP_RATE',     // Slab rates (e.g., debt MF STCG, non-STT equity STCG)
    STCG_DTAA_RATE = 'STCG_DTAA_RATE',   // STCG taxed at DTAA rates
    LTCG_10_PER = 'LTCG_10_PER',         // Sec 112A (STT paid equity over 1L)
    LTCG_12_5_PER = 'LTCG_12_5_PER',     // Post-Budget 2024: Foreign equity, unlisted shares (12.5%)
    LTCG_20_PER = 'LTCG_20_PER',         // Sec 112 (e.g., debt MF LTCG with indexation, property)
    LTCG_DTAA_RATE = 'LTCG_DTAA_RATE',   // LTCG taxed at DTAA rates
    // Add other specific categories if needed, e.g., VDA
}

/**
 * Represents the gains or losses for a specific tax category, along with set-off details.
 */
export interface ProcessedTaxCategory {
    originalGainOrLoss: number; // The initial CurrYrCapGain for this category (can be negative for loss)
    netGainAfterSetOff: number; // Gain remaining in this category after losses from other categories were set off against it
    lossFromThisCategoryUsed: number; // How much of the loss (if originalGainOrLoss was negative) from this category was used to set off other gains
    lossSetOffAgainstThisCategory: number; // How much loss (from other categories) was set off against gain in this category
    remainingLossToCarry: number;   // Absolute value of loss from this category remaining after all intra-head set-offs
}

// Map to hold the processed amounts for each tax category
export type ProcessedCapitalGains = Map<CapitalGainTaxCategory, ProcessedTaxCategory>;

// --- Helper Functions (Moved to Module Scope) ---

const initializeCategory = (
    aggregatedGainsLosses: ProcessedCapitalGains, 
    category: CapitalGainTaxCategory, 
    gainOrLoss: number | undefined
): void => {
    const amount = gainOrLoss || 0;
    aggregatedGainsLosses.set(category, {
        originalGainOrLoss: amount,
        netGainAfterSetOff: amount > 0 ? amount : 0,
        lossFromThisCategoryUsed: 0,
        lossSetOffAgainstThisCategory: 0,
        remainingLossToCarry: amount < 0 ? Math.abs(amount) : 0,
    });
};

const performSetOff = (
    lossCategoryData: ProcessedTaxCategory,
    gainCategoryData: ProcessedTaxCategory,
): number => {
    const lossAvailable = lossCategoryData.remainingLossToCarry;
    const gainAvailable = gainCategoryData.netGainAfterSetOff;

    if (lossAvailable === 0 || gainAvailable === 0) {
        return 0;
    }

    const setOffAmount = Math.min(lossAvailable, gainAvailable);

    lossCategoryData.remainingLossToCarry -= setOffAmount;
    lossCategoryData.lossFromThisCategoryUsed += setOffAmount;

    gainCategoryData.netGainAfterSetOff -= setOffAmount;
    gainCategoryData.lossSetOffAgainstThisCategory += setOffAmount;
    
    logger.debug(`Set-off: Used ${setOffAmount} from a loss category against a gain category.`);
    return setOffAmount;
};

const recordSetOffInITRFields = (
    lossCat: CapitalGainTaxCategory,
    gainCat: CapitalGainTaxCategory,
    setOffAmount: number,
    schedule: ScheduleCGFor23 
) => {
    if (setOffAmount === 0) return;

    const isLossLTC = lossCat.startsWith('LTCG');
    const isGainLTC = gainCat.startsWith('LTCG');
    const currYrLosses = schedule.CurrYrLosses!;
    const inLossSetOff = currYrLosses.InLossSetOff!;

    if (isLossLTC && isGainLTC) {
        if (lossCat === CapitalGainTaxCategory.LTCG_10_PER) inLossSetOff.LtclSetOff10Per = (inLossSetOff.LtclSetOff10Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.LTCG_20_PER) inLossSetOff.LtclSetOff20Per = (inLossSetOff.LtclSetOff20Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.LTCG_DTAA_RATE) inLossSetOff.LtclSetOffDTAARate = (inLossSetOff.LtclSetOffDTAARate || 0) + setOffAmount;
    } else if (!isLossLTC && !isGainLTC) {
        if (lossCat === CapitalGainTaxCategory.STCG_15_PER) inLossSetOff.StclSetoff15Per = (inLossSetOff.StclSetoff15Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_30_PER) inLossSetOff.StclSetoff30Per = (inLossSetOff.StclSetoff30Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_APP_RATE) inLossSetOff.StclSetoffAppRate = (inLossSetOff.StclSetoffAppRate || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_DTAA_RATE) inLossSetOff.StclSetoffDTAARate = (inLossSetOff.StclSetoffDTAARate || 0) + setOffAmount;
    } else if (isLossLTC && !isGainLTC) {
        logger.debug(`LTCL (${lossCat}) vs STCG (${gainCat}) set-off of ${setOffAmount} recorded in InLossSetOff and detailed fields.`);
        // Populate InLossSetOff for LTCL utilized against STCG
        if (lossCat === CapitalGainTaxCategory.LTCG_10_PER) inLossSetOff.LtclSetOff10Per = (inLossSetOff.LtclSetOff10Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.LTCG_20_PER) inLossSetOff.LtclSetOff20Per = (inLossSetOff.LtclSetOff20Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.LTCG_DTAA_RATE) inLossSetOff.LtclSetOffDTAARate = (inLossSetOff.LtclSetOffDTAARate || 0) + setOffAmount;
    } else { // STCL vs LTCG
        logger.debug(`STCL (${lossCat}) vs LTCG (${gainCat}) set-off of ${setOffAmount} recorded in InLossSetOff and detailed fields.`);
        // Populate InLossSetOff for STCL utilized against LTCG
        if (lossCat === CapitalGainTaxCategory.STCG_15_PER) inLossSetOff.StclSetoff15Per = (inLossSetOff.StclSetoff15Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_30_PER) inLossSetOff.StclSetoff30Per = (inLossSetOff.StclSetoff30Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_APP_RATE) inLossSetOff.StclSetoffAppRate = (inLossSetOff.StclSetoffAppRate || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_DTAA_RATE) inLossSetOff.StclSetoffDTAARate = (inLossSetOff.StclSetoffDTAARate || 0) + setOffAmount;
    }

    if (gainCat === CapitalGainTaxCategory.LTCG_10_PER && currYrLosses.InLtcg10Per) {
        const target = currYrLosses.InLtcg10Per;
        if (lossCat === CapitalGainTaxCategory.LTCG_20_PER) target.LtclSetOff20Per = (target.LtclSetOff20Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.LTCG_DTAA_RATE) target.LtclSetOffDTAARate = (target.LtclSetOffDTAARate || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_15_PER) target.StclSetoff15Per = (target.StclSetoff15Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_30_PER) target.StclSetoff30Per = (target.StclSetoff30Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_APP_RATE) target.StclSetoffAppRate = (target.StclSetoffAppRate || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_DTAA_RATE) target.StclSetoffDTAARate = (target.StclSetoffDTAARate || 0) + setOffAmount;
    } else if (gainCat === CapitalGainTaxCategory.LTCG_20_PER && currYrLosses.InLtcg20Per) {
        const target = currYrLosses.InLtcg20Per;
        if (lossCat === CapitalGainTaxCategory.LTCG_10_PER) target.LtclSetOff10Per = (target.LtclSetOff10Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.LTCG_DTAA_RATE) target.LtclSetOffDTAARate = (target.LtclSetOffDTAARate || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_15_PER) target.StclSetoff15Per = (target.StclSetoff15Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_30_PER) target.StclSetoff30Per = (target.StclSetoff30Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_APP_RATE) target.StclSetoffAppRate = (target.StclSetoffAppRate || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_DTAA_RATE) target.StclSetoffDTAARate = (target.StclSetoffDTAARate || 0) + setOffAmount;
    } else if (gainCat === CapitalGainTaxCategory.LTCG_DTAA_RATE && currYrLosses.InLtcgDTAARate) {
        const target = currYrLosses.InLtcgDTAARate;
        if (lossCat === CapitalGainTaxCategory.LTCG_10_PER) target.LtclSetOff10Per = (target.LtclSetOff10Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.LTCG_20_PER) target.LtclSetOff20Per = (target.LtclSetOff20Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_15_PER) target.StclSetoff15Per = (target.StclSetoff15Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_30_PER) target.StclSetoff30Per = (target.StclSetoff30Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_APP_RATE) target.StclSetoffAppRate = (target.StclSetoffAppRate || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_DTAA_RATE) target.StclSetoffDTAARate = (target.StclSetoffDTAARate || 0) + setOffAmount;
    } 
    else if (gainCat === CapitalGainTaxCategory.STCG_15_PER && currYrLosses.InStcg15Per) {
        const target = currYrLosses.InStcg15Per;
        if (lossCat === CapitalGainTaxCategory.STCG_30_PER) target.StclSetoff30Per = (target.StclSetoff30Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_APP_RATE) target.StclSetoffAppRate = (target.StclSetoffAppRate || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_DTAA_RATE) target.StclSetoffDTAARate = (target.StclSetoffDTAARate || 0) + setOffAmount;
    } else if (gainCat === CapitalGainTaxCategory.STCG_30_PER && currYrLosses.InStcg30Per) {
        const target = currYrLosses.InStcg30Per;
        if (lossCat === CapitalGainTaxCategory.STCG_15_PER) target.StclSetoff15Per = (target.StclSetoff15Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_APP_RATE) target.StclSetoffAppRate = (target.StclSetoffAppRate || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_DTAA_RATE) target.StclSetoffDTAARate = (target.StclSetoffDTAARate || 0) + setOffAmount;
    } else if (gainCat === CapitalGainTaxCategory.STCG_APP_RATE && currYrLosses.InStcgAppRate) {
        const target = currYrLosses.InStcgAppRate;
        if (lossCat === CapitalGainTaxCategory.STCG_15_PER) target.StclSetoff15Per = (target.StclSetoff15Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_30_PER) target.StclSetoff30Per = (target.StclSetoff30Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_DTAA_RATE) target.StclSetoffDTAARate = (target.StclSetoffDTAARate || 0) + setOffAmount;
    } else if (gainCat === CapitalGainTaxCategory.STCG_DTAA_RATE && currYrLosses.InStcgDTAARate) {
        const target = currYrLosses.InStcgDTAARate;
        if (lossCat === CapitalGainTaxCategory.STCG_15_PER) target.StclSetoff15Per = (target.StclSetoff15Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_30_PER) target.StclSetoff30Per = (target.StclSetoff30Per || 0) + setOffAmount;
        else if (lossCat === CapitalGainTaxCategory.STCG_APP_RATE) target.StclSetoffAppRate = (target.StclSetoffAppRate || 0) + setOffAmount;
    }
};

/**
 * Post-processes ScheduleCG to calculate intra-head capital loss set-offs
 * and populate derived fields like InLossSetOff, LossRemainSetOff, TotLossSetOff,
 * and update SumOfCGIncm.
 * @param scheduleCG The aggregated ScheduleCGFor23 object.
 * @returns The post-processed ScheduleCGFor23 object.
 */
export const postProcessScheduleCG = (scheduleCG: ScheduleCGFor23): ScheduleCGFor23 => {
    logger.info('Initiating post-processing for Schedule CG.', {
        scheduleCG: scheduleCG
    });
    
    const processedScheduleCG = cloneDeep(scheduleCG);

    if (!processedScheduleCG.CurrYrLosses) {
        logger.warn('CurrYrLosses not found in ScheduleCG for post-processing. Returning as is.');
        return processedScheduleCG;
    }

    processedScheduleCG.CurrYrLosses.InLossSetOff = processedScheduleCG.CurrYrLosses.InLossSetOff || {} as InLossSetOff;
    processedScheduleCG.CurrYrLosses.TotLossSetOff = processedScheduleCG.CurrYrLosses.TotLossSetOff || {} as InLossSetOff; 
    processedScheduleCG.CurrYrLosses.LossRemainSetOff = processedScheduleCG.CurrYrLosses.LossRemainSetOff || {} as InLossSetOff;

    const zeroOutSetOffFields = (obj: any) => {
        for (const key in obj) {
            if (key.toLowerCase().includes('setoff') || key.toLowerCase().includes('lossremain')) {
                if (typeof obj[key] === 'number') {
                    obj[key] = 0;
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    zeroOutSetOffFields(obj[key]);
                }
            }
        }
    };

    zeroOutSetOffFields(processedScheduleCG.CurrYrLosses);
    const categoriesToZero = [
        processedScheduleCG.CurrYrLosses.InStcg15Per,
        processedScheduleCG.CurrYrLosses.InStcg30Per,
        processedScheduleCG.CurrYrLosses.InStcgAppRate,
        processedScheduleCG.CurrYrLosses.InStcgDTAARate,
        processedScheduleCG.CurrYrLosses.InLtcg10Per,
        processedScheduleCG.CurrYrLosses.InLtcg20Per,
        processedScheduleCG.CurrYrLosses.InLtcgDTAARate,
    ];
    categoriesToZero.forEach(category => {
        if (category) {
            zeroOutSetOffFields(category);
        }
    });

    const aggregatedGainsLosses: ProcessedCapitalGains = new Map();

    if (processedScheduleCG.CurrYrLosses) {
        initializeCategory(aggregatedGainsLosses, CapitalGainTaxCategory.STCG_15_PER, processedScheduleCG.CurrYrLosses.InStcg15Per?.CurrYrCapGain);
        initializeCategory(aggregatedGainsLosses, CapitalGainTaxCategory.STCG_30_PER, processedScheduleCG.CurrYrLosses.InStcg30Per?.CurrYrCapGain);
        initializeCategory(aggregatedGainsLosses, CapitalGainTaxCategory.STCG_APP_RATE, processedScheduleCG.CurrYrLosses.InStcgAppRate?.CurrYrCapGain);
        initializeCategory(aggregatedGainsLosses, CapitalGainTaxCategory.STCG_DTAA_RATE, processedScheduleCG.CurrYrLosses.InStcgDTAARate?.CurrYrCapGain);
        initializeCategory(aggregatedGainsLosses, CapitalGainTaxCategory.LTCG_10_PER, processedScheduleCG.CurrYrLosses.InLtcg10Per?.CurrYrCapGain);
        initializeCategory(aggregatedGainsLosses, CapitalGainTaxCategory.LTCG_20_PER, processedScheduleCG.CurrYrLosses.InLtcg20Per?.CurrYrCapGain);
        initializeCategory(aggregatedGainsLosses, CapitalGainTaxCategory.LTCG_DTAA_RATE, processedScheduleCG.CurrYrLosses.InLtcgDTAARate?.CurrYrCapGain);
    }

    // Rule 1: LTCG Loss vs LTCG Gain
    // Order of LTCG loss categories (e.g., DTAA/20% might have priority or specific rules, assume simple for now)
    // Order of LTCG gain categories (e.g., set off against 10% first then 20%? Assume flexible for now)
    const ltcgLossCategories = [CapitalGainTaxCategory.LTCG_20_PER, CapitalGainTaxCategory.LTCG_DTAA_RATE, CapitalGainTaxCategory.LTCG_10_PER];
    const ltcgGainCategories = [CapitalGainTaxCategory.LTCG_10_PER, CapitalGainTaxCategory.LTCG_20_PER, CapitalGainTaxCategory.LTCG_DTAA_RATE];

    for (const lossCat of ltcgLossCategories) {
        const lossData = aggregatedGainsLosses.get(lossCat);
        if (lossData && lossData.remainingLossToCarry > 0) {
            for (const gainCat of ltcgGainCategories) {
                if (lossData.remainingLossToCarry === 0) break; // All loss from this category has been set off
                
                const gainData = aggregatedGainsLosses.get(gainCat);
                if (gainData && gainData.netGainAfterSetOff > 0) {
                    const setOffAmountVal = performSetOff(lossData, gainData);
                    if (setOffAmountVal > 0) {
                        recordSetOffInITRFields(lossCat, gainCat, setOffAmountVal, processedScheduleCG);
                    }
                }
            }
        }
    }

    // Rule 2: Remaining LTCG Loss vs STCG Gain
    const stcgGainCategories = [
        CapitalGainTaxCategory.STCG_APP_RATE, // Common STCG, good to absorb LTCG loss first
        CapitalGainTaxCategory.STCG_15_PER, 
        CapitalGainTaxCategory.STCG_30_PER, 
        CapitalGainTaxCategory.STCG_DTAA_RATE
    ];

    for (const lossCat of ltcgLossCategories) { // Use the same LTCG loss categories array
        const lossData = aggregatedGainsLosses.get(lossCat);
        if (lossData && lossData.remainingLossToCarry > 0) {
            for (const gainCat of stcgGainCategories) {
                if (lossData.remainingLossToCarry === 0) break;

                const gainData = aggregatedGainsLosses.get(gainCat);
                if (gainData && gainData.netGainAfterSetOff > 0) {
                    const setOffAmountVal = performSetOff(lossData, gainData);
                    if (setOffAmountVal > 0) {
                        recordSetOffInITRFields(lossCat, gainCat, setOffAmountVal, processedScheduleCG);
                    }
                }
            }
        }
    }

    // Rule 3: STCL Loss vs STCG Gain
    const stclLossCategories = [
        CapitalGainTaxCategory.STCG_APP_RATE, // Order might matter based on specific rules or desired behavior
        CapitalGainTaxCategory.STCG_15_PER,
        CapitalGainTaxCategory.STCG_30_PER,
        CapitalGainTaxCategory.STCG_DTAA_RATE
    ];
    // Re-using stcgGainCategories defined for Rule 2

    for (const lossCat of stclLossCategories) {
        const lossData = aggregatedGainsLosses.get(lossCat);
        if (lossData && lossData.remainingLossToCarry > 0) {
            for (const gainCat of stcgGainCategories) {
                if (lossData.remainingLossToCarry === 0) break;
                // STCL cannot be set off against STCG 15% (Sec 111A) if the loss is not also from 111A type asset.
                // This needs a more fine-grained check if we have such distinctions.
                // For now, assuming general STCL can be set off against general STCG.
                // A STCL from AppRate can be set off against STCG 15% gain, but STCL 15% loss has restrictions.
                // This simplified model might need refinement for specific STCL types (e.g. STCL under 111A vs other STCL)

                const gainData = aggregatedGainsLosses.get(gainCat);
                if (gainData && gainData.netGainAfterSetOff > 0) {
                    // Special rule: Loss from STCG (other than 111A) can be set off against STCG 111A gain.
                    // Loss from STCG 111A can only be set off against STCG 111A gain.
                    // This simplified loop does not yet distinguish this. Assume general set-off for now.
                    const setOffAmountVal = performSetOff(lossData, gainData);
                    if (setOffAmountVal > 0) {
                        recordSetOffInITRFields(lossCat, gainCat, setOffAmountVal, processedScheduleCG);
                    }
                }
            }
        }
    }

    // Rule 4: Remaining STCL Loss vs LTCG Gain
    // Re-using stclLossCategories and ltcgGainCategories defined earlier

    for (const lossCat of stclLossCategories) {
        const lossData = aggregatedGainsLosses.get(lossCat);
        if (lossData && lossData.remainingLossToCarry > 0) {
            for (const gainCat of ltcgGainCategories) {
                if (lossData.remainingLossToCarry === 0) break;

                // STCL (not from spec biz) can be set off against LTCG.
                // However, if STCL is from Sec 111A (STCG_15_PER), it typically cannot be set off against LTCG.
                // This simplified model does not yet distinguish this. Assume general set-off for now.
                if (lossCat === CapitalGainTaxCategory.STCG_15_PER && lossData.remainingLossToCarry > 0) {
                    // Generally, STCL under Sec 111A cannot be set off against LTCG.
                    // It can only be set off against STCG under Sec 111A or carried forward.
                    // So, we might skip setting it off against LTCG or have specific conditions.
                    // For now, the simple loop will attempt it, which might be too permissive for STCG_15_PER loss.
                }

                const gainData = aggregatedGainsLosses.get(gainCat);
                if (gainData && gainData.netGainAfterSetOff > 0) {
                    const setOffAmountVal = performSetOff(lossData, gainData);
                    if (setOffAmountVal > 0) {
                        recordSetOffInITRFields(lossCat, gainCat, setOffAmountVal, processedScheduleCG);
                    }
                }
            }
        }
    }

    // --- Step 3: Populate TotLossSetOff --- 
    const inLossSetOff = processedScheduleCG.CurrYrLosses.InLossSetOff!;
    const totLossSetOff = processedScheduleCG.CurrYrLosses.TotLossSetOff!;

    // Summing up all the set-off amounts from InLossSetOff to TotLossSetOff
    // Assuming TotLossSetOff has a similar structure or at least fields that correspond
    // to the source of gain that was reduced.
    totLossSetOff.LtclSetOff10Per = inLossSetOff.LtclSetOff10Per || 0;
    totLossSetOff.LtclSetOff20Per = inLossSetOff.LtclSetOff20Per || 0;
    totLossSetOff.LtclSetOffDTAARate = inLossSetOff.LtclSetOffDTAARate || 0;
    totLossSetOff.StclSetoff15Per = inLossSetOff.StclSetoff15Per || 0;
    totLossSetOff.StclSetoff30Per = inLossSetOff.StclSetoff30Per || 0;
    totLossSetOff.StclSetoffAppRate = inLossSetOff.StclSetoffAppRate || 0;
    totLossSetOff.StclSetoffDTAARate = inLossSetOff.StclSetoffDTAARate || 0;

    logger.info('Populated TotLossSetOff based on InLossSetOff.');

    // --- Step 4: Populate LossRemainSetOff --- 
    // This section populates the losses remaining to be carried forward, categorized by their original tax type.
    const lossRemainSetOff = processedScheduleCG.CurrYrLosses.LossRemainSetOff!;
    
    // Initialize all fields to 0, as these directly map to loss categories to be carried forward.
    lossRemainSetOff.LtclSetOff10Per = 0;       // Remaining loss from LTCG 10% category
    lossRemainSetOff.LtclSetOff20Per = 0;       // Remaining loss from LTCG 20% category
    lossRemainSetOff.LtclSetOffDTAARate = 0;  // Remaining loss from LTCG DTAA category
    lossRemainSetOff.StclSetoff15Per = 0;       // Remaining loss from STCG 15% category
    lossRemainSetOff.StclSetoff30Per = 0;       // Remaining loss from STCG 30% category
    lossRemainSetOff.StclSetoffAppRate = 0;     // Remaining loss from STCG App Rate category
    lossRemainSetOff.StclSetoffDTAARate = 0;  // Remaining loss from STCG DTAA category

    aggregatedGainsLosses.forEach((data, category) => {
        if (data.remainingLossToCarry > 0) {
            switch (category) {
                case CapitalGainTaxCategory.LTCG_10_PER:
                    lossRemainSetOff.LtclSetOff10Per = data.remainingLossToCarry;
                    break;
                case CapitalGainTaxCategory.LTCG_20_PER:
                    lossRemainSetOff.LtclSetOff20Per = data.remainingLossToCarry;
                    break;
                case CapitalGainTaxCategory.LTCG_DTAA_RATE:
                    lossRemainSetOff.LtclSetOffDTAARate = data.remainingLossToCarry;
                    break;
                case CapitalGainTaxCategory.STCG_15_PER:
                    lossRemainSetOff.StclSetoff15Per = data.remainingLossToCarry;
                    break;
                case CapitalGainTaxCategory.STCG_30_PER:
                    lossRemainSetOff.StclSetoff30Per = data.remainingLossToCarry;
                    break;
                case CapitalGainTaxCategory.STCG_APP_RATE:
                    lossRemainSetOff.StclSetoffAppRate = data.remainingLossToCarry;
                    break;
                case CapitalGainTaxCategory.STCG_DTAA_RATE:
                    lossRemainSetOff.StclSetoffDTAARate = data.remainingLossToCarry;
                    break;
            }
        }
    });
    logger.info('Populated LossRemainSetOff with losses to be carried forward.');


    // --- Step 5: Calculate Final Net Capital Gains (SumOfCGIncm, TotScheduleCGFor23) ---
    let sumOfCGIncm = 0;
    aggregatedGainsLosses.forEach((data, category) => {
        // netGainAfterSetOff already accounts for losses set off against this category's gain.
        // It will be 0 if the original amount was a loss, or if the gain was fully offset.
        if (data.netGainAfterSetOff > 0) {
            sumOfCGIncm += data.netGainAfterSetOff;
        }
    });

    processedScheduleCG.SumOfCGIncm = sumOfCGIncm;
    processedScheduleCG.TotScheduleCGFor23 = sumOfCGIncm; // Typically, TotScheduleCGFor23 mirrors SumOfCGIncm after all intra-head set-offs.

    logger.info(`Calculated SumOfCGIncm and TotScheduleCGFor23: ${sumOfCGIncm}`);

    // --- Step 6: Update CurrYrCapGain in detailed sections to reflect net gain after set-offs ---
    aggregatedGainsLosses.forEach((data, category) => {
        if (data.originalGainOrLoss >= 0) { // Only update for categories that were originally gains
            switch (category) {
                case CapitalGainTaxCategory.LTCG_10_PER:
                    if (processedScheduleCG.CurrYrLosses?.InLtcg10Per) {
                        processedScheduleCG.CurrYrLosses.InLtcg10Per.CurrYrCapGain = data.netGainAfterSetOff;
                    }
                    break;
                case CapitalGainTaxCategory.LTCG_20_PER:
                    if (processedScheduleCG.CurrYrLosses?.InLtcg20Per) {
                        processedScheduleCG.CurrYrLosses.InLtcg20Per.CurrYrCapGain = data.netGainAfterSetOff;
                    }
                    break;
                case CapitalGainTaxCategory.LTCG_DTAA_RATE:
                    if (processedScheduleCG.CurrYrLosses?.InLtcgDTAARate) {
                        processedScheduleCG.CurrYrLosses.InLtcgDTAARate.CurrYrCapGain = data.netGainAfterSetOff;
                    }
                    break;
                case CapitalGainTaxCategory.STCG_15_PER:
                    if (processedScheduleCG.CurrYrLosses?.InStcg15Per) {
                        processedScheduleCG.CurrYrLosses.InStcg15Per.CurrYrCapGain = data.netGainAfterSetOff;
                    }
                    break;
                case CapitalGainTaxCategory.STCG_30_PER:
                    if (processedScheduleCG.CurrYrLosses?.InStcg30Per) {
                        processedScheduleCG.CurrYrLosses.InStcg30Per.CurrYrCapGain = data.netGainAfterSetOff;
                    }
                    break;
                case CapitalGainTaxCategory.STCG_APP_RATE:
                    if (processedScheduleCG.CurrYrLosses?.InStcgAppRate) {
                        processedScheduleCG.CurrYrLosses.InStcgAppRate.CurrYrCapGain = data.netGainAfterSetOff;
                    }
                    break;
                case CapitalGainTaxCategory.STCG_DTAA_RATE:
                    if (processedScheduleCG.CurrYrLosses?.InStcgDTAARate) {
                        processedScheduleCG.CurrYrLosses.InStcgDTAARate.CurrYrCapGain = data.netGainAfterSetOff;
                    }
                    break;
            }
        }
        // For categories that were originally losses, their CurrYrCapGain already reflects the original loss amount,
        // and CurrYearIncome also reflects that original loss amount. These are not changed here.
    });
    logger.info('Updated CurrYrCapGain in detailed loss/gain lines for original gain categories.');


    // Final Review of TODOs and Comments:
    // The primary remaining task for correctness is to refine the set-off rules for STCL under Sec 111A (STCG_15_PER losses),
    // which currently might be too permissive in allowing set-off against non-111A STCG or LTCG.
    // The detailed set-off fields within InLtcg... and InStcg... types have been populated based on the identified schema structure.

    logger.warn('postProcessScheduleCG: Review and refine specific set-off rules for STCL 111A (STCG_15_PER loss). Intra-category set-off fields populated based on schema.');

    // --- Step 7: Ensure specific CurrYrCapGain and CurrYearIncome fields are non-negative for final output --- 
    const categoriesToAdjust = [
        processedScheduleCG.CurrYrLosses.InLtcg10Per,
        processedScheduleCG.CurrYrLosses.InLtcg20Per,
        processedScheduleCG.CurrYrLosses.InLtcgDTAARate,
        processedScheduleCG.CurrYrLosses.InStcg15Per,
        processedScheduleCG.CurrYrLosses.InStcg30Per,
        processedScheduleCG.CurrYrLosses.InStcgAppRate,
        processedScheduleCG.CurrYrLosses.InStcgDTAARate
    ];

    for (const category of categoriesToAdjust) {
        if (category) {
            if (typeof category.CurrYrCapGain === 'number') {
                category.CurrYrCapGain = Math.max(0, category.CurrYrCapGain);
            }
            if (typeof category.CurrYearIncome === 'number') {
                category.CurrYearIncome = Math.max(0, category.CurrYearIncome);
            }
        }
    }
    logger.info('Adjusted relevant CurrYrCapGain and CurrYearIncome fields to be non-negative for final output.');

    logger.info('Completed post-processing for Schedule CG.', {
        scheduleCG: processedScheduleCG
    });
    return processedScheduleCG;
}; 