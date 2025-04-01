/**
 * Format file size in bytes to a human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.2 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

/**
 * Format a number as a currency value
 * @param value - The number to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | undefined | null, currency: string = 'USD'): string => {
  if (value === undefined || value === null) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a date string or object into a readable format
 * @param date - The date to format (string, Date object, or timestamp)
 * @param format - The format to use (default: 'MM/DD/YYYY')
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | number | undefined | null): string => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : 
                  date instanceof Date ? date : 
                  new Date(date);
  
  if (isNaN(dateObj.getTime())) return '-';
  
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${month}/${day}/${year}`;
};

/**
 * Removes all quotes from a string and trims it
 * @param str - The string to process
 * @returns String with quotes removed
 */
export const removeQuotes = (str: string): string => {
  if (!str) return '';
  return str.replace(/["']/g, '').trim();
};

/**
 * Parse a date string in MM/DD/YYYY format into a Date object
 * @param dateStr - Date string to parse (format: MM/DD/YYYY, may be quoted)
 * @returns Parsed Date object or new Date(0) if parsing fails
 */
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
    
    console.warn(`Invalid date format: ${dateStr}, expected MM/DD/YYYY`);
    return new Date(0);
  } catch (e) {
    console.error(`Error parsing date ${dateStr}:`, e);
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
    // First remove quotes
    const withoutQuotes = removeQuotes(valueStr);
    
    // Then remove dollar signs, commas, percent signs
    const cleanedValue = withoutQuotes.replace(/[$,%]/g, '');
    
    // Handle negative values in parentheses
    if (cleanedValue.startsWith('(') && cleanedValue.endsWith(')')) {
      return -1 * parseFloat(cleanedValue.substring(1, cleanedValue.length - 1)) || 0;
    }
    
    return parseFloat(cleanedValue) || 0;
  } catch (e) {
    console.error(`Error parsing numeric value "${valueStr}":`, e);
    return 0;
  }
};

export default { formatFileSize, formatCurrency, formatDate, parseDate, parseNumericValue, removeQuotes }; 