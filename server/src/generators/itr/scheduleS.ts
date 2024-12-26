import { Form16 } from '../../types/form16';
import { NatureOfEmployment, ScheduleS, StateCode } from '../../types/itr';

export const processScheduleS = (form16: Form16): ScheduleS => ({
  Salaries: [{
    NameOfEmployer: form16.employer.name,
    TANofEmployer: form16.employer.tan,
    AddressDetail: {
      //generate empty AddressDetail object
      AddrDetail: '',
      CityOrTownOrDistrict: '',
      StateCode: StateCode.The01,
      PinCode: 110011
    },
    NatureOfEmployment: NatureOfEmployment.Oth,
    Salarys: {
      //generate Salarys object here from
      GrossSalary: form16.salaryDetails?.grossSalary?.total ?? 0,
      IncomeNotified89A: 0,
      IncomeNotified89AType: [],
      IncomeNotifiedOther89A: 0,
      IncomeNotifiedPrYr89A: 0,
      NatureOfPerquisites: undefined,
      NatureOfProfitInLieuOfSalary: undefined,
      NatureOfSalary: undefined,
      ProfitsinLieuOfSalary: 0,
      Salary: form16.salaryDetails?.grossSalary?.total ?? 0,
      ValueOfPerquisites: 0
    }
    // Add more salary details
  }],
  TotalGrossSalary: form16.salaryDetails.grossSalary.total,
  // AllwncExemptUs10: undefined,
  NetSalary: form16.salaryDetails.netSalary,
  DeductionUS16: form16.deductions?.total || 0,
  DeductionUnderSection16ia: form16.deductions?.standardDeduction || 0,
  EntertainmntalwncUs16ii: form16.deductions?.entertainmentAllowance || 0,
  ProfessionalTaxUs16iii: form16.deductions?.taxOnEmployment || 0,
  TotIncUnderHeadSalaries: form16.salaryDetails.netSalary - (form16.deductions?.total || 0),
  AllwncExtentExemptUs10: 0
});