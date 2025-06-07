import { ScheduleCGFor23, Schedule112A, Schedule112A115ADType, ShareOnOrBefore, Proviso112SectionCode } from '../types/itr';
import { CAMSMFCapitalGainData, CAMSMutualFundTransaction } from '../document-parsers/camsMFCapitalGainParser';
import { ParseResult } from '../utils/parserTypes';
import { getLogger, ILogger } from '../utils/logger';
import { 
    ShortTermCapGainFor23, 
    LongTermCapGain23, 
    DeductSec48,
    EquityOrUnitSec94Type,
    EquityOrUnitSec54Type,
    DateRangeType,
    AccruOrRecOfCG,
    CurrYrLosses,
    InLossSetOff,
    InStcg15Per,
    InLtcg10Per,
    InLtcg20Per,
    InLtcgDTAARate,
    InStcg30Per,
    InStcgAppRate,
    InStcgDTAARate,
    MFSectionCode,
    SECCode,
    EquityOrUnitSec54TypeDebn112
} from '../types/itr';

const logger: ILogger = getLogger('camsMFToITRProcessor');

/**
 * Interface for ITR sections generated from CAMS MF Capital Gain data
 */
export interface CAMSMFCapitalGainITRSections {
    scheduleCG: ScheduleCGFor23;
    schedule112A?: Schedule112A;
}

/**
 * Result type for the conversion function
 */
export type CAMSMFCapitalGainITRResult = ParseResult<CAMSMFCapitalGainITRSections>;

/**
 * Constants for capital gain tax treatment
 */
export const CAPITAL_GAIN_CONSTANTS = {
    // Equity - Section 111A and 112A
    EQUITY_STCG_TAX_RATE: 15,
    EQUITY_LTCG_TAX_RATE: 10,
    EQUITY_LTCG_EXEMPTION_LIMIT: 100000,  // ₹1 lakh exemption for LTCG

    // Debt - Section 112
    DEBT_LTCG_TAX_RATE: 20,
    
    // Tax code sections (using SECCode enum values)
    SECTION_111A: SECCode.The1A,  // STCG on equity at 15%
    SECTION_112A: SECCode.The2A,  // LTCG on equity at 10% above ₹1 lakh
    SECTION_112: SECCode.The21,    // LTCG on debt at 20% with indexation
    
    // Asset holding periods (in days)
    EQUITY_LONG_TERM_THRESHOLD: 365,     // > 1 year
    DEBT_LONG_TERM_THRESHOLD: 3 * 365,   // > 3 years
};

/**
 * Helper function to create a default DeductSec48 object with the given cost basis
 */
const createDeductSec48 = (costBasis: number): DeductSec48 => ({
    AquisitCost: costBasis,
    ExpOnTrans: 0,
    ImproveCost: 0,
    TotalDedn: costBasis // Total deduction is sum of all costs
});

/**
 * Helper function to create a default DateRangeType object with a specified amount
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
 * Helper function to create an AccruOrRecOfCG object
 */
const createAccruOrRecOfCG = (
    equitySTCG: number, 
    equityLTCG: number,
    debtSTCG: number, 
    debtLTCG: number
): AccruOrRecOfCG => ({
    // Equity STCG goes to 15% bracket (Section 111A)
    ShortTermUnder15Per: createDateRange(equitySTCG),
    
    // Debt STCG goes to normal income (applicable rate)
    ShortTermUnderAppRate: createDateRange(debtSTCG),
    
    // Equity LTCG goes to 10% bracket (Section 112A)
    LongTermUnder10Per: createDateRange(equityLTCG),
    
    // Debt LTCG goes to 20% bracket (Section 112)
    LongTermUnder20Per: createDateRange(debtLTCG),
    
    // Other rates not applicable for domestic MF
    ShortTermUnder30Per: createDateRange(0),
    ShortTermUnderDTAARate: createDateRange(0),
    LongTermUnderDTAARate: createDateRange(0),
    VDATrnsfGainsUnder30Per: createDateRange(0)
});

/**
 * Helper function to create a CurrYrLosses object for loss set off
 */
const createCurrYrLosses = (
    equitySTCG: number, 
    equityLTCG: number,
    debtSTCG: number, 
    debtLTCG: number
): CurrYrLosses => ({
    InLossSetOff: {
        LtclSetOff10Per: 0,
        LtclSetOff20Per: 0,
        LtclSetOffDTAARate: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    } as InLossSetOff,
    
    // Equity STCG - 15% tax rate
    InStcg15Per: {
        CurrYearIncome: equitySTCG,
        CurrYrCapGain: equitySTCG,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    } as InStcg15Per,
    
    // Normal rate - primarily for debt STCG
    InStcgAppRate: {
        CurrYearIncome: debtSTCG,
        CurrYrCapGain: debtSTCG,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffDTAARate: 0
    } as InStcgAppRate,
    
    // Equity LTCG - 10% tax rate (Section 112A)
    InLtcg10Per: {
        CurrYearIncome: equityLTCG,
        CurrYrCapGain: equityLTCG,
        LtclSetOff20Per: 0,
        LtclSetOffDTAARate: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    } as InLtcg10Per,
    
    // Debt LTCG - 20% tax rate (Section 112)
    InLtcg20Per: {
        CurrYearIncome: debtLTCG,
        CurrYrCapGain: debtLTCG,
        LtclSetOff10Per: 0,
        LtclSetOffDTAARate: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    } as InLtcg20Per,
    
    // Other rates not applicable for domestic MF
    InStcg30Per: {
        CurrYearIncome: 0,
        CurrYrCapGain: 0,
        StclSetoff15Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    } as InStcg30Per,
    
    InStcgDTAARate: {
        CurrYearIncome: 0,
        CurrYrCapGain: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0
    } as InStcgDTAARate,
    
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
    
    LossRemainSetOff: {
        LtclSetOff10Per: 0,
        LtclSetOff20Per: 0,
        LtclSetOffDTAARate: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    },
    
    TotLossSetOff: {
        LtclSetOff10Per: 0,
        LtclSetOff20Per: 0,
        LtclSetOffDTAARate: 0,
        StclSetoff15Per: 0,
        StclSetoff30Per: 0,
        StclSetoffAppRate: 0,
        StclSetoffDTAARate: 0
    }
});

/**
 * Helper function to create a sale transaction
 */
const createSaleTransaction = (proceeds: number, costBasis: number, gain: number): EquityOrUnitSec94Type => ({
    BalanceCG: gain,
    CapgainonAssets: gain,
    DeductSec48: createDeductSec48(costBasis),
    FullConsideration: proceeds,
    LossSec94of7Or94of8: 0,
    FairMrktValueUnqshr: 0,
    FullValueConsdOthUnqshr: 0,
    FullValueConsdRecvUnqshr: 0,
    FullValueConsdSec50CA: 0
});

// Helper function to create a sale transaction specifically for AssetNA (EquityOrUnitSec54Type)
const createSaleTransactionForAssetNA = (proceeds: number, costBasis: number, gain: number, deductionUs54F: number): EquityOrUnitSec54Type => ({
    BalanceCG: gain,
    CapgainonAssets: gain,
    DeductSec48: createDeductSec48(costBasis),
    FullConsideration: proceeds,
    FairMrktValueUnqshr: proceeds, // Assuming Fair Market Value is same as Full Consideration for this context
    FullValueConsdOthUnqshr: 0,    // Defaulting these as per typical usage for SaleofAssetNA
    FullValueConsdRecvUnqshr: 0,
    FullValueConsdSec50CA: 0,
    DeductionUs54F: deductionUs54F
});

// Helper function to create a sale transaction specifically for Bonds/Debentures (EquityOrUnitSec54TypeDebn112)
const createSaleTransactionForBondsDebentures = (proceeds: number, costBasis: number, gain: number, deductionUs54F: number): EquityOrUnitSec54TypeDebn112 => ({
    BalanceCG: gain,
    CapgainonAssets: gain,
    DeductSec48: createDeductSec48(costBasis),
    FullConsideration: proceeds,
    DeductionUs54F: deductionUs54F
});

/**
 * Process the short-term capital gains from CAMS MF data
 */
const processShortTermCapitalGains = (
    transactions: CAMSMutualFundTransaction[]
): ShortTermCapGainFor23 => {
    // Filter for STCG transactions
    const stcgTransactions = transactions.filter(txn => txn.capitalGainType === 'STCG');
    
    // Separate equity and debt MF transactions
    const equitySTCGTransactions = stcgTransactions.filter(txn => txn.assetCategory === 'Equity');
    const debtSTCGTransactions = stcgTransactions.filter(txn => txn.assetCategory === 'Debt' || txn.assetCategory === 'Hybrid');
    
    // Calculate totals
    const equityTotalProceeds = equitySTCGTransactions.reduce((sum, txn) => sum + txn.saleValue, 0);
    const equityTotalCost = equitySTCGTransactions.reduce((sum, txn) => sum + txn.acquisitionValue, 0);
    const equityTotalGain = equitySTCGTransactions.reduce((sum, txn) => sum + txn.gainOrLoss, 0);
    
    const debtTotalProceeds = debtSTCGTransactions.reduce((sum, txn) => sum + txn.saleValue, 0);
    const debtTotalCost = debtSTCGTransactions.reduce((sum, txn) => sum + txn.acquisitionValue, 0);
    const debtTotalGain = debtSTCGTransactions.reduce((sum, txn) => sum + txn.gainOrLoss, 0);
    
    // Create the ShortTermCapGainFor23 object
    return {
        // For EquityMFonSTT, we use section 111A (15% tax rate)
        EquityMFonSTT: equityTotalGain !== 0 ? [{
            EquityMFonSTTDtls: createSaleTransaction(
                equityTotalProceeds,
                equityTotalCost,
                equityTotalGain
            ),
            MFSectionCode: MFSectionCode.The1A // Section 111A
        }] : [ //default array if no STCG
            {
                EquityMFonSTTDtls: {
                    BalanceCG: 0,
                    CapgainonAssets: 0,
                    DeductSec48: {
                      AquisitCost: 0,
                      ExpOnTrans: 0,
                      ImproveCost: 0,
                      TotalDedn: 0
                    },
                    FullConsideration: 0,
                    LossSec94of7Or94of8: 0
                },
                MFSectionCode: MFSectionCode.The1A
            }, 
            {
                EquityMFonSTTDtls: {
                    BalanceCG: 0,
                    CapgainonAssets: 0,
                    DeductSec48: {
                      AquisitCost: 0,
                      ExpOnTrans: 0,
                      ImproveCost: 0,
                      TotalDedn: 0
                    },
                    FullConsideration: 0,
                    LossSec94of7Or94of8: 0
                },
                MFSectionCode: MFSectionCode.The5AD1Biip
            }

        ],
        
        // For debt funds, gains are taxed at slab rate, so we put them in SaleOnOtherAssets
        SaleOnOtherAssets: debtTotalGain !== 0 ? 
            createSaleTransaction(debtTotalProceeds, debtTotalCost, debtTotalGain) : 
            createSaleTransaction(0, 0, 0),
        
        // Set other required fields
        AmtDeemedStcg: 0,
        NRISecur115AD: createSaleTransaction(0, 0, 0),
        NRITransacSec48Dtl: {
            NRItaxSTTNotPaid: 0,
            NRItaxSTTPaid: 0
        },
        PassThrIncNatureSTCG: 0,
        TotalAmtDeemedStcg: 0,
        TotalAmtNotTaxUsDTAAStcg: 0,
        TotalAmtTaxUsDTAAStcg: 0,
        
        // Total short-term capital gain is sum of equity and debt
        TotalSTCG: equityTotalGain + debtTotalGain
    };
};

/**
 * Process the long-term capital gains from CAMS MF data
 * todo: this information is also available in camsData.summary. can be used to avoid re-processing the transactions.
 */
const processLongTermCapitalGains = (
    transactions: CAMSMutualFundTransaction[]
): LongTermCapGain23 => {
    // Filter for LTCG transactions
    const ltcgTransactions = transactions.filter(txn => txn.capitalGainType === 'LTCG');
    
    // Separate equity and debt MF transactions
    const equityLTCGTransactions = ltcgTransactions.filter(txn => txn.assetCategory === 'Equity');
    const debtLTCGTransactions = ltcgTransactions.filter(txn => txn.assetCategory === 'Debt' || txn.assetCategory === 'Hybrid');
    
    // Calculate totals
    const equityTotalGain = equityLTCGTransactions.reduce((sum, txn) => sum + txn.gainOrLoss, 0);
    
    // TODO: Clarify if txn.acquisitionValue for debt LTCG already includes indexation.
    // If not, indexation (using Cost Inflation Index - CII) needs to be applied here 
    // or ensured that the parser provides the indexed cost of acquisition for debt LTCG.
    // Taxable LTCG on debt funds (Section 112) is calculated on indexed cost.
    const debtTotalProceeds = debtLTCGTransactions.reduce((sum, txn) => sum + txn.saleValue, 0);
    const debtTotalCost = debtLTCGTransactions.reduce((sum, txn) => sum + txn.acquisitionValue, 0);
    const debtTotalGain = debtLTCGTransactions.reduce((sum, txn) => sum + txn.gainOrLoss, 0);
    
    // Create the LongTermCapGain23 object
    return {
        // For equity funds, use section 112A (10% tax on gains above ₹1 lakh)
        SaleOfEquityShareUs112A: {
            BalanceCG: equityTotalGain,
            CapgainonAssets: equityTotalGain,
            DeductionUs54F: 0
        },
        
        // For debt funds, gains are taxed at 20% with indexation under section 112
        // These go in SaleofAssetNA
        SaleofAssetNA: createSaleTransactionForAssetNA(debtTotalProceeds, debtTotalCost, debtTotalGain, 0),
        
        // Set other required fields
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
        SaleofBondsDebntr: createSaleTransactionForBondsDebentures(0, 0, 0, 0),
        PassThrIncNatureLTCG: 0,
        PassThrIncNatureLTCGUs112A: 0,
        TotalAmtDeemedLtcg: 0,
        TotalAmtNotTaxUsDTAALtcg: 0,
        TotalAmtTaxUsDTAALtcg: 0,
        
        // Total long-term capital gain is sum of equity and debt
        TotalLTCG: equityTotalGain + debtTotalGain,
        Proviso112Applicable: [{
          Proviso112Applicabledtls: {
            BalanceCG: 0,
            CapgainonAssets: 0,
            DeductSec48: {
              AquisitCost: 0,
              ExpOnTrans: 0,
              ImproveCost: 0,
              TotalDedn: 0
            },
            DeductionUs54F: 0,
            FullConsideration: 0
          },
          Proviso112SectionCode: Proviso112SectionCode.The22
          },
          {
            Proviso112Applicabledtls: {
            BalanceCG: 0,
            CapgainonAssets: 0,
            DeductSec48: {
              AquisitCost: 0,
              ExpOnTrans: 0,
              ImproveCost: 0,
              TotalDedn: 0
            },
            DeductionUs54F: 0,
            FullConsideration: 0
          },
          Proviso112SectionCode: Proviso112SectionCode.The5ACA1B
        },
       ]
    };
};

/**
 * Generate the Schedule CG section for capital gains
 */
const generateScheduleCG = (
    camsData: CAMSMFCapitalGainData
): ScheduleCGFor23 => {
    // Process transactions into short-term and long-term gains
    const shortTermGains = processShortTermCapitalGains(camsData.transactions);
    const longTermGains = processLongTermCapitalGains(camsData.transactions);
    
    // Calculate totals
    const totalGains = shortTermGains.TotalSTCG + longTermGains.TotalLTCG;
    
    // Extract individual gain components for detailed reporting
    const equitySTCG = camsData.transactions
        .filter(txn => txn.capitalGainType === 'STCG' && txn.assetCategory === 'Equity')
        .reduce((sum, txn) => sum + txn.gainOrLoss, 0);
    
    const debtSTCG = camsData.transactions
        .filter(txn => txn.capitalGainType === 'STCG' && (txn.assetCategory === 'Debt' || txn.assetCategory === 'Hybrid'))
        .reduce((sum, txn) => sum + txn.gainOrLoss, 0);
    
    const equityLTCG = camsData.transactions
        .filter(txn => txn.capitalGainType === 'LTCG' && txn.assetCategory === 'Equity')
        .reduce((sum, txn) => sum + txn.gainOrLoss, 0);
    
    const debtLTCG = camsData.transactions
        .filter(txn => txn.capitalGainType === 'LTCG' && (txn.assetCategory === 'Debt' || txn.assetCategory === 'Hybrid'))
        .reduce((sum, txn) => sum + txn.gainOrLoss, 0);
    
    return {
        ShortTermCapGainFor23: shortTermGains,
        LongTermCapGain23: longTermGains,
        SumOfCGIncm: totalGains,
        TotScheduleCGFor23: totalGains,
        IncmFromVDATrnsf: 0,
        DeducClaimInfo: {
            TotDeductClaim: 0,
            DeducClaimDtlsUs54: [],
            DeducClaimDtlsUs54B: [],
            DeducClaimDtlsUs54EC: [],
            DeducClaimDtlsUs54F: [],
            DeducClaimDtlsUs115F: []
        },
        CurrYrLosses: createCurrYrLosses(equitySTCG, equityLTCG, debtSTCG, debtLTCG),
        AccruOrRecOfCG: createAccruOrRecOfCG(equitySTCG, equityLTCG, debtSTCG, debtLTCG)
    };
};

/**
 * Generates Schedule 112A from equity LTCG transactions
 */
const generateSchedule112A = (
    transactions: CAMSMutualFundTransaction[]
): Schedule112A | undefined => {
    const equityLTCGTransactions = transactions.filter(
        txn => txn.assetCategory === 'Equity' && txn.capitalGainType === 'LTCG'
    );

    if (equityLTCGTransactions.length === 0) {
        return undefined;
    }

    // TODO: Implement proper grandfathering logic for Section 112A.
    // This requires: 
    // 1. Access to Fair Market Value (FMV) as of Jan 31, 2018, for units acquired on or before this date.
    //    This FMV should be provided by the CAMSMutualFundTransaction type (from the parser).
    // 2. Correct calculation of Cost of Acquisition based on grandfathering rules:
    //    Higher of (actual cost) AND (lower of (FMV as of Jan 31, 2018) AND (sale price)).
    // 3. Update FairMktValuePerShareunit, TotFairMktValueCapAst, AcquisitionCost, and LTCGBeforelowerB1B2 accordingly.

    const schedule112ADtls: Schedule112A115ADType[] = [];
    let totalSaleValue112A = 0;
    let totalCostAcqWithoutIndx112A = 0;
    let totalFairMktValueCapAst112A = 0; // Placeholder - Needs FMV data from parser
    let totalExpExclCnctTransfer112A = 0; // Assuming zero transfer expenses for now
    let totalDeductions112A = 0; // Assuming zero deductions for now
    let totalBalance112A = 0;
    let totalLTCGBeforelowerB1B2112A = 0; // Placeholder

    const grandfatheringDate = new Date('2018-01-31');

    for (const txn of equityLTCGTransactions) {
        const shareOnOrBefore = txn.purchaseDate <= grandfatheringDate ? ShareOnOrBefore.Be : ShareOnOrBefore.AE;
        const costAcquisition = txn.acquisitionValue;
        const saleValue = txn.saleValue;
        const balance = txn.gainOrLoss;

        // --- Placeholders/Assumptions ---
        // These require data potentially missing from the current CAMSMutualFundTransaction type
        // or require more complex calculation logic (e.g., grandfathering).
        const fairMarketValuePerUnit = 0; // Needs FMV on 31-Jan-2018 if ShareOnOrBefore.Be
        const ltcgBeforeLowerB1B2 = balance;
        const fairMarketValueTotal = fairMarketValuePerUnit * txn.units;
        const deductions = 0;
        const expenses = 0;

        const detail: Schedule112A115ADType = {
            ISINCode: txn.isin,
            ShareUnitName: txn.fundName, // Or schemeName
            NumSharesUnits: txn.redemptionUnits,
            SalePricePerShareUnit: txn.navOnSale, // Assuming NAV is per unit price
            TotSaleValue: saleValue,
            CostAcqWithoutIndx: costAcquisition,
            AcquisitionCost: costAcquisition,
            FairMktValuePerShareunit: fairMarketValuePerUnit,
            TotFairMktValueCapAst: fairMarketValueTotal,
            ExpExclCnctTransfer: expenses,
            LTCGBeforelowerB1B2: ltcgBeforeLowerB1B2,
            TotalDeductions: deductions,
            Balance: balance,
            ShareOnOrBefore: shareOnOrBefore,
        };
        schedule112ADtls.push(detail);

        // Aggregate totals
        totalSaleValue112A += saleValue;
        totalCostAcqWithoutIndx112A += costAcquisition;
        totalFairMktValueCapAst112A += fairMarketValueTotal;
        totalExpExclCnctTransfer112A += expenses;
        totalDeductions112A += deductions;
        totalBalance112A += balance;
        totalLTCGBeforelowerB1B2112A += ltcgBeforeLowerB1B2;
    }

    const schedule112A: Schedule112A = {
        Schedule112ADtls: schedule112ADtls,
        SaleValue112A: Math.round(totalSaleValue112A),
        CostAcqWithoutIndx112A: Math.round(totalCostAcqWithoutIndx112A),
        AcquisitionCost112A: Math.round(totalCostAcqWithoutIndx112A),
        FairMktValueCapAst112A: Math.round(totalFairMktValueCapAst112A),
        ExpExclCnctTransfer112A: Math.round(totalExpExclCnctTransfer112A),
        LTCGBeforelowerB1B2112A: Math.round(totalLTCGBeforelowerB1B2112A),
        Deductions112A: Math.round(totalDeductions112A),
        Balance112A: Math.round(totalBalance112A),
    };

    return schedule112A;
};

/**
 * Main function to convert CAMS MF Capital Gain data to ITR sections
 * 
 * @param camsData - CAMS MF Capital Gain data
 * @param assessmentYear - Assessment year in format YYYY-YY
 * @returns Generated ITR sections
 */
export const convertCAMSMFCapitalGainToITR = (
    camsData: CAMSMFCapitalGainData,
    assessmentYear: string
): CAMSMFCapitalGainITRResult => {
    try {
        logger.info(`Starting conversion of CAMS MF Capital Gain data for AY ${assessmentYear}`);

        if (!camsData || !camsData.transactions || camsData.transactions.length === 0) {
            logger.warn(`No CAMS MF transactions found to process for AY ${assessmentYear}`);
            return {
                success: false,
                error: 'No CAMS MF transactions found'
            };
        }

        // 1. Generate Schedule CG (as before)
        const scheduleCG = generateScheduleCG(camsData);

        // 2. Generate Schedule 112A (new step)
        const schedule112A = generateSchedule112A(camsData.transactions);
        if (schedule112A) {
            logger.info(`Generated Schedule 112A with ${schedule112A.Schedule112ADtls?.length || 0} detail entries.`);
        } else {
             logger.info('No equity LTCG transactions found, skipping Schedule 112A generation.');
        }

        const resultData: CAMSMFCapitalGainITRSections = {
            scheduleCG: scheduleCG,
            schedule112A: schedule112A
        };

        logger.info(`Successfully converted CAMS MF Capital Gain data for AY ${assessmentYear}`);

        return {
            success: true,
            data: resultData
        };
    } catch (error: any) {
        logger.error(`Error converting CAMS MF Capital Gain data: ${error.message}`, { stack: error.stack });
        return {
            success: false,
            error: `Error converting CAMS MF Capital Gain data: ${error.message}`
        };
    }
}; 