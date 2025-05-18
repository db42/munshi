import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { useEditMode } from '../context/EditModeContext';
import { useUserInput } from '../context/UserInputContext';
import { SelfAssessmentTaxPayment } from '../../../types/userInput.types';
import { CurrencyInput, DateInput, TextInput } from '../ui/forms/FormComponents';

export const SelfAssessmentTaxForm: React.FC = () => {
  const { userInput, saveUserInputData, isLoading } = useUserInput();
  const { setHasUnsavedChanges } = useEditMode();
  
  // Initialize entries from context
  const existingEntries = userInput.taxesPaidAdditions?.selfAssessmentTax || [];
  const [entries, setEntries] = useState<SelfAssessmentTaxPayment[]>(existingEntries);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Update entries if context data changes
  useEffect(() => {
    setEntries(userInput.taxesPaidAdditions?.selfAssessmentTax || []);
  }, [userInput.taxesPaidAdditions?.selfAssessmentTax]);

  // Function to add a new empty entry
  const addEntry = () => {
    const newEntry: SelfAssessmentTaxPayment = {
      bsrCode: '',
      dateDeposit: '', // YYYY-MM-DD
      challanSerialNo: '',
      amount: 0
    };
    
    setEntries([...entries, newEntry]);
    setHasUnsavedChanges(true);
  };

  // Function to update an entry
  const updateEntry = (index: number, field: keyof SelfAssessmentTaxPayment, value: any) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value
    };
    
    setEntries(updatedEntries);
    setHasUnsavedChanges(true);
  };

  // Function to remove an entry
  const removeEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    setHasUnsavedChanges(true);
  };

  // Function to save entries to context
  const handleSave = async () => {
    const newErrors: {[key: string]: string} = {};
    let isValid = true;
    
    entries.forEach((entry, index) => {
      // Check required fields
      if (!entry.bsrCode) {
        newErrors[`${index}-bsrCode`] = 'BSR Code is required';
        isValid = false;
      }
      
      if (!entry.dateDeposit) {
        newErrors[`${index}-dateDeposit`] = 'Date of Deposit is required';
        isValid = false;
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.dateDeposit)) {
        newErrors[`${index}-dateDeposit`] = 'Format should be YYYY-MM-DD';
        isValid = false;
      }
      
      if (!entry.challanSerialNo) {
        newErrors[`${index}-challanSerialNo`] = 'Challan Serial Number is required';
        isValid = false;
      }
      
      if (!entry.amount || entry.amount <= 0) {
        newErrors[`${index}-amount`] = 'Amount must be greater than 0';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    
    if (isValid) {
      try {
        // Update user input data with new entries
        await saveUserInputData({
          ...userInput,
          taxesPaidAdditions: {
            ...userInput.taxesPaidAdditions,
            selfAssessmentTax: entries
          }
        });
        
        setHasUnsavedChanges(false);
        alert('Self-assessment tax payments saved successfully!');
      } catch (error) {
        console.error('Error saving self-assessment tax payments:', error);
        alert('Failed to save self-assessment tax payments. Please try again.');
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Self-Assessment Tax Payments</h3>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium">Payment #{index + 1}</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => removeEntry(index)}
                className="text-red-500 h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput
                id={`bsrCode-${index}`}
                label="BSR Code"
                value={entry.bsrCode}
                onChange={(value) => updateEntry(index, 'bsrCode', value || '')}
                error={errors[`${index}-bsrCode`]}
              />
              
              <DateInput
                id={`dateDeposit-${index}`}
                label="Date of Deposit"
                value={entry.dateDeposit}
                onChange={(value) => updateEntry(index, 'dateDeposit', value || '')}
                error={errors[`${index}-dateDeposit`]}
              />
              
              <TextInput
                id={`challanSerialNo-${index}`}
                label="Challan Serial Number"
                value={entry.challanSerialNo}
                onChange={(value) => updateEntry(index, 'challanSerialNo', value || '')}
                error={errors[`${index}-challanSerialNo`]}
              />
              
              <CurrencyInput
                id={`amount-${index}`}
                label="Amount"
                value={entry.amount}
                onChange={(value) => updateEntry(index, 'amount', value || 0)}
                error={errors[`${index}-amount`]}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center p-6 bg-slate-50 rounded-md">
      {entries.length === 0 ? (
          <p className="text-gray-500">No self-assessment tax payments added yet.</p>
      ) : null }
        <Button variant="outline" onClick={addEntry} className="mt-2">
          <Plus className="h-4 w-4 mr-1" /> Add Payment
        </Button>
      </div>

      {/* Save Button Section */}
      {entries.length > 0 && (
        <div className="flex justify-end mt-6">
          <Button 
            onClick={handleSave} 
            disabled={isLoading} // Consider adding !hasUnsavedChanges later if needed
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md text-sm font-medium shadow-sm transition-colors duration-150 ease-in-out"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Self-Assessment Tax'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
