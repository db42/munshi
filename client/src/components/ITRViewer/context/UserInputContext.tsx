import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import type { UserInputData, UserItrInputRecord } from '../../../types/userInput.types';
import { getUserItrInputRecord, saveUserInput, mergeUserInput } from '../../../api/userInput';
import { useUser } from '../../../context/UserContext';

interface UserInputContextType {
  userInput: UserInputData;
  isLoading: boolean;
  error: Error | null;
  saveUserInputData: (data: UserInputData) => Promise<void>;
}

const UserInputContext = createContext<UserInputContextType>({
  userInput: {},
  isLoading: false,
  error: null,
  saveUserInputData: async () => {},
});

export const UserInputProvider: React.FC<{
  children: ReactNode;
  assessmentYear: string;
}> = ({ children, assessmentYear }) => {
  const [userInput, setUserInput] = useState<UserInputData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const record: UserItrInputRecord | null = await getUserItrInputRecord(currentUser.id, assessmentYear);
        setUserInput(record?.input_data || {});
      } catch (err) {
        console.error('Error fetching user input:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch user input'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [assessmentYear, currentUser]);

  // Save complete user input data
  const saveUserInputData = async (data: UserInputData) => {
    setIsLoading(true);
    setError(null);
    try {
      const savedRecord = await saveUserInput(currentUser.id, assessmentYear, data);
      setUserInput(savedRecord.input_data);
    } catch (err) {
      console.error('Error saving user input:', err);
      setError(err instanceof Error ? err : new Error('Failed to save user input'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserInputContext.Provider value={{
      userInput,
      isLoading,
      error,
      saveUserInputData,
    }}>
      {children}
    </UserInputContext.Provider>
  );
};

// Custom hook to use the user input context
export const useUserInput = () => useContext(UserInputContext); 