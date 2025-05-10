/**
 * Recursively sorts an object by its keys at all levels
 * @param obj The object to sort
 * @returns A new object with sorted keys
 */
export const sortedObject = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  return Object.keys(obj).sort().reduce((sorted, key) => {
    sorted[key] = sortedObject(obj[key]);
    return sorted;
  }, {});
}; 