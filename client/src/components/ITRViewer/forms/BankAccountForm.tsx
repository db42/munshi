import React, { useState, useEffect } from 'react';
import { useUserInput } from '../context/UserInputContext';
import { useEditMode } from '../context/EditModeContext';
import type { BankAccount, UserInputData } from '../../../types/userInput.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash2, PlusCircle } from 'lucide-react';

// Props for the form (if any, though direct context access is the pattern)
// interface BankAccountFormProps {}

export const BankAccountForm: React.FC = () => {
  const { userInput, isLoading, saveUserInputData } = useUserInput();
  const { setHasUnsavedChanges } = useEditMode();

  // Local state for bank accounts, initialized from context
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(
    userInput.generalInfoAdditions?.bankDetails || []
  );

  // Update local state when context data changes (e.g., after a fetch or external update)
  useEffect(() => {
    setBankAccounts(userInput.generalInfoAdditions?.bankDetails || []);
  }, [userInput.generalInfoAdditions?.bankDetails]);

  const handleInputChange = (index: number, field: keyof BankAccount, value: string | boolean) => {
    const updatedAccounts = bankAccounts.map((account, i) => {
      if (i === index) {
        return { ...account, [field]: value };
      }
      // If a primary account is being set, unmark other primaries
      if (field === 'isPrimary' && value === true) {
        return { ...account, isPrimary: false };
      }
      return account;
    });
    setBankAccounts(updatedAccounts);
    setHasUnsavedChanges(true);
  };

  const addBankAccount = () => {
    setBankAccounts([
      ...bankAccounts,
      {
        ifsc: '',
        bankName: '',
        accountNumber: '',
        accountType: 'SB',
        isPrimary: bankAccounts.every(acc => !acc.isPrimary) ? true : false, // Make new primary if no other primary exists
      },
    ]);
    setHasUnsavedChanges(true);
  };

  const removeBankAccount = (index: number) => {
    let updatedAccounts = bankAccounts.filter((_, i) => i !== index);
    // If the removed account was primary and other accounts exist, make the first one primary
    const wasPrimary = bankAccounts[index]?.isPrimary;
    if (wasPrimary && updatedAccounts.length > 0 && !updatedAccounts.some(acc => acc.isPrimary)) {
      updatedAccounts[0].isPrimary = true;
    }
    setBankAccounts(updatedAccounts);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    for (const account of bankAccounts) {
      if (!account.ifsc || !account.bankName || !account.accountNumber) {
        // Consider using a toast notification for errors
        alert('Please fill all mandatory fields for each bank account (IFSC, Bank Name, Account Number).');
        return;
      }
      // TODO: Add IFSC format validation (e.g., /^[A-Z]{4}0[A-Z0-9]{6}$/)
    }

    const updatedUserInput: UserInputData = {
      ...userInput,
      generalInfoAdditions: {
        ...userInput.generalInfoAdditions,
        bankDetails: bankAccounts,
      },
    };

    try {
      await saveUserInputData(updatedUserInput);
      setHasUnsavedChanges(false);
      alert('Bank details saved successfully!');
    } catch (error) {
      console.error("Error saving bank details:", error);
      alert('Failed to save bank details. Please try again.');
    }
  };

  // --- Render Logic ---
  return (
    <div className="space-y-6">
      {bankAccounts.map((account, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50 py-3 px-4 border-b">
            <CardTitle className="text-base font-semibold">Account {index + 1}</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => removeBankAccount(index)} 
              aria-label="Remove account"
              className="text-slate-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={`ifsc-${index}`}>IFSC Code*</Label>
                <Input
                  id={`ifsc-${index}`}
                  value={account.ifsc}
                  onChange={(e) => handleInputChange(index, 'ifsc', e.target.value)}
                  placeholder="E.g., SBIN0001234"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`bankName-${index}`}>Bank Name*</Label>
                <Input
                  id={`bankName-${index}`}
                  value={account.bankName}
                  onChange={(e) => handleInputChange(index, 'bankName', e.target.value)}
                  placeholder="E.g., State Bank of India"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`accountNumber-${index}`}>Account Number*</Label>
              <Input
                id={`accountNumber-${index}`}
                value={account.accountNumber}
                onChange={(e) => handleInputChange(index, 'accountNumber', e.target.value)}
                placeholder="Enter account number"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <Label htmlFor={`accountType-${index}`}>Account Type*</Label>
                <Select
                  value={account.accountType}
                  onValueChange={(value) => handleInputChange(index, 'accountType', value as 'SB' | 'CA')}
                >
                  <SelectTrigger id={`accountType-${index}`}>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SB">Savings Account (SB)</SelectItem>
                    <SelectItem value="CA">Current Account (CA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pb-1.5 md:justify-self-start">
                <Checkbox
                  id={`isPrimary-${index}`}
                  checked={!!account.isPrimary}
                  onCheckedChange={(checked) => handleInputChange(index, 'isPrimary', checked)}
                />
                <Label htmlFor={`isPrimary-${index}`} className="font-normal text-sm cursor-pointer">
                  Set as primary account
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
        <Button variant="outline" onClick={addBankAccount} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Another Account
        </Button>
        <Button onClick={handleSave} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Saving Bank Details...' : 'Save Bank Details'}
        </Button>
      </div>
    </div>
  );
}; 