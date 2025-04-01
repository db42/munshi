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

/**
 * Interface for investment income statements (dividends, interest)
 */
export interface USInvestmentIncome {
  // Basic information
  taxpayerName: string;
  taxpayerPAN: string;
  brokerName: string;
  brokerAccountNumber: string;
  statementPeriod: {
    startDate: Date;
    endDate: Date;
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
  incomeType?: string;  // 'dividend', 'interest', etc.
  isQualifiedDividend?: boolean;
  isInterest?: boolean;
  sourceDescription?: string; // Additional description of the income source
}

export interface CapitalGainSummary {
  totalProceeds: number;         // in INR
  totalCostBasis: number;        // in INR
  totalGain: number;             // in INR
  totalForeignTaxPaid: number;   // in INR
} 