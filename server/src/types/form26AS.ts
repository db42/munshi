export interface AnnualTaxStatement {
    header: DocumentHeader;
    partI: PartIDetails;
    partII: PartIIDetails;
    partIII: PartIIIDetails;
    partIV: PartIVDetails;
    partV: PartVDetails;
    partVI: PartVIDetails;
    partVII: PartVIIDetails;
    partVIII: PartVIIIDetails;
    partIX: PartIXDetails;
    partX: PartXDetails;
    contactInformation: ContactInformationEntry[];
    legends: LegendsContainer; // Renamed for clarity
    notesForAnnualTaxStatement: string[];
    sections: SectionEntry[];
    minorHead: MinorOrMajorHeadEntry[];
    majorHead: MinorOrMajorHeadEntry[];
    glossary: GlossaryEntry[];
}

export interface DocumentHeader {
    dataUpdatedTill: string; // e.g., "6-Jul-2024"
    assessmentYear: string; // e.g., "2024-25"
    permanentAccountNumberPAN: string; // e.g., "AQWPB0620M"
    currentStatusOfPAN: string; // e.g., "Active and Operative"
    financialYear: string; // e.g., "2023-24"
    nameOfAssessee: string; // e.g., "DUSHYANT BANSAL"
    addressOfAssessee: string; // Full address string
    // Assessee PAN, Name, Assessment Year might appear on page 2 header but are redundant if same
}

// PART-I - Details of Tax Deducted at Source
export interface PartIDetails {
    deductors: PartIDeductor[];
}

export interface PartIDeductor {
    srNo: number; // Outer Sr. No. for the deductor block
    nameOfDeductor: string;
    tanOfDeductor: string;
    totalAmountPaidCredited: number;
    totalTaxDeducted: number; // Corresponds to "Total Tax Deducted #"
    totalTDSDeposited: number;
    transactions: PartITransaction[];
}

export interface PartITransaction {
    srNo: number; // Inner Sr. No. for the transaction row
    section: string; // e.g., "194A", "192"
    transactionDate: string; // e.g., "01-Dec-2023"
    statusOfBooking: string; // e.g., "F"
    dateOfBooking: string; // e.g., "03-Feb-2024"
    remarks?: string; // Corresponds to "Remarks**"
    amountPaidCredited: number;
    taxDeducted: number; // Corresponds to "Tax Deducted ##"
    tdsDeposited: number;
}

// PART-II - Details of Tax Deducted at Source for 15G/15H
export interface PartIIDetails {
    // If "No Transactions Present", this array will be empty.
    items: PartIIEntry[];
}

export interface PartIIEntry { // Structure based on column headers if data were present
    srNo: number;
    nameOfDeductor: string;
    tanOfDeductor: string;
    totalAmountPaidCredited: number;
    totalTaxDeducted: number;
    totalTDSDeposited: number;
    transactions: PartIITransaction[];
}

export interface PartIITransaction { // Structure based on column headers if data were present
    srNo: number;
    section: string;
    transactionDate: string;
    dateOfBooking: string;
    remarks?: string;
    amountPaidCredited: number;
    taxDeducted: number;
    tdsDeposited: number;
}

// PART-III - Details of Tax Paid (Other than TDS or TCS) - e.g. Advance Tax, Self Assessment Tax
export interface PartIIIDetails {
    // If "No Transactions Present", this array will be empty.
    // This part corresponds to Part C of the physical Form 26AS.
    items: ChallanPaymentDetail[]; 
}

// Renamed PartIIIEntry to ChallanPaymentDetail and updated fields
export interface ChallanPaymentDetail { 
    srNo: number;
    minorHead?: string; // e.g., "200" for Advance Tax, "400" for Self Assessment Tax
    majorHead?: string; // e.g., "0021" for Income Tax Other Than Companies
    tax?: number;
    surcharge?: number;
    educationCess?: number; // or Health and Education Cess
    interest?: number;
    fees?: number;
    others?: number;
    totalTaxDeposited: number;
    bsrCodeOfBankBranch?: string;
    dateOfDeposit: string; // e.g., "YYYY-MM-DD"
    challanSerialNumber?: string;
    remarks?: string; // e.g., "Advance Tax", "Self Assessment Tax"
}

// PART-IV - Details of Tax Deducted at Source u/s 194IA/194IB/194M/194S
export interface PartIVDetails {
    // If "No Transactions Present" for items, this array will be empty.
    items: PartIVEntry[];
    // This field directly holds the string "No Transactions Present" or a summary.
    grossTotalAcrossDeductors: string;
}

export interface PartIVEntry { // Structure based on column headers if data were present
    srNo: number; // Sr. No. for the main entry
    acknowledgementNumber: string;
    nameOfDeductor: string;
    panOfDeductor: string;
    transactionDate: string;
    totalTransactionAmount: number;
    totalTDSDeposited: number; // Corresponds to "Total TDS Deposited***"
    // Nested details, if any
    transactionDetails: PartIVTransactionDetail[];
}

export interface PartIVTransactionDetail { // Structure for the nested part if data were present
    srNo: number; // Sr. No. for the detail line
    tdsCertificateNumber: string;
    section: string;
    dateOfDeposit: string;
    statusOfBooking: string;
    dateOfBooking: string;
    demandPayment: number | string; // Can be amount or text
    tdsDeposited: number; // Corresponds to "TDS Deposited***"
}

// PART-V - Details of Transactions under Proviso to sub-section (1) of section 194S as per Form-26QE
export interface PartVDetails {
    // If "No Transactions Present" for items, this array will be empty.
    items: PartVEntry[];
    // This field directly holds the string "No Transactions Present" or a summary from page 2.
    grossTotalAcrossBuyers: string;
}

export interface PartVEntry { // Corresponds to entries on page 1
    srNo: number;
    acknowledgementNumber: string;
    nameOfBuyer: string;
    panOfBuyer: string;
    transactionDate: string;
    totalTransactionAmount: number;
    // Challan details associated with this entry, typically from page 2
    challanDetails: PartVChallanDetail[]; // Array will be empty if no challan details
}

export interface PartVChallanDetail { // Corresponds to challan details for Part V on page 2
    srNo: number;
    bsrCode: string;
    dateOfDeposit: string;
    challanSerialNumber: string;
    totalTaxAmount: number;
    statusOfBooking: string;
}

// PART-VI - Details of Tax Collected at Source
export interface PartVIDetails {
    // If "No Transactions Present", this array will be empty.
    collectors: PartVICollector[];
}

export interface PartVICollector { // Structure based on column headers if data were present
    srNo: number; // Sr. No. for the collector block
    nameOfCollector: string;
    tanOfCollector: string;
    totalAmountPaidDebited: number;
    totalTaxCollected: number; // Corresponds to "Total Tax Collected +"
    totalTCSDeposited: number;
    transactions: PartVITransaction[];
}

export interface PartVITransaction { // Structure based on column headers if data were present
    srNo: number; // Sr. No. for the transaction row
    section: string;
    transactionDate: string;
    statusOfBooking: string;
    dateOfBooking: string;
    remarks?: string;
    amountPaidDebited: number;
    taxCollected: number; // Corresponds to "Tax Collected ++"
    tcsDeposited: number;
}

// PART-VII - Details of Paid Refund
export interface PartVIIDetails {
    // If "No Transactions Present", this array will be empty.
    refunds: PartVIIRefund[];
}

export interface PartVIIRefund { // Structure based on column headers if data were present
    srNo: number;
    assessmentYearRefund: string; // "Assessment Year" column in Part VII
    mode: string;
    refundIssued: string; // Date or description
    natureOfRefund: string;
    amountOfRefund: number;
    interest: number;
    dateOfPayment: string;
    remarks?: string;
}

// PART-VIII - Details of Tax Deducted at Source u/s 194IA/194IB/194M/194S (For Buyer/Tenant etc.)
export interface PartVIIIDetails {
    // If "No Transactions Present" for items, this array will be empty.
    items: PartVIIIEntry[];
    // This field directly holds the string "No Transactions Present" or a summary.
    grossTotalAcrossDeductees: string;
}

export interface PartVIIIEntry { // Structure based on column headers if data were present
    srNo: number; // Sr. No. for the main entry
    acknowledgementNumber: string;
    nameOfDeductee: string;
    panOfDeductee: string;
    transactionDate: string;
    totalTransactionAmount: number;
    totalTDSDeposited: number; // Corresponds to "Total TDS Deposited***"
    totalAmountDepositedOtherThanTDS: number; // Corresponds to "Total Amount ### Deposited other than TDS"
    // Nested details, if any
    transactionDetails: PartVIIITransactionDetail[];
}

export interface PartVIIITransactionDetail { // Structure for the nested part if data were present
    srNo: number; // Sr. No. for the detail line
    tdsCertificateNumber: string;
    section: string;
    dateOfDeposit: string;
    statusOfBooking: string;
    dateOfBooking: string;
    demandPayment: number | string;
    tdsDeposited: number; // Corresponds to "TDS Deposited***"
    totalAmountDepositedOtherThanTDSInner: number; // Corresponds to "Total Amount ### Deposited other than TDS" for the detail line
}

// PART-IX - Details of Transactions/Demand Payments under Proviso to sub-section (1) of section 194S as per Form 26QE
export interface PartIXDetails {
    // If "No Transactions Present" for items, this array will be empty.
    items: PartIXEntry[];
    // This field directly holds the string "No Transactions Present" or a summary.
    grossTotalAcrossSellers: string;
}

export interface PartIXEntry { // Structure based on column headers if data were present
    srNo: number; // Sr. No. for the main entry
    acknowledgementNumber: string;
    nameOfSeller: string;
    panOfSeller: string;
    transactionDate: string;
    totalTransactionAmount: number;
    totalAmountDepositedOtherThanTDS: number; // For the main entry
    challanDetails: PartIXChallanDetail[]; // Array will be empty if no challan details
}

export interface PartIXChallanDetail { // Structure for challan details if data were present
    srNo: number; // Sr. No. for the challan detail line
    bsrCode: string;
    dateOfDeposit: string;
    challanSerialNumber: string;
    totalTaxAmount: number;
    statusOfBooking: string;
    demandPayment: number | string;
    totalAmountDepositedOtherThanTDSInner: number; // For the challan detail line
}

// PART X - TDS/TCS Defaults* (Processing of Statements)
export interface PartXDetails {
    // If "No Transactions Present", this array will be empty.
    defaults: PartXDefaultEntry[];
}

export interface PartXDefaultEntry { // Structure based on column headers if data were present
    srNo: number; // Sr. No. for the main default entry
    financialYearDefaults: string; // "Financial Year" column in Part X
    shortPaymentOuter: number; // "Short Payment" for the main entry
    shortDeductionCollectionOuter: number; // "Short Deduction/ Collection" for the main entry
    interestOnTDSTCSPaymentsDefaultOuter: number;
    interestOnTDSTCSDeductionCollectionDefaultOuter: number;
    lateFilingFeeU234EOuter: number;
    interestU220_2Outer: number; // "Interest u/s 220(2)"
    totalDefaultOuter: number;
    // Nested details per TAN, if any
    details: PartXDefaultDetail[];
}

export interface PartXDefaultDetail { // Structure for the nested TAN-specific details if data were present
    srNo: number; // Sr. No. for the TAN-specific detail line
    tan: string; // "TANs" column
    shortPaymentInner: number; // "Short Payment" for the detail line
    shortDeductionCollectionInner: number; // "Short Deduction/ Collection" for the detail line
    interestOnTDSTCSPaymentsDefaultInner: number;
    interestOnTDSTCSDeductionCollectionDefaultInner: number;
    lateFilingFeeU234EInner: number;
    interestU220_2Inner: number;
    totalDefaultInner: number;
}

// Contact Information
export interface ContactInformationEntry {
    partOfAnnualTaxStatement: string; // e.g., "I", "II", "VIII"
    contactInCaseOfAnyClarification: string; // e.g., "Deductor", "Assessing Officer / Bank"
}

// Legends Container
export interface LegendsContainer {
    statusOfBooking: StatusBookingLegendEntry[];
    remarks: RemarkLegendEntry[];
}

export interface StatusBookingLegendEntry {
    legend: string; // e.g., "U", "M", "F"
    description: string;
    definition: string;
}

export interface RemarkLegendEntry {
    legend: string; // e.g., "'A'", "'B'"
    description: string;
}

// Sections (from Page 3 & 4)
export interface SectionEntry {
    section: string; // e.g., "192", "194A"
    description: string;
}

// Minor or Major Head Entry
export interface MinorOrMajorHeadEntry {
    code: string; // e.g., "200", "0020"
    description: string;
}

// Glossary Entry
export interface GlossaryEntry {
    abbreviation: string; // e.g., "AY", "TDS"
    description: string;
}

// This can be the main export if this is the root type for a parsed Form 26AS.
// If there are other top-level elements in a parsed 26AS JSON, adjust accordingly.
export type ParsedForm26AS = AnnualTaxStatement; 