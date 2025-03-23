import { ENDPOINTS, DEFAULT_HEADERS } from './config';
import { formatApiError } from '../utils/api-helpers';

/**
 * Fetch the ITR data for a specific user and assessment year
 * 
 * @param userId - The user ID
 * @param assessmentYear - The assessment year in format YYYY-YY
 * @returns The ITR data
 */
export const getITRByUserAndYear = async (userId: string, assessmentYear: string): Promise<any> => {
  try {
    const response = await fetch(ENDPOINTS.ITR_BY_USER_AND_YEAR(userId, assessmentYear), {
      method: 'GET',
      headers: DEFAULT_HEADERS,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch ITR: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching ITR data:', error);
    throw new Error(formatApiError(error));
  }
}; 