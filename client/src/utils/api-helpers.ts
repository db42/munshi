import type { ErrorResponse } from '../types/document';

/**
 * Format error message from API response
 * @param error - The error object
 * @returns Formatted error message
 */
export const formatApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
};

/**
 * Parse API error response
 * @param response - The fetch response
 * @returns Promise with the error message
 */
export const parseApiError = async (response: Response): Promise<string> => {
  try {
    const errorData: ErrorResponse = await response.json();
    return errorData.message || `Error: ${response.status} ${response.statusText}`;
  } catch (error) {
    return `Error: ${response.status} ${response.statusText}`;
  }
}; 