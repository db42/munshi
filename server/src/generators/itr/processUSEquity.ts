import { CapitalGainSummary, USCGEquityTransaction, USEquityStatement } from '../../types/usEquityStatement';
import { 
    ScheduleCGFor23, 
    ShortTermCapGainFor23, 
    LongTermCapGain23, 
    DeductSec48,
    EquityOrUnitSec94Type,
    DateRangeType,
    InLossSetOff,
    InStcg15Per,
    InLtcg10Per,
    InLtcg20Per,
    InLtcgDTAARate,
    InStcg30Per,
    InStcgAppRate,
    InStcgDTAARate,
    AccruOrRecOfCG,
    NRITransacSec48Dtl,
    DeducClaimInfo,
    MFSectionCode,
    CapGain
} from '../../types/itr';
import { getExchangeRate, convertUSDtoINR, formatCurrency } from '../../utils/currencyConverter';

// Define the interface for ITR sections
export interface USEquityITRSections {
    scheduleCG: ScheduleCGFor23;
    partBTICapitalGains: CapGain;
    partBTTIForeignTaxCredit: number;
}

/**
 * Creates a default DeductSec48 object with the given cost basis
 */
const createDeductSec48 = (costBasis: number): DeductSec48 => ({
    AquisitCost: costBasis,
    ExpOnTrans: 0,
    ImproveCost: 0,
    TotalDedn: costBasis // Total deduction is sum of all costs
});

/**
 * Creates a default DateRangeType object with a specified amount
 */
const createDateRange = (amount: number): DateRangeType => ({
    DateRange: {
        Up16Of12To15Of3: amount,
        Up16Of3To31Of3: 0,
        Up16Of9To15Of12: 0,
        Upto15Of6: 0,
        Upto15Of9: 0
    }
});

/**
 * Creates a default InLossSetOff object
 */
const createInLossSetOff = (): InLossSetOff => ({
    LtclSetOff10Per: 0,
    LtclSetOff20Per: 0,
    LtclSetOffDTAARate: 0,
    StclSetoff15Per: 0,
    StclSetoff30Per: 0,
    StclSetoffAppRate: 0,
    StclSetoffDTAARate: 0
});

/**
 * Creates a default AccruOrRecOfCG object
 */
const createAccruOrRecOfCG = (shortTermGain: number, longTermGain: number): AccruOrRecOfCG => ({
    LongTermUnder10Per: createDateRange(longTermGain),
    LongTermUnder20Per: createDateRange(0),
    LongTermUnderDTAARate: createDateRange(0),
    ShortTermUnder15Per: createDateRange(shortTermGain),
    ShortTermUnder30Per: createDateRange(0),
    ShortTermUnderAppRate: createDateRange(0),
    ShortTermUnderDTAARate: createDateRange(0)
});

/**
 * Creates a default EquityOrUnitSec94Type object for sale transactions
 */
const createSaleTransaction = (proceeds: number, costBasis: number, gain: number): EquityOrUnitSec94Type => ({
    BalanceCG: gain,
    CapgainonAssets: gain,
    DeductSec48: createDeductSec48(costBasis),
    FullConsideration: proceeds,
    LossSec94of7Or94of8: 0,
    FairMrktValueUnqshr: proceeds, // Using proceeds as fair market value
    FullValueConsdOthUnqshr: 0,
    FullValueConsdRecvUnqshr: 0,
    FullValueConsdSec50CA: 0
});

/**
 * Creates a default CurrYrLosses object
 */
const createCurrYrLosses = (shortTermGain: number, longTermGain: number) => ({
    InLossSetOff: createInLossSetOff(),
    InLtcg10Per: {
        CurrYearIncome: longTermGain,
        CurrYrCapGain: longTermGain,
        LtclSetOff20Per: 0,
        LtclSetOffDTAARate: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    } as InLtcg10Per,
    InLtcg20Per: {
        CurrYearIncome: 0,
        CurrYrCapGain: 0,
        LtclSetOff10Per: 0,
        LtclSetOffDTAARate: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    } as InLtcg20Per,
    InLtcgDTAARate: {
        CurrYearIncome: 0,
        CurrYrCapGain: 0,
        LtclSetOff10Per: 0,
        LtclSetOff20Per: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    } as InLtcgDTAARate,
    InStcg15Per: {
        CurrYearIncome: shortTermGain,
        CurrYrCapGain: shortTermGain,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    } as InStcg15Per,
    InStcg30Per: {
        CurrYearIncome: 0,
        CurrYrCapGain: 0,
        StclSetoff15Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    } as InStcg30Per,
    InStcgAppRate: {
        CurrYearIncome: 0,
        CurrYrCapGain: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffDTAARate: 0
    } as InStcgAppRate,
    InStcgDTAARate: {
        CurrYearIncome: 0,
        CurrYrCapGain: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0
    } as InStcgDTAARate,
    LossRemainSetOff: createInLossSetOff(),
    TotLossSetOff: createInLossSetOff()
});

/**
 * Creates a default NRITransacSec48Dtl object
 */
const createNRITransacSec48Dtl = (): NRITransacSec48Dtl => ({
    NRItaxSTTNotPaid: 0,
    NRItaxSTTPaid: 0
});

/**
 * Creates a default DeducClaimInfo object
 */
const createDeducClaimInfo = (): DeducClaimInfo => ({
    TotDeductClaim: 0,
    DeducClaimDtlsUs54: [],
    DeducClaimDtlsUs54B: [],
    DeducClaimDtlsUs54EC: [],
    DeducClaimDtlsUs54F: [],
    DeducClaimDtlsUs115F: []
});

/**
 * Determines if a transaction is short-term or long-term based on holding period
 * For Indian tax purposes, foreign equity held for <= 24 months is short-term
 * 
 * @param acquisitionDate Date of acquisition
 * @param sellDate Date of sale
 * @returns Boolean indicating if it's a short-term transaction
 */
const isShortTermTransaction = (acquisitionDate: Date, sellDate: Date): boolean => {
  // Calculate difference in months
  const monthsDiff = 
    (sellDate.getFullYear() - acquisitionDate.getFullYear()) * 12 + 
    (sellDate.getMonth() - acquisitionDate.getMonth());
  
  // For foreign equity (including US stocks), short-term is <= 24 months
  return monthsDiff <= 24;
};

/**
 * Calculate capital gains from transaction data
 * 
 * @param transactions Array of equity transactions
 * @returns Object with short-term and long-term capital gains
 */
const calculateCapitalGains = (
  transactions: USCGEquityTransaction[]): { shortTerm: CapitalGainSummary; longTerm: CapitalGainSummary } => {
  // Initialize summary objects
  const shortTerm: CapitalGainSummary = {
    totalProceeds: 0,
    totalCostBasis: 0,
    totalGain: 0,
    totalForeignTaxPaid: 0
  };
  
  const longTerm: CapitalGainSummary = {
    totalProceeds: 0,
    totalCostBasis: 0,
    totalGain: 0,
    totalForeignTaxPaid: 0
  };
  
  // Create arrays to store individual transactions for reporting
  const shortTermTransactions: Array<{
    index: number;
    security: string;
    dates: string;
    proceeds: number;
    cost: number;
    gain: number;
    exchangeRate: number;
  }> = [];
  
  const longTermTransactions: Array<{
    index: number;
    security: string;
    dates: string;
    proceeds: number;
    cost: number;
    gain: number;
    exchangeRate: number;
  }> = [];
  
  console.log(`Starting capital gains calculation for ${transactions.length} transactions...`);
  
  // Process each transaction
  transactions.forEach((transaction, index) => {
    // Skip if not a sale transaction (must have both acquisition and sell dates)
    if (!transaction.acquisitionDate || !transaction.sellDate) {
      console.log(`Skipping transaction #${index + 1}: Missing acquisition or sell date`);
      return;
    }
    
    const acquisitionDate = new Date(transaction.acquisitionDate);
    const sellDate = new Date(transaction.sellDate);
    
    // Determine if short-term or long-term
    const isShortTerm = isShortTermTransaction(acquisitionDate, sellDate);
    
    // Get exchange rate for the sell date
    const exchangeRate = getExchangeRate(sellDate);
    
    // Calculate gain for this transaction in USD
    const proceedsUSD = transaction.totalProceeds || 0;
    const costBasisUSD = transaction.totalCost || 0;
    const gainUSD = proceedsUSD - costBasisUSD;
    
    // Convert to INR
    const proceedsINR = convertUSDtoINR(proceedsUSD, sellDate);
    const costBasisINR = convertUSDtoINR(costBasisUSD, sellDate);
    const gainINR = convertUSDtoINR(gainUSD, sellDate);
    
    // Create transaction entry
    const transactionEntry = {
      index: index + 1,
      security: transaction.securityName || 'Unknown',
      dates: `${acquisitionDate.toISOString().split('T')[0]} to ${sellDate.toISOString().split('T')[0]}`,
      proceeds: proceedsINR,
      cost: costBasisINR,
      gain: gainINR,
      exchangeRate
    };
    
    // Add to appropriate category
    if (isShortTerm) {
      shortTerm.totalProceeds += proceedsINR;
      shortTerm.totalCostBasis += costBasisINR;
      shortTerm.totalGain += gainINR;
      shortTermTransactions.push(transactionEntry);
    } else {
      longTerm.totalProceeds += proceedsINR;
      longTerm.totalCostBasis += costBasisINR;
      longTerm.totalGain += gainINR;
      longTermTransactions.push(transactionEntry);
    }
  });
  
  // Log short term transactions
  console.log('\n===== SHORT TERM CAPITAL GAINS =====');
  if (shortTermTransactions.length === 0) {
    console.log('No short term transactions found.');
  } else {
    console.log(`Found ${shortTermTransactions.length} short term transactions:`);
    shortTermTransactions.forEach(tx => {
      console.log(`#${tx.index}: ${tx.security} | ${tx.dates} | Exchange Rate: ${tx.exchangeRate} | ` +
                 `Proceeds: ${formatCurrency(tx.proceeds)} | Cost: ${formatCurrency(tx.cost)} | Gain: ${formatCurrency(tx.gain)}`);
    });
    console.log(`\nShort Term Summary: Proceeds=${formatCurrency(shortTerm.totalProceeds)}, Cost=${formatCurrency(shortTerm.totalCostBasis)}, Gain=${formatCurrency(shortTerm.totalGain)}`);
  }
  
  // Log long term transactions
  console.log('\n===== LONG TERM CAPITAL GAINS =====');
  if (longTermTransactions.length === 0) {
    console.log('No long term transactions found.');
  } else {
    console.log(`Found ${longTermTransactions.length} long term transactions:`);
    longTermTransactions.forEach(tx => {
      console.log(`#${tx.index}: ${tx.security} | ${tx.dates} | Exchange Rate: ${tx.exchangeRate} | ` +
                 `Proceeds: ${formatCurrency(tx.proceeds)} | Cost: ${formatCurrency(tx.cost)} | Gain: ${formatCurrency(tx.gain)}`);
    });
    console.log(`\nLong Term Summary: Proceeds=${formatCurrency(longTerm.totalProceeds)}, Cost=${formatCurrency(longTerm.totalCostBasis)}, Gain=${formatCurrency(longTerm.totalGain)}`);
  }
  
  // Log overall summary
  console.log('\n===== OVERALL CAPITAL GAINS SUMMARY =====');
  console.log(`Total Transactions: ${shortTermTransactions.length + longTermTransactions.length}`);
  console.log(`Total Gain: ${formatCurrency(shortTerm.totalGain + longTerm.totalGain)}`);
  
  return { shortTerm, longTerm };
};

/**
 * Processes short-term capital gains from US equity data
 */
const processShortTermCapitalGains = (shortTermGains: CapitalGainSummary): ShortTermCapGainFor23 => {
    
    return {
        AmtDeemedStcg: 0,
        EquityMFonSTT: [{
            EquityMFonSTTDtls: createSaleTransaction(
                shortTermGains.totalProceeds,
                shortTermGains.totalCostBasis,
                shortTermGains.totalGain
            ),
            MFSectionCode: MFSectionCode.The1A // Section 111A for equity shares/units
        }],
        NRISecur115AD: createSaleTransaction(0, 0, 0),
        NRITransacSec48Dtl: createNRITransacSec48Dtl(),
        PassThrIncNatureSTCG: 0,
        SaleOnOtherAssets: createSaleTransaction(
            shortTermGains.totalProceeds,
            shortTermGains.totalCostBasis,
            shortTermGains.totalGain
        ),
        TotalAmtDeemedStcg: 0,
        TotalAmtNotTaxUsDTAAStcg: 0,
        TotalAmtTaxUsDTAAStcg: shortTermGains.totalForeignTaxPaid,
        TotalSTCG: shortTermGains.totalGain,
        UnutilizedStcgFlag: undefined // Optional flag, not setting it
    };
};

/**
 * Processes long-term capital gains from US equity data
 */
const processLongTermCapitalGains = (longTermGains: CapitalGainSummary): LongTermCapGain23 => {
    
    return {
        AmtDeemedLtcg: 0,
        NRISaleOfEquityShareUs112A: {
            BalanceCG: 0,
            CapgainonAssets: 0,
            DeductionUs54F: 0
        },
        NRISaleofForeignAsset: {
            BalOtherthanSpecAsset: 0,
            BalonSpeciAsset: 0,
            DednOtherSpecAssetus115: 0,
            DednSpecAssetus115: 0,
            SaleOtherSpecAsset: 0,
            SaleonSpecAsset: 0
        },
        PassThrIncNatureLTCG: 0,
        PassThrIncNatureLTCGUs112A: 0,
        SaleOfEquityShareUs112A: {
            BalanceCG: longTermGains.totalGain,
            CapgainonAssets: longTermGains.totalGain,
            DeductionUs54F: 0
        },
        // For SaleofAssetNA and SaleofBondsDebntr, we need to create custom transaction types
        // that include the DeductionUs54F property
        SaleofAssetNA: {
            ...createSaleTransaction(
                longTermGains.totalProceeds,
                longTermGains.totalCostBasis,
                longTermGains.totalGain
            ),
            DeductionUs54F: 0
        },
        SaleofBondsDebntr: {
            ...createSaleTransaction(0, 0, 0),
            DeductionUs54F: 0
        },
        TotalAmtDeemedLtcg: 0,
        TotalAmtNotTaxUsDTAALtcg: 0,
        TotalAmtTaxUsDTAALtcg: longTermGains.totalForeignTaxPaid,
        TotalLTCG: longTermGains.totalGain
    };
};

/**
 * Processes US equity data to generate the capital gains section of ITR-2
 * 
 * This function takes US equity statement data and populates the relevant sections
 * of Schedule CG in the ITR-2 form, including:
 * 1. Short-term capital gains (held for <= 24 months)
 * 2. Long-term capital gains (held for > 24 months)
 * 3. Foreign tax credit for taxes paid in the US
 * 
 * @param usEquityData - Parsed US equity statement data
 * @returns ScheduleCGFor23 object with capital gains information
 */
export const processUSEquityForITR = (usEquityData: USEquityStatement): ScheduleCGFor23 => {
    const capitalGains = calculateCapitalGains(usEquityData.transactions);
      
    const shortTermGains = processShortTermCapitalGains(capitalGains.shortTerm);
    const longTermGains = processLongTermCapitalGains(capitalGains.longTerm);
    
    const totalGains = shortTermGains.TotalSTCG + longTermGains.TotalLTCG;
    
    return {
        ShortTermCapGainFor23: shortTermGains,
        LongTermCapGain23: longTermGains,
        SumOfCGIncm: totalGains,
        TotScheduleCGFor23: totalGains,
        IncmFromVDATrnsf: 0,
        DeducClaimInfo: createDeducClaimInfo(),
        CurrYrLosses: createCurrYrLosses(shortTermGains.TotalSTCG, longTermGains.TotalLTCG),
        AccruOrRecOfCG: createAccruOrRecOfCG(shortTermGains.TotalSTCG, longTermGains.TotalLTCG)
    };
}; 