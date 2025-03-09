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
 * @param financialYear - Financial year in format 'YYYY-YY'
 * @returns The calendar year
 */
export function identifyCalendarYear(financialYear: string): number {
  const match = financialYear.match(/^(\d{4})-\d{2}$/);
  if (!match) {
    throw new Error(`Invalid financial year format: ${financialYear}. Expected format: 'YYYY-YY'`);
  }
  
  // For financial year 2023-24, the relevant calendar year is 2023
  const calendarYear = parseInt(match[1]);
  
  console.log(`Processing for Financial Year: ${financialYear} (April 1 to March 31)`);
  console.log(`Relevant Calendar Year for Schedule FA: ${calendarYear} (January 1 to December 31)`);
  
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
