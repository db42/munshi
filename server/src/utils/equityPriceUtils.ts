import equityClosingPriceData from './usd-equity-closing-price-data.json';
import { DEFAULT_EXCHANGE_RATE } from './currencyConverter';
import { parseDateString } from './dateUtils';
import { getLogger, ILogger } from './logger';

// Create a named logger instance for this module
const logger: ILogger = getLogger('equityPriceUtils');

// Define the type for the equity closing price data
interface EquityClosingPriceData {
  [symbol: string]: {
    [date: string]: number | null;
  };
}

// Cast the imported JSON to the defined type
const closingPriceData = equityClosingPriceData as EquityClosingPriceData;

/**
 * Result of peak price search
 */
export interface PeakPriceResult {
  price: number;
  date?: Date;
}

/**
 * Finds the price of a security on a specific date
 * 
 * @param symbol - The security symbol
 * @param date - The date to find the price for
 * @returns The price in USD, or 0 if no data is found
 */
export const findPrice = (symbol: string, date: Date): number => {
  if (!closingPriceData[symbol]) {
    logger.warn(`No price data found for symbol: ${symbol}`);
    return 0;
  }

  const price = closingPriceData[symbol][date.toISOString().split('T')[0]];
  return price || 0;
};

/**
 * Finds the peak price for a security within a date range
 * 
 * @param symbol - The security symbol
 * @param acquisitionDate - The date the security was acquired
 * @param startDate - The start date of the range (not used for peak price calculation)
 * @param endDate - The end date of the range to search
 * @returns Object containing the peak price and the date when it occurred
 */
export const findPeakPrice = (
  symbol: string, 
  acquisitionDate: Date, 
  startDate: Date, 
  endDate: Date
): PeakPriceResult => {
  // If we don't have data for this symbol, return a default value
  if (!closingPriceData[symbol]) {
    logger.warn(`No price data found for symbol: ${symbol}`);
    return { price: 0, date: undefined };
  }

  let peakPrice = 0;
  let peakDate: Date | undefined;

  // Iterate through all dates for this symbol
  for (const dateStr in closingPriceData[symbol]) {
    // Parse the date string to a Date object for comparison
    const currentDate = parseDateString(dateStr);
    
    // Look for peak price between acquisition date and end date
    if (currentDate >= acquisitionDate && currentDate <= endDate) {
      const price = closingPriceData[symbol][dateStr];
      if (price !== null && price > peakPrice) {
        peakPrice = price;
        peakDate = currentDate;
      }
    }
  }

  if (peakDate) {
    return { price: peakPrice, date: peakDate };
  } else {
    logger.warn(`No prices found for ${symbol} between acquisition date and end date. Using acquisition price.`);
    return { price: 0, date: undefined };
  }
};

/**
 * Converts a peak price from USD to INR
 * 
 * @param peakPriceResult - The peak price result containing price and date
 * @param quantity - The quantity of securities
 * @returns The peak value in INR
 */
export const calculatePeakValueINR = (peakPriceResult: PeakPriceResult, quantity: number): number => {
  return Math.round(peakPriceResult.price * quantity * DEFAULT_EXCHANGE_RATE * 100) / 100;
}; 