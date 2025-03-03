import { Form16 } from '../../types/form16';
import { Itr2 } from '../../types/itr';
import { ConversionResult } from './types';
import { processCreationInfo } from './creationInfo';
import { processFormITR2 } from './formITR2';
import { processPartAGEN1 } from './partAGEN1';
import { processScheduleS } from './scheduleS';
import { processPartBTI } from './partBTI';
import { processPartBTTI } from './partBTTI';
import { 
    // initializeScheduleBFLA, 
    // initializeScheduleCYLA, 
    initializeVerification 
} from './initializers';

export const convertForm16ToITR = (form16: Form16): ConversionResult<Itr2> => {
    try {
        const itr: Itr2 = {
            CreationInfo: processCreationInfo(form16),
            Form_ITR2: processFormITR2(form16),
            PartA_GEN1: processPartAGEN1(form16),
            ScheduleS: processScheduleS(form16),
            PartB_TI: processPartBTI(form16),
            PartB_TTI: processPartBTTI(form16),
            //todo mark it as compulsory
            // ScheduleBFLA: initializeScheduleBFLA(),
            // ScheduleCYLA: initializeScheduleCYLA(),
            Verification: initializeVerification()
        };

        return {
            success: true,
            data: itr
        };
    } catch (error) {
        return {
            success: false,
            error: `Failed to generate ITR: ${error}`
        };
    }
};