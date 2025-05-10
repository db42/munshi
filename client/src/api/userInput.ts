import { ENDPOINTS, DEFAULT_HEADERS } from './config';
import { formatApiError } from '../utils/api-helpers';
import { UserInputData, CarryForwardLossEntry } from '../types/userInput.types';

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
    // Handle each section with special merging logic
    
    // General Info section
    generalInfoAdditions: newData.generalInfoAdditions ? {
      ...existing.generalInfoAdditions,
      ...newData.generalInfoAdditions,
      // Replace arrays entirely
      ...(newData.generalInfoAdditions.bankDetails && {
        bankDetails: newData.generalInfoAdditions.bankDetails 
      })
    } : existing.generalInfoAdditions,
    
    // Schedule HP (House Property) section
    scheduleHPAdditions: newData.scheduleHPAdditions 
      ? newData.scheduleHPAdditions 
      : existing.scheduleHPAdditions,
    
    // Schedule CG (Capital Gains) section
    scheduleCGAdditions: newData.scheduleCGAdditions ? {
      ...existing.scheduleCGAdditions,
      ...newData.scheduleCGAdditions,
      // Replace arrays entirely
      ...(newData.scheduleCGAdditions.shortTerm && {
        shortTerm: newData.scheduleCGAdditions.shortTerm
      }),
      ...(newData.scheduleCGAdditions.longTerm && {
        longTerm: newData.scheduleCGAdditions.longTerm
      })
    } : existing.scheduleCGAdditions,
    
    // Schedule OS (Other Sources) section
    scheduleOSAdditions: newData.scheduleOSAdditions 
      ? newData.scheduleOSAdditions 
      : existing.scheduleOSAdditions,
    
    // Chapter VIA section
    chapterVIAAdditions: newData.chapterVIAAdditions ? {
      ...existing.chapterVIAAdditions,
      ...newData.chapterVIAAdditions,
      // Section 80C - object
      ...(newData.chapterVIAAdditions.section80C && {
        section80C: {
          ...existing.chapterVIAAdditions?.section80C,
          ...newData.chapterVIAAdditions.section80C
        }
      }),
      // Section 80D - object
      ...(newData.chapterVIAAdditions.section80D && {
        section80D: {
          ...existing.chapterVIAAdditions?.section80D,
          ...newData.chapterVIAAdditions.section80D
        }
      }),
      // Section 80G - array
      ...(newData.chapterVIAAdditions.section80G && {
        section80G: newData.chapterVIAAdditions.section80G
      }),
      // Section 80TTA - object
      ...(newData.chapterVIAAdditions.section80TTA && {
        section80TTA: {
          ...existing.chapterVIAAdditions?.section80TTA,
          ...newData.chapterVIAAdditions.section80TTA
        }
      })
    } : existing.chapterVIAAdditions,
    
    // Taxes Paid section
    taxesPaidAdditions: newData.taxesPaidAdditions ? {
      ...existing.taxesPaidAdditions,
      ...newData.taxesPaidAdditions,
      // Replace arrays entirely
      ...(newData.taxesPaidAdditions.selfAssessmentTax && {
        selfAssessmentTax: newData.taxesPaidAdditions.selfAssessmentTax
      })
    } : existing.taxesPaidAdditions,
    
    // Schedule CFL (Carry Forward Losses) section
    scheduleCFLAdditions: newData.scheduleCFLAdditions ? {
      ...existing.scheduleCFLAdditions,
      ...newData.scheduleCFLAdditions,
      // Replace arrays entirely
      ...(newData.scheduleCFLAdditions.lossesToCarryForward && {
        lossesToCarryForward: newData.scheduleCFLAdditions.lossesToCarryForward
      })
    } : existing.scheduleCFLAdditions,
    
    // Schedule FA (Foreign Assets) section
    scheduleFAAdditions: newData.scheduleFAAdditions 
      ? newData.scheduleFAAdditions 
      : existing.scheduleFAAdditions
  };
}; 