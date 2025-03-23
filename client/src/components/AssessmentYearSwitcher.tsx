import React, { useState, useEffect } from 'react';

// Define props interface
interface AssessmentYearSwitcherProps {
  currentYear: string;
  onChange: (year: string) => void;
}

// Generate a list of assessment years (current year and 4 previous years)
const generateAssessmentYears = (): string[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const years: string[] = [];
  
  // Indian assessment years are in the format "YYYY-YY" where YYYY is the financial year start
  for (let i = 0; i < 5; i++) {
    const startYear = currentYear - i;
    const endYear = (startYear + 1) % 100; // Last two digits of the next year
    years.push(`${startYear}-${endYear.toString().padStart(2, '0')}`);
  }
  
  return years;
};

const AssessmentYearSwitcher: React.FC<AssessmentYearSwitcherProps> = ({ 
  currentYear,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [years] = useState<string[]>(generateAssessmentYears());
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);
  
  // Handle year selection
  const handleYearChange = (year: string) => {
    if (year !== currentYear) {
      onChange(year);
    }
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-transparent hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        title="Change Assessment Year"
      >
        <span className="mr-1">AY:</span>
        <span className="font-semibold">{currentYear}</span>
        <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
              Select Assessment Year
            </div>
            {years.map((year) => (
              <button
                key={year}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  year === currentYear 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
                onClick={() => handleYearChange(year)}
              >
                {year}
                {year === currentYear && (
                  <span className="ml-2 text-xs inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Current
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentYearSwitcher; 