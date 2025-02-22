export interface TaxSlab {
  threshold: number;
  rate: number;
}

export interface TaxCalculationResult {
  taxOnIncome: number;
  surcharge: number;
  healthAndEducationCess: number;
  totalTaxPayable: number;
  rebate87A: number;
  refundDue: number;
}

export const calculatePercentage = (amount: number, percentage: number): number => {
    return Math.floor((amount * percentage * 100) / 100);
};

export const logCalculation = (step: string, value: number) => {
    console.log(`${step}: ₹${value.toLocaleString('en-IN')}`);
};

export const calculateSurcharge = (taxAmount: number, totalIncome: number): number => {
    console.log('\n--- Surcharge Calculation ---');
    let surchargePercentage = 0;
    
    if (totalIncome <= 5000000) {
        surchargePercentage = 0;
    } else if (totalIncome <= 10000000) {
        surchargePercentage = 10;
    } else if (totalIncome <= 20000000) {
        surchargePercentage = 15;
    } else if (totalIncome <= 50000000) {
        surchargePercentage = 25;
    } else {
        surchargePercentage = 37;
    }

    console.log(`Income: ₹${totalIncome.toLocaleString('en-IN')}`);
    console.log(`Applicable surcharge rate: ${surchargePercentage}%`);
    
    const surcharge = calculatePercentage(taxAmount, surchargePercentage / 100);
    console.log(`Calculated surcharge: ₹${surcharge.toLocaleString('en-IN')}`);
    console.log('--- End Surcharge Calculation ---\n');
    
    return surcharge;
};

export const calculateTaxForSlabs = (totalIncome: number, slabs: TaxSlab[], regimeName: string): number => {
    console.log(`\n--- Tax Slab Calculation (${regimeName}) ---`);
    let tax = 0;
    let remainingIncome = totalIncome;
    
    for (let i = slabs.length - 1; i >= 0; i--) {
        const currentSlab = slabs[i];
        const previousThreshold = i > 0 ? slabs[i-1].threshold : 0;
        
        if (remainingIncome > previousThreshold) {
            const taxableInThisSlab = Math.min(
                remainingIncome - previousThreshold, 
                currentSlab.threshold - previousThreshold
            );
            const taxForThisSlab = calculatePercentage(taxableInThisSlab, currentSlab.rate);
            
            tax += taxForThisSlab;
            console.log(
                `Tax at ${currentSlab.rate * 100}% for income ` +
                `${previousThreshold.toLocaleString('en-IN')}-${currentSlab.threshold.toLocaleString('en-IN')}: ` +
                `₹${taxForThisSlab.toLocaleString('en-IN')} (on ₹${taxableInThisSlab.toLocaleString('en-IN')})`
            );
        }
    }

    console.log(`Total tax before rebate: ₹${tax.toLocaleString('en-IN')}`);
    console.log('--- End Tax Slab Calculation ---\n');

    return tax;
};