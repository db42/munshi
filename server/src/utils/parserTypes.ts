import { getLogger, ILogger } from './logger';

// Create a named logger instance for this module
const logger: ILogger = getLogger('parserTypes');

/**
 * Generic result type for all document parsers
 * 
 * @template T The type of data returned by the parser
 */
export interface ParseResult<T> {
  /** Whether the parsing was successful */
  success: boolean;
  
  /** The parsed data (if successful) */
  data?: T;
  
  /** Error message (if unsuccessful) */
  error?: string;
} 

/**
 * Identifies the calendar year from the financial year
 * 
 * @param financialYear - Financial year in format 'YYYY-YYYY'
 * @returns The calendar year
 */
export function identifyCalendarYear(financialYear: string): number {
  const yearString = financialYear.split('-')[0];
  
  // For financial year 2023-24, the relevant calendar year is 2023
  const calendarYear = parseInt(yearString);
  
  logger.info(`Processing for Financial Year: ${financialYear} (April 1 to March 31)`);
  logger.info(`Relevant Calendar Year for Schedule FA: ${calendarYear} (January 1 to December 31)`);
  
  return calendarYear;
}

/**
 * Gets the relevant date ranges for processing
 * 
 * @param calendarYear - The calendar year
 * @returns Object containing the relevant date ranges
 */
export function getRelevantDates(calendarYear: number) {
  const calendarYearStart = new Date(`${calendarYear}-01-01`);
  const calendarYearEnd = new Date(`${calendarYear}-12-31`);
  
  return { calendarYearStart, calendarYearEnd };
}

export function getFinancialYear(assessmentYear: string): string {
  // Extract the start year from the assessment year
  let financialYear = '';
  if (assessmentYear.includes('-')) {
    const startYear = assessmentYear.split('-')[0];
    financialYear = `${Number(startYear) - 1}-${startYear}`;
  } else {
    throw new Error(`Invalid assessment year format: ${assessmentYear}. Expected format: 'YYYY-YY'`);
  }
  
  logger.info(`Processing for Financial Year: ${financialYear} (April 1 to March 31)`);
  
  return financialYear;
}