export interface Form16 {
  metadata: Form16Metadata;
  employer: EmployerInfo;
  employee: EmployeeInfo;
  salaryDetails: SalaryDetails;
  deductions: Deductions;
  incomeChargeable?: IncomeChargeable;
  taxDeduction: TaxDeduction;
}

export interface Form16Metadata {
  certificateNumber: string;
  lastUpdatedOn?: string;
  financialYear: {
    startDate: string;
    endDate: string;
  };
}

export interface EmployerInfo {
  name: string;
  tan: string;
  address?: string;
}

export interface EmployeeInfo {
  name: string;
  pan: string;
}

export interface SalaryDetails {
  grossSalary: {
    salaryAsPerSection17_1?: number;
    valueOfPerquisitesSection17_2?: number;
    profitsInLieuOfSalarySection17_3?: number;
    total: number;
  };
  allowanceExemptSection10?: number;
  netSalary: number;
}

export interface Deductions {
  standardDeduction?: number;
  entertainmentAllowance?: number;
  taxOnEmployment?: number;
  total: number;
}

export interface IncomeChargeable {
  salariesTotal: number;
  anyOtherIncome?: {
    natureOfIncome?: string;
    amount: number;
  }[];
  grossTotalIncome: number;
}

export interface TaxDeduction {
  taxDeducted?: {
    month: string;
    amount: number;
    paidToGovernment?: {
      challanDate: string;
      challanNumber: string;
      bsr: string;
    };
  }[];
  totalTaxDeducted: number;
}

// Helper types for partial data during parsing
export interface Form16Partial extends Partial<Form16> {
  metadata: Partial<Form16Metadata>;
  employer: Partial<EmployerInfo>;
  employee: Partial<EmployeeInfo>;
}