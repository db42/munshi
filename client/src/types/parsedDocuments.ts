import { DocumentType } from './document';

/**
 * Interface for a single mutual fund transaction from CAMS statement (Matches Server)
 */
export interface CAMSMutualFundTransaction {
  folioNo: string;
  fundName: string;
  schemeName: string;
  isin: string;
  transactionType: string; 
  units: number;
  navOnSale: number;
  saleValue: number;
  saleDate: Date; // Assuming Date object transfer or conversion client-side
  purchaseDate: Date; // Assuming Date object transfer or conversion client-side
  purchaseNav: number;
  acquisitionValue: number;
  holdingPeriodDays: number;
  gainOrLoss: number;
  capitalGainType: 'STCG' | 'LTCG';
  assetCategory: 'Equity' | 'Debt' | 'Hybrid';
}

/**
 * Interface for scheme-wise summary data (Matches Server)
 */
export interface SchemeWiseSummary {
  schemeName: string;
  folioNo?: string;
  isin?: string;
  units: number;
  totalAmount: number;
  costOfAcquisition: number;
  shortTermGain: number;
  longTermGainWithIndex?: number;
  longTermGainWithoutIndex: number;
  assetCategory: 'Equity' | 'Debt' | 'Hybrid';
}

/**
 * CAMS Mutual Fund Capital Gain Statement data (Matches Server)
 */
export interface CAMSMFCapitalGainData {
  investorDetails: {
    name: string;
    pan: string; 
  };
  statementPeriod: {
    fromDate: string; // Keep as string to match server
    toDate: string;   // Keep as string to match server
  };
  transactions: CAMSMutualFundTransaction[];
  schemeWiseSummary?: SchemeWiseSummary[]; 
  summary: {
    equityStcg: number;
    equityLtcg: number;
    debtStcg: number;
    debtLtcg: number;
    totalGainLoss: number;
  };
}

/**
 * Union type for all possible parsed document data types
 */
export type ParsedDocumentData = 
  | USEquityStatementData
  | USEquityCGStatementData
  | USInvestmentIncomeData
  | Form16Data
  | AISData
  | CAMSMFCapitalGainData
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
 * Interface for AIS (Annual Information Statement) data
 */
export interface AISData {
  assessmentYear: string;
  financialYear: string;
  taxpayerInfo: {
    pan: string;
    name: string;
    [key: string]: any;
  };
  tdsDetails?: Array<{
    deductorCollectorName: string;
    deductorCollectorTan?: string;
    amountPaidCredited: number;
    taxDeductedCollected: number;
    [key: string]: any;
  }>;
  sftDetails?: Array<{
    description: string;
    reportingEntityName: string;
    transactionValue: number;
    [key: string]: any;
  }>;
  taxPaymentDetails?: Array<{
    type: string;
    amount: number;
    dateOfDeposit: string;
    [key: string]: any;
  }>;
  demandRefundDetails?: Array<{
    assessmentYear: string;
    status: string;
    amount: number;
    [key: string]: any;
  }>;
  [key: string]: any;
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
    case DocumentType.AIS:
      return 'Annual Information Statement';
    case DocumentType.CAMS_MF_CAPITAL_GAIN:
      return 'CAMS Mutual Fund Capital Gain Statement';
    default:
      return 'Unknown Document Type';
  }
} 