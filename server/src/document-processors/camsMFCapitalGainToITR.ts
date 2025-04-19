import { CapGain, Itr2, ScheduleCGFor23 } from '../types/itr';
import { CAMSMFCapitalGainData, CAMSMutualFundTransaction } from '../document-parsers/camsMFCapitalGainParser';
import { ParseResult } from '../utils/parserTypes';
import { logger } from '../utils/logger';
import cloneDeep from 'lodash/cloneDeep';
import { 
    ShortTermCapGainFor23, 
    LongTermCapGain23, 
    DeductSec48,
    EquityOrUnitSec94Type,
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
    SECCode
} from '../types/itr';

/**
 * Interface for ITR sections generated from CAMS MF Capital Gain data
 */
export interface CAMSMFCapitalGainITRSections {
    scheduleCG: ScheduleCGFor23;
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
    LongTermUnderDTAARate: createDateRange(0)
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
        }] : undefined,
        
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
    const equityTotalProceeds = equityLTCGTransactions.reduce((sum, txn) => sum + txn.saleValue, 0);
    const equityTotalCost = equityLTCGTransactions.reduce((sum, txn) => sum + txn.acquisitionValue, 0);
    const equityTotalGain = equityLTCGTransactions.reduce((sum, txn) => sum + txn.gainOrLoss, 0);
    
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
        SaleofAssetNA: {
            ...createSaleTransaction(debtTotalProceeds, debtTotalCost, debtTotalGain),
            DeductionUs54F: 0
        },
        
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
        SaleofBondsDebntr: {
            ...createSaleTransaction(0, 0, 0),
            DeductionUs54F: 0
        },
        PassThrIncNatureLTCG: 0,
        PassThrIncNatureLTCGUs112A: 0,
        TotalAmtDeemedLtcg: 0,
        TotalAmtNotTaxUsDTAALtcg: 0,
        TotalAmtTaxUsDTAALtcg: 0,
        
        // Total long-term capital gain is sum of equity and debt
        TotalLTCG: equityTotalGain + debtTotalGain
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
        logger.info(`Processing CAMS MF capital gains for assessment year: ${assessmentYear}`);
        
        // Generate Schedule CG
        const scheduleCG = generateScheduleCG(camsData);
        
        // Extract individual gain components for logging purposes
        const equitySTCG = camsData.transactions
            .filter(txn => txn.capitalGainType === 'STCG' && txn.assetCategory === 'Equity')
            .reduce((sum, txn) => sum + txn.gainOrLoss, 0);
        
        const equityLTCG = camsData.transactions
            .filter(txn => txn.capitalGainType === 'LTCG' && txn.assetCategory === 'Equity')
            .reduce((sum, txn) => sum + txn.gainOrLoss, 0);
        
        const debtLTCG = camsData.transactions
            .filter(txn => txn.capitalGainType === 'LTCG' && (txn.assetCategory === 'Debt' || txn.assetCategory === 'Hybrid'))
            .reduce((sum, txn) => sum + txn.gainOrLoss, 0);
        
        logger.info(`Successfully processed CAMS MF capital gains. Equity STCG: ${equitySTCG}, Equity LTCG: ${equityLTCG}, Debt LTCG: ${debtLTCG}`);
        
        // Return only the Schedule CG section, Schedule SI will be computed centrally
        return {
            success: true,
            data: {
                scheduleCG
            }
        };
    } catch (error) {
        logger.error(`Error processing CAMS MF capital gains: ${error instanceof Error ? error.message : String(error)}`);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}; 