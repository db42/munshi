// partBTTIProcessor.ts
import { Form16 } from '../../types/form16';
import { PartBTTI } from '../../types/itr';
import { calculateOldRegimeTax } from './oldRegimeTaxCalculator';
import { calculateNewRegimeTax } from './newRegimeTaxCalculator';
import { logCalculation } from './taxUtils';

export enum TaxRegimePreference {
    OLD = 'OLD',
    NEW = 'NEW',
    AUTO = 'AUTO'
}

export const processPartBTTI = (
    form16: Form16, 
    regimePreference: TaxRegimePreference = TaxRegimePreference.AUTO
): PartBTTI => {
    if (regimePreference === TaxRegimePreference.OLD) {
        console.log('\nUsing Old Tax Regime as per preference');
        return calculateOldRegimeTax(form16);
    }
    
    if (regimePreference === TaxRegimePreference.NEW) {
        console.log('\nUsing New Tax Regime as per preference');
        return calculateNewRegimeTax(form16);
    }

    // Calculate tax under both regimes and compare
    console.log('\n=== Comparing Both Tax Regimes ===\n');
    
    console.log('Calculating Old Regime Tax:');
    const oldRegimeResult = calculateOldRegimeTax(form16);
    
    console.log('\nCalculating New Regime Tax:');
    const newRegimeResult = calculateNewRegimeTax(form16);
    
    console.log('\n=== Tax Regime Comparison Summary ===');
    logCalculation('Old Regime - Total Tax', oldRegimeResult.ComputationOfTaxLiability.GrossTaxPayable);
    logCalculation('New Regime - Total Tax', newRegimeResult.ComputationOfTaxLiability.GrossTaxPayable);
    
    // Determine which regime is more beneficial
    const taxDifference = 
        oldRegimeResult.ComputationOfTaxLiability.GrossTaxPayable - 
        newRegimeResult.ComputationOfTaxLiability.GrossTaxPayable;

    if (taxDifference > 0) {
        console.log(`\nNew Regime is more beneficial - Saves ₹${taxDifference.toLocaleString('en-IN')}`);
        return newRegimeResult;
    } else if (taxDifference < 0) {
        console.log(`\nOld Regime is more beneficial - Saves ₹${Math.abs(taxDifference).toLocaleString('en-IN')}`);
        return oldRegimeResult;
    } else {
        console.log('\nBoth regimes result in same tax liability - Using New Regime as default');
        return newRegimeResult;
    }
};