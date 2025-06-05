import { Itr2, PartBTI } from '../../types/itr';
import { getLogger, ILogger } from '../../utils/logger';

// Create a named logger instance for this module
const logger: ILogger = getLogger('partBTI');

/**
 * Calculates PartB_TI based on various schedules in the ITR object.
 * This function aggregates incomes from all heads after set-offs from CYLA and BFLA.
 * 
 * @param itr - The complete ITR object with all sections
 * @returns The calculated PartB_TI section
 */
export const calculatePartBTI = (itr: Itr2): PartBTI => {
    logger.info('\n--- Starting PartB-TI Calculation ---');

    // Income figures from various heads. We start with CYLA figures and then apply BFLA.
    // This is a simplification; a more robust BFLA application would adjust each head individually.
    let incomeFromSalaries = itr.ScheduleCYLA?.Salary?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0;
    let incomeFromHP = itr.ScheduleCYLA?.HP?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0;
    
    // Sum of all capital gains after CYLA
    let stcgPostCYLA = (itr.ScheduleCYLA?.STCG15Per?.IncCYLA.IncOfCurYrAfterSetOff ?? 0) +
                       (itr.ScheduleCYLA?.STCG30Per?.IncCYLA.IncOfCurYrAfterSetOff ?? 0) +
                       (itr.ScheduleCYLA?.STCGAppRate?.IncCYLA.IncOfCurYrAfterSetOff ?? 0) +
                       (itr.ScheduleCYLA?.STCGDTAARate?.IncCYLA.IncOfCurYrAfterSetOff ?? 0);
    
    let ltcgPostCYLA = (itr.ScheduleCYLA?.LTCG10Per?.IncCYLA.IncOfCurYrAfterSetOff ?? 0) +
                       (itr.ScheduleCYLA?.LTCG20Per?.IncCYLA.IncOfCurYrAfterSetOff ?? 0) +
                       (itr.ScheduleCYLA?.LTCGDTAARate?.IncCYLA.IncOfCurYrAfterSetOff ?? 0);

    let totalCapitalGains = stcgPostCYLA + ltcgPostCYLA;
    let incomeFromOS = itr.ScheduleCYLA?.OthSrcExclRaceHorse?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0;

    // Gross Total Income before BFLA set-off
    const grossTotalIncomePostCYLA = incomeFromSalaries + incomeFromHP + totalCapitalGains + incomeFromOS;

    // Deductions from Schedule VIA
    const deductionsUnderVIA = itr.ScheduleVIA?.DeductUndChapVIA.TotalChapVIADeductions || 0;

    // Total brought forward losses to be set off
    const broughtForwardLossesSetoff = itr.ScheduleBFLA?.TotalBFLossSetOff?.TotBFLossSetoff ?? 0;

    // Gross Total Income after BFLA
    const grossTotalIncome = Math.max(0, grossTotalIncomePostCYLA - broughtForwardLossesSetoff);

    // Total Income (Net Taxable Income)
    const totalIncome = Math.max(0, grossTotalIncome - deductionsUnderVIA);

    logger.info(`Gross Total Income (post CYLA & BFLA): ₹${grossTotalIncome.toLocaleString('en-IN')}`);
    logger.info(`Deductions under Chapter VI-A: ₹${deductionsUnderVIA.toLocaleString('en-IN')}`);
    logger.info(`Total Income (Net Taxable Income): ₹${totalIncome.toLocaleString('en-IN')}`);

    // Create the PartB-TI object ensuring all mandatory fields are present
    const partBTI: PartBTI = {
        GrossTotalIncome: grossTotalIncome,
        DeductionsUnderScheduleVIA: deductionsUnderVIA,
        TotalIncome: totalIncome,
        TotalTI: totalIncome,
        BalanceAfterSetoffLosses: grossTotalIncomePostCYLA, // GTI after CYLA but before BFLA
        BroughtFwdLossesSetoff: broughtForwardLossesSetoff,
        Salaries: incomeFromSalaries,
        IncomeFromHP: incomeFromHP,
        CapGain: {
            CapGains30Per115BBH: 0,
            ShortTermLongTermTotal: totalCapitalGains,
            ShortTerm: {
                ShortTerm15Per: itr.ScheduleCYLA?.STCG15Per?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0,
                ShortTerm30Per: itr.ScheduleCYLA?.STCG30Per?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0,
                ShortTermAppRate: itr.ScheduleCYLA?.STCGAppRate?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0,
                ShortTermSplRateDTAA: itr.ScheduleCYLA?.STCGDTAARate?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0,
                TotalShortTerm: stcgPostCYLA,
            },
            LongTerm: {
                LongTerm10Per: itr.ScheduleCYLA?.LTCG10Per?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0,
                LongTerm20Per: itr.ScheduleCYLA?.LTCG20Per?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0,
                LongTermSplRateDTAA: itr.ScheduleCYLA?.LTCGDTAARate?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0,
                TotalLongTerm: ltcgPostCYLA,
            },
            TotalCapGains: totalCapitalGains,
        },
        IncFromOS: {
            FromOwnRaceHorse: 0,
            IncChargblSplRate: 0,
            OtherSrcThanOwnRaceHorse: incomeFromOS,
            TotIncFromOS: incomeFromOS,
        },
        AggregateIncome: totalIncome, 
        NetAgricultureIncomeOrOtherIncomeForRate: itr.ScheduleEI?.NetAgriIncOrOthrIncRule7 ?? 0,
        IncChargeableTaxSplRates: itr.ScheduleSI?.TotSplRateInc ?? 0,
        IncChargeTaxSplRate111A112: itr.ScheduleSI?.SplCodeRateTax?.find(
            (item) => item.SecCode === '1A' || item.SecCode === '2A'
        )?.SplRateInc ?? 0,
        DeemedIncomeUs115JC: 0,
        CurrentYearLoss: (itr.ScheduleCYLA?.TotalCurYr.TotHPlossCurYr ?? 0) + (itr.ScheduleCYLA?.TotalCurYr.TotOthSrcLossNoRaceHorse ?? 0),
        LossesOfCurrentYearCarriedFwd: ((itr.ScheduleCFL?.TotalLossCFSummary?.LossSummaryDetail?.TotalHPPTILossCF ?? 0) +
                                       (itr.ScheduleCFL?.TotalLossCFSummary?.LossSummaryDetail?.TotalLTCGPTILossCF ?? 0) +
                                       (itr.ScheduleCFL?.TotalLossCFSummary?.LossSummaryDetail?.TotalSTCGPTILossCF ?? 0) +
                                       (itr.ScheduleCFL?.TotalLossCFSummary?.LossSummaryDetail?.OthSrcLossRaceHorseCF ?? 0)),
    };

    logger.info('--- Finished PartB-TI Calculation ---\n');
    return partBTI;
};
