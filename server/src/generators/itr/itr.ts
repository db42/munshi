import { parsedDocuments } from '../../services/parsedDocument';
import { convertForm16ToITR as convertForm16ToITRSections } from '../../document-processors/form16ToITR';
import { Itr2, ScheduleCGFor23, ScheduleFA, ScheduleOS, ScheduleTR1, ScheduleFSI, PartBTTI, Itr, Schedule112A, ScheduleTDS2 } from '../../types/itr';
import { convertCharlesSchwabCSVToITR as convertCharlesSchwabCSVToITRSections } from '../../document-processors/charlesSchwabToITR';
import { convertUSCGEquityToITR as convertUSCGEquityToITRSections, USEquityITRSections } from '../../document-processors/usCGEquityToITR';
import { convertUSInvestmentIncomeToITRSections } from '../../document-processors/usInvestmentIncomeToITR';
import { convertAISToITRSections } from '../../document-processors/aisToITR';
import { convertCAMSMFCapitalGainToITR, CAMSMFCapitalGainITRSections } from '../../document-processors/camsMFCapitalGainToITR';
import cloneDeep from 'lodash/cloneDeep';
import { logger } from '../../utils/logger';
import { calculatePartBTTI, TaxRegimePreference } from './partBTTI';
import { calculatePartBTI } from './partBTI';
import { calculateScheduleCYLA } from './scheduleCYLA';
import { calculateScheduleSI } from './scheduleSI';
import { calculateScheduleAMTC, isAMTApplicable } from './scheduleAMTC';

export interface ITRData {
    // Define your ITR structure here
    assessmentYear: string;
    userId: number;
    // Add other ITR fields
}

/**
 * Enum for ITR section types
 */
export enum ITRSectionType {
    SCHEDULE_CG = 'ScheduleCGFor23',
    SCHEDULE_FA = 'ScheduleFA',
    SCHEDULE_OS = 'ScheduleOS',
    SCHEDULE_TR1 = 'ScheduleTR1',
    SCHEDULE_FSI = 'ScheduleFSI',
    SCHEDULE_112A = 'Schedule112A',
    SCHEDULE_TDS2 = 'ScheduleTDS2'
}

/**
 * Represents a section from a parsed document that needs to be merged into an ITR
 */
export interface ITRSection {
    // Type of the section, used to determine which merger to apply
    type: ITRSectionType;
    // The actual section data
    data: any;
}

/**
 * Type for a function that merges a specific section into an ITR
 */
type SectionTransformer = (itr: Itr2, section: ITRSection) => Itr2;

/**
 * Registry of section transformers mapped by section type
 */
const sectionTransformers: Record<ITRSectionType, SectionTransformer> = {
    [ITRSectionType.SCHEDULE_CG]: (itr, section) => {
        const scheduleCG = section.data as ScheduleCGFor23;
        if (!itr.ScheduleCGFor23) {
            itr = {
                ...itr,
                ScheduleCGFor23: scheduleCG
            };
        } else {
            itr = {
                ...itr,
                ScheduleCGFor23: mergeScheduleCG(itr.ScheduleCGFor23, scheduleCG)
            };
        }
        return itr;
    },
    [ITRSectionType.SCHEDULE_FA]: (itr, section) => {
        const scheduleFA = section.data as ScheduleFA;
        itr = {
            ...itr,
            ScheduleFA: scheduleFA
        };
        return itr;
    },
    // New transformers for full section handling
    [ITRSectionType.SCHEDULE_OS]: (itr, section) => {
        const scheduleOS = section.data as Partial<ScheduleOS>;

        // If no existing ScheduleOS, add it
        if (!itr.ScheduleOS) {
            itr = {
                ...itr,
                ScheduleOS: scheduleOS as ScheduleOS
            };
        } else {
            // Merge with existing ScheduleOS
            const updatedScheduleOS = {
                ...itr.ScheduleOS,
                // Ensure we update all fields from the new section
                ...scheduleOS,
                // Special handling for income values that need to be accumulated
                IncChargeable: (itr.ScheduleOS.IncChargeable || 0) + (scheduleOS.IncChargeable || 0),
                // For DTAA dividend, we combine the values in the DateRange
                DividendDTAA: {
                    DateRange: {
                        Up16Of12To15Of3: (itr.ScheduleOS.DividendDTAA?.DateRange?.Up16Of12To15Of3 || 0) +
                            (scheduleOS.DividendDTAA?.DateRange?.Up16Of12To15Of3 || 0),
                        Up16Of3To31Of3: (itr.ScheduleOS.DividendDTAA?.DateRange?.Up16Of3To31Of3 || 0) +
                            (scheduleOS.DividendDTAA?.DateRange?.Up16Of3To31Of3 ||
                                0),
                        Up16Of9To15Of12: (itr.ScheduleOS.DividendDTAA?.DateRange?.Up16Of9To15Of12 || 0) +
                            (scheduleOS.DividendDTAA?.DateRange?.Up16Of9To15Of12 || 0),
                        Upto15Of6: (itr.ScheduleOS.DividendDTAA?.DateRange?.Upto15Of6 || 0) +
                            (scheduleOS.DividendDTAA?.DateRange?.Upto15Of6 || 0),
                        Upto15Of9: (itr.ScheduleOS.DividendDTAA?.DateRange?.Upto15Of9 || 0) +
                            (scheduleOS.DividendDTAA?.DateRange?.Upto15Of9 || 0)
                    }
                }
            };

            itr = {
                ...itr,
                ScheduleOS: updatedScheduleOS
            };
        }

        return itr;
    },

    [ITRSectionType.SCHEDULE_TR1]: (itr, section) => {
        const scheduleTR1 = section.data as Partial<ScheduleTR1>;

        // If no existing ScheduleTR1, add it
        if (!itr.ScheduleTR1) {
            itr = {
                ...itr,
                ScheduleTR1: scheduleTR1 as ScheduleTR1
            };
        } else {
            // Merge with existing ScheduleTR1
            const existingScheduleTR = itr.ScheduleTR1.ScheduleTR || [];
            const newScheduleTR = scheduleTR1.ScheduleTR || [];

            // Merge ScheduleTR entries
            const mergedScheduleTR = [...existingScheduleTR];

            // Add or update entries from new ScheduleTR
            newScheduleTR.forEach(newEntry => {
                const existingEntryIndex = mergedScheduleTR.findIndex(
                    entry => entry.CountryCodeExcludingIndia === newEntry.CountryCodeExcludingIndia
                );

                if (existingEntryIndex >= 0) {
                    // Update existing country entry
                    mergedScheduleTR[existingEntryIndex] = {
                        ...mergedScheduleTR[existingEntryIndex],
                        TaxPaidOutsideIndia: (mergedScheduleTR[existingEntryIndex].TaxPaidOutsideIndia || 0) +
                            (newEntry.TaxPaidOutsideIndia || 0),
                        TaxReliefOutsideIndia: (mergedScheduleTR[existingEntryIndex].TaxReliefOutsideIndia ||
                            0) + (newEntry.TaxReliefOutsideIndia || 0)
                    };
                } else {
                    // Add new country entry
                    mergedScheduleTR.push(newEntry);
                }
            });

            const updatedScheduleTR1 = {
                ...itr.ScheduleTR1,
                ...scheduleTR1,
                ScheduleTR: mergedScheduleTR,
                // Update totals
                TotalTaxPaidOutsideIndia: (itr.ScheduleTR1.TotalTaxPaidOutsideIndia || 0) +
                    (scheduleTR1.TotalTaxPaidOutsideIndia || 0),
                TotalTaxReliefOutsideIndia: (itr.ScheduleTR1.TotalTaxReliefOutsideIndia || 0) +
                    (scheduleTR1.TotalTaxReliefOutsideIndia || 0),
                TaxReliefOutsideIndiaDTAA: (itr.ScheduleTR1.TaxReliefOutsideIndiaDTAA || 0) +
                    (scheduleTR1.TaxReliefOutsideIndiaDTAA || 0)
            };

            itr = {
                ...itr,
                ScheduleTR1: updatedScheduleTR1
            };
        }

        return itr;
    },

    [ITRSectionType.SCHEDULE_FSI]: (itr, section) => {
        const scheduleFSI = section.data as ScheduleFSI;

        // If no existing ScheduleFSI, add it
        if (!itr.ScheduleFSI) {
            itr = {
                ...itr,
                ScheduleFSI: scheduleFSI
            };
        } else {
            // Merge with existing ScheduleFSI
            const existingScheduleFSIDtls = itr.ScheduleFSI.ScheduleFSIDtls || [];
            const newScheduleFSIDtls = scheduleFSI.ScheduleFSIDtls || [];

            // Merge ScheduleFSIDtls entries
            const mergedScheduleFSIDtls = [...existingScheduleFSIDtls];

            // Add or update entries from new ScheduleFSIDtls
            newScheduleFSIDtls.forEach(newEntry => {
                const existingEntryIndex = mergedScheduleFSIDtls.findIndex(
                    entry => entry.CountryCodeExcludingIndia === newEntry.CountryCodeExcludingIndia
                );

                if (existingEntryIndex >= 0) {
                    // Update existing country entry
                    const existingEntry = mergedScheduleFSIDtls[existingEntryIndex];

                    // Update IncOthSrc (Income from Other Sources)
                    const updatedIncOthSrc = {
                        ...existingEntry.IncOthSrc,
                        IncFrmOutsideInd: (existingEntry.IncOthSrc.IncFrmOutsideInd || 0) +
                            (newEntry.IncOthSrc.IncFrmOutsideInd || 0),
                        TaxPaidOutsideInd: (existingEntry.IncOthSrc.TaxPaidOutsideInd || 0) +
                            (newEntry.IncOthSrc.TaxPaidOutsideInd || 0),
                        TaxPayableinInd: (existingEntry.IncOthSrc.TaxPayableinInd || 0) +
                            (newEntry.IncOthSrc.TaxPayableinInd || 0),
                        TaxReliefinInd: (existingEntry.IncOthSrc.TaxReliefinInd || 0) +
                            (newEntry.IncOthSrc.TaxReliefinInd || 0)
                    };

                    // Update TotalCountryWise
                    const updatedTotalCountryWise = {
                        ...existingEntry.TotalCountryWise,
                        IncFrmOutsideInd: (existingEntry.TotalCountryWise.IncFrmOutsideInd || 0) +
                            (newEntry.TotalCountryWise.IncFrmOutsideInd || 0),
                        TaxPaidOutsideInd: (existingEntry.TotalCountryWise.TaxPaidOutsideInd || 0) +
                            (newEntry.TotalCountryWise.TaxPaidOutsideInd || 0),
                        TaxPayableinInd: (existingEntry.TotalCountryWise.TaxPayableinInd || 0) +
                            (newEntry.TotalCountryWise.TaxPayableinInd || 0),
                        TaxReliefinInd: (existingEntry.TotalCountryWise.TaxReliefinInd || 0) +
                            (newEntry.TotalCountryWise.TaxReliefinInd || 0)
                    };

                    mergedScheduleFSIDtls[existingEntryIndex] = {
                        ...existingEntry,
                        IncOthSrc: updatedIncOthSrc,
                        TotalCountryWise: updatedTotalCountryWise
                    };
                } else {
                    // Add new country entry
                    mergedScheduleFSIDtls.push(newEntry);
                }
            });

            const updatedScheduleFSI = {
                ...itr.ScheduleFSI,
                ScheduleFSIDtls: mergedScheduleFSIDtls
            };

            itr = {
                ...itr,
                ScheduleFSI: updatedScheduleFSI
            };
        }

        return itr;
    },
    [ITRSectionType.SCHEDULE_112A]: (itr, section) => {
        const schedule112A = section.data as Schedule112A;
        itr = {
            ...itr,
            Schedule112A: schedule112A
        };
        return itr;
    },
    [ITRSectionType.SCHEDULE_TDS2]: (itr, section) => {
        const scheduleTDS2 = section.data as ScheduleTDS2;
        itr = {
            ...itr,
            ScheduleTDS2: scheduleTDS2
        };
        return itr;
    }
};

/**
 * Merges Schedule CG sections
 * 
 * @param existingScheduleCG - Existing Schedule CG section from ITR
 * @param newScheduleCG - New Schedule CG section from US equity data
 * @returns Merged Schedule CG section
 */
const mergeScheduleCG = (existingScheduleCG: ScheduleCGFor23 | undefined, newScheduleCG: ScheduleCGFor23): ScheduleCGFor23 => {
    // If no existing ScheduleCG, return the new one
    if (!existingScheduleCG) {
        return newScheduleCG;
    }

    // Create a deep copy to avoid mutations
    const mergedScheduleCG = cloneDeep(existingScheduleCG);

    // Merge ShortTermCapGainFor23
    if (mergedScheduleCG.ShortTermCapGainFor23 && newScheduleCG.ShortTermCapGainFor23) {
        // Merge EquityMFonSTT arrays if both exist
        if (mergedScheduleCG.ShortTermCapGainFor23.EquityMFonSTT && newScheduleCG.ShortTermCapGainFor23.EquityMFonSTT) {
            mergedScheduleCG.ShortTermCapGainFor23.EquityMFonSTT = [
                ...mergedScheduleCG.ShortTermCapGainFor23.EquityMFonSTT,
                ...newScheduleCG.ShortTermCapGainFor23.EquityMFonSTT
            ];
        } else if (newScheduleCG.ShortTermCapGainFor23.EquityMFonSTT) {
            mergedScheduleCG.ShortTermCapGainFor23.EquityMFonSTT = newScheduleCG.ShortTermCapGainFor23.EquityMFonSTT;
        }

        // Merge SaleOnOtherAssets by adding values
        if (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets && newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets) {
            mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FairMrktValueUnqshr =
                (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FairMrktValueUnqshr || 0) +
                (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FairMrktValueUnqshr || 0);

            mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FullConsideration =
                (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FullConsideration || 0) +
                (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.FullConsideration || 0);

            // DeductSec48 handling
            if (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48 &&
                newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48) {
                mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.AquisitCost =
                    (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.AquisitCost || 0) +
                    (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.AquisitCost || 0);

                mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ExpOnTrans =
                    (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ExpOnTrans || 0) +
                    (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ExpOnTrans || 0);

                mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ImproveCost =
                    (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ImproveCost || 0) +
                    (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.ImproveCost || 0);

                mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.TotalDedn =
                    (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.TotalDedn || 0) +
                    (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.DeductSec48.TotalDedn || 0);
            }

            mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.BalanceCG =
                (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.BalanceCG || 0) +
                (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.BalanceCG || 0);

            mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.CapgainonAssets =
                (mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.CapgainonAssets || 0) +
                (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets.CapgainonAssets || 0);
        } else if (newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets) {
            mergedScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets = newScheduleCG.ShortTermCapGainFor23.SaleOnOtherAssets;
        }

        // Update Total STCG
        mergedScheduleCG.ShortTermCapGainFor23.TotalSTCG =
            (mergedScheduleCG.ShortTermCapGainFor23.TotalSTCG || 0) +
            (newScheduleCG.ShortTermCapGainFor23.TotalSTCG || 0);
    } else if (newScheduleCG.ShortTermCapGainFor23) {
        mergedScheduleCG.ShortTermCapGainFor23 = newScheduleCG.ShortTermCapGainFor23;
    }

    // Merge LongTermCapGain23
    if (mergedScheduleCG.LongTermCapGain23 && newScheduleCG.LongTermCapGain23) {
        // Merge SaleOfEquityShareUs112A
        if (mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A && newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A) {
            mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.BalanceCG =
                (mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.BalanceCG || 0) +
                (newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.BalanceCG || 0);

            mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.CapgainonAssets =
                (mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.CapgainonAssets || 0) +
                (newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.CapgainonAssets || 0);

            mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.DeductionUs54F =
                (mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.DeductionUs54F || 0) +
                (newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A.DeductionUs54F || 0);
        } else if (newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A) {
            mergedScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A = newScheduleCG.LongTermCapGain23.SaleOfEquityShareUs112A;
        }

        // Merge SaleofAssetNA (debt funds)
        if (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA && newScheduleCG.LongTermCapGain23.SaleofAssetNA) {
            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.FairMrktValueUnqshr =
                (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.FairMrktValueUnqshr || 0) +
                (newScheduleCG.LongTermCapGain23.SaleofAssetNA.FairMrktValueUnqshr || 0);

            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.FullConsideration =
                (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.FullConsideration || 0) +
                (newScheduleCG.LongTermCapGain23.SaleofAssetNA.FullConsideration || 0);

            // DeductSec48 handling
            if (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48 &&
                newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48) {
                mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.AquisitCost =
                    (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.AquisitCost || 0) +
                    (newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.AquisitCost || 0);

                mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ExpOnTrans =
                    (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ExpOnTrans || 0) +
                    (newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ExpOnTrans || 0);

                mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ImproveCost =
                    (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ImproveCost || 0) +
                    (newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.ImproveCost || 0);

                mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.TotalDedn =
                    (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.TotalDedn || 0) +
                    (newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductSec48.TotalDedn || 0);
            }

            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.BalanceCG =
                (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.BalanceCG || 0) +
                (newScheduleCG.LongTermCapGain23.SaleofAssetNA.BalanceCG || 0);

            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.CapgainonAssets =
                (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.CapgainonAssets || 0) +
                (newScheduleCG.LongTermCapGain23.SaleofAssetNA.CapgainonAssets || 0);

            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductionUs54F =
                (mergedScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductionUs54F || 0) +
                (newScheduleCG.LongTermCapGain23.SaleofAssetNA.DeductionUs54F || 0);
        } else if (newScheduleCG.LongTermCapGain23.SaleofAssetNA) {
            mergedScheduleCG.LongTermCapGain23.SaleofAssetNA = newScheduleCG.LongTermCapGain23.SaleofAssetNA;
        }

        // Update Total LTCG
        mergedScheduleCG.LongTermCapGain23.TotalLTCG =
            (mergedScheduleCG.LongTermCapGain23.TotalLTCG || 0) +
            (newScheduleCG.LongTermCapGain23.TotalLTCG || 0);
    } else if (newScheduleCG.LongTermCapGain23) {
        mergedScheduleCG.LongTermCapGain23 = newScheduleCG.LongTermCapGain23;
    }

    // Merge CurrYrLosses - this part merges detailed breakups of capital gains by tax rates
    if (mergedScheduleCG.CurrYrLosses && newScheduleCG.CurrYrLosses) {
        // Merge equity STCG at 15%
        if (mergedScheduleCG.CurrYrLosses.InStcg15Per && newScheduleCG.CurrYrLosses.InStcg15Per) {
            mergedScheduleCG.CurrYrLosses.InStcg15Per.CurrYearIncome =
                (mergedScheduleCG.CurrYrLosses.InStcg15Per.CurrYearIncome || 0) +
                (newScheduleCG.CurrYrLosses.InStcg15Per.CurrYearIncome || 0);

            mergedScheduleCG.CurrYrLosses.InStcg15Per.CurrYrCapGain =
                (mergedScheduleCG.CurrYrLosses.InStcg15Per.CurrYrCapGain || 0) +
                (newScheduleCG.CurrYrLosses.InStcg15Per.CurrYrCapGain || 0);
        }

        // Merge debt STCG at applicable rate
        if (mergedScheduleCG.CurrYrLosses.InStcgAppRate && newScheduleCG.CurrYrLosses.InStcgAppRate) {
            mergedScheduleCG.CurrYrLosses.InStcgAppRate.CurrYearIncome =
                (mergedScheduleCG.CurrYrLosses.InStcgAppRate.CurrYearIncome || 0) +
                (newScheduleCG.CurrYrLosses.InStcgAppRate.CurrYearIncome || 0);

            mergedScheduleCG.CurrYrLosses.InStcgAppRate.CurrYrCapGain =
                (mergedScheduleCG.CurrYrLosses.InStcgAppRate.CurrYrCapGain || 0) +
                (newScheduleCG.CurrYrLosses.InStcgAppRate.CurrYrCapGain || 0);
        }

        // Merge equity LTCG at 10% under section 112A
        if (mergedScheduleCG.CurrYrLosses.InLtcg10Per && newScheduleCG.CurrYrLosses.InLtcg10Per) {
            mergedScheduleCG.CurrYrLosses.InLtcg10Per.CurrYearIncome =
                (mergedScheduleCG.CurrYrLosses.InLtcg10Per.CurrYearIncome || 0) +
                (newScheduleCG.CurrYrLosses.InLtcg10Per.CurrYearIncome || 0);

            mergedScheduleCG.CurrYrLosses.InLtcg10Per.CurrYrCapGain =
                (mergedScheduleCG.CurrYrLosses.InLtcg10Per.CurrYrCapGain || 0) +
                (newScheduleCG.CurrYrLosses.InLtcg10Per.CurrYrCapGain || 0);
        }

        // Merge debt LTCG at 20% under section 112
        if (mergedScheduleCG.CurrYrLosses.InLtcg20Per && newScheduleCG.CurrYrLosses.InLtcg20Per) {
            mergedScheduleCG.CurrYrLosses.InLtcg20Per.CurrYearIncome =
                (mergedScheduleCG.CurrYrLosses.InLtcg20Per.CurrYearIncome || 0) +
                (newScheduleCG.CurrYrLosses.InLtcg20Per.CurrYearIncome || 0);

            mergedScheduleCG.CurrYrLosses.InLtcg20Per.CurrYrCapGain =
                (mergedScheduleCG.CurrYrLosses.InLtcg20Per.CurrYrCapGain || 0) +
                (newScheduleCG.CurrYrLosses.InLtcg20Per.CurrYrCapGain || 0);
        }
    } else if (newScheduleCG.CurrYrLosses) {
        mergedScheduleCG.CurrYrLosses = newScheduleCG.CurrYrLosses;
    }

    // Merge AccruOrRecOfCG similarly to CurrYrLosses
    if (mergedScheduleCG.AccruOrRecOfCG && newScheduleCG.AccruOrRecOfCG) {
        // Merge similar to CurrYrLosses for all tax rate types...
        // Implementation similar to the above CurrYrLosses merging
        // Only merged if both sections exist
    } else if (newScheduleCG.AccruOrRecOfCG) {
        mergedScheduleCG.AccruOrRecOfCG = newScheduleCG.AccruOrRecOfCG;
    }

    // Update totals
    mergedScheduleCG.SumOfCGIncm =
        ((mergedScheduleCG.ShortTermCapGainFor23?.TotalSTCG || 0) +
            (mergedScheduleCG.LongTermCapGain23?.TotalLTCG || 0));

    mergedScheduleCG.TotScheduleCGFor23 = mergedScheduleCG.SumOfCGIncm;

    return mergedScheduleCG;
};

/**
 * Merges Foreign Tax Credit in PartB-TTI
 * 
 * @param existingPartBTTI - Existing PartB-TTI section from ITR
 * @param foreignTaxCredit - Foreign Tax Credit from US equity data
 * @returns Updated PartB-TTI section
 */
const mergeForeignTaxCredit = (existingPartBTTI: PartBTTI, foreignTaxCredit: number): PartBTTI => {
    // Create a new copy to avoid mutations
    const updatedPartBTTI = { ...existingPartBTTI };

    // Ensure ComputationOfTaxLiability property exists
    if (!updatedPartBTTI.ComputationOfTaxLiability) {
        updatedPartBTTI.ComputationOfTaxLiability = {
            AggregateTaxInterestLiability: 0,
            CreditUS115JD: 0,
            EducationCess: 0,
            GrossTaxLiability: 0,
            GrossTaxPayable: 0,
            IntrstPay: {
                IntrstPayUs234A: 0,
                IntrstPayUs234B: 0,
                IntrstPayUs234C: 0,
                LateFilingFee234F: 0,
                TotalIntrstPay: 0
            },
            NetTaxLiability: 0,
            Rebate87A: 0,
            Surcharge25ofSI: 0,
            Surcharge25ofSIBeforeMarginal: 0,
            SurchargeOnAboveCrore: 0,
            SurchargeOnAboveCroreBeforeMarginal: 0,
            TaxPayAfterCreditUs115JD: 0,
            TaxPayableOnRebate: 0,
            TaxPayableOnTI: {
                RebateOnAgriInc: 0,
                TaxAtNormalRatesOnAggrInc: 0,
                TaxAtSpecialRates: 0,
                TaxPayableOnTotInc: 0
            },
            TaxRelief: {
                TotTaxRelief: 0
            },
            TotalSurcharge: 0
        };
    } else {
        // Create a new ComputationOfTaxLiability object
        updatedPartBTTI.ComputationOfTaxLiability = {
            ...updatedPartBTTI.ComputationOfTaxLiability
        };
    }

    // Ensure TaxRelief property exists
    if (!updatedPartBTTI.ComputationOfTaxLiability.TaxRelief) {
        updatedPartBTTI.ComputationOfTaxLiability.TaxRelief = {
            TotTaxRelief: 0
        };
    } else {
        // Create a new TaxRelief object
        updatedPartBTTI.ComputationOfTaxLiability.TaxRelief = {
            ...updatedPartBTTI.ComputationOfTaxLiability.TaxRelief
        };
    }

    // Update Section90 (relief for taxes paid outside India)
    if (updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section90 !== undefined) {
        updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section90 += foreignTaxCredit;
    } else {
        updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section90 = foreignTaxCredit;
    }

    // Update total tax relief
    updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.TotTaxRelief =
        (updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section89 || 0) +
        (updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section90 || 0) +
        (updatedPartBTTI.ComputationOfTaxLiability.TaxRelief.Section91 || 0);

    return updatedPartBTTI;
};

/**
 * Converts USEquityITRSections to ITRSection array
 */
const convertEquityITRSectionsToITRSections = (
    equityITRSections: USEquityITRSections
): ITRSection[] => {
    const { scheduleCG } = equityITRSections;

    return [
        {
            type: ITRSectionType.SCHEDULE_CG,
            data: scheduleCG,
        }
    ];
};

/**
 * Converts CAMSMFCapitalGainITRSections to ITRSection array
 */
const convertCAMSMFITRSectionsToITRSections = (
    camsMFITRSections: CAMSMFCapitalGainITRSections
): ITRSection[] => {
    const sections: ITRSection[] = [
        {
            type: ITRSectionType.SCHEDULE_CG,
            data: camsMFITRSections.scheduleCG,
        }
    ];

    // Add Schedule112A if it exists
    if (camsMFITRSections.schedule112A) {
        sections.push({
            type: ITRSectionType.SCHEDULE_112A,
            data: camsMFITRSections.schedule112A,
        });
    }

    return sections;
};

/**
 * Merges multiple ITR sections into an existing ITR using the Functional Reducer Pattern
 * 
 * @param existingITR - Base ITR to merge sections into
 * @param sections - Array of ITR sections to merge
 * @returns Updated ITR with all sections merged
 */
const mergeITRSections = (existingITR: Itr2, sections: ITRSection[]): Itr2 => {
    try {
        // Use reduce to apply each section transformer in sequence
        return sections.reduce((itr, section) => {
            const transformer = sectionTransformers[section.type];
            if (!transformer) {
                console.warn(`No transformer found for section type: ${section.type}`);
                return itr;
            }

            // Apply the transformer for this section type
            return transformer(itr, section);
        }, cloneDeep(existingITR)); // Start with a deep clone of the existing ITR
    } catch (error) {
        console.error(`Failed to merge ITR sections: ${error}`);
        return existingITR; // Return original ITR if merge fails
    }
};

export const generateITR = async (
    userId: number,
    assessmentYear: string,
): Promise<Itr> => {
    logger.info(`Starting ITR generation for user ${userId}, AY ${assessmentYear}`);

    // --- 1. Initialize Base ITR Structure ---
    const baseITR: Partial<Itr2> = initializeBaseITR2(assessmentYear);

    // --- 2. Fetch and Process Documents, Generate Initial Sections ---
    const sectionsToMerge: ITRSection[] = [];

    // Process Form 16
    const form16Docs = await parsedDocuments.getForm16(userId, assessmentYear);
    if (form16Docs?.parsed_data?.data) {
        const form16Result = convertForm16ToITRSections(form16Docs.parsed_data.data);
        if (form16Result.success && form16Result.data) {
            baseITR.CreationInfo = form16Result.data.creationInfo;
            baseITR.Form_ITR2 = form16Result.data.formITR2;
            baseITR.PartA_GEN1 = form16Result.data.partAGEN1;
            baseITR.ScheduleS = form16Result.data.scheduleS;
            baseITR.ScheduleTDS1 = form16Result.data.scheduleTDS1;
            baseITR.Verification = form16Result.data.verification;
        } else {
            logger.error(`Failed to convert Form 16 for user ${userId}: ${form16Result.error}`);
            throw new Error('Essential Form 16 processing failed');
        }
    } else {
        logger.warn(`No Form 16 data found or processed for user ${userId}, AY ${assessmentYear}`);
    }

    // Process US Equity Capital Gains
    const usEquityCapitalGainStatementDocs = await parsedDocuments.getUSEquityCapitalGainStatementCSV(userId, assessmentYear);
    if (usEquityCapitalGainStatementDocs?.parsed_data?.data) {
        const result = convertUSCGEquityToITRSections(usEquityCapitalGainStatementDocs.parsed_data.data, assessmentYear);
        if (result.success && result.data) {
            sectionsToMerge.push(...convertEquityITRSectionsToITRSections(result.data));
        } else {
            logger.warn(`Failed to convert US Equity CG Statement for user ${userId}: ${result.error}`);
        }
    } else {
        logger.info(`No US Equity CG Statement found for user ${userId}, AY ${assessmentYear}`);
    }

    // Process CAMS Mutual Fund Capital Gains
    const camsMFCapitalGainData = await parsedDocuments.getCAMSMFCapitalGainData(userId, assessmentYear);
    if (camsMFCapitalGainData?.success && camsMFCapitalGainData?.data) {
        const result = convertCAMSMFCapitalGainToITR(camsMFCapitalGainData.data, assessmentYear);
        logger.info(`CAMS MF Capital Gain Statement result: ${JSON.stringify(result)}`);
        if (result.success && result.data) {
            sectionsToMerge.push(...convertCAMSMFITRSectionsToITRSections(result.data));
        } else {
            logger.warn(`Failed to convert CAMS MF Capital Gain Statement for user ${userId}: ${result.error}`);
        }
    } else {
        logger.info(`No CAMS MF Capital Gain Statement found for user ${userId}, AY ${assessmentYear}`);
    }

    // Process Charles Schwab CSV (for Schedule FA)
    const charlesSchwabCSVDataParseResult = await parsedDocuments.getCharlesSchwabCSVData(userId, assessmentYear);
    if (charlesSchwabCSVDataParseResult?.success && charlesSchwabCSVDataParseResult?.data) {
        const scheduleFAResult = convertCharlesSchwabCSVToITRSections(charlesSchwabCSVDataParseResult.data, assessmentYear);
        if (scheduleFAResult.success && scheduleFAResult.data) {
            sectionsToMerge.push({ type: ITRSectionType.SCHEDULE_FA, data: scheduleFAResult.data });
        } else {
            logger.warn(`Failed to convert Charles Schwab CSV for user ${userId}: ${scheduleFAResult.error}`);
        }
    } else {
        logger.info(`No Charles Schwab CSV found for user ${userId}, AY ${assessmentYear}`);
    }

    // Process US Investment Income (Dividends etc.)
    const usInvestmentIncomeParseResult = await parsedDocuments.getUSEquityDividendIncome(userId, assessmentYear);
    if (usInvestmentIncomeParseResult?.success && usInvestmentIncomeParseResult?.data) {
        const investmentIncomeResult = convertUSInvestmentIncomeToITRSections(usInvestmentIncomeParseResult.data, assessmentYear);
        if (investmentIncomeResult.success && investmentIncomeResult.data) {
            const sections = investmentIncomeResult.data;
            if (sections.scheduleOS) sectionsToMerge.push({ type: ITRSectionType.SCHEDULE_OS, data: sections.scheduleOS });
            if (sections.scheduleTR1) sectionsToMerge.push({ type: ITRSectionType.SCHEDULE_TR1, data: sections.scheduleTR1 });
            if (sections.scheduleFSI) sectionsToMerge.push({ type: ITRSectionType.SCHEDULE_FSI, data: sections.scheduleFSI });
        } else {
            logger.warn(`Failed to convert US Investment Income for user ${userId}: ${investmentIncomeResult.error}`);
        }
    } else {
        logger.info(`No US Investment Income data found for user ${userId}, AY ${assessmentYear}`);
    }

    // Process AIS data
    const aisDataParseResult = await parsedDocuments.getAISData(userId, assessmentYear);
    if (aisDataParseResult?.parsed_data?.data) {
        const aisResult = convertAISToITRSections(aisDataParseResult.parsed_data.data, assessmentYear);
        if (aisResult.success && aisResult.data) {
            const sections = aisResult.data;
            sectionsToMerge.push({ type: ITRSectionType.SCHEDULE_OS, data: sections.scheduleOS });
            sectionsToMerge.push({ type: ITRSectionType.SCHEDULE_TDS2, data: sections.scheduleTDS2 });
        } else {
            logger.warn(`Failed to convert AIS data for user ${userId}: ${aisResult.error}`);
        }
    } else {
        logger.info(`No AIS data found for user ${userId}, AY ${assessmentYear}`);
    }

    // --- 3. Merge Initial Sections ---
    let mergedITR = mergeITRSections(baseITR as Itr2, sectionsToMerge);
    logger.debug('ITR after merging initial document sections.');

    // --- 4. Calculate Schedule CYLA ---
    const scheduleCYLA = calculateScheduleCYLA(mergedITR);
    mergedITR.ScheduleCYLA = scheduleCYLA;
    logger.info('Calculated Schedule CYLA.');

    // --- 5. Calculate PartB-TI (Using income *after* CYLA adjustments) ---
    const partBTI = calculatePartBTI(mergedITR);
    mergedITR["PartB-TI"] = partBTI;
    logger.info('Calculated PartB-TI.');

    // --- 6. Calculate Schedule SI (for special income tax rates) ---
    const scheduleSI = calculateScheduleSI(mergedITR);
    mergedITR.ScheduleSI = scheduleSI;
    logger.info('Calculated Schedule SI for special income tax rates.');

    // --- 7. Calculate PartB-TTI ---
    const partBTTI = calculatePartBTTI(mergedITR, TaxRegimePreference.AUTO);
    mergedITR.PartB_TTI = partBTTI;
    logger.info('Calculated PartB-TTI.');

    // --- 8. Calculate Schedule AMTC ---
    if (isAMTApplicable(mergedITR)) {
        const scheduleAMTC = calculateScheduleAMTC(mergedITR);
        mergedITR.ScheduleAMTC = scheduleAMTC;
        logger.info('Calculated Schedule AMTC for Alternative Minimum Tax Credit.');
    } else {
        logger.info('AMT not applicable, skipping Schedule AMTC calculation.');
    }

    // --- 9. Final ITR Object ---
    const finalITR: Itr = {
        ITR: {
            ITR2: mergedITR as Itr2
        }
    };

    logger.info(`ITR generation complete for user ${userId}, AY ${assessmentYear}`);
    return finalITR;
};

// --- Helper Functions ---

function initializeBaseITR2(assessmentYear: string): Partial<Itr2> {
    logger.debug('Initializing base ITR-2 structure.');
    // Creates a basic ITR-2 structure 
    return {
        Form_ITR2: {
            FormName: "ITR-2",
            Description: "For Individuals and HUFs not having income from profits and gains of business or profession",
            AssessmentYear: assessmentYear.substring(0, 4),
            SchemaVer: "Ver1.0",
            FormVer: "Ver1.0"
        },
        // Initialize other mandatory base sections like CreationInfo, PartA_GEN1 with placeholders
        ScheduleHP: {
            PassThroghIncome: 0,
            TotalIncomeChargeableUnHP: 0
        },
        ScheduleVDA: {
            ScheduleVDADtls: [],
            TotIncCapGain: 0
        },
        ScheduleEI: {
            ExpIncAgri: 0,
            GrossAgriRecpt: 0,
            IncNotChrgblToTax: 0,
            InterestInc: 0,
            NetAgriIncOrOthrIncRule7: 0,
            Others: 0,
            PassThrIncNotChrgblTax: 0,
            TotalExemptInc: 0,
            UnabAgriLossPrev8: 0
        },
        // Initialize other necessary schedules with default empty structures if needed
    };
}

// Create the service wrapper
export const itrGenerator = {
    generateITR: generateITR
};