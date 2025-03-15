
/**
 * Parses a date string in MM/DD/YYYY format to a Date object
 * 
 * @param dateStr - The date string to parse
 * @returns Date object
 */
export const parseDateString = (dateStr: string): Date => {
  const [month, day, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};
