import React, { createContext, useState, useContext, ReactNode } from 'react';

interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  activeEditSection: string | null;
  setActiveEditSection: (section: string | null) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

// Create context with default values
const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,
  toggleEditMode: () => {},
  activeEditSection: null,
  setActiveEditSection: () => {},
  hasUnsavedChanges: false,
  setHasUnsavedChanges: () => {},
});

// Provider component
export const EditModeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeEditSection, setActiveEditSection] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const toggleEditMode = () => {
    if (isEditMode && hasUnsavedChanges) {
      // Prompt user about unsaved changes before exiting edit mode
      if (window.confirm("You have unsaved changes. Are you sure you want to exit edit mode?")) {
        setIsEditMode(false);
        setActiveEditSection(null);
        setHasUnsavedChanges(false);
      }
    } else {
      setIsEditMode(!isEditMode);
      if (!isEditMode) {
        setHasUnsavedChanges(false);
      } else {
        setActiveEditSection(null);
      }
    }
  };

  return (
    <EditModeContext.Provider value={{
      isEditMode,
      toggleEditMode,
      activeEditSection,
      setActiveEditSection,
      hasUnsavedChanges,
      setHasUnsavedChanges,
    }}>
      {children}
    </EditModeContext.Provider>
  );
};

// Custom hook for using the context
export const useEditMode = () => useContext(EditModeContext); 