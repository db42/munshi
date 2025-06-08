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