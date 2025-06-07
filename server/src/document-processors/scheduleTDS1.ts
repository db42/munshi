import { Form16 } from '../types/form16';
import { ScheduleTDS1, TDSonSalary, EmployerOrDeductorOrCollectDetl } from '../types/itr';

/**
 * Processes Form 16 data to generate ScheduleTDS1
 * 
 * @param form16 - Form 16 data from employer
 * @returns The generated ScheduleTDS1 section
 */
export const processScheduleTDS1 = (form16: Form16): ScheduleTDS1 => {
    // TODO: Implement the logic to extract and format TDS details from Form 16 Part A

    const employerDetails: EmployerOrDeductorOrCollectDetl = {
        EmployerOrDeductorOrCollecterName: form16.employer.name,
        TAN: form16.employer.tan
        // Note: Address is not part of EmployerOrDeductorOrCollectDetl in the ITR schema for TDSonSalary
    };

    const tdsEntries: TDSonSalary[] = [
        {
            EmployerOrDeductorOrCollectDetl: employerDetails,
            IncChrgSal: form16.salaryDetails.incomeChargeableSalaries, 
            TotalTDSSal: form16.totalTaxDeducted // Using the total from Form 16 Part A
        }
    ];

    return {
        TDSonSalary: tdsEntries,
        TotalTDSonSalaries: form16.totalTaxDeducted // Sum of TDS from all entries
    };
}; 