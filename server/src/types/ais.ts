// server/src/types/ais.ts

/**
 * Represents an amount in Indian Rupees.
 */
type AmountInRupees = number;

/**
 * Basic information about the taxpayer.
 */
export interface AISTaxpayerInfo {
  pan: string;
  aadhaar?: string; // Optional
  name: string;
  dateOfBirth?: Date; // Was YYYY-MM-DD string
  mobileNumber?: string;
  emailAddress?: string;
  address?: string; // Consider a more structured address type if needed
}

/**
 * Details of a single transaction line within a TDS/TCS entry.
 */
export interface AISTransactionLine {
  quarter?: string; // e.g., Q4(Jan-Mar)
  dateOfPaymentCredit?: Date; // Was YYYY-MM-DD or DD/MM/YYYY string
  amountPaidCredited: AmountInRupees;
  taxDeductedCollected: AmountInRupees;
  taxDeposited?: AmountInRupees; // Often same as tax deducted
}

/**
 * Details of Tax Deducted at Source (TDS) or Tax Collected at Source (TCS).
 * Represents a summary entry for a specific deductor/collector and section code.
 */
export interface AISTdsTcsDetail {
  deductorCollectorName: string;
  deductorCollectorTan: string;
  sectionCode?: string; // e.g., 192, 194A
  description?: string; // e.g., "Salary received (Section 192)"
  amountPaidCredited: AmountInRupees; // Total amount for this entry
  taxDeductedCollected: AmountInRupees; // Total tax for this entry
  count?: number; // Number of transaction lines reported
  status?: string; // e.g., "Active"
  // Breakdown of individual transactions within this entry
  transactionBreakdown?: AISTransactionLine[];
}

/**
 * Enum representing common Specified Financial Transaction (SFT) codes.
 * These codes categorize high-value transactions reported to the Income Tax Department.
 */
export enum SftCode {
  /** Purchase of bank drafts or pay orders in cash */
  SFT_001 = 'SFT-001',
  /** Purchase of pre-paid instruments in cash */
  SFT_002 = 'SFT-002',
  /** Cash deposit or withdrawals aggregating to INR 10 lakh or more in a financial year in one or more current accounts */
  SFT_003 = 'SFT-003',
  /** Cash deposits aggregating to INR 10 lakh or more in a financial year, in one or more accounts (other than current/time deposit) */
  SFT_004 = 'SFT-004',
  /** One or more time deposits (other than renewed time deposit) aggregating to INR 10 lakh or more in a financial year */
  SFT_005 = 'SFT-005',
  /** Payment of INR 1 lakh or more in cash or INR 10 lakh or more by any other mode against credit card dues */
  SFT_006 = 'SFT-006',
  /** Purchase of debentures/bonds aggregating to INR 10 lakh or more in a financial year */
  SFT_007 = 'SFT-007',
  /** Purchase of shares aggregating to INR 10 lakh or more in a financial year */
  SFT_008 = 'SFT-008',
  /** Buyback of shares from any person (other than shares bought in the open market) for an amount aggregating to INR 10 lakh or more */
  SFT_009 = 'SFT-009',
  /** Purchase of mutual fund units aggregating to INR 10 lakh or more */
  SFT_010 = 'SFT-010',
  /** Purchase of foreign currency aggregating to INR 10 lakh or more */
  SFT_011 = 'SFT-011',
  /** Purchase or sale of immovable property for an amount of INR 30 lakh or more */
  SFT_012 = 'SFT-012',
  /** Receipt of cash payment exceeding INR 2 lakh for sale of goods or services */
  SFT_013 = 'SFT-013',
  /** Cash deposits during the specified period (e.g., 9th Nov to 30th Dec 2016) */
  SFT_014 = 'SFT-014',
  /** Information regarding salary from employer (Form 16) - Sometimes mapped */
  SFT_015 = 'SFT-015',
  /** Reportable Interest income */
  SFT_016 = 'SFT-016',
  /** Reportable Dividend income */
  SFT_017 = 'SFT-017',
  /** Reportable Sale of Securities/Units of Mutual Fund */
  SFT_018 = 'SFT-018',
  /** Unknown or other SFT code */
  UNKNOWN = 'UNKNOWN'
}

/**
 * Details of a single breakdown line within an SFT entry.
 */
export interface AISSftBreakdownLine {
  reportedOnDate?: Date; // Was string date format
  accountNumber?: string;
  accountType?: string; // e.g., "Saving"
  interestAmount?: AmountInRupees; // Specific amount for this line (might be same as transactionValue)
  status?: string; // e.g., "Active"
  // Add other relevant fields if they appear at the breakdown level for specific SFTs
}

/**
 * Details of Specified Financial Transactions (SFT).
 * Represents a summary entry for a specific reporting entity and SFT code.
 */
export interface AISSftDetail {
  sftCode: SftCode | string; // Use enum, allow string for flexibility with unknown codes
  description: string;
  reportingEntityName: string; // e.g., Bank Name (PAN)
  reportingEntityPan?: string; // Extracted PAN if available separately
  transactionValue: AmountInRupees; // The primary/total value reported for this SFT entry
  count?: number; // e.g., Number of accounts/transactions summarized
  // Existing fields that remain at the top level
  singleOrJointParty?: 'Single' | 'Joint'; // May apply to the overall SFT report
  numberOfParties?: number;
  remarks?: string;
  // Breakdown of individual accounts/transactions within this SFT entry
  breakdown?: AISSftBreakdownLine[];
}

/**
 * Details of taxes paid (Advance Tax, Self-Assessment Tax).
 */
export interface AISTaxPaymentDetail {
  type: 'Advance Tax' | 'Self-Assessment Tax' | 'TDS/TCS' | string; // Allow for other types
  bsrCode: string;
  challanSerialNumber: string;
  dateOfDeposit: Date; // Was YYYY-MM-DD string
  amount: AmountInRupees;
  assessmentYear?: string; // YYYY-YY format
}

/**
 * Information related to demands or refunds.
 */
export interface AISDemandRefundDetail {
  assessmentYear: string; // YYYY-YY format
  status: 'Demand' | 'Refund' | string; // e.g., "Demand determined", "Refund Issued"
  amount: AmountInRupees;
  date?: Date; // Was YYYY-MM-DD string
  sectionCode?: string;
  remarks?: string;
}

/**
 * Other reported information, like interest income, dividends, sales.
 */
export interface AISOtherInformation {
  informationCode: string; // Specific code for the type of information
  description: string;
  reportingEntity?: string;
  amount: AmountInRupees;
  date?: Date; // Was YYYY-MM-DD string
  // Add more specific fields as needed based on the information type
}


/**
 * Represents the parsed data from an Annual Information Statement (AIS).
 */
export interface AISData {
  assessmentYear: string; // e.g., "2024-25"
  financialYear: string; // e.g., "2023-24"
  taxpayerInfo: AISTaxpayerInfo;
  tdsDetails?: AISTdsTcsDetail[];
  tcsDetails?: AISTdsTcsDetail[]; // Often similar structure to TDS
  sftDetails?: AISSftDetail[];
  taxPaymentDetails?: AISTaxPaymentDetail[];
  demandRefundDetails?: AISDemandRefundDetail[];
  otherInformation?: AISOtherInformation[];
  // Add any other top-level fields if present in AIS
  summary?: { // Optional summary section if available
    totalIncomeReported?: AmountInRupees;
    totalTaxDeposited?: AmountInRupees;
  }
} 