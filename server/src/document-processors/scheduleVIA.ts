import { Form16 } from '../types/form16';
import { ScheduleVIA, DeductUndChapVIA, USRDeductUndChapVIA } from '../types/itr';
import { Chapter6ADeductions } from '../types/userInput.types';

export const processScheduleVIAFromForm16 = (form16: Form16): ScheduleVIA => {
    const deductions = form16.salaryDetails.deductionsChapterVIA || {};

    const deductUndChapVIA: DeductUndChapVIA = {
        AnyOthSec80CCH: deductions.section80CCH || 0,
        Section80C: deductions.section80C || 0,
        Section80CCC: deductions.section80CCC || 0,
        Section80CCDEmployeeOrSE: deductions.section80CCD1 || 0,
        Section80CCD1B: deductions.section80CCD1B || 0,
        Section80CCDEmployer: deductions.section80CCD2 || 0,
        Section80D: deductions.section80D || 0,
        Section80DD: 0, // Not available in this Form 16 structure
        Section80DDB: 0, // Not available in this Form 16 structure
        Section80E: deductions.section80E || 0,
        Section80EE: 0, // Not available in this Form 16 structure
        Section80EEA: 0, // Not available in this Form 16 structure
        Section80EEB: 0, // Not available in this Form 16 structure
        Section80G: deductions.section80G || 0,
        Section80GG: 0, // Not available in this Form 16 structure
        Section80GGA: 0, // Not available in this Form 16 structure
        Section80GGC: 0, // Not available in this Form 16 structure
        Section80QQB: 0, // Not available in this Form 16 structure
        Section80RRB: 0, // Not available in this Form 16 structure
        Section80TTA: deductions.section80TTA || 0,
        Section80TTB: 0, // Not available in this Form 16 structure
        Section80U: 0, // Not available in this Form 16 structure
        TotalChapVIADeductions: deductions.totalChapterVIADeductions || 0,
    };

    return {
        DeductUndChapVIA: deductUndChapVIA,
        // The UsrDeductUndChapVIA is for user-entered data, so it's initialized as empty here
        UsrDeductUndChapVIA: {},
    };
};

export const processScheduleVIAFromUserInput = (deductions: Chapter6ADeductions): ScheduleVIA => {
    const totalDeductions = (deductions.section80C_investments || 0) +
                            (deductions.section80D_premium || 0) +
                            (deductions.section80E_interest || 0) +
                            (deductions.section80TTA_interest || 0) +
                            (deductions.section80TTB_interest || 0) +
                            (deductions.nps_additional_contribution_80CCD1B || 0) +
                            (deductions.nps_contribution_80CCD1 || 0);

    const deductUndChapVIA: DeductUndChapVIA = {
        Section80C: deductions.section80C_investments || 0,
        Section80D: deductions.section80D_premium || 0,
        Section80E: deductions.section80E_interest || 0,
        Section80TTA: deductions.section80TTA_interest || 0,
        Section80TTB: deductions.section80TTB_interest || 0,
        Section80CCD1B: deductions.nps_additional_contribution_80CCD1B || 0,
        Section80CCDEmployeeOrSE: deductions.nps_contribution_80CCD1 || 0,
        TotalChapVIADeductions: totalDeductions,
        Section80G: 0, 
        Section80GGA: 0,
    };

    return {
        DeductUndChapVIA: deductUndChapVIA,
        UsrDeductUndChapVIA: {}, 
    };
};

export const mergeScheduleVIA = ({form16, userInput}: {form16?: ScheduleVIA, userInput?: ScheduleVIA}): ScheduleVIA => {
    if (!form16 && !userInput) {
        return {
            DeductUndChapVIA: { Section80D: 0, Section80G: 0, Section80GGA: 0, TotalChapVIADeductions: 0 },
            UsrDeductUndChapVIA: {}
        };
    }
    if (!userInput) return form16!;
    if (!form16) return userInput!;

    const mergedDeductions: DeductUndChapVIA = {
        ...form16.DeductUndChapVIA,
    };

    for (const key in userInput.DeductUndChapVIA) {
        if (Object.prototype.hasOwnProperty.call(userInput.DeductUndChapVIA, key)) {
            const k = key as keyof DeductUndChapVIA;
            (mergedDeductions[k] as number) = (mergedDeductions[k] || 0) + (userInput.DeductUndChapVIA[k] || 0);
        }
    }

    const mergedUsrDeductions: USRDeductUndChapVIA = {
        ...form16.UsrDeductUndChapVIA,
    };

    for (const key in userInput.UsrDeductUndChapVIA) {
        if (Object.prototype.hasOwnProperty.call(userInput.UsrDeductUndChapVIA, key)) {
            const k = key as keyof USRDeductUndChapVIA;
            if (k === 'Section80DDBUsrType') {
                mergedUsrDeductions[k] = userInput.UsrDeductUndChapVIA[k] || form16.UsrDeductUndChapVIA[k];
            } else {
                (mergedUsrDeductions[k] as number) = (mergedUsrDeductions[k] || 0) + (userInput.UsrDeductUndChapVIA[k] || 0);
            }
        }
    }

    // Recalculate total
    mergedDeductions.TotalChapVIADeductions = Object.entries(mergedDeductions)
        .filter(([key]) => key !== 'TotalChapVIADeductions')
        .reduce((total, [, value]) => total + (Number(value) || 0), 0);

    return {
        DeductUndChapVIA: mergedDeductions,
        UsrDeductUndChapVIA: mergedUsrDeductions,
    };
}; 