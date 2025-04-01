/**
 * Parse a date string in MM/DD/YYYY format into a Date object
 * @param dateStr - Date string to parse (format: MM/DD/YYYY, may be quoted)
 * @returns Parsed Date object or new Date(0) if parsing fails
 */
export const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date(0);
  
  try {
    // Remove any quotation marks and trim
    dateStr = dateStr.replace(/"/g, '').trim();
    
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
 * @returns Parsed number or 0 if parsing fails
 */
export const parseNumericValue = (valueStr: string): number => {
  if (!valueStr) return 0;
  
  try {
    // Remove quotes, dollar signs, commas, percent signs
    const cleanedValue = valueStr.replace(/["$,%]/g, '').trim();
    
    // Handle negative values in parentheses
    if (cleanedValue.startsWith('(') && cleanedValue.endsWith(')')) {
      return -1 * parseFloat(cleanedValue.substring(1, cleanedValue.length - 1)) || 0;
    } else if (cleanedValue.startsWith('-')) {
      // Standard negative notation -123.45
      return parseFloat(cleanedValue) || 0;
    }
    
    return parseFloat(cleanedValue) || 0;
  } catch (e) {
    console.error(`[FORMATTER] Error parsing numeric value "${valueStr}":`, e);
    return 0;
  }
}; 