import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { useEditMode } from '../context/EditModeContext';
import { useUserInput } from '../context/UserInputContext';
import { CurrencyInput, DateInput, TextInput } from '../ui/forms/FormComponents';
import { CarryForwardLossEntry } from '../../../types/userInput.types';

export const CarryForwardLossForm: React.FC = () => {
  const { userInput, saveUserInputData, isLoading } = useUserInput();
  const { setHasUnsavedChanges } = useEditMode();
  
  // Initialize entries from context
  const existingEntries = userInput.scheduleCFLAdditions?.lossesToCarryForward || [];
  const [entries, setEntries] = useState<CarryForwardLossEntry[]>(existingEntries);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Update entries if context data changes
  useEffect(() => {
    setEntries(userInput.scheduleCFLAdditions?.lossesToCarryForward || []);
  }, [userInput.scheduleCFLAdditions?.lossesToCarryForward]);

  // Function to add a new empty entry
  const addEntry = () => {
    const newEntry: CarryForwardLossEntry = {
      lossYearAY: '',
      dateOfFiling: undefined,
      housePropertyLossCF: undefined,
      shortTermCapitalLossCF: undefined,
      longTermCapitalLossCF: undefined,
      businessLossCF: undefined
    };
    
    setEntries([...entries, newEntry]);
    setHasUnsavedChanges(true);
  };

  // Function to update an entry
  const updateEntry = (index: number, field: keyof CarryForwardLossEntry, value: any) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    
    setEntries(updatedEntries);
    setHasUnsavedChanges(true);
    
    // Clear error for this field if it exists
    if (errors[`${index}-${field}`]) {
      const newErrors = {...errors};
      delete newErrors[`${index}-${field}`];
      setErrors(newErrors);
    }
  };

  // Function to remove an entry
  const removeEntry = (index: number) => {
    const updatedEntries = [...entries];
    updatedEntries.splice(index, 1);
    setEntries(updatedEntries);
    setHasUnsavedChanges(true);
  };

  // Save entries directly to context
  const handleSave = async () => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;
    
    entries.forEach((entry, index) => {
      // Check required field
      if (!entry.lossYearAY) {
        newErrors[`${index}-lossYearAY`] = 'Assessment Year is required';
        isValid = false;
      } else if (!/^\d{4}-\d{2}$/.test(entry.lossYearAY)) {
        newErrors[`${index}-lossYearAY`] = 'Format should be YYYY-YY';
        isValid = false;
      }
      
      // Validate at least one loss amount is entered
      const hasAnyLossAmount = entry.housePropertyLossCF !== undefined || 
                            entry.shortTermCapitalLossCF !== undefined || 
                            entry.longTermCapitalLossCF !== undefined || 
                            entry.businessLossCF !== undefined;
                            
      if (!hasAnyLossAmount) {
        newErrors[`${index}-amounts`] = 'At least one loss amount is required';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    if (isValid) {
      try {
        // Update user input data with new entries
        await saveUserInputData({
          ...userInput,
          scheduleCFLAdditions: {
            ...userInput.scheduleCFLAdditions,
            lossesToCarryForward: entries
          }
        });
        
        setHasUnsavedChanges(false);
        alert('Carry forward losses saved successfully!');
      } catch (error) {
        console.error('Error saving carry forward losses:', error);
        alert('Failed to save carry forward losses. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Carry Forward Losses</h3>
      
      {entries.length > 0 ? (
        <div className="space-y-8">
          {entries.map((entry, index) => (
            <Card key={index} className="p-4 space-y-4 relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2" 
                onClick={() => removeEntry(index)}
                type="button"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  id={`ay-${index}`}
                  label="Assessment Year (YYYY-YY)"
                  value={entry.lossYearAY}
                  onChange={(value) => updateEntry(index, 'lossYearAY', value || '')}
                  placeholder="2022-23"
                  error={errors[`${index}-lossYearAY`]}
                />
                
                <DateInput
                  id={`date-filing-${index}`}
                  label="Date of Filing"
                  value={entry.dateOfFiling}
                  onChange={(value) => updateEntry(index, 'dateOfFiling', value)}
                  error={errors[`${index}-dateOfFiling`]}
                />
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Loss Amounts</h4>
                {errors[`${index}-amounts`] && (
                  <p className="text-xs text-red-500 mb-2">{errors[`${index}-amounts`]}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CurrencyInput
                    id={`hp-loss-${index}`}
                    label="House Property Loss"
                    value={entry.housePropertyLossCF}
                    onChange={(value) => updateEntry(index, 'housePropertyLossCF', value)}
                    error={errors[`${index}-housePropertyLossCF`]}
                  />
                  
                  <CurrencyInput
                    id={`stcg-loss-${index}`}
                    label="Short Term Capital Loss"
                    value={entry.shortTermCapitalLossCF}
                    onChange={(value) => updateEntry(index, 'shortTermCapitalLossCF', value)}
                    error={errors[`${index}-shortTermCapitalLossCF`]}
                  />
                  
                  <CurrencyInput
                    id={`ltcg-loss-${index}`}
                    label="Long Term Capital Loss"
                    value={entry.longTermCapitalLossCF}
                    onChange={(value) => updateEntry(index, 'longTermCapitalLossCF', value)}
                    error={errors[`${index}-longTermCapitalLossCF`]}
                  />
                  
                  <CurrencyInput
                    id={`business-loss-${index}`}
                    label="Business Loss"
                    value={entry.businessLossCF}
                    onChange={(value) => updateEntry(index, 'businessLossCF', value)}
                    error={errors[`${index}-businessLossCF`]}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-gray-500 mb-4">No carry forward losses added yet</p>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={addEntry} 
          className="flex items-center gap-2"
          type="button"
        >
          <Plus className="h-4 w-4" />
          Add Loss Entry
        </Button>
        
        <Button 
          variant="default" 
          onClick={handleSave} 
          disabled={entries.length === 0}
          type="button"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}; 