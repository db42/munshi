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
  acquisitionDate?: Date; // for sell transactions
  sellDate?: Date; // for sell transactions
  quantity: number;
  totalCost: number;
  totalProceeds: number;
  feesBrokerage: number;
}

export interface DividendIncome {
  securityName: string;
  symbol: string;
  paymentDate: Date;
  grossAmount: number;  // in USD
  taxWithheld: number;  // in USD
  netAmount: number;    // in USD
}

export interface CapitalGainSummary {
  totalProceeds: number;         // in INR
  totalCostBasis: number;        // in INR
  totalGain: number;             // in INR
  totalForeignTaxPaid: number;   // in INR
} 