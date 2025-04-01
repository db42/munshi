import { DocumentType } from './document';

/**
 * Union type for all possible parsed document data types
 */
export type ParsedDocumentData = 
  | USEquityStatementData
  | USEquityCGStatementData
  | USInvestmentIncomeData
  | Form16Data
  | GenericParsedData;

/**
 * Interface for US Equity Statement data
 */
export interface USEquityStatementData {
  records: CharlesSchwabRecord[];
  accountNumber: string;
}

export interface CharlesSchwabRecord {
  date: Date | string;
  action: string;
  symbol: string;
  description: string;
  quantity: number;
  price: number;
  feesAndCommissions: number;
  amount: number;
}

/**
 * Interface for US Investment Income (dividends, interest) data
 */
export interface USInvestmentIncomeData {
  // Basic information
  taxpayerName: string;
  taxpayerPAN: string;
  brokerName: string;
  brokerAccountNumber: string;
  statementPeriod: {
    startDate: Date | string;
    endDate: Date | string;
  };
  
  // Investment income records
  dividends: DividendIncome[];
  
  // Summary information
  taxWithheld: {
    dividendTax: number;
    interestTax: number;
  };
  
  // Investment income specific summaries
  summary: {
    totalDividends: number;
    totalQualifiedDividends: number;
    totalNonQualifiedDividends: number;
    totalInterestIncome: number;
    dividendsBySymbol: Record<string, number>;
    interestBySource: Record<string, number>;
    totalInvestmentIncome: number;
  };
  
  // Metadata
  assessmentYear: string;
  parserVersion?: string;
  sourceFileType?: string;
}

/**
 * Interface for US Equity Capital Gain Statement data
 */
export interface USEquityCGStatementData {
  // Basic information
  taxpayerName: string;
  taxpayerPAN: string;
  brokerName: string;
  brokerAccountNumber: string;
  statementPeriod: {
    startDate: Date | string;
    endDate: Date | string;
  };
  
  // Transaction details
  transactions: USCGEquityTransaction[];
  
  // Summary information
  dividends: DividendIncome[];
  capitalGains: {
    shortTerm: CapitalGainSummary;
    longTerm: CapitalGainSummary;
  };
  taxWithheld: {
    dividendTax: number;
    capitalGainsTax: number;
  };
}

export interface USCGEquityTransaction {
  transactionId: string;
  securityName: string;
  symbol: string;
  acquisitionDate?: Date | string;
  sellDate?: Date | string;
  quantity: number;
  totalCost: number;
  totalProceeds: number;
  feesBrokerage: number;
}

export interface DividendIncome {
  securityName: string;
  symbol: string;
  paymentDate: Date | string;
  grossAmount: number;
  taxWithheld: number;
  netAmount: number;
  incomeType?: string;  // 'dividend', 'interest', etc.
  isQualifiedDividend?: boolean;
  isInterest?: boolean;
  sourceDescription?: string; // Additional description of the income source
}

export interface CapitalGainSummary {
  totalProceeds: number;
  totalCostBasis: number;
  totalGain: number;
  totalForeignTaxPaid: number;
}

/**
 * Interface for Form 16 data
 */
export interface Form16Data {
  metadata: {
    certificateNumber: string;
    lastUpdatedOn: string;
  };
  employer: {
    name: string;
    address: {
      addrDetail: string;
      cityOrTownOrDistrict: string;
      stateCode: number;
      pinCode: number;
    };
    pan: string;
    tan: string;
  };
  employee: {
    name: string;
    address: {
      addrDetail: string;
      cityOrTownOrDistrict: string;
      stateCode: number;
      pinCode: number;
    };
    pan: string;
    employeeReferenceNumber: string | null;
  };
  assessmentYear: string;
  periodWithEmployer: {
    startDate: string;
    endDate: string;
  };
  summaryOfTaxDeducted: Array<{
    quarter: string;
    receiptNumber: string;
    amountPaidCredited: number;
    taxDeducted: number;
    taxDepositedRemitted: number;
  }>;
  totalTaxDeducted: number;
  taxDepositedThroughChallan: Array<{
    slNo: number;
    taxDeposited: number;
    bsrCode: string;
    dateTaxDeposited: string;
    challanSerialNumber: string;
    statusMatchingOltas: string;
  }>;
  verification: {
    name: string;
    designation: string;
    place: string;
    date: string;
  };
  salaryDetails: {
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
  };
  form12BA: {
    taxDeductedSalary: number;
    taxPaidEmployer: number;
    totalTaxPaid: number;
  };
}

/**
 * Generic interface for any parsed document data
 */
export interface GenericParsedData {
  [key: string]: any;
}

/**
 * Helper function to determine the type of parsed data
 */
export function getParsedDataType(documentType: DocumentType, data: any): string {
  switch (documentType) {
    case DocumentType.US_EQUITY_STATEMENT:
      return 'US Equity Statement';
    case DocumentType.US_EQUITY_CG_STATEMENT:
      return 'US Equity Capital Gain Statement';
    case DocumentType.FORM_16:
      return 'Form 16';
    case DocumentType.FORM_26AS:
      return 'Form 26AS';
    case DocumentType.BANK_STATEMENT:
      return 'Bank Statement';
    case DocumentType.RENT_RECEIPT:
      return 'Rent Receipt';
    case DocumentType.INSURANCE_PREMIUM:
      return 'Insurance Premium';
    case DocumentType.PPF_RECEIPT:
      return 'PPF Receipt';
    case DocumentType.MUTUAL_FUND_STATEMENT:
      return 'Mutual Fund Statement';
    default:
      return 'Unknown Document Type';
  }
} 