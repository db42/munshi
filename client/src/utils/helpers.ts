// Simple utility to get nested value or return default
export const getNestedValue = (obj: any, path: string | undefined, defaultValue: any = '-') => {
  if (!path) return defaultValue;
  // Basic check to prevent errors if obj is not an object during reduce
  if (typeof obj !== 'object' || obj === null) return defaultValue;
  const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);
  // Return defaultValue if value is null or undefined, otherwise return value
  return value ?? defaultValue;
}; 