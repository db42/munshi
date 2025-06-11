import { useState, useEffect } from 'react';
import { ENDPOINTS } from '../../api/config'; // Import from config file
import type { Itr } from '../../types/itr';

interface UseITRDataResult {
  data: Itr | null;
  isLoading: boolean;
  error: Error | null;
}

export function useITRData(userId: string, assessmentYear: string): UseITRDataResult {
  const [data, setData] = useState<Itr | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Construct the URL using the imported endpoint function
        const apiUrl = ENDPOINTS.ITR_BY_USER_AND_YEAR(userId, assessmentYear);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result: Itr = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    if (userId && assessmentYear) {
        fetchData();
    }
    // Add dependencies: userId, assessmentYear
    // If using a real API endpoint, dependencies might include an API client instance
  }, [userId, assessmentYear]); // Re-fetch if userId or assessmentYear changes

  return { data, isLoading, error };
} 