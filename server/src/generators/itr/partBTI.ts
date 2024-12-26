import { Form16 } from '../../types/form16';
import { PartBTI } from '../../types/itr';

/**
 * Processes Part B-TI (Computation of Total Income) of ITR-2
 * 
 * Part B-TI is a crucial section in ITR-2 that computes the total taxable income by:
 * 1. Aggregating income from all sources (Salary, House Property, Capital Gains, Other Sources)
 * 2. Adjusting for current year losses
 * 3. Setting off brought forward losses
 * 4. Applying Chapter VI-A deductions
 * 
 * @param form16 - Form 16 data from employer
 * @returns PartBTI object containing complete income computation
 */
export const processPartBTI = (form16: Form16): PartBTI => {
    // Step 1: Calculate Income from Salary
    // This includes gross salary minus exempt allowances and standard deduction
    const salaryIncome = form16.salaryDetails.grossSalary.total;
    const exemptAllowances = form16.salaryDetails.allowanceExemptSection10 || 0;
    const deductions = form16.deductions?.total || 0;
    const netSalaryIncome = salaryIncome - exemptAllowances - deductions;

    // Step 2: Calculate Income from House Property
    // Will be populated when processing Form 26AS or rent receipts
    const housePropertyIncome = 0;

    // Step 3: Calculate Capital Gains
    // Will be populated when processing trading statements
    const shortTermCapitalGains = 0;
    const longTermCapitalGains = 0;

    // Step 4: Calculate Income from Other Sources
    // Includes interest income, dividends etc.
    const otherSourcesIncome = 0;

    // Step 5: Calculate Gross Total Income
    const grossTotalIncome = netSalaryIncome + 
        housePropertyIncome + 
        shortTermCapitalGains + 
        longTermCapitalGains + 
        otherSourcesIncome;

    // Step 6: Calculate Current Year Losses
    // For example, loss from house property can be set off against other heads
    const currentYearLoss = 0;

    // Step 7: Calculate Balance After Set-off
    const balanceAfterSetOff = Math.max(0, grossTotalIncome - currentYearLoss);

    // Step 8: Apply Brought Forward Losses
    // These are losses from previous years that can be carried forward
    const broughtForwardLossesSetOff = 0;

    return {
        // 1. Income from Salary 
        // (as computed in Schedule S)
        Salaries: netSalaryIncome,

        // 2. Income from House Property
        // (as computed in Schedule HP)
        IncomeFromHP: housePropertyIncome,

        // 3. Capital Gains
        // (as computed in Schedule CG)
        CapGain: {
            ShortTermLongTermTotal: 0,
            CapGains30Per115BBH: 0,
            ShortTerm: {
                // Short-term gains taxed at 15% (equity shares, equity mutual funds)
                ShortTerm15Per: 0,
                // Short-term gains taxed at 30% (debt funds held < 3 years)
                ShortTerm30Per: 0,
                // Short-term gains taxed at slab rates
                ShortTermAppRate: shortTermCapitalGains,
                // Special rates as per DTAA
                ShortTermSplRateDTAA: 0,
                TotalShortTerm: shortTermCapitalGains
            },
            LongTerm: {
                // Long-term gains taxed at 10% (equity shares > 1 year)
                LongTerm10Per: 0,
                // Long-term gains taxed at 20% with indexation
                LongTerm20Per: longTermCapitalGains,
                // Special rates as per DTAA
                LongTermSplRateDTAA: 0,
                TotalLongTerm: longTermCapitalGains
            },
            TotalCapGains: shortTermCapitalGains + longTermCapitalGains
        },

        // 4. Income from Other Sources
        // (as computed in Schedule OS)
        IncFromOS: {
            // Regular income like interest, dividends
            OtherSrcThanOwnRaceHorse: otherSourcesIncome,
            // Income taxable at special rates
            IncChargblSplRate: 0,
            // Income from owning and maintaining race horses
            FromOwnRaceHorse: 0,
            TotIncFromOS: otherSourcesIncome
        },

        // 5. Total of All Heads of Income
        TotalTI: grossTotalIncome,

        // 6. Current Year Loss Adjustment
        // Losses under any head to be adjusted against income under other heads
        CurrentYearLoss: currentYearLoss,
        
        // 7. Balance After Set-off of Current Year Losses
        BalanceAfterSetoffLosses: balanceAfterSetOff,

        // 8. Brought Forward Losses
        // Previous years' losses to be adjusted against current year income
        BroughtFwdLossesSetoff: broughtForwardLossesSetOff,

        // 9. Gross Total Income
        // (7 - 8)
        GrossTotalIncome: Math.max(0, balanceAfterSetOff - broughtForwardLossesSetOff),

        // 10. Income Chargeable to Tax at Special Rates
        // Income like STCG on equity (15%), LTCG on equity (10%)
        IncChargeTaxSplRate111A112: 0,

        // 11. Deductions under Chapter VI-A
        // Includes 80C, 80D, etc. deductions
        DeductionsUnderScheduleVIA: 0,

        // 12. Total Income
        // (9 - 11)
        TotalIncome: Math.max(0, balanceAfterSetOff - broughtForwardLossesSetOff),

        // 13. Income chargeable to tax at special rates
        IncChargeableTaxSplRates: 0,

        // 14. Net agricultural income
        // Used for rate purpose when agricultural income > 5000
        NetAgricultureIncomeOrOtherIncomeForRate: 0,

        // 15. Aggregate Income
        // (12 + 14)
        AggregateIncome: Math.max(0, balanceAfterSetOff - broughtForwardLossesSetOff),

        // 16. Losses to be Carried Forward
        // Current year losses that couldn't be set off
        LossesOfCurrentYearCarriedFwd: currentYearLoss > grossTotalIncome ? currentYearLoss - grossTotalIncome : 0,

        // 17. Deemed Total Income under AMT
        // Adjusted Total Income for AMT calculation
        DeemedIncomeUs115JC: 0
    };
};