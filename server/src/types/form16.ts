export interface Form16 {
  metadata: Form16Metadata;
  employer: EmployerInfo;
  employee: EmployeeInfo;
  assessmentYear: string;
  periodWithEmployer: PeriodWithEmployer;
  summaryOfTaxDeducted: TaxDeductionSummary[];
  totalTaxDeducted: number;
  taxDepositedThroughChallan: ChallanDetails[];
  verification: Verification;
  salaryDetails: SalaryDetails;
  form12BA: Form12BA;
}

export interface Form16Metadata {
  certificateNumber: string;
  lastUpdatedOn: string;
}

export interface PeriodWithEmployer {
  startDate: string;
  endDate: string;
}
/*
* 01-Andaman and Nicobar islands; 02-Andhra Pradesh; 03-Arunachal Pradesh; 04-Assam;
* 05-Bihar; 06-Chandigarh; 07-Dadra Nagar and Haveli; 08-Daman and Diu; 09- Delhi; 10- Goa;
* 11-Gujarat; 12- Haryana; 13- Himachal Pradesh; 14-Jammu and Kashmir; 15- Karnataka; 16-
* Kerala; 17- Lakshadweep; 18-Madhya Pradesh; 19-Maharashtra; 20-Manipur; 21- Meghalaya;
* 22-Mizoram; 23-Nagaland; 24- Odisha; 25- Puducherry; 26- Punjab; 27-Rajasthan; 28-
* Sikkim; 29-Tamil Nadu; 30- Tripura; 31-Uttar Pradesh; 32- West Bengal; 33- Chhattisgarh;
* 34- Uttarakhand; 35- Jharkhand; 36- Telangana; 37- Ladakh; 99- State outside India
*/
// Enhanced address interface
export interface Address {
  addrDetail: string;
  cityOrTownOrDistrict: string;
  stateCode: number;
  pinCode: number;
}
export interface EmployerInfo {
  name: string;
  address: string;
  pan: string;
  tan: string;
}

export interface EmployeeInfo {
  name: string;
  address: Address
  pan: string;
  employeeReferenceNumber: string | null;
}

export interface TaxDeductionSummary {
  quarter: string;
  receiptNumber: string;
  amountPaidCredited: number;
  taxDeducted: number;
  taxDepositedRemitted: number;
}

export interface ChallanDetails {
  slNo: number;
  taxDeposited: number;
  bsrCode: string;
  dateTaxDeposited: string;
  challanSerialNumber: string;
  statusMatchingOltas: string;
}

export interface Verification {
  name: string;
  designation: string;
  place: string;
  date: string;
}

export interface SalaryDetails {
  optingOutTaxation: string;
  grossSalary: {
    salary: number;
    perquisites: number;
    profitsInLieu: number;
    total: number;
    salaryFromOtherEmployers: number;
  };
  exemptAllowances: {
    travelConcession: number;
    deathCumRetirementGratuity: number;
    commutedPension: number;
    leaveEncashment: number;
    houseRentAllowance: number;
    otherAllowances: number;
    totalExemption: number;
  };
  salaryFromCurrentEmployer: number;
  deductionsUnderSection16: {
    standardDeduction: number;
    entertainmentAllowance: number;
    taxOnEmployment: number;
    totalDeductions: number;
  };
  incomeChargeableSalaries: number;
  otherIncome: {
    houseProperty: number;
    otherSources: number;
    totalOtherIncome: number;
  };
  grossTotalIncome: number;
  deductionsChapterVIA: {
    section80C: number;
    section80CCC: number;
    section80CCD1: number;
    total80C80CCC80CCD1: number;
    section80CCD1B: number;
    section80CCD2: number;
    section80D: number;
    section80E: number;
    section80CCH: number;
    section80G: number;
    section80TTA: number;
    totalChapterVIADeductions: number;
  };
  totalTaxableIncome: number;
  taxOnTotalIncome: number;
  rebateSection87A: number;
  surcharge: number;
  healthEducationCess: number;
  taxPayable: number;
  reliefSection89: number;
  netTaxPayable: number;
}

export interface Form12BA {
  taxDeductedSalary: number;
  taxPaidEmployer: number;
  totalTaxPaid: number;
}

// Helper type for partial data during parsing
// export interface Form16Partial extends Partial<Form16> {
//   metadata: Partial<Form16Metadata>;
//   employer: Partial<EmployerInfo>;
//   employee: Partial<EmployeeInfo>;
//   salaryDetails: Partial<SalaryDetails>;
// }