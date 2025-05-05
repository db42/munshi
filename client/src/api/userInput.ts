import { ENDPOINTS, DEFAULT_HEADERS } from './config';
import { formatApiError } from '../utils/api-helpers';

// Define the CarryForwardLossEntry interface
export interface CarryForwardLossEntry {
  lossYearAY: string; // YYYY-YY
  dateOfFiling?: string; // YYYY-MM-DD
  housePropertyLossCF?: number;
  shortTermCapitalLossCF?: number;
  longTermCapitalLossCF?: number;
  businessLossCF?: number;
}

// Main User Input Data Structure matching the server-side type
export interface UserInputData {
  scheduleCFLAdditions?: {
    lossesToCarryForward?: CarryForwardLossEntry[];
  };
  // Other fields will be added later...
}

/**
 * Fetch user input data for a specific user and assessment year
 * 
 * @param userId - The user ID
 * @param assessmentYear - The assessment year in format YYYY-YY
 * @returns The user input data
 */
export const getUserInput = async (userId: string, assessmentYear: string): Promise<UserInputData> => {
  try {
    const response = await fetch(ENDPOINTS.USER_INPUT_BY_USER_AND_YEAR(userId, assessmentYear), {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      // If 404, it means no user input exists yet, so return empty object
      if (response.status === 404) {
        return {};
      }
      
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch user input: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user input data:', error);
    throw new Error(formatApiError(error));
  }
};

/**
 * Save user input data for a specific user and assessment year
 * 
 * @param userId - The user ID
 * @param assessmentYear - The assessment year in format YYYY-YY
 * @param data - The user input data to save
 * @returns The saved user input data
 */
export const saveUserInput = async (
  userId: string, 
  assessmentYear: string, 
  data: UserInputData
): Promise<UserInputData> => {
  try {
    const response = await fetch(ENDPOINTS.USER_INPUT_BY_USER_AND_YEAR(userId, assessmentYear), {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to save user input: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving user input data:', error);
    throw new Error(formatApiError(error));
  }
};

/**
 * Utility function to merge new user input with existing data
 * 
 * @param existing - Existing user input data
 * @param newData - New user input data to merge
 * @returns Merged user input data
 */
export const mergeUserInput = (existing: UserInputData, newData: UserInputData): UserInputData => {
  return {
    ...existing,
    ...newData,
    // For nested objects that need special merging logic
    scheduleCFLAdditions: {
      ...existing.scheduleCFLAdditions,
      ...newData.scheduleCFLAdditions,
      // For array fields, replace entirely rather than merging
      ...(newData.scheduleCFLAdditions?.lossesToCarryForward && {
        lossesToCarryForward: newData.scheduleCFLAdditions.lossesToCarryForward
      })
    }
  };
}; 