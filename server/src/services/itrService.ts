import { Pool } from 'pg';
import pool from '../config/database';
import { parsedDocuments } from './parsedDocument';
import { convertForm16ToITR } from '../generators/itr/form16ToITR';
import { convertUSEquityToITR } from '../generators/itr/usEquityToITR';
import { Itr2, ScheduleCGFor23, CapGain } from '../types/itr';
import { USEquityITRSections } from '../generators/itr/processUSEquity';

export interface ITRData {
    // Define your ITR structure here
    assessmentYear: string;
    userId: number;
    // Add other ITR fields
}

/**
 * Merges Schedule CG sections
 * 
 * @param existingScheduleCG - Existing Schedule CG section from ITR
 * @param newScheduleCG - New Schedule CG section from US equity data
 * @returns Merged Schedule CG section
 */
const mergeScheduleCG = (existingScheduleCG: ScheduleCGFor23 | undefined, newScheduleCG: ScheduleCGFor23): ScheduleCGFor23 => {
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
    const mergedCapGain = JSON.parse(JSON.stringify(existingCapGain)) as CapGain;
    
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
 * Updates income totals in PartB-TI based on capital gains
 * 
 * @param existingPartBTI - Existing PartB-TI section from ITR
 * @param capitalGains - Capital Gains from US equity data
 * @returns Updated PartB-TI section
 */
const updateIncomeTotals = (existingPartBTI: any, capitalGains: CapGain): any => {
    // Create a deep copy to avoid mutations
    const updatedPartBTI = JSON.parse(JSON.stringify(existingPartBTI));
    
    // Update GrossTotalIncome and TotalIncome
    const totalCapitalGains = capitalGains.TotalCapGains;
    
    if (updatedPartBTI.GrossTotalIncome !== undefined) {
        updatedPartBTI.GrossTotalIncome += totalCapitalGains;
    } else {
        updatedPartBTI.GrossTotalIncome = totalCapitalGains;
    }
    
    if (updatedPartBTI.TotalIncome !== undefined) {
        updatedPartBTI.TotalIncome += totalCapitalGains;
    } else {
        updatedPartBTI.TotalIncome = totalCapitalGains;
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
const mergeForeignTaxCredit = (existingPartBTTI: any, foreignTaxCredit: number): any => {
    // Create a deep copy to avoid mutations
    const updatedPartBTTI = JSON.parse(JSON.stringify(existingPartBTTI));
    
    // Use type assertion to add TaxRelief property
    const partBTTI = updatedPartBTTI as any;
    
    // Ensure TaxRelief property exists
    if (!partBTTI.TaxRelief) {
        partBTTI.TaxRelief = {
            TotTaxRelief: 0
        };
    }
    
    // Update Section90 (relief for taxes paid outside India)
    if (partBTTI.TaxRelief.Section90 !== undefined) {
        partBTTI.TaxRelief.Section90 += foreignTaxCredit;
    } else {
        partBTTI.TaxRelief.Section90 = foreignTaxCredit;
    }
    
    // Update total tax relief
    partBTTI.TaxRelief.TotTaxRelief = 
        (partBTTI.TaxRelief.Section89 || 0) + 
        (partBTTI.TaxRelief.Section90 || 0) + 
        (partBTTI.TaxRelief.Section91 || 0);
    
    return updatedPartBTTI;
};

/**
 * Merges US equity data sections into an existing ITR
 * 
 * @param existingITR - Existing ITR object from Form 16
 * @param equityITRSections - Pre-processed ITR sections from US equity data
 * @returns Updated ITR with US equity data integrated
 */
const mergeUSEquityDataIntoITR = (existingITR: Itr2, equityITRSections: USEquityITRSections): Itr2 => {
    try {
        const { scheduleCG, partBTICapitalGains, partBTTIForeignTaxCredit } = equityITRSections;
        // Create a deep copy of the ITR to avoid mutations
        const updatedITR = JSON.parse(JSON.stringify(existingITR)) as Itr2;
        
        // 1. Merge Schedule CG
        updatedITR.ScheduleCGFor23 = mergeScheduleCG(updatedITR.ScheduleCGFor23, scheduleCG);
        
        // 2. Merge Capital Gains in PartB-TI
        if (updatedITR['PartB-TI']) {
            // Merge Capital Gains
            updatedITR['PartB-TI'].CapGain = mergeCapitalGains(updatedITR['PartB-TI'].CapGain, partBTICapitalGains);
            
            // Update income totals
            updatedITR['PartB-TI'] = updateIncomeTotals(updatedITR['PartB-TI'], partBTICapitalGains);
        }
        
        // 3. Merge Foreign Tax Credit in PartB-TTI
        if (updatedITR.PartB_TTI) {
            updatedITR.PartB_TTI = mergeForeignTaxCredit(updatedITR.PartB_TTI, partBTTIForeignTaxCredit);
        }
        
        return updatedITR;
    } catch (error) {
        console.error(`Failed to merge US equity data: ${error}`);
        return existingITR; // Return original ITR if merge fails
    }
};

export const generateITR = () => async (
    userId: number,
    assessmentYear: string
): Promise<ITRData> => {
    // 1. Get Form 16 data
    const form16Docs = await parsedDocuments.getForm16(userId, assessmentYear);
    // console.log(form16Docs?.parsed_data.data);

    // 2. Get USEquityCapitalGainStatement data
    const usEquityCapitalGainStatementDocs = await parsedDocuments.getUSEquityCapitalGainStatement(userId, assessmentYear);
    console.log(usEquityCapitalGainStatementDocs?.parsed_data.data);

    // 3. Compute ITR from Form 16 data
    const itrData = convertForm16ToITR(form16Docs?.parsed_data.data);
    
    // 4. If US equity data exists, merge it into the ITR
    if (usEquityCapitalGainStatementDocs?.parsed_data.data && itrData.success && itrData.data) {
        const usEquityData = usEquityCapitalGainStatementDocs.parsed_data.data;
        
        // Generate ITR sections from US equity data
        const result = convertUSEquityToITR(usEquityData);
        if (result.success && result.data) {
        
            // const { scheduleCG, capitalGains, foreignTaxCredit } = result.data;
            // Merge US equity data into the ITR
            const mergedITR = mergeUSEquityDataIntoITR(itrData.data, result.data);
            
            return {
                    assessmentYear,
                    userId,
                    ...mergedITR
                };
            
        } else {
            console.error(`Failed to generate ITR sections: ${result.error}`);
        }
    }
    
    // Return the ITR data from Form 16 if US equity data couldn't be merged
    return {
        assessmentYear,
        userId,
        ...(itrData.success ? itrData.data : {})
    };
};


// Create the service wrapper
export const itrService = {
    // getForm16Data: getForm16Data(pool),
    generateITR: generateITR()
};