import { Itr2 } from '../../types/itr';
import { getLogger, ILogger } from '../../utils/logger';
import { NEW_REGIME_SLABS, OLD_REGIME_SLABS, getSlabCalculationBreakdownText, getSlabTax } from './taxUtils';

// Create a named logger instance for this module
const logger: ILogger = getLogger('computationSheet');

// Helper function to format numbers as currency strings, padded for alignment
const formatCurrency = (value: number | undefined, width = 20): string => {
    if (value === undefined || isNaN(value)) {
        return '₹'.padStart(width);
    }
    return `₹ ${Math.round(value).toLocaleString('en-IN')}`.padStart(width);
};

// Helper function to create a divider line for the report
const divider = (length = 80, char = '-') => char.repeat(length);

/**
 * Generates a human-readable tax computation sheet from a completed ITR object.
 *
 * @param itr - The final, calculated Itr2 object.
 * @returns A formatted string representing the tax computation sheet.
 */
export const generateComputationSheet = (itr: Itr2): string => {
    const ptti = itr.PartB_TTI;
    const pti = itr['PartB-TI'];
    const si = itr.ScheduleSI;

    if (!ptti || !pti) {
        logger.warn('Could not generate computation sheet because PartB_TTI or PartB-TI is missing.');
        return '';
    }

    const sheet: string[] = [];

    // Header
    sheet.push(divider(80, '='));
    sheet.push('COMPUTATION OF INCOME AND TAX'.padStart(55));
    sheet.push(`For Assessment Year ${itr.Form_ITR2.AssessmentYear}-${(parseInt(itr.Form_ITR2.AssessmentYear, 10) + 1).toString().substring(2)}`.padStart(55));
    sheet.push(divider(80, '='));
    sheet.push('');

    // Part A: Computation of Total Income
    sheet.push('PART A: COMPUTATION OF TOTAL INCOME');
    sheet.push(divider(80));
    
    // Income from Salary
    sheet.push(`1. Income from Salaries`.padEnd(60) + formatCurrency(pti.Salaries));
    // Income from House Property
    sheet.push(`2. Income from House Property`.padEnd(60) + formatCurrency(pti.IncomeFromHP));
    // Capital Gains
    const totalCG = pti.CapGain?.ShortTermLongTermTotal ?? 0;
    sheet.push(`3. Capital Gains`.padEnd(60) + formatCurrency(totalCG));
    // Income from Other Sources
    sheet.push(`4. Income from Other Sources`.padEnd(60) + formatCurrency(pti.IncFromOS?.TotIncFromOS));
    
    sheet.push(divider(80));
    // Gross Total Income
    sheet.push(`   GROSS TOTAL INCOME (GTI)`.padEnd(60) + formatCurrency(pti.GrossTotalIncome));
    sheet.push(divider(80));
    
    // Deductions
    sheet.push(`Less: Deductions under Chapter VI-A`.padEnd(60) + formatCurrency(pti.DeductionsUnderScheduleVIA));
    sheet.push(divider(80));

    // Total Income
    sheet.push(`   TOTAL INCOME`.padEnd(60) + formatCurrency(pti.TotalIncome));
    sheet.push(divider(80, '='));
    sheet.push('');

    // Part B: Computation of Tax Liability
    sheet.push('PART B: COMPUTATION OF TAX LIABILITY');
    sheet.push(divider(80));

    // Tax on Special Rate Income
    if (si && si.TotSplRateInc > 0) {
        sheet.push('   Tax on Special Rate Incomes:');
        si.SplCodeRateTax?.forEach(item => {
            const description = `   - On ₹${item.SplRateInc.toLocaleString('en-IN')} @ ${item.SplRatePercent}% (u/s ${item.SecCode})`;
            sheet.push(description.padEnd(60) + formatCurrency(item.SplRateIncTax));
        });
        sheet.push('   '.padEnd(60) + '---------------');
        sheet.push('   Total Tax on Special Income'.padEnd(60) + formatCurrency(si.TotSplRateIncTax));
        sheet.push('');
    }

    // Tax on Regular Income
    const regularIncome = pti.TotalIncome - (si?.TotSplRateInc ?? 0);
    const taxOnRegularIncome = ptti.ComputationOfTaxLiability.TaxPayableOnTI.TaxAtNormalRatesOnAggrInc;
    sheet.push(`   Tax on Regular Income of ${formatCurrency(regularIncome, 0)} (at slab rates)`.padEnd(60) + formatCurrency(taxOnRegularIncome));

    // Determine which regime was used by silently calculating tax with both slab sets
    const taxUnderOldRegime = getSlabTax(regularIncome, OLD_REGIME_SLABS);
    const taxUnderNewRegime = getSlabTax(regularIncome, NEW_REGIME_SLABS);
    
    let breakdown: string[] = [];
    if (Math.round(taxUnderNewRegime) === Math.round(taxOnRegularIncome)) {
        breakdown = getSlabCalculationBreakdownText(regularIncome, NEW_REGIME_SLABS, 'New Regime');
    } else if (Math.round(taxUnderOldRegime) === Math.round(taxOnRegularIncome)) {
        breakdown = getSlabCalculationBreakdownText(regularIncome, OLD_REGIME_SLABS, 'Old Regime');
    }
    sheet.push(...breakdown);

    sheet.push('');

    // Total Tax and Rebate
    const totalTaxBeforeRebate = taxOnRegularIncome + (si?.TotSplRateIncTax ?? 0);
    sheet.push('   Total Tax (before Rebate)'.padEnd(60) + formatCurrency(totalTaxBeforeRebate));
    sheet.push(`Less: Rebate u/s 87A`.padEnd(60) + formatCurrency(ptti.ComputationOfTaxLiability.Rebate87A));
    sheet.push(divider(80));
    const taxPayableOnRebate = ptti.ComputationOfTaxLiability.TaxPayableOnRebate;
    sheet.push(`   Tax Payable`.padEnd(60) + formatCurrency(taxPayableOnRebate));
    
    // Surcharge
    sheet.push(`Add: Surcharge ${Math.round(ptti.Surcharge/taxPayableOnRebate*100)}%`.padEnd(60) + formatCurrency(ptti.Surcharge));
    const taxWithSurcharge = taxPayableOnRebate + (ptti.Surcharge ?? 0);
    sheet.push('   '.padEnd(60) + '---------------');
    sheet.push(`   Tax and Surcharge`.padEnd(60) + formatCurrency(taxWithSurcharge));
    
    // Cess
    sheet.push(`Add: Health & Education Cess @ 4%`.padEnd(60) + formatCurrency(ptti.HealthEduCess));
    sheet.push(divider(80));

    // Gross Tax Liability
    sheet.push(`   GROSS TAX LIABILITY`.padEnd(60) + formatCurrency(ptti.ComputationOfTaxLiability.GrossTaxLiability));
    sheet.push(divider(80));

    // Relief
    sheet.push(`Less: Tax Relief`.padEnd(60) + formatCurrency(ptti.ComputationOfTaxLiability.TaxRelief?.TotTaxRelief));
    sheet.push(divider(80));
    
    // Net Tax Liability
    sheet.push(`   NET TAX LIABILITY`.padEnd(60) + formatCurrency(ptti.ComputationOfTaxLiability.NetTaxLiability));
    sheet.push(divider(80, '='));
    sheet.push('');

    // Part C: Taxes Paid and Balance
    sheet.push('PART C: TAXES PAID & BALANCE');
    sheet.push(divider(80));

    sheet.push(`1. Tax Deducted at Source (TDS)`.padEnd(60) + formatCurrency(ptti.TaxPaid.TaxesPaid.TDS));
    sheet.push(`2. Tax Collected at Source (TCS)`.padEnd(60) + formatCurrency(ptti.TaxPaid.TaxesPaid.TCS));
    sheet.push(`3. Advance & Self-Assessment Tax`.padEnd(60) + formatCurrency(ptti.TaxPaid.TaxesPaid.SelfAssessmentTax + ptti.TaxPaid.TaxesPaid.AdvanceTax));
    sheet.push(divider(80));
    sheet.push(`   TOTAL TAXES PAID`.padEnd(60) + formatCurrency(ptti.TaxPaid.TaxesPaid.TotalTaxesPaid));
    sheet.push(divider(80, '='));

    // Final Result
    if (ptti.Refund.RefundDue > 0) {
        sheet.push(`   REFUND DUE`.padEnd(60) + formatCurrency(ptti.Refund.RefundDue));
    } else {
        sheet.push(`   BALANCE TAX PAYABLE`.padEnd(60) + formatCurrency(ptti.TaxPaid.BalTaxPayable));
    }
    sheet.push(divider(80, '='));

    return sheet.join('\n');
}; 