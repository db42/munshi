import { Itr2, PartBTI } from '../../types/itr';
import { getLogger, ILogger } from '../../utils/logger';

const logger: ILogger = getLogger('partBTIGenerator');

/**
 * Calculates PartB_TI based on all merged ITR sections
 * 
 * This centralized function calculates income totals across all sections:
 * - Salary income from ScheduleS
 * - Income from Other Sources (dividends, interest) from ScheduleOS
 * - Capital Gains from ScheduleCG
 * 
 * @param itr - The ITR object with merged sections
 * @returns The calculated PartB_TI section
 */
export const calculatePartBTI = (itr: Itr2): PartBTI => {
    // Start with a base PartB_TI
    const partBTI: PartBTI = {
        TotalIncome: 0,
        CurrentYearLoss: 0,
        GrossTotalIncome: 0,
        AggregateIncome: 0,
        BalanceAfterSetoffLosses: 0,
        BroughtFwdLossesSetoff: 0,
        CapGain: {
            CapGains30Per115BBH: 0,
            LongTerm: {
                LongTerm10Per: 0,
                LongTerm20Per: 0,
                LongTermSplRateDTAA: 0,
                TotalLongTerm: 0
            },
            ShortTerm: {
                ShortTerm15Per: 0,
                ShortTerm30Per: 0,
                ShortTermAppRate: 0,
                ShortTermSplRateDTAA: 0,
                TotalShortTerm: 0
            },
            ShortTermLongTermTotal: 0,
            TotalCapGains: 0
        },
        DeductionsUnderScheduleVIA: 0,
        DeemedIncomeUs115JC: 0,
        IncChargeTaxSplRate111A112: 0,
        IncChargeableTaxSplRates: 0,
        IncFromOS: {
            FromOwnRaceHorse: 0,
            IncChargblSplRate: 0,
            OtherSrcThanOwnRaceHorse: 0,
            TotIncFromOS: 0
        },
        IncomeFromHP: 0,
        LossesOfCurrentYearCarriedFwd: 0,
        NetAgricultureIncomeOrOtherIncomeForRate: 0,
        Salaries: 0,
        TotalTI: 0
    };
    
    // Calculate income from salary (ScheduleS)
    let salaryIncome = 0;
    if (itr.ScheduleS) {
        // Extract salary income from ScheduleS using TotIncUnderHeadSalaries
        salaryIncome = itr.ScheduleS.TotIncUnderHeadSalaries || 0;
        
        // If TotIncUnderHeadSalaries isn't available, calculate from other fields
        if (salaryIncome === 0 && itr.ScheduleS.TotalGrossSalary !== undefined) {
            const grossSalary = itr.ScheduleS.TotalGrossSalary || 0;
            const deductions = itr.ScheduleS.DeductionUS16 || 0;
            salaryIncome = Math.max(0, grossSalary - deductions);
        }
    }
    
    // Calculate income from other sources (ScheduleOS)
    let incomeFromOS = 0;
    if (itr.ScheduleOS) {
        // Extract income from other sources
        incomeFromOS = itr.ScheduleOS.IncChargeable || 0;
        
        // Update PartB_TI structure for other sources
        partBTI.IncFromOS.OtherSrcThanOwnRaceHorse = incomeFromOS;
        partBTI.IncFromOS.TotIncFromOS = incomeFromOS;
    }
    
    // Calculate capital gains (ScheduleCGFor23)
    let capitalGains = 0;
    let shortTermCapitalGains = 0;
    let longTermCapitalGains = 0;
    if (itr.ScheduleCGFor23) {
        // Use the total capital gains directly from the schedule
        capitalGains = itr.ScheduleCGFor23.SumOfCGIncm || 0;
        
        // Extract short-term and long-term gains separately
        shortTermCapitalGains = itr.ScheduleCGFor23.ShortTermCapGainFor23?.TotalSTCG || 0;
        longTermCapitalGains = itr.ScheduleCGFor23.LongTermCapGain23?.TotalLTCG || 0;
        
        // Update total capital gains in PartB_TI
        partBTI.CapGain.TotalCapGains = capitalGains;
        partBTI.CapGain.ShortTermLongTermTotal = capitalGains;
        partBTI.CapGain.ShortTerm.TotalShortTerm = shortTermCapitalGains;
        partBTI.CapGain.LongTerm.TotalLongTerm = longTermCapitalGains;
    }
    
    // Update PartB_TI values
    partBTI.Salaries = salaryIncome;
    
    // Process brought forward losses from ScheduleBFLA
    let broughtForwardLosses = 0;
    
    if (itr.ScheduleBFLA) {
        // Use the already calculated BFLA values instead of recalculating
        broughtForwardLosses = itr.ScheduleBFLA.TotalBFLossSetOff?.TotBFLossSetoff || 0;
        
        logger.info(`Using BFLA calculated losses: ${broughtForwardLosses}`);
        
        // Use specific income fields after BFLA
        if (itr.ScheduleCGFor23) {
            // Populate specific short-term capital gains rates
            partBTI.CapGain.ShortTerm.ShortTerm15Per = 
                itr.ScheduleBFLA.STCG15Per?.IncBFLA.IncOfCurYrAfterSetOffBFLosses || 0;
            partBTI.CapGain.ShortTerm.ShortTerm30Per = 
                itr.ScheduleBFLA.STCG30Per?.IncBFLA.IncOfCurYrAfterSetOffBFLosses || 0;
            partBTI.CapGain.ShortTerm.ShortTermAppRate = 
                itr.ScheduleBFLA.STCGAppRate?.IncBFLA.IncOfCurYrAfterSetOffBFLosses || 0;
            partBTI.CapGain.ShortTerm.ShortTermSplRateDTAA = 
                itr.ScheduleBFLA.STCGDTAARate?.IncBFLA.IncOfCurYrAfterSetOffBFLosses || 0;
                
            // Populate specific long-term capital gains rates
            partBTI.CapGain.LongTerm.LongTerm10Per = 
                itr.ScheduleCYLA?.LTCG10Per?.IncCYLA.IncOfCurYrAfterSetOff || 0;
            partBTI.CapGain.LongTerm.LongTerm20Per = 
                itr.ScheduleBFLA.LTCG20Per?.IncBFLA.IncOfCurYrAfterSetOffBFLosses || 0;
            partBTI.CapGain.LongTerm.LongTermSplRateDTAA = 
                itr.ScheduleBFLA.LTCGDTAARate?.IncBFLA.IncOfCurYrAfterSetOffBFLosses || 0;
                
            // Recalculate totals based on the BFLA-adjusted values
            partBTI.CapGain.ShortTerm.TotalShortTerm = 
                partBTI.CapGain.ShortTerm.ShortTerm15Per +
                partBTI.CapGain.ShortTerm.ShortTerm30Per +
                partBTI.CapGain.ShortTerm.ShortTermAppRate +
                partBTI.CapGain.ShortTerm.ShortTermSplRateDTAA;
                
            partBTI.CapGain.LongTerm.TotalLongTerm = 
                partBTI.CapGain.LongTerm.LongTerm10Per +
                partBTI.CapGain.LongTerm.LongTerm20Per +
                partBTI.CapGain.LongTerm.LongTermSplRateDTAA;
                
            partBTI.CapGain.TotalCapGains = 
                partBTI.CapGain.ShortTerm.TotalShortTerm + 
                partBTI.CapGain.LongTerm.TotalLongTerm;
                
            partBTI.CapGain.ShortTermLongTermTotal = partBTI.CapGain.TotalCapGains;
            
            // Populate income chargeable at special rates (111A/112)
            const ltcg10PerForSplRate = itr.ScheduleBFLA?.LTCG10Per?.IncBFLA.IncOfCurYrAfterSetOffBFLosses || 0;
            partBTI.IncChargeTaxSplRate111A112 = 
                partBTI.CapGain.ShortTerm.ShortTerm15Per +  // Section 111A (STCG 15%)
                ltcg10PerForSplRate +    // Section 112A (LTCG 10%) - BFLA Adjusted
                partBTI.CapGain.LongTerm.LongTerm20Per;     // Section 112 (LTCG 20%)
                
            partBTI.IncChargeableTaxSplRates = partBTI.IncChargeTaxSplRate111A112;
        }
    } else {
        // Log warning when BFLA is not available
        logger.warn('ScheduleBFLA is not available. Cannot apply brought forward losses accurately.');
    }
    
    partBTI.BroughtFwdLossesSetoff = broughtForwardLosses;
    
    // Calculate final total income
    partBTI.AggregateIncome = salaryIncome + incomeFromOS;
    partBTI.TotalTI = salaryIncome + incomeFromOS + capitalGains;
    partBTI.BalanceAfterSetoffLosses = salaryIncome + incomeFromOS + capitalGains;

    partBTI.GrossTotalIncome = salaryIncome + incomeFromOS + capitalGains - broughtForwardLosses;
    partBTI.TotalIncome = salaryIncome + incomeFromOS + capitalGains - broughtForwardLosses;
    return partBTI;
};
