import { Form16 } from '../types/form16';
import { CreationInfo, FormITR2, PartAGEN1, ScheduleS, Verification, ScheduleTDS1 } from '../types/itr';
import { processCreationInfo } from './creationInfo';
import { processFormITR2 } from './formITR2';
import { processPartAGEN1 } from './partAGEN1';
import { processScheduleS } from './scheduleS';
import { processScheduleTDS1 } from './scheduleTDS1';
import { initializeVerification } from './initializers';
import { ParseResult } from '../utils/parserTypes';

/**
 * Interface for ITR sections generated from Form 16 data
 */
export interface Form16ITRSections {
  creationInfo: CreationInfo;
  formITR2: FormITR2;
  partAGEN1: PartAGEN1;
  scheduleS: ScheduleS;
  scheduleTDS1: ScheduleTDS1;
  verification: Verification;
}

/**
 * Converts Form 16 data to relevant ITR sections
 * 
 * This function processes Form 16 data and creates necessary ITR sections:
 * - CreationInfo: Basic metadata about the ITR generation
 * - FormITR2: Form details including assessment year
 * - PartAGEN1: General information including filing status and personal info
 * - ScheduleS: Salary income details from Form 16
 * - ScheduleTDS1: Tax Deduction Schedule 1 details from Form 16
 * - Verification: Required verification section
 * 
 * Note: PartB_TI and PartB_TTI are no longer generated here.
 * They are calculated centrally after all sections are merged.
 * 
 * @param form16 - Form 16 data from employer
 * @returns Parsed ITR sections from Form 16
 */
export const convertForm16ToITR = (form16: Form16): ParseResult<Form16ITRSections> => {
    try {
        const sections: Form16ITRSections = {
            creationInfo: processCreationInfo(form16),
            formITR2: processFormITR2(form16),
            partAGEN1: processPartAGEN1(form16),
            scheduleS: processScheduleS(form16),
            scheduleTDS1: processScheduleTDS1(form16),
            verification: initializeVerification()
        };

        return {
            success: true,
            data: sections
        };
    } catch (error) {
        return {
            success: false,
            error: `Failed to generate ITR from Form 16: ${error}`
        };
    }
};