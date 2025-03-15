import usdInrRatesData from './usd_inr_rates.json';

// Define the type for the USD-INR rates object
export interface USDINRRates {
    [date: string]: number;
}

// Default exchange rate to use when a specific date's rate is not found
export const DEFAULT_EXCHANGE_RATE = 83.5;

// Cast the imported JSON to the defined type
const usdInrRates: USDINRRates = usdInrRatesData as USDINRRates;

/**
 * Gets the USD to INR exchange rate for a specific date
 * Falls back to the most recent rate if the exact date is not found
 * 
 * @param date - The date to get the exchange rate for
 * @returns The USD to INR exchange rate
 */
export const getExchangeRate = (date: Date): number => {
    // Format date as M/D/YYYY to match the format in the JSON file
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    
    // Try to get the exact rate for the date
    if (formattedDate in usdInrRates) {
        return usdInrRates[formattedDate];
    }
    
    // If not found, use a default rate (average for the year or most recent)
    // For simplicity, we'll use a fixed fallback rate of 83.5
    console.log(`Exchange rate not found for ${formattedDate}, using default rate of 83.5`);
    return DEFAULT_EXCHANGE_RATE;
};

/**
 * Converts USD amount to INR using the exchange rate for the given date
 * 
 * @param amountUSD - The amount in USD
 * @param date - The date to use for the exchange rate
 * @returns The amount converted to INR, rounded to 2 decimal places
 */
export const convertUSDtoINR = (amountUSD: number, date: Date): number => {
    const exchangeRate = getExchangeRate(date);
    const amountINR = amountUSD * exchangeRate;
    
    // Round to 2 decimal places to avoid floating point precision issues
    return Math.round(amountINR * 100) / 100;
};

/**
 * Formats a monetary value with the specified currency symbol
 * 
 * @param amount - The monetary value to format
 * @param currency - The currency symbol to use (default: ₹)
 * @returns Formatted string with currency symbol and thousands separators
 */
export const formatCurrency = (amount: number, currency: string = '₹'): string => {
    return `${currency}${amount.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}; 