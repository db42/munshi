// client/src/types/userInput.types.ts

// Base types
interface Address {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    country?: string;
}

export interface BankAccount {
    ifsc: string;
    accountNumber: string;
    accountType: 'SB' | 'CA'; // Refined to SB/CA, map to 'Savings'/'Current' in UI
    bankName: string; // Added mandatory bankName
    isPrimary?: boolean;
}

interface HousePropertyDetails {
    propertyAddress: Address;
    ownershipPercentage?: number;
    propertyType: 'Self-occupied' | 'Let out';
    grossRentReceived?: number | null;
    municipalTaxesPaid?: number;
    interestOnBorrowedCapital?: number;
    // Add other required HP fields as needed
}

interface CapitalGainsEntry {
    assetType?: string;
    description?: string;
    dateAcquisition: string; // YYYY-MM-DD
    dateSale: string; // YYYY-MM-DD
    saleConsideration: number;
    costAcquisition: number;
    expensesOnTransfer?: number;
    // Add other fields specific to STCG/LTCG if needed
}

interface OtherSourceIncomeEntry {
    sourceDescription: string;
    amount: number;
    country?: string; // For foreign dividends etc.
    taxPaidOutsideIndia?: number;
}

interface Section80CDetails {
    ppf?: number;
    lic?: number;
    elss?: number;
    nsc?: number;
    tuitionFees?: number;
    // Add other 80C items...
}

interface Section80DDetails {
    premiumSelfFamily?: number;
    premiumParents?: number;
    preventiveHealthCheckupSelf?: number;
    preventiveHealthCheckupParents?: number;
    // Add flags for senior citizens if needed for logic
}

interface Section80GDonation {
    doneeName: string;
    panDonee: string;
    addressDonee?: Address;
    amount: number;
    eligiblePercentage?: '100%' | '50%' | string; // Or codes
}

// Entry for carry-forward losses
export interface CarryForwardLossEntry {
    lossYearAY: string; // YYYY-YY
    dateOfFiling?: string; // YYYY-MM-DD
    housePropertyLossCF?: number;
    shortTermCapitalLossCF?: number;
    longTermCapitalLossCF?: number;
    businessLossCF?: number;
    // Add other loss types
}

// Self-assessment tax payment entry
export interface SelfAssessmentTaxPayment {
    bsrCode: string;
    dateDeposit: string; // YYYY-MM-DD
    challanSerialNo: string;
    amount: number;
}

interface ForeignAssetEntry {
    itemType: string; // Consider using an enum: 'Foreign Bank Account', 'Foreign Depository Account', etc.
    countryCode: string; // ISO 3166-1 alpha-2 code
    accountNumberOrRef?: string;
    institutionName?: string;
    peakBalanceDuringYear?: number; // In foreign currency
    closingBalance?: number; // In foreign currency
    grossAmountPaidCredited?: number; // For income-generating assets
    // Add other fields specific to asset types
}

// Main user input data interface
export interface UserInputData {
    inputSchemaVersion?: string;
    
    generalInfoAdditions?: {
        bankDetails?: BankAccount[];
    };
    scheduleHPAdditions?: HousePropertyDetails[];
    scheduleCGAdditions?: {
        shortTerm?: CapitalGainsEntry[];
        longTerm?: CapitalGainsEntry[];
    };
    scheduleOSAdditions?: OtherSourceIncomeEntry[];
    chapterVIAAdditions?: {
        section80C?: Section80CDetails;
        section80D?: Section80DDetails;
        section80G?: Section80GDonation[];
        section80TTA?: { savingsInterest?: number };
        // Add other VIA sections
    };
    taxesPaidAdditions?: {
        selfAssessmentTax?: SelfAssessmentTaxPayment[];
    };
    scheduleCFLAdditions?: {
        lossesToCarryForward?: CarryForwardLossEntry[];
    };
    scheduleFAAdditions?: ForeignAssetEntry[];
    // scheduleALAdditions?: { ... }; // Define if needed
}

// Type for the record returned from the user_itr_inputs table
export interface UserItrInputRecord {
    id: string; // UUID
    owner_id: number;
    assessment_year: string;
    input_data: UserInputData; // The stored JSON blob matches our defined type
    input_schema_version: string;
    created_at: Date;
    updated_at: Date;
} 