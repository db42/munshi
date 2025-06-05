import { getLogger, ILogger } from '../../utils/logger';
import { Itr2, ScheduleSI, SplCodeRateTax, SECCode } from '../../types/itr';

// Define a constant for the foreign equity LTCG tax rate
const FOREIGN_EQUITY_LTCG_RATE = 0.125; // 12.5% as per Budget 2024 for unlisted shares/stocks

const logger: ILogger = getLogger('scheduleSIGenerator');

/**
 * Calculates Schedule SI (Special Income) from other ITR sections
 * This schedule handles income that is taxed at special rates
 * 
 * @param itr - The ITR object with other sections populated
 * @returns The calculated ScheduleSI section
 */
export const calculateScheduleSI = (itr: Itr2): ScheduleSI => {
    logger.debug('Calculating Schedule SI for special income tax rates.');
    
    const specialIncomeSources: SplCodeRateTax[] = [];
    let totalSpecialIncome = 0;
    let totalSpecialIncomeTax = 0;
    
    // Check for capital gains with special rates from ScheduleCG
    if (itr.ScheduleCGFor23) {
        // Short-term capital gains on shares/equity where STT paid (15%)
        if (itr.ScheduleCGFor23.ShortTermCapGainFor23?.EquityMFonSTT) {
            // Calculate total STCG at 15% rate from equity/MF transactions
            let stcgAmount = 0;
            const equityMFArray = itr.ScheduleCGFor23.ShortTermCapGainFor23.EquityMFonSTT;
            
            if (Array.isArray(equityMFArray) && equityMFArray.length > 0) {
                for (const item of equityMFArray) {
                    if (item.EquityMFonSTTDtls && item.EquityMFonSTTDtls.CapgainonAssets) {
                        stcgAmount += item.EquityMFonSTTDtls.CapgainonAssets;
                    }
                }
            }
            
            if (stcgAmount > 0) {
                // 15% tax rate for STCG on shares where STT paid (Section 111A)
                const taxRate = 15;
                const taxAmount = (stcgAmount * taxRate) / 100;
                
                specialIncomeSources.push({
                    SecCode: SECCode.The1A, // 111A - STCG on shares with STT paid
                    SplRateInc: stcgAmount,
                    SplRatePercent: taxRate,
                    SplRateIncTax: taxAmount
                });
                
                totalSpecialIncome += stcgAmount;
                totalSpecialIncomeTax += taxAmount;
            }
        }
        
        // Long-term capital gains on equity shares/units with STT paid (10% > 1L without indexation)
        if (itr.ScheduleCGFor23.LongTermCapGain23?.SaleOfEquityShareUs112A) {
            const ltcgAmount = itr.ScheduleCGFor23.LongTermCapGain23.SaleOfEquityShareUs112A.CapgainonAssets || 0;
            if (ltcgAmount > 0) {
                // Apply ₹1 lakh exemption under Section 112A
                const LTCG_EXEMPTION_LIMIT = 100000;
                const taxableAmount = Math.max(0, ltcgAmount - LTCG_EXEMPTION_LIMIT);
                
                if (taxableAmount > 0) {
                    // 10% tax rate for LTCG on shares/units where STT paid (Section 112A)
                    const taxRate = 10;
                    const taxAmount = (taxableAmount * taxRate) / 100;
                    
                    specialIncomeSources.push({
                        SecCode: SECCode.The2A, // 112A - LTCG on equity shares/MF with STT
                        SplRateInc: taxableAmount, // Only the taxable amount above ₹1 lakh
                        SplRatePercent: taxRate,
                        SplRateIncTax: taxAmount
                    });
                    
                    totalSpecialIncome += taxableAmount;
                    totalSpecialIncomeTax += taxAmount;
                    
                    logger.info(`LTCG Section 112A: Total gain ₹${ltcgAmount.toLocaleString('en-IN')}, Exemption ₹${LTCG_EXEMPTION_LIMIT.toLocaleString('en-IN')}, Taxable ₹${taxableAmount.toLocaleString('en-IN')}, Tax ₹${taxAmount.toLocaleString('en-IN')}`);
                } else {
                    logger.info(`LTCG Section 112A: Total gain ₹${ltcgAmount.toLocaleString('en-IN')} is within ₹1 lakh exemption limit - No tax applicable`);
                }
            }
        }
        
        // Post-budget 2024, LTCG on unlisted shares/stocks (including foreign equity) is 12.5%
        if (itr.ScheduleCGFor23?.LongTermCapGain23?.SaleofAssetNA?.CapgainonAssets) {
            const otherLTCG = itr.ScheduleCGFor23.LongTermCapGain23.SaleofAssetNA.CapgainonAssets;
            if (otherLTCG > 0) {
                // Using 12.5% rate as requested for now.
                const taxAmount = otherLTCG * FOREIGN_EQUITY_LTCG_RATE;

                logger.info(`Found Other LTCG of ₹${otherLTCG.toLocaleString('en-IN')}, Tax: ₹${taxAmount.toLocaleString('en-IN')}`);
                
                specialIncomeSources.push({
                    SecCode: SECCode.The5ACA1B, // Using existing foreign asset section for foreign equity
                    SplRateInc: otherLTCG,
                    SplRatePercent: FOREIGN_EQUITY_LTCG_RATE * 100,
                    SplRateIncTax: taxAmount
                });

                // Add to the running totals
                totalSpecialIncome += otherLTCG;
                totalSpecialIncomeTax += taxAmount;
            }
        }
        
        // Traditional LTCG with indexation benefit (20%)
        if (itr.ScheduleCGFor23.LongTermCapGain23?.SaleofLandBuild) {
            let ltcgAmount = 0;
            
            // Sum up LTCG from land and building sales
            if (itr.ScheduleCGFor23.LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls) {
                const saleItems = itr.ScheduleCGFor23.LongTermCapGain23.SaleofLandBuild.SaleofLandBuildDtls;
                for (const item of saleItems) {
                    if (item.LTCGonImmvblPrprty) {
                        ltcgAmount += item.LTCGonImmvblPrprty;
                    }
                }
            }
            
            if (ltcgAmount > 0) {
                // 20% tax rate for LTCG with indexation (Section 112)
                const taxRate = 20;
                const taxAmount = (ltcgAmount * taxRate) / 100;
                
                specialIncomeSources.push({
                    SecCode: SECCode.The21, // 112 - LTCG with indexation
                    SplRateInc: ltcgAmount,
                    SplRatePercent: taxRate,
                    SplRateIncTax: taxAmount
                });
                
                totalSpecialIncome += ltcgAmount;
                totalSpecialIncomeTax += taxAmount;
            }
        }
    }
    
    // Check for special income in Schedule OS (Other Sources)
    if (itr.ScheduleOS) {
        // Winnings from lottery, crossword puzzles, etc. (30%)
        if (itr.ScheduleOS.IncFrmLottery) {
            // Each date range in ScheduleOS is a DateRangeType which is an object with DateRange property
            let lotteryAmount = 0;
            
            // Sum up lottery income from different date ranges
            if (itr.ScheduleOS.IncFrmLottery.DateRange) {
                const dateRange = itr.ScheduleOS.IncFrmLottery.DateRange;
                lotteryAmount += (dateRange.Up16Of12To15Of3 || 0);
                lotteryAmount += (dateRange.Up16Of3To31Of3 || 0);
                lotteryAmount += (dateRange.Up16Of9To15Of12 || 0);
                lotteryAmount += (dateRange.Upto15Of6 || 0);
                lotteryAmount += (dateRange.Upto15Of9 || 0);
            }
            
            if (lotteryAmount > 0) {
                // 30% tax rate for lottery winnings (Section 115BB)
                const taxRate = 30;
                const taxAmount = (lotteryAmount * taxRate) / 100;
                
                specialIncomeSources.push({
                    SecCode: SECCode.The5Bb, // 115BB - Lottery winnings
                    SplRateInc: lotteryAmount,
                    SplRatePercent: taxRate,
                    SplRateIncTax: taxAmount
                });
                
                totalSpecialIncome += lotteryAmount;
                totalSpecialIncomeTax += taxAmount;
            }
        }
        
        // Interest received by non-resident or foreign company (Section 115A)
        if (itr.ScheduleOS.DividendDTAA) {
            // Foreign dividend income subject to special rates under DTAA
            let dtaaIncome = 0;
            
            if (itr.ScheduleOS.DividendDTAA.DateRange) {
                const dateRange = itr.ScheduleOS.DividendDTAA.DateRange;
                
                // Sum up dividend income from all date ranges
                dtaaIncome += (dateRange.Up16Of12To15Of3 || 0);
                dtaaIncome += (dateRange.Up16Of3To31Of3 || 0);
                dtaaIncome += (dateRange.Up16Of9To15Of12 || 0);
                dtaaIncome += (dateRange.Upto15Of6 || 0);
                dtaaIncome += (dateRange.Upto15Of9 || 0);
            }
            
            if (dtaaIncome > 0) {
                // Use 15% as default for foreign dividends if specific rate not known
                const taxRate = 15;
                const taxAmount = (dtaaIncome * taxRate) / 100;
                
                specialIncomeSources.push({
                    SecCode: SECCode.The5A1AI, // 115A(1)(a)(i) - Foreign dividend income
                    SplRateInc: dtaaIncome,
                    SplRatePercent: taxRate,
                    SplRateIncTax: taxAmount
                });
                
                totalSpecialIncome += dtaaIncome;
                totalSpecialIncomeTax += taxAmount;
            }
        }
    }
    
    // Check for VDA (Virtual Digital Assets) income
    if (itr.ScheduleVDA && itr.ScheduleVDA.TotIncCapGain > 0) {
        const vdaAmount = itr.ScheduleVDA.TotIncCapGain;
        // 30% flat tax rate for VDA income
        const taxRate = 30;
        const taxAmount = (vdaAmount * taxRate) / 100;
        
        specialIncomeSources.push({
            SecCode: SECCode.The5Bbh, // 115BBH - VDA income
            SplRateInc: vdaAmount,
            SplRatePercent: taxRate,
            SplRateIncTax: taxAmount
        });
        
        totalSpecialIncome += vdaAmount;
        totalSpecialIncomeTax += taxAmount;
    }
    
    // Return the completed ScheduleSI
    return {
        SplCodeRateTax: specialIncomeSources.length > 0 ? specialIncomeSources : undefined,
        TotSplRateInc: totalSpecialIncome,
        TotSplRateIncTax: totalSpecialIncomeTax
    };
}; 