/**
 * Parse a date string in MM/DD/YYYY format into a Date object
 * @param dateStr - Date string to parse (format: MM/DD/YYYY, may be quoted)
 * @returns Parsed Date object or new Date(0) if parsing fails
 */
import { removeQuotes } from './stringUtils';

export const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date(0);
  
  try {
    // Remove any quotation marks and trim
    dateStr = removeQuotes(dateStr);
    
    // Parse MM/DD/YYYY format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      const year = parts[2];
      return new Date(`${year}-${month}-${day}T00:00:00Z`);
    }
    
    console.warn(`[FORMATTER] Invalid date format: ${dateStr}, expected MM/DD/YYYY`);
    return new Date(0);
  } catch (e) {
    console.error(`[FORMATTER] Error parsing date ${dateStr}:`, e);
    return new Date(0);
  }
};

/**
 * Parse a string numeric value into a number. Handles financial formatting.
 * @param valueStr - String value to parse (can include $, commas, parentheses for negatives)
 * @param convertToInt - Whether to convert the result to an integer (defaults to false)
 * @returns Parsed number or 0 if parsing fails
 */
export const parseNumericValue = (valueStr: string, convertToInt: boolean = false): number => {
  if (!valueStr) return 0;
  
  try {
    // Remove quotes first, then clean financial symbols
    const withoutQuotes = removeQuotes(valueStr);
    const cleanedValue = withoutQuotes.replace(/[$,%]/g, '');
    
    // Handle negative values in parentheses
    let result: number;
    if (cleanedValue.startsWith('(') && cleanedValue.endsWith(')')) {
      result = -1 * parseFloat(cleanedValue.substring(1, cleanedValue.length - 1)) || 0;
    } else if (cleanedValue.startsWith('-')) {
      // Standard negative notation -123.45
      result = parseFloat(cleanedValue) || 0;
    } else {
      result = parseFloat(cleanedValue) || 0;
    }
    
    // Convert to integer if requested
    return convertToInt ? Math.round(result) : result;
  } catch (e) {
    console.error(`[FORMATTER] Error parsing numeric value "${valueStr}":`, e);
    return 0;
  }
};

export function roundNumbersInObject(data: any): any {
    if (typeof data === 'number') {
        return Math.round(data);
    } else if (Array.isArray(data)) {
        return data.map(item => roundNumbersInObject(item));
    } else if (typeof data === 'object' && data !== null) {
        const newObj: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newObj[key] = roundNumbersInObject(data[key]);
            }
        }
        return newObj;
    }
    return data; // Return other types (string, boolean, null, etc.) as is
}