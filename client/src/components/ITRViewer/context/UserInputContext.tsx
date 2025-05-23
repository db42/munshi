import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserInputData, UserItrInputRecord } from '../../../types/userInput.types';
import { getUserItrInputRecord, saveUserInput, mergeUserInput } from '../../../api/userInput';
import { DEFAULT_USER_ID } from '../../../api/config';

interface UserInputContextType {
  userInput: UserInputData;
  isLoading: boolean;
  error: Error | null;
  saveUserInputData: (data: UserInputData) => Promise<void>;
  updateUserInputData: (partialData: Partial<UserInputData>) => void;
}

const UserInputContext = createContext<UserInputContextType>({
  userInput: {},
  isLoading: false,
  error: null,
  saveUserInputData: async () => {},
  updateUserInputData: () => {},
});

export const UserInputProvider: React.FC<{
  children: ReactNode;
  assessmentYear: string;
}> = ({ children, assessmentYear }) => {
  const [userInput, setUserInput] = useState<UserInputData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user input data once when the provider mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const record: UserItrInputRecordResponse = await getUserItrInputRecord(DEFAULT_USER_ID, assessmentYear);
        setUserInput(record?.input_data || {});
      } catch (err) {
        console.error('Error fetching user input:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user input'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [assessmentYear]);

  // Save complete user input data
  const saveUserInputData = async (data: UserInputData) => {
    setIsLoading(true);
    setError(null);
    try {
      const savedRecord = await saveUserInput(DEFAULT_USER_ID, assessmentYear, data);
      setUserInput(savedRecord.input_data);
    } catch (err) {
      console.error('Error saving user input:', err);
      setError(err instanceof Error ? err : new Error('Failed to save user input'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user input data with partial data (merges with existing data)
  const updateUserInputData = (partialData: Partial<UserInputData>) => {
    setUserInput(prev => mergeUserInput(prev, partialData as UserInputData));
  };

  return (
    <UserInputContext.Provider value={{
      userInput,
      isLoading,
      error,
      saveUserInputData,
      updateUserInputData
    }}>
      {children}
    </UserInputContext.Provider>
  );
};

// Custom hook to use the user input context
export const useUserInput = () => useContext(UserInputContext); 