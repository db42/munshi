import { useState, useEffect } from 'react';
import { ENDPOINTS, DEFAULT_HEADERS } from '../../api/config'; // Import from config file
import { Itr } from '../../types/itr';
import { TaxRegimePreference } from '../../types/tax.types';
import type { TaxRegimeComparison } from '../../types/tax.types';

interface ITRDataPayload {
    itr: Itr;
    taxRegimeComparison: TaxRegimeComparison;
}

interface UseITRDataResult {
  data: ITRDataPayload | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useITRData(
    userId: string, 
    assessmentYear: string, 
    taxRegimePreference: TaxRegimePreference = TaxRegimePreference.AUTO
): UseITRDataResult {
  const [data, setData] = useState<ITRDataPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = ENDPOINTS.GENERATE_ITR;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
            userId,
            assessmentYear,
            taxRegimePreference,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: ITRDataPayload = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId && assessmentYear) {
        fetchData();
    }
  }, [userId, assessmentYear, taxRegimePreference]);

  return { data, isLoading, error, refetch: fetchData };
} 