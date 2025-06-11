import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useUserInput } from '../context/UserInputContext';
import { useEditMode } from '../context/EditModeContext';
import { CurrencyInput } from '@/components/ui/forms/FormComponents';
import { Chapter6ADeductions } from '../../../types/userInput.types';
import _ from 'lodash';

interface Chapter6ADeductionsFormProps {
  onSave: () => void;
  onCancel: () => void;
}

export const Chapter6ADeductionsForm: React.FC<Chapter6ADeductionsFormProps> = ({ onSave, onCancel }) => {
  const { userInput, saveUserInputData, isLoading } = useUserInput();
  const { setHasUnsavedChanges } = useEditMode();

  const [deductions, setDeductions] = useState<Chapter6ADeductions>(
    userInput.chapter6aDeductions || {}
  );

  useEffect(() => {
    setDeductions(userInput.chapter6aDeductions || {});
  }, [userInput.chapter6aDeductions]);

  const handleUpdate = (field: keyof Chapter6ADeductions, value: number | undefined) => {
    const newDeductions = { ...deductions, [field]: value };
    setDeductions(newDeductions);
    setHasUnsavedChanges(!_.isEqual(newDeductions, userInput.chapter6aDeductions));
  };

  const handleSave = async () => {
    try {
      await saveUserInputData({
        ...userInput,
        chapter6aDeductions: deductions,
      });
      setHasUnsavedChanges(false);
      alert('Deductions have been saved successfully.');
      onSave();
    } catch (error) {
      console.error('Error saving Chapter VI-A deductions:', error);
      alert('Failed to save deductions. Please try again.');
    }
  };

  const handleCancel = () => {
    setDeductions(userInput.chapter6aDeductions || {});
    setHasUnsavedChanges(false);
    onCancel();
  };

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chapter VI-A Deductions</CardTitle>
        <CardDescription>
          Add or edit your deductions under Chapter VI-A. These will be used to calculate your taxable income under the old tax regime.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CurrencyInput
            id="section80C"
            label="Section 80C (Investments: PPF, LIC, etc.)"
            value={deductions.section80C_investments}
            onChange={(value) => handleUpdate('section80C_investments', value)}
          />
          <CurrencyInput
            id="section80D"
            label="Section 80D (Medical Insurance Premium)"
            value={deductions.section80D_premium}
            onChange={(value) => handleUpdate('section80D_premium', value)}
          />
          <CurrencyInput
            id="section80E"
            label="Section 80E (Interest on Education Loan)"
            value={deductions.section80E_interest}
            onChange={(value) => handleUpdate('section80E_interest', value)}
          />
          <CurrencyInput
            id="section80TTA"
            label="Section 80TTA (Interest on Savings Account)"
            value={deductions.section80TTA_interest}
            onChange={(value) => handleUpdate('section80TTA_interest', value)}
          />
          <CurrencyInput
            id="section80TTB"
            label="Section 80TTB (Interest for Senior Citizens)"
            value={deductions.section80TTB_interest}
            onChange={(value) => handleUpdate('section80TTB_interest', value)}
          />
          <CurrencyInput
            id="nps_contribution_80CCD1"
            label="Section 80CCD(1) (NPS Contribution)"
            value={deductions.nps_contribution_80CCD1}
            onChange={(value) => handleUpdate('nps_contribution_80CCD1', value)}
          />
          <CurrencyInput
            id="nps_additional_contribution_80CCD1B"
            label="Section 80CCD(1B) (Additional NPS Contribution)"
            value={deductions.nps_additional_contribution_80CCD1B}
            onChange={(value) => handleUpdate('nps_additional_contribution_80CCD1B', value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Deductions'}
        </Button>
      </CardFooter>
    </Card>
  );
}; 