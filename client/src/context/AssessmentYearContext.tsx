import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DEFAULT_ASSESSMENT_YEAR } from '../api/config';

// Context interface
interface AssessmentYearContextProps {
  assessmentYear: string;
  setAssessmentYear: (year: string) => void;
}

// Create context with defaults
const AssessmentYearContext = createContext<AssessmentYearContextProps>({
  assessmentYear: DEFAULT_ASSESSMENT_YEAR,
  setAssessmentYear: () => {},
});

// Provider props
interface AssessmentYearProviderProps {
  children: ReactNode;
}

// Provider component
export const AssessmentYearProvider: React.FC<AssessmentYearProviderProps> = ({ children }) => {
  // Get the initial year from localStorage or use the default
  const [assessmentYear, setAssessmentYearState] = useState<string>(() => {
    const storedYear = localStorage.getItem('assessmentYear');
    return storedYear || DEFAULT_ASSESSMENT_YEAR;
  });

  // Update localStorage when the assessment year changes and reload the app
  const setAssessmentYear = (year: string) => {
    if (year !== assessmentYear) {
      localStorage.setItem('assessmentYear', year);
      // Reload the app to apply changes everywhere
      window.location.reload();
    }
  };
  
  const value = {
    assessmentYear,
    setAssessmentYear,
  };
  
  return (
    <AssessmentYearContext.Provider value={value}>
      {children}
    </AssessmentYearContext.Provider>
  );
};

// Custom hook to use the context
export const useAssessmentYear = (): AssessmentYearContextProps => {
  const context = useContext(AssessmentYearContext);
  
  if (!context) {
    throw new Error('useAssessmentYear must be used within an AssessmentYearProvider');
  }
  
  return context;
};

export default AssessmentYearContext; 