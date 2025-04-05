import { Form16 } from '../types/form16';
import { NatureOfEmployment, ScheduleS, StateCode } from '../types/itr';

export const processScheduleS = (form16: Form16): ScheduleS => ({
  //form16.employer.address is of the following format: 3rd FLOOR, 24TH MAIN RD, INDIQUBE ORION, BANGALORE, - 560102 Karnataka
  //write code to extract address, city, stateCode and pincode from form16.employer.address and
  //generate AddressDetails object here



  Salaries: [{
    NameOfEmployer: form16.employer.name,
    TANofEmployer: form16.employer.tan,
    AddressDetail: {
      //generate empty AddressDetail object
      AddrDetail: form16.employer.address.addrDetail,
      CityOrTownOrDistrict: form16.employer.address.cityOrTownOrDistrict,
      StateCode: String(form16.employer.address.stateCode) as StateCode,
      PinCode: form16.employer.address.pinCode
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
  NetSalary: form16.salaryDetails.grossTotalIncome,
  DeductionUS16: form16.salaryDetails.deductionsUnderSection16.totalDeductions,
  DeductionUnderSection16ia: form16.salaryDetails?.deductionsUnderSection16.standardDeduction || 0,
  EntertainmntalwncUs16ii: form16.salaryDetails.deductionsUnderSection16.entertainmentAllowance || 0,
  ProfessionalTaxUs16iii: form16.salaryDetails.deductionsUnderSection16.taxOnEmployment || 0,
  TotIncUnderHeadSalaries: form16.salaryDetails.grossSalary.total - form16.salaryDetails.deductionsUnderSection16.totalDeductions,
  AllwncExtentExemptUs10: 0
});