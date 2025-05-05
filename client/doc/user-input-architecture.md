# User Input Architecture

This document outlines the architecture for handling user input in the ITR Viewer component. The system allows users to provide additional data not present in their original ITR documents.

## 1. Component Hierarchy and Data Flow

```
ITRViewer
├── EditModeProvider (Context for edit mode state)
└── UserInputProvider (Context for centralized user input data)
    └── Step Components (DeductionsLossesStep, etc.)
        └── Form Components (CarryForwardLossForm, etc.)
             │
             └── Direct Context Access
```

## 2. Core Contexts

### 2.1 UserInputContext

Provides centralized state management for all user input data:

```tsx
// UserInputContext.tsx
const UserInputContext = createContext<UserInputContextType>({
  userInput: {},            // The current user input data
  isLoading: false,         // Loading state for API operations
  error: null,              // Error state for API operations
  saveUserInputData: async () => {},  // Save complete user input data
  updateUserInputData: () => {},      // Update partial user input data
});
```

#### Key Functions:

- **`saveUserInputData(data)`**: Persist complete user input data to the backend
- **`updateUserInputData(partialData)`**: Merge partial updates with existing data

### 2.2 EditModeContext

Manages the application-wide edit mode state:

```tsx
// EditModeContext.tsx
const EditModeContext = createContext<EditModeContextType>({
  isEditMode: false,             // Whether edit mode is active
  toggleEditMode: () => {},      // Toggle edit mode on/off
  activeEditSection: null,       // Current section being edited (if any)
  setActiveEditSection: () => {},
  hasUnsavedChanges: false,      // Whether there are unsaved changes
  setHasUnsavedChanges: () => {},
});
```

## 3. Form Component Implementation

Form components directly access and manage their specific section of the user input data:

```tsx
// Example form component pattern
export const SectionSpecificForm: React.FC = () => {
  // Get data and functions from contexts
  const { userInput, saveUserInputData, isLoading } = useUserInput();
  const { setHasUnsavedChanges } = useEditMode();
  
  // Local state for form UI
  const [formData, setFormData] = useState(userInput.specificSection || []);
  
  // Update local state when context data changes
  useEffect(() => {
    setFormData(userInput.specificSection || []);
  }, [userInput.specificSection]);
  
  // Handle form operations (add, update, remove entries)
  const addEntry = () => {
    // Add entry to local state
    setHasUnsavedChanges(true);
  };
  
  // Save data directly to context
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      await saveUserInputData({
        ...userInput,
        specificSection: formData
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    // Form UI
  );
};
```

## 4. Data Structure

The user input data structure mirrors the server-side schema:

```typescript
// Example user input data structure
export interface UserInputData {
  scheduleCFLAdditions?: {
    lossesToCarryForward?: CarryForwardLossEntry[];
  };
  // Other sections will be added later
}

export interface CarryForwardLossEntry {
  lossYearAY: string;
  dateOfFiling?: string;
  housePropertyLossCF?: number;
  shortTermCapitalLossCF?: number;
  longTermCapitalLossCF?: number;
  businessLossCF?: number;
}
```

## 5. API Integration

The user input API client provides methods to interact with the backend:

```typescript
// api/userInput.ts
export const getUserInput = async (userId, assessmentYear): Promise<UserInputData> => {
  // Fetch user input data from backend
};

export const saveUserInput = async (userId, assessmentYear, data): Promise<UserInputData> => {
  // Save user input data to backend
};

export const mergeUserInput = (existing, newData): UserInputData => {
  // Merge existing and new user input data
};
```

## 6. Edit Mode UI

The `EditModeToggleButton` component provides a consistent UI for toggling edit mode:

```tsx
// EditModeToggleButton.tsx
export const EditModeToggleButton: React.FC = () => {
  const { isEditMode, toggleEditMode, hasUnsavedChanges } = useEditMode();
  
  return (
    // Render Edit/Save/Cancel buttons based on state
  );
};
```

## 7. Implementation Notes

### Direct Context Access Pattern

We've chosen to have form components directly access UserInputContext rather than passing data through props because:

1. Each form is specific to a particular section of user input data
2. Forms are not reused across different sections
3. It simplifies the parent step components
4. Changes in one form are immediately reflected in all components

### Trade-offs

- **Pros**: Simplifies component hierarchy, reduces prop drilling, centralizes data management
- **Cons**: Creates stronger coupling between forms and context structure

### Future Considerations

If common form patterns emerge, consider extracting them into reusable components while maintaining the direct context access pattern. 