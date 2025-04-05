import { parsedDocuments } from '../../services/parsedDocument';
import { convertForm16ToITR, Form16ITRSections } from '../../document-processors/form16ToITR';
import { Itr2, ScheduleCGFor23, CapGain, ScheduleFA, DateRangeType, ScheduleOS, ScheduleTR1, ScheduleFSI, AssetOutIndiaFlag, CountryCodeExcludingIndia, ReliefClaimedUsSection, ScheduleFSIDtls, IncFromOS, PartBTI, PartBTTI } from '../../types/itr';
import { convertCharlesSchwabCSVToITR as convertCharlesSchwabCSVToITRSections } from '../../document-processors/charlesSchwabToITR';
import { convertUSCGEquityToITR as convertUSCGEquityToITRSections, USEquityITRSections } from '../../document-processors/usCGEquityToITR';
import { convertUSInvestmentIncomeToITRSections, USInvestmentIncomeITRSections } from '../../document-processors/usInvestmentIncomeToITR';
import { ParseResult } from '../../utils/parserTypes';
import cloneDeep from 'lodash/cloneDeep';
import { logger } from '../../utils/logger';
import { calculatePartBTTI, TaxRegimePreference } from './partBTTI';
import { calculatePartBTI } from './partBTI';

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
    SCHEDULE_FSI = 'ScheduleFSI'
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
    
    // For now, we're simply replacing the existing Schedule CG with the new one
    // This can be enhanced to perform a more sophisticated merge if needed
    return newScheduleCG;
};

/**
 * Merges Capital Gains sections
 * 
 * @param existingCapGain - Existing Capital Gains section from ITR
 * @param newCapGain - New Capital Gains section from US equity data
 * @returns Merged Capital Gains section
 */
const mergeCapitalGains = (existingCapGain: CapGain | undefined, newCapGain: CapGain): CapGain => {
    // If no existing CapGain, return the new one
    if (!existingCapGain) {
        return newCapGain;
    }
    
    // Create a deep copy to avoid mutations
    const mergedCapGain = cloneDeep(existingCapGain);
    
    // Merge ShortTerm
    if (mergedCapGain.ShortTerm) {
        mergedCapGain.ShortTerm.ShortTerm15Per = 
            (mergedCapGain.ShortTerm.ShortTerm15Per || 0) + newCapGain.ShortTerm.ShortTerm15Per;
        mergedCapGain.ShortTerm.TotalShortTerm = 
            (mergedCapGain.ShortTerm.TotalShortTerm || 0) + newCapGain.ShortTerm.TotalShortTerm;
    } else {
        mergedCapGain.ShortTerm = newCapGain.ShortTerm;
    }
    
    // Merge LongTerm
    if (mergedCapGain.LongTerm) {
        mergedCapGain.LongTerm.LongTerm10Per = 
            (mergedCapGain.LongTerm.LongTerm10Per || 0) + newCapGain.LongTerm.LongTerm10Per;
        mergedCapGain.LongTerm.TotalLongTerm = 
            (mergedCapGain.LongTerm.TotalLongTerm || 0) + newCapGain.LongTerm.TotalLongTerm;
    } else {
        mergedCapGain.LongTerm = newCapGain.LongTerm;
    }
    
    // Update totals
    mergedCapGain.ShortTermLongTermTotal = 
        (mergedCapGain.ShortTermLongTermTotal || 0) + newCapGain.ShortTermLongTermTotal;
    mergedCapGain.TotalCapGains = 
        (mergedCapGain.TotalCapGains || 0) + newCapGain.TotalCapGains;
    
    return mergedCapGain;
};

/**
 * Updates income totals in PartB-TI based on the updated capital gains
 * 
 * @param partBTI - Existing PartB-TI section from ITR
 * @param capGain - Updated Capital Gains section
 * @returns Updated PartB-TI section with recalculated totals
 */
const updateIncomeTotals = (partBTI: PartBTI, capGain: CapGain): PartBTI => {
    // Create a new copy to avoid mutations
    const updatedPartBTI = {...partBTI};
    
    // Update GrossTotalIncome if it exists
    if (updatedPartBTI.GrossTotalIncome !== undefined) {
        // Calculate the difference in capital gains
        const originalCapGainTotal = (partBTI.CapGain && partBTI.CapGain.TotalCapGains) || 0;
        const newCapGainTotal = capGain.TotalCapGains || 0;
        const difference = newCapGainTotal - originalCapGainTotal;
        
        // Add the difference to GrossTotalIncome
        updatedPartBTI.GrossTotalIncome += difference;
    }
    
    // Update TotalIncome if it exists
    if (updatedPartBTI.TotalIncome !== undefined) {
        // Calculate the difference in capital gains
        const originalCapGainTotal = (partBTI.CapGain && partBTI.CapGain.TotalCapGains) || 0;
        const newCapGainTotal = capGain.TotalCapGains || 0;
        const difference = newCapGainTotal - originalCapGainTotal;
        
        // Add the difference to TotalIncome
        updatedPartBTI.TotalIncome += difference;
    }
    
    return updatedPartBTI;
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
    const updatedPartBTTI = {...existingPartBTTI};
    
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

export const generateITR = () => async (
    userId: number,
    assessmentYear: string
): Promise<ITRData> => {
    // Collect all sections to merge
    const sectionsToMerge: ITRSection[] = [];

    // Generate ITR from Form 16 data
    const form16Docs = await parsedDocuments.getForm16(userId, assessmentYear);
    console.log(form16Docs?.parsed_data.data);
    const form16Result = convertForm16ToITR(form16Docs?.parsed_data.data);

    // Initialize the base ITR
    let baseITR: Partial<Itr2> = {
        CreationInfo: {} as any,
        Form_ITR2: {} as any,
        PartA_GEN1: {} as any,
        ScheduleS: {} as any,
        Verification: {} as any
    };

    // Set the base ITR sections from Form 16 data
    if (form16Result.success && form16Result.data) {
        const form16Sections = form16Result.data;
        baseITR = {
            ...baseITR,
            CreationInfo: form16Sections.creationInfo,
            Form_ITR2: form16Sections.formITR2,
            PartA_GEN1: form16Sections.partAGEN1,
            ScheduleS: form16Sections.scheduleS,
            ScheduleTDS1: form16Sections.scheduleTDS1,
            Verification: form16Sections.verification
        };
    } else {
        throw new Error('Form 16 data not found');
    }

    // Process USEquityCapitalGainStatement data
    const usEquityCapitalGainStatementDocs = await parsedDocuments.getUSEquityCapitalGainStatement(userId, assessmentYear);
    if (!usEquityCapitalGainStatementDocs?.parsed_data.data) {
        throw new Error('US CG Equity data not found');
    }
    console.log(usEquityCapitalGainStatementDocs?.parsed_data.data);
        
    const result = convertUSCGEquityToITRSections(usEquityCapitalGainStatementDocs.parsed_data.data, assessmentYear);
    if (result.success && result.data) {
        sectionsToMerge.push(...convertEquityITRSectionsToITRSections(result.data));
    }

    // Process Charles Schwab CSV data
    let scheduleFAResult: ParseResult<ScheduleFA> | undefined;
    const charlesSchwabCSVDataParseResult = await parsedDocuments.getCharlesSchwabCSVData(userId, assessmentYear);
    if (charlesSchwabCSVDataParseResult.success && charlesSchwabCSVDataParseResult.data) {
        scheduleFAResult = convertCharlesSchwabCSVToITRSections(charlesSchwabCSVDataParseResult.data, assessmentYear);
    }
    
    if (scheduleFAResult && scheduleFAResult.success && scheduleFAResult.data) {
        sectionsToMerge.push({
            type: ITRSectionType.SCHEDULE_FA,
            data: scheduleFAResult.data,
        });
    }

    // Get US equity dividend income
    const usInvestmentIncomeParseResult = await parsedDocuments.getUSEquityDividendIncome(userId, assessmentYear);
    if (usInvestmentIncomeParseResult.success && usInvestmentIncomeParseResult.data) {
        try {
            // Convert to ITR sections
            const investmentIncomeResult = convertUSInvestmentIncomeToITRSections(
                usInvestmentIncomeParseResult.data,
                assessmentYear
            );
            
            // Only process if conversion was successful
            if (investmentIncomeResult.success && investmentIncomeResult.data) {
                const sections = investmentIncomeResult.data;
                
                // Add the full sections for merging
                sectionsToMerge.push({
                    type: ITRSectionType.SCHEDULE_OS,
                    data: sections.scheduleOS
                });
                
                sectionsToMerge.push({
                    type: ITRSectionType.SCHEDULE_TR1,
                    data: sections.scheduleTR1
                });
                
                sectionsToMerge.push({
                    type: ITRSectionType.SCHEDULE_FSI,
                    data: sections.scheduleFSI
                });
                
                logger.info(`Successfully processed US investment income data for user ${userId}`);
            } else {
                logger.warn(`Failed to convert US investment income to ITR sections: ${investmentIncomeResult.error || 'Unknown error'}`);
            }
        } catch (error) {
            logger.error(`Error processing US investment income data: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    
    // Merge all sections at once using the functional reducer pattern
    const mergedITR = mergeITRSections(baseITR as Itr2, sectionsToMerge);

    // Calculate Part B-TI after merging all sections
    const partBTI = calculatePartBTI(mergedITR);
    
    // Update the ITR with the calculated PartB_TI
    let finalITR: Itr2 = {
        ...mergedITR,
        PartB_TI: partBTI
    };
    
    // Calculate Part B-TTI based on PartB_TI and other sections
    const partBTTI = calculatePartBTTI(finalITR, TaxRegimePreference.AUTO);
    
    // Update the ITR with the calculated PartB_TTI
    finalITR = {
        ...finalITR,
        PartB_TTI: partBTTI
    };

    return {
        assessmentYear,
        userId,
        ...finalITR
    };
};

// Create the service wrapper
export const itrGenerator = {
    // getForm16Data: getForm16Data(pool),
    generateITR: generateITR()
};