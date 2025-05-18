// partBTTIProcessor.ts
import { AssetOutIndiaFlag, BankAccountDtls, Itr2, PartBTI, PartBTTI, TaxRescertifiedFlag, BankDetailType, AccountType as ITR_AccountType } from '../../types/itr';
import { logCalculation, TaxSlab, calculatePercentage, calculateSurcharge, calculateTaxForSlabs, calculateRebate87A, NEW_REGIME_SLABS, OLD_REGIME_SLABS, createEmptyPartBTTI } from './taxUtils';
import { getLogger, ILogger } from '../../utils/logger';
import { BankAccount as UserInputBankAccount } from '../../types/userInput.types';

// Create a named logger instance for this module
const logger: ILogger = getLogger('partBTTI');

export enum TaxRegimePreference {
    OLD = 'OLD',
    NEW = 'NEW',
    AUTO = 'AUTO'
}

/**
 * Calculates PartB_TTI based on PartB_TI and other ITR sections
 * 
 * This function:
 * 1. Calculates tax on total income
 * 2. Applies appropriate rebates and surcharges
 * 3. Calculates educational cess
 * 4. Applies tax relief for foreign taxes
 * 5. Calculates final tax liability
 * 
 * @param itr - The complete ITR object with all sections
 * @param regimePreference - Tax regime preference (OLD, NEW, or AUTO)
 * @returns The calculated PartB_TTI section
 */
export const calculatePartBTTI = (
    itr: Itr2,
    regimePreference: TaxRegimePreference = TaxRegimePreference.AUTO,
    bankDetails?: UserInputBankAccount[] | undefined
): PartBTTI => {
    let regimeResult: PartBTTI;

    // Calculate tax under both regimes and compare
    logger.info('\n=== Comparing Both Tax Regimes ===\n');
    
    logger.info('Calculating Old Regime Tax:');
    const oldRegimeResult = calculatePartBTTIOldRegime(itr);
    
    logger.info('\nCalculating New Regime Tax:');
    const newRegimeResult = calculatePartBTTINewRegime(itr);
    
    logger.info('\n=== Tax Regime Comparison Summary ===');
    logCalculation('Old Regime - Total Tax', oldRegimeResult.ComputationOfTaxLiability.GrossTaxPayable);
    logCalculation('New Regime - Total Tax', newRegimeResult.ComputationOfTaxLiability.GrossTaxPayable);

    if (regimePreference === TaxRegimePreference.OLD) {
        logger.info('\nUsing Old Tax Regime as per preference');
        regimeResult = oldRegimeResult;
    } else if (regimePreference === TaxRegimePreference.NEW) {
        logger.info('\nUsing New Tax Regime as per preference');
        regimeResult = newRegimeResult;
    } else {
        logger.info('\nBoth regimes result in same tax liability - Using New Regime as default');
        // Determine which regime is more beneficial
        const taxDifference = 
            oldRegimeResult.ComputationOfTaxLiability.GrossTaxPayable - 
            newRegimeResult.ComputationOfTaxLiability.GrossTaxPayable;

        if (taxDifference > 0) {
            logger.info(`\nNew Regime is more beneficial - Saves ₹${taxDifference.toLocaleString('en-IN')}`);
            regimeResult = newRegimeResult;
        } else if (taxDifference < 0) {
            logger.info(`\nOld Regime is more beneficial - Saves ₹${Math.abs(taxDifference).toLocaleString('en-IN')}`);
            regimeResult = oldRegimeResult;
        } else {
            logger.info('\nBoth regimes result in same tax liability - Using New Regime as default');
            regimeResult = newRegimeResult;
        }
    }

    regimeResult.Refund.BankAccountDtls = getBankAccountDtls(bankDetails);
    return regimeResult;
};

const getBankAccountDtls = (bankDetails?: UserInputBankAccount[] | undefined): BankAccountDtls => {
    if (!bankDetails || bankDetails.length === 0) {
        return {
            BankDtlsFlag: TaxRescertifiedFlag.N,
            AddtnlBankDetails: [],
            ForeignBankDetails: [],
        };
    }

    // Create a mutable copy to reorder if necessary
    const orderedBankDetails = [...bankDetails];
    const primaryAccountIndex = orderedBankDetails.findIndex(acc => acc.isPrimary === true);

    // If a primary account exists and it's not already at the first position, move it to the front.
    if (primaryAccountIndex > 0) { // primaryAccountIndex === 0 means it's already first
        const primaryAccount = orderedBankDetails.splice(primaryAccountIndex, 1)[0];
        orderedBankDetails.unshift(primaryAccount);
    }

    const itrBankAccounts: BankDetailType[] = orderedBankDetails.map(acc => {
        let itrAccountType: ITR_AccountType;
        switch (acc.accountType) {
            case 'SB':
                itrAccountType = ITR_AccountType.Sb;
                break;
            case 'CA':
                itrAccountType = ITR_AccountType.CA;
                break;
            default:
                logger.warn(`Unknown bank account type from user input: ${acc.accountType}, defaulting to SB.`);
                itrAccountType = ITR_AccountType.Sb;
        }
        return {
            IFSCCode: acc.ifsc,
            BankAccountNo: acc.accountNumber,
            BankName: acc.bankName,
            AccountType: itrAccountType,
        };
    });

    return {
        BankDtlsFlag: TaxRescertifiedFlag.Y,
        AddtnlBankDetails: itrBankAccounts,
    };
};

/**
 * Common function to calculate tax and prepare PartB_TTI
 * 
 * @param itr - The complete ITR object with all sections
 * @param isNewRegime - Whether to use new regime or old regime
 * @param slabs - Tax slabs to use for calculation
 * @param regimeName - Name of the regime for logging
 * @returns The calculated PartB_TTI section
 */
const calculateTaxAndPreparePartBTTI = (
    itr: Itr2, 
    isNewRegime: boolean, 
    slabs: TaxSlab[], 
    regimeName: string
): PartBTTI => {
    logger.info(`\n=== Starting ${regimeName} Tax Calculation ===\n`);
    
    // Initialize values
    let taxOnIncome = 0;
    let rebate87A = 0;
    let surcharge = 0;
    let healthAndEducationCess = 0;
    let totalTaxPayable = 0;
    let tdsPaid = 0;
    let foreignTaxCredit = 0;
    
    // Extract income from PartB_TI
    const partBTI = itr["PartB-TI"];
    if (!partBTI) {
        // If no PartB_TI, return minimal PartB_TTI
        return createEmptyPartBTTI();
    }
    
    const totalIncome = partBTI.TotalIncome || 0;
    logCalculation('Total Taxable Income', totalIncome);
    
    // Calculate tax based on selected regime
    taxOnIncome = calculateTaxForSlabs(totalIncome, slabs, regimeName);
    logCalculation('Tax on Income (before surcharge)', taxOnIncome);
    
    // Apply Rebate under section 87A
    rebate87A = calculateRebate87A(totalIncome, taxOnIncome, isNewRegime);
    
    // Calculate Surcharge (if applicable)
    surcharge = calculateSurcharge(taxOnIncome, totalIncome);
    logCalculation('Surcharge', surcharge);
    
    // Calculate Health and Education Cess
    healthAndEducationCess = calculatePercentage(taxOnIncome + surcharge, 0.04);
    logCalculation('Health and Education Cess', healthAndEducationCess);
    
    // Calculate tax liability before relief
    const taxLiabilityBeforeRelief = Math.max(0, taxOnIncome + surcharge + healthAndEducationCess - rebate87A);
    logCalculation('Tax Liability (before relief)', taxLiabilityBeforeRelief);
    
    // Process foreign tax credit from Schedule TR1
    if (itr.ScheduleTR1 && itr.ScheduleTR1.TotalTaxReliefOutsideIndia) {
        foreignTaxCredit = itr.ScheduleTR1.TotalTaxReliefOutsideIndia;
        logCalculation('Foreign Tax Credit', foreignTaxCredit);
    }
    
    // Apply tax relief (limited to tax liability)
    const taxRelief = Math.min(foreignTaxCredit, taxLiabilityBeforeRelief);
    logCalculation('Tax Relief Applied', taxRelief);
    
    // Calculate final tax liability
    totalTaxPayable = Math.max(0, taxLiabilityBeforeRelief - taxRelief);
    logCalculation('Total Tax Payable', totalTaxPayable);
    
    // Calculate TDS already paid
    if (itr.ScheduleTDS1) {
        tdsPaid += itr.ScheduleTDS1.TotalTDSonSalaries || 0;
    }
    
    if (itr.ScheduleTDS2) {
        tdsPaid += itr.ScheduleTDS2.TotalTDSonOthThanSals || 0;
    }
    
    if (itr.ScheduleTDS3) {
        tdsPaid += itr.ScheduleTDS3.TotalTDS3OnOthThanSal || 0;
    }
    logCalculation('TDS Already Paid', tdsPaid);
    
    // Calculate any Advance Tax and Self Assessment Tax paid
    // ScheduleIT contains the total of both Advance Tax and Self Assessment Tax.
    // Assigning the total to SelfAssessmentTax for now as the structure requires separate fields.
    const advanceTax = 0; 
    const selfAssessmentTax = itr.ScheduleIT?.TotalTaxPayments || 0; 
    logCalculation('Self Assessment Tax Paid (includes Advance Tax)', selfAssessmentTax);

    // Calculate Tax Collected at Source (TCS)
    const tcs = itr.ScheduleTCS?.TotalSchTCS || 0;
    logCalculation('Tax Collected at Source (TCS)', tcs);
    
    const totalTaxesPaid = tdsPaid + advanceTax + selfAssessmentTax + tcs;
    logCalculation('Total Taxes Paid', totalTaxesPaid);
    
    // Calculate balance tax payable or refund due
    const balanceTaxPayable = Math.max(0, totalTaxPayable - totalTaxesPaid);
    const refundDue = totalTaxesPaid > totalTaxPayable ? totalTaxesPaid - totalTaxPayable : 0;
    logCalculation('Balance Tax Payable', balanceTaxPayable);
    logCalculation('Refund Due', refundDue);

    logger.info(`\n=== End ${regimeName} Tax Calculation ===\n`);
    
    // Construct and return PartB_TTI
    return {
        TaxPayDeemedTotIncUs115JC: 0,
        TotalTaxPayablDeemedTotInc: 0,

        ComputationOfTaxLiability: {
            TaxPayableOnTI: {
                TaxAtNormalRatesOnAggrInc: taxOnIncome,
                TaxAtSpecialRates: 0,
                RebateOnAgriInc: 0,
                TaxPayableOnTotInc: taxOnIncome
            },
            
            Rebate87A: rebate87A,
            TaxPayableOnRebate: Math.max(0, taxOnIncome - rebate87A),
            
            Surcharge25ofSI: 0,
            SurchargeOnAboveCrore: surcharge,
            Surcharge25ofSIBeforeMarginal: 0,
            SurchargeOnAboveCroreBeforeMarginal: surcharge,
            TotalSurcharge: surcharge,
            
            EducationCess: healthAndEducationCess,
            
            GrossTaxLiability: taxLiabilityBeforeRelief,
            GrossTaxPayable: taxLiabilityBeforeRelief,

            GrossTaxPay: {
                TaxDeferred17: 0,
                TaxDeferredPayableCY: 0,
                TaxInc17: taxLiabilityBeforeRelief
            },
            
            CreditUS115JD: 0,
            TaxPayAfterCreditUs115JD: taxLiabilityBeforeRelief,
            
            TaxRelief: {
                Section89: 0,
                Section90: foreignTaxCredit,
                Section91: 0,
                TotTaxRelief: taxRelief
            },
            
            NetTaxLiability: totalTaxPayable,
            
            IntrstPay: {
                IntrstPayUs234A: 0,
                IntrstPayUs234B: 0,
                IntrstPayUs234C: 0,
                LateFilingFee234F: 0,
                TotalIntrstPay: 0
            },
            
            AggregateTaxInterestLiability: totalTaxPayable
        },

        Surcharge: surcharge,
        HealthEduCess: healthAndEducationCess,

        TaxPaid: {
            TaxesPaid: {
                AdvanceTax: advanceTax,
                TDS: tdsPaid,
                TCS: tcs,
                SelfAssessmentTax: selfAssessmentTax,
                TotalTaxesPaid: totalTaxesPaid
            },
            BalTaxPayable: balanceTaxPayable
        },

        Refund: {
            RefundDue: refundDue,
            BankAccountDtls: {
                BankDtlsFlag: TaxRescertifiedFlag.N,
            }
        },

        AssetOutIndiaFlag: itr.ScheduleFA ? AssetOutIndiaFlag.Yes : AssetOutIndiaFlag.No,
    };
};

/**
 * Calculates PartB_TTI for New Tax Regime
 * 
 * @param itr - The complete ITR object with all sections
 * @returns The calculated PartB_TTI section under new regime
 */
const calculatePartBTTINewRegime = (itr: Itr2): PartBTTI => {
    return calculateTaxAndPreparePartBTTI(itr, true, NEW_REGIME_SLABS, 'New Regime');
};

/**
 * Calculates PartB_TTI for Old Tax Regime
 * 
 * @param itr - The complete ITR object with all sections
 * @returns The calculated PartB_TTI section under old regime
 */
const calculatePartBTTIOldRegime = (itr: Itr2): PartBTTI => {
    return calculateTaxAndPreparePartBTTI(itr, false, OLD_REGIME_SLABS, 'Old Regime');
};