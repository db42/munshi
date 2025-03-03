import { USEquityStatement } from '../../types/usEquityStatement';
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
    LossRemainSetOff,
    TotLossSetOff,
    AccruOrRecOfCG,
    NRITransacSec48Dtl,
    DeducClaimInfo,
    MFSectionCode,
    CapGain
} from '../../types/itr';

/**
 * Interface defining the sections of ITR that are affected by US equity data
 */
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
 * Processes short-term capital gains from US equity data
 */
const processShortTermCapitalGains = (usEquityData: USEquityStatement): ShortTermCapGainFor23 => {
    const shortTermGains = usEquityData.capitalGains.shortTerm;
    
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
const processLongTermCapitalGains = (usEquityData: USEquityStatement): LongTermCapGain23 => {
    const longTermGains = usEquityData.capitalGains.longTerm;
    
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
    const shortTermGains = processShortTermCapitalGains(usEquityData);
    const longTermGains = processLongTermCapitalGains(usEquityData);
    
    const totalGains = shortTermGains.TotalSTCG + longTermGains.TotalLTCG;
    const totalForeignTax = shortTermGains.TotalAmtTaxUsDTAAStcg + longTermGains.TotalAmtTaxUsDTAALtcg;
    
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