/**
 * Utility functions for string manipulation
 */

/**
 * Removes all quotes from a string
 * @param str - The string to process
 * @returns String with quotes removed
 */
export const removeQuotes = (str: string): string => {
  if (!str) return '';
  return str.replace(/["']/g, '').trim();
};

/**
 * Creates a normalized string for comparison (lowercase, no quotes, trimmed)
 * @param str - The string to normalize
 * @returns Normalized string
 */
export const normalizeString = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().replace(/["']/g, '').trim();
};

/**
 * Checks if a string contains a substring (case-insensitive)
 * @param str - The string to search in
 * @param substring - The substring to search for
 * @returns True if the substring is found
 */
export const containsIgnoreCase = (str: string, substring: string): boolean => {
  if (!str || !substring) return false;
  return normalizeString(str).includes(normalizeString(substring));
};

/**
 * Formats a string for display in logs or debug output
 * @param obj - The object to stringify
 * @param indent - Number of spaces for indentation (default: 2)
 * @returns Formatted string representation
 */
export const prettyStringify = (obj: any, indent: number = 2): string => {
  try {
    return JSON.stringify(obj, null, indent);
  } catch (e) {
    return `[Object could not be stringified: ${e}]`;
  }
}; 