export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  DIVIDEND = 'DIVIDEND',
  SPLIT = 'SPLIT',
  MERGER = 'MERGER',
  OTHER = 'OTHER'
}

export interface USEquityStatement {
  // Basic information
  taxpayerName: string;
  taxpayerPAN: string;
  brokerName: string;
  brokerAccountNumber: string;
  statementPeriod: {
    startDate: Date;
    endDate: Date;
  };
  
  // Transaction details
  transactions: USEquityTransaction[];
  
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

export interface USEquityTransaction {
  transactionId: string;
  securityName: string;
  symbol: string;
  transactionDate: Date;
  acquisitionDate?: Date; // for sell transactions
  type: TransactionType;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  feesBrokerage: number;
  exchangeRate: number; // USD to INR conversion rate on transaction date
  amountINR: number;    // Total amount in INR
  notes?: string;
}

export interface DividendIncome {
  securityName: string;
  symbol: string;
  paymentDate: Date;
  grossAmount: number;  // in USD
  taxWithheld: number;  // in USD
  netAmount: number;    // in USD
  exchangeRate: number; // USD to INR conversion rate on payment date
  grossAmountINR: number;
  taxWithheldINR: number;
  netAmountINR: number;
}

export interface CapitalGainSummary {
  totalProceeds: number;         // in INR
  totalCostBasis: number;        // in INR
  totalGain: number;             // in INR
  totalForeignTaxPaid: number;   // in INR
} 