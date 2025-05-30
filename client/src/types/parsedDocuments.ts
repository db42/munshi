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
  | Form26ASData
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

// START - Form 26AS Data Interfaces (mirrored from server/src/types/form26AS.ts)
export interface Form26AS_DocumentHeader {
    dataUpdatedTill: string;
    assessmentYear: string;
    permanentAccountNumberPAN: string;
    currentStatusOfPAN: string;
    financialYear: string;
    nameOfAssessee: string;
    addressOfAssessee: string;
}

export interface Form26AS_PartITransaction {
    srNo: number;
    section: string;
    transactionDate: string;
    statusOfBooking: string;
    dateOfBooking: string;
    remarks?: string;
    amountPaidCredited: number;
    taxDeducted: number;
    tdsDeposited: number;
}

export interface Form26AS_PartIDeductor {
    srNo: number;
    nameOfDeductor: string;
    tanOfDeductor: string;
    totalAmountPaidCredited: number;
    totalTaxDeducted: number;
    totalTDSDeposited: number;
    transactions: Form26AS_PartITransaction[];
}

export interface Form26AS_PartIDetails {
    deductors: Form26AS_PartIDeductor[];
}

export interface Form26AS_PartIITransaction {
    srNo: number;
    section: string;
    transactionDate: string;
    dateOfBooking: string;
    remarks?: string;
    amountPaidCredited: number;
    taxDeducted: number;
    tdsDeposited: number;
}

export interface Form26AS_PartIIEntry {
    srNo: number;
    nameOfDeductor: string;
    tanOfDeductor: string;
    totalAmountPaidCredited: number;
    totalTaxDeducted: number;
    totalTDSDeposited: number;
    transactions: Form26AS_PartIITransaction[];
}

export interface Form26AS_PartIIDetails {
    items: Form26AS_PartIIEntry[];
}

export interface Form26AS_PartIIITransaction {
    srNo: number;
    section: string;
    transactionDate: string;
    statusOfBooking: string;
    remarks?: string;
    amountPaidCredited: number;
}

export interface Form26AS_PartIIIEntry {
    srNo: number;
    nameOfDeductor: string;
    tanOfDeductor: string;
    totalAmountPaidCredited: number;
    transactions: Form26AS_PartIIITransaction[];
}

export interface Form26AS_PartIIIDetails {
    items: Form26AS_PartIIIEntry[];
}

export interface Form26AS_PartIVTransactionDetail {
    srNo: number;
    tdsCertificateNumber: string;
    section: string;
    dateOfDeposit: string;
    statusOfBooking: string;
    dateOfBooking: string;
    demandPayment: number | string;
    tdsDeposited: number;
}

export interface Form26AS_PartIVEntry {
    srNo: number;
    acknowledgementNumber: string;
    nameOfDeductor: string;
    panOfDeductor: string;
    transactionDate: string;
    totalTransactionAmount: number;
    totalTDSDeposited: number;
    transactionDetails: Form26AS_PartIVTransactionDetail[];
}

export interface Form26AS_PartIVDetails {
    items: Form26AS_PartIVEntry[];
    grossTotalAcrossDeductors: string;
}

export interface Form26AS_PartVChallanDetail {
    srNo: number;
    bsrCode: string;
    dateOfDeposit: string;
    challanSerialNumber: string;
    totalTaxAmount: number;
    statusOfBooking: string;
}

export interface Form26AS_PartVEntry {
    srNo: number;
    acknowledgementNumber: string;
    nameOfBuyer: string;
    panOfBuyer: string;
    transactionDate: string;
    totalTransactionAmount: number;
    challanDetails: Form26AS_PartVChallanDetail[];
}

export interface Form26AS_PartVDetails {
    items: Form26AS_PartVEntry[];
    grossTotalAcrossBuyers: string;
}

export interface Form26AS_PartVITransaction {
    srNo: number;
    section: string;
    transactionDate: string;
    statusOfBooking: string;
    dateOfBooking: string;
    remarks?: string;
    amountPaidDebited: number;
    taxCollected: number;
    tcsDeposited: number;
}

export interface Form26AS_PartVICollector {
    srNo: number;
    nameOfCollector: string;
    tanOfCollector: string;
    totalAmountPaidDebited: number;
    totalTaxCollected: number;
    totalTCSDeposited: number;
    transactions: Form26AS_PartVITransaction[];
}

export interface Form26AS_PartVIDetails {
    collectors: Form26AS_PartVICollector[];
}

export interface Form26AS_PartVIIRefund {
    srNo: number;
    assessmentYearRefund: string;
    mode: string;
    refundIssued: string;
    natureOfRefund: string;
    amountOfRefund: number;
    interest: number;
    dateOfPayment: string;
    remarks?: string;
}

export interface Form26AS_PartVIIDetails {
    refunds: Form26AS_PartVIIRefund[];
}

export interface Form26AS_PartVIIITransactionDetail {
    srNo: number;
    tdsCertificateNumber: string;
    section: string;
    dateOfDeposit: string;
    statusOfBooking: string;
    dateOfBooking: string;
    demandPayment: number | string;
    tdsDeposited: number;
    totalAmountDepositedOtherThanTDSInner: number;
}

export interface Form26AS_PartVIIIEntry {
    srNo: number;
    acknowledgementNumber: string;
    nameOfDeductee: string;
    panOfDeductee: string;
    transactionDate: string;
    totalTransactionAmount: number;
    totalTDSDeposited: number;
    totalAmountDepositedOtherThanTDS: number;
    transactionDetails: Form26AS_PartVIIITransactionDetail[];
}

export interface Form26AS_PartVIIIDetails {
    items: Form26AS_PartVIIIEntry[];
    grossTotalAcrossDeductees: string;
}

export interface Form26AS_PartIXChallanDetail {
    srNo: number;
    bsrCode: string;
    dateOfDeposit: string;
    challanSerialNumber: string;
    totalTaxAmount: number;
    statusOfBooking: string;
    demandPayment: number | string;
    totalAmountDepositedOtherThanTDSInner: number;
}

export interface Form26AS_PartIXEntry {
    srNo: number;
    acknowledgementNumber: string;
    nameOfSeller: string;
    panOfSeller: string;
    transactionDate: string;
    totalTransactionAmount: number;
    totalAmountDepositedOtherThanTDS: number;
    challanDetails: Form26AS_PartIXChallanDetail[];
}

export interface Form26AS_PartIXDetails {
    items: Form26AS_PartIXEntry[];
    grossTotalAcrossSellers: string;
}

export interface Form26AS_PartXDefaultDetail {
    srNo: number;
    tan: string;
    shortPaymentInner: number;
    shortDeductionCollectionInner: number;
    interestOnTDSTCSPaymentsDefaultInner: number;
    interestOnTDSTCSDeductionCollectionDefaultInner: number;
    lateFilingFeeU234EInner: number;
    interestU220_2Inner: number;
    totalDefaultInner: number;
}

export interface Form26AS_PartXDefaultEntry {
    srNo: number;
    financialYearDefaults: string;
    shortPaymentOuter: number;
    shortDeductionCollectionOuter: number;
    interestOnTDSTCSPaymentsDefaultOuter: number;
    interestOnTDSTCSDeductionCollectionDefaultOuter: number;
    lateFilingFeeU234EOuter: number;
    interestU220_2Outer: number;
    totalDefaultOuter: number;
    details: Form26AS_PartXDefaultDetail[];
}

export interface Form26AS_PartXDetails {
    defaults: Form26AS_PartXDefaultEntry[];
}

export interface Form26AS_ContactInformationEntry {
    partOfAnnualTaxStatement: string;
    contactInCaseOfAnyClarification: string;
}

export interface Form26AS_StatusBookingLegendEntry {
    legend: string;
    description: string;
    definition: string;
}

export interface Form26AS_RemarkLegendEntry {
    legend: string;
    description: string;
}

export interface Form26AS_LegendsContainer {
    statusOfBooking: Form26AS_StatusBookingLegendEntry[];
    remarks: Form26AS_RemarkLegendEntry[];
}

export interface Form26AS_SectionEntry {
    section: string;
    description: string;
}

export interface Form26AS_MinorOrMajorHeadEntry {
    code: string;
    description: string;
}

export interface Form26AS_GlossaryEntry {
    abbreviation: string;
    description: string;
}

export interface Form26ASData { // This is the main interface, equivalent to AnnualTaxStatement
    header: Form26AS_DocumentHeader;
    partI: Form26AS_PartIDetails;
    partII: Form26AS_PartIIDetails;
    partIII: Form26AS_PartIIIDetails;
    partIV: Form26AS_PartIVDetails;
    partV: Form26AS_PartVDetails;
    partVI: Form26AS_PartVIDetails;
    partVII: Form26AS_PartVIIDetails;
    partVIII: Form26AS_PartVIIIDetails;
    partIX: Form26AS_PartIXDetails;
    partX: Form26AS_PartXDetails;
    contactInformation: Form26AS_ContactInformationEntry[];
    legends: Form26AS_LegendsContainer;
    notesForAnnualTaxStatement: string[];
    sections: Form26AS_SectionEntry[];
    minorHead: Form26AS_MinorOrMajorHeadEntry[];
    majorHead: Form26AS_MinorOrMajorHeadEntry[];
    glossary: Form26AS_GlossaryEntry[];
}
// END - Form 26AS Data Interfaces 