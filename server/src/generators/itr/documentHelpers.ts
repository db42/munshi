import { parsedDocuments } from '../../services/parsedDocument';
import { convertForm16ToITR as convertForm16ToITRSections } from '../../document-processors/form16ToITR';
import { form26ASToITR, Form26ASITRSections } from '../../document-processors/form26ASToITR';
import { ScheduleCGFor23, ScheduleFA, ScheduleOS, ScheduleTR1, ScheduleFSI, Schedule112A } from '../../types/itr';
import { convertCharlesSchwabCSVToITR as convertCharlesSchwabCSVToITRSections } from '../../document-processors/charlesSchwabToITR';
import { convertUSCGEquityToITR as convertUSCGEquityToITRSections } from '../../document-processors/usCGEquityToITR';
import { convertUSInvestmentIncomeToITRSections } from '../../document-processors/usInvestmentIncomeToITR';
import { convertAISToITRSections } from '../../document-processors/aisToITR';
import { convertCAMSMFCapitalGainToITR } from '../../document-processors/camsMFCapitalGainToITR';
import { convertUserInputToITRSections } from '../../document-processors/userInputToITR';
import { userInput } from '../../services/userInput';
import { getLogger, ILogger } from '../../utils/logger';

// Create a named logger instance for this module
const logger: ILogger = getLogger('documentHelpers');

// === DOCUMENT FETCHING & PROCESSING HELPERS ===

export async function getForm16Sections(userId: number, assessmentYear: string): Promise<any> {
    const form16Docs = await parsedDocuments.getForm16(userId, assessmentYear);
    if (form16Docs?.parsed_data?.data) {
        const form16Result = convertForm16ToITRSections(form16Docs.parsed_data.data);
        if (form16Result.success && form16Result.data) {
            logger.info('Form 16 data processed successfully');
            return form16Result.data;
        } else {
            logger.error(`Failed to convert Form 16 for user ${userId}: ${form16Result.error}`);
            throw new Error('Essential Form 16 processing failed');
        }
    } else {
        logger.warn(`No Form 16 data found for user ${userId}, AY ${assessmentYear}`);
        return undefined;
    }
}

export async function getForm26ASSections(userId: number, assessmentYear: string): Promise<Form26ASITRSections | undefined> {
    const form26ASDocs = await parsedDocuments.getForm26ASData(userId, assessmentYear);
    if (form26ASDocs?.parsed_data?.data) {
        const form26ASResult = form26ASToITR(form26ASDocs.parsed_data.data, assessmentYear);
        if (form26ASResult.success && form26ASResult.data) {
            logger.info('Form 26AS data processed successfully');
            return form26ASResult.data;
        } else {
            logger.warn(`Failed to convert Form 26AS for user ${userId}: ${form26ASResult.error}`);
            return undefined;
        }
    } else {
        logger.info(`No Form 26AS data found for user ${userId}, AY ${assessmentYear}`);
        return undefined;
    }
}

export async function getAISSections(userId: number, assessmentYear: string): Promise<any> {
    const aisDataParseResult = await parsedDocuments.getAISData(userId, assessmentYear);
    if (aisDataParseResult?.parsed_data?.data) {
        const aisResult = convertAISToITRSections(aisDataParseResult.parsed_data.data, assessmentYear);
        if (aisResult.success && aisResult.data) {
            logger.info('AIS data processed successfully');
            return aisResult.data;
        } else {
            logger.warn(`Failed to convert AIS data for user ${userId}: ${aisResult.error}`);
            return undefined;
        }
    } else {
        logger.info(`No AIS data found for user ${userId}, AY ${assessmentYear}`);
        return undefined;
    }
}

export async function getUserInputSections(userId: number, assessmentYear: string): Promise<{ sections: any; rawData: any }> {
    const userInputRecord = await userInput.get(userId.toString(), assessmentYear);
    const userInputData = userInputRecord?.input_data;
    if (userInputData) {
        const userInputSectionsResult = convertUserInputToITRSections(userInputData, assessmentYear);
        if (userInputSectionsResult.success && userInputSectionsResult.data) {
            logger.info('User input data processed successfully');
            return {
                sections: userInputSectionsResult.data,
                rawData: userInputData
            };
        } else {
            logger.warn(`Failed to convert user input data for user ${userId}: ${userInputSectionsResult.error}`);
            return { sections: undefined, rawData: userInputData };
        }
    } else {
        logger.info(`No user input data found for user ${userId}, AY ${assessmentYear}`);
        return { sections: undefined, rawData: undefined };
    }
}

// === OTHER DOCUMENT TYPE HELPERS ===

export async function getUSEquityCapitalGainSections(userId: number, assessmentYear: string): Promise<{ scheduleCG?: ScheduleCGFor23 }> {
    const usEquityCapitalGainStatementDocs = await parsedDocuments.getUSEquityCapitalGainStatementCSV(userId, assessmentYear);
    if (usEquityCapitalGainStatementDocs?.parsed_data?.data) {
        const result = convertUSCGEquityToITRSections(usEquityCapitalGainStatementDocs.parsed_data.data, assessmentYear);
        if (result.success && result.data) {
            logger.info('US Equity Capital Gains processed successfully');
            return { scheduleCG: result.data.scheduleCG };
        } else {
            logger.warn(`Failed to convert US Equity CG Statement for user ${userId}: ${result.error}`);
        }
    } else {
        logger.info(`No US Equity CG Statement found for user ${userId}, AY ${assessmentYear}`);
    }
    return {};
}

export async function getCAMSMFCapitalGainSections(userId: number, assessmentYear: string): Promise<{ scheduleCG?: ScheduleCGFor23; schedule112A?: Schedule112A }> {
    const camsMFCapitalGainData = await parsedDocuments.getCAMSMFCapitalGainData(userId, assessmentYear);
    if (camsMFCapitalGainData?.success && camsMFCapitalGainData?.data) {
        const result = convertCAMSMFCapitalGainToITR(camsMFCapitalGainData.data, assessmentYear);
        if (result.success && result.data) {
            logger.info('CAMS MF Capital Gains processed successfully');
            return { 
                scheduleCG: result.data.scheduleCG,
                schedule112A: result.data.schedule112A 
            };
        } else {
            logger.warn(`Failed to convert CAMS MF Capital Gain Statement for user ${userId}: ${result.error}`);
        }
    } else {
        logger.info(`No CAMS MF Capital Gain Statement found for user ${userId}, AY ${assessmentYear}`);
    }
    return {};
}

export async function getCharlesSchwabSections(userId: number, assessmentYear: string): Promise<{ scheduleFA?: ScheduleFA }> {
    const charlesSchwabCSVDataParseResult = await parsedDocuments.getCharlesSchwabCSVData(userId, assessmentYear);
    if (charlesSchwabCSVDataParseResult?.success && charlesSchwabCSVDataParseResult?.data) {
        const scheduleFAResult = convertCharlesSchwabCSVToITRSections(charlesSchwabCSVDataParseResult.data, assessmentYear);
        if (scheduleFAResult.success && scheduleFAResult.data) {
            logger.info('Charles Schwab CSV processed successfully');
            return { scheduleFA: scheduleFAResult.data };
        } else {
            logger.warn(`Failed to convert Charles Schwab CSV for user ${userId}: ${scheduleFAResult.error}`);
        }
    } else {
        logger.info(`No Charles Schwab CSV found for user ${userId}, AY ${assessmentYear}`);
    }
    return {};
}

export async function getUSInvestmentIncomeSections(userId: number, assessmentYear: string): Promise<{ scheduleOS?: Partial<ScheduleOS>; scheduleTR1?: Partial<ScheduleTR1>; scheduleFSI?: Partial<ScheduleFSI> }> {
    const usInvestmentIncomeParseResult = await parsedDocuments.getUSEquityDividendIncome(userId, assessmentYear);
    if (usInvestmentIncomeParseResult?.success && usInvestmentIncomeParseResult?.data) {
        const investmentIncomeResult = convertUSInvestmentIncomeToITRSections(usInvestmentIncomeParseResult.data, assessmentYear);
        if (investmentIncomeResult.success && investmentIncomeResult.data) {
            const sections = investmentIncomeResult.data;
            logger.info('US Investment Income processed successfully');
            return {
                scheduleOS: sections.scheduleOS,
                scheduleTR1: sections.scheduleTR1,
                scheduleFSI: sections.scheduleFSI
            };
        } else {
            logger.warn(`Failed to convert US Investment Income for user ${userId}: ${investmentIncomeResult.error}`);
        }
    } else {
        logger.info(`No US Investment Income data found for user ${userId}, AY ${assessmentYear}`);
    }
    return {};
} 