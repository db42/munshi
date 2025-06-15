import React from 'react';
import type { Itr1 } from '../../../types/itr-1';
import type { Itr2, Address, PersonalInfo } from '../../../types/itr';
import type { ITRViewerStepConfig } from '../types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BankAccountForm } from '../forms/BankAccountForm';
import { useEditMode } from '../context/EditModeContext';
import { useUserInput } from '../context/UserInputContext';
import { Button } from '@/components/ui/button';
import { Edit, List } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const getPersonalInfo = (itrData: Itr1 | Itr2): PersonalInfo | undefined => {
  if ('Form_ITR1' in itrData && itrData.PersonalInfo) { // This is Itr1
    return itrData.PersonalInfo;
  } else if ('Form_ITR2' in itrData && itrData.PartA_GEN1) { // This is Itr2
    return itrData.PartA_GEN1.PersonalInfo;
  }
  return undefined;
};

// No longer using a separate StepProps interface. Props are defined directly on the component.
// The key change is that itrData is now a union type: Itr1 | Itr2.
export const PersonalInfoStep: React.FC<{ itrData: Itr1 | Itr2, config: ITRViewerStepConfig }> = ({ itrData, config }) => {
  const personalInfo: PersonalInfo | undefined = getPersonalInfo(itrData);

  // The address is derived from the normalized personalInfo object.
  const address: Address | undefined = personalInfo?.Address;

  const { activeEditSection, setActiveEditSection } = useEditMode();
  const { userInput } = useUserInput();

  const isBankSectionInEdit = activeEditSection === 'bankAccounts';
  const userBankAccounts = userInput.generalInfoAdditions?.bankDetails || [];

  const handleToggleBankEdit = () => {
    if (isBankSectionInEdit) {
      setActiveEditSection(null);
    } else {
      setActiveEditSection('bankAccounts');
    }
  };

  return (
    <div className="space-y-4">
      {/* Removed h3 as title is handled by parent */}
      {/* <h3 className="text-lg font-medium">{config.title}</h3> */}

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-1">
          <Label htmlFor="pan">PAN</Label>
          <Input id="pan" readOnly value={personalInfo?.PAN ?? '-'} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            readOnly 
            value={`${personalInfo?.AssesseeName?.FirstName ?? ''} ${personalInfo?.AssesseeName?.SurNameOrOrgName ?? ''}`.trim() || '-'} 
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="text" readOnly value={personalInfo?.DOB ?? '-'} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input id="mobile" readOnly value={address?.MobileNo ?? '-'} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" readOnly value={address?.EmailAddress ?? '-'} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="aadhaar">Aadhaar Number</Label>
          <Input id="aadhaar" readOnly value={personalInfo?.AadhaarCardNo ?? '-'} />
        </div>
      </div>

      {/* Residential Address Section */}
      <div className="space-y-2 pt-4">
        <Label className="text-base font-medium">Residential Address</Label>
        <div className="space-y-2">
          <Label htmlFor="address1" className="text-xs text-gray-500">Flat/Door/Block No.</Label>
          <Input id="address1" readOnly value={address?.ResidenceNo ?? '-'} />
        </div>
        <div className="space-y-2">
           <Label htmlFor="address2" className="text-xs text-gray-500">Premises/Building/Village</Label>
           <Input id="address2" readOnly value={address?.ResidenceName ?? '-'} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="city">City/Town/District</Label>
            <Input id="city" readOnly value={address?.CityOrTownOrDistrict ?? '-'} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="state">State</Label>
            <Input id="state" readOnly value={address?.StateCode ?? '-'} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="pincode">PIN Code</Label>
            <Input id="pincode" readOnly value={address?.PinCode ?? '-'} />
          </div>
        </div>
      </div>

      {/* Bank Account Details Section */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-5 border-b">
          <CardTitle className="text-lg font-semibold">
            Bank Account Details (User Added)
          </CardTitle>
          <Button onClick={handleToggleBankEdit} variant="outline" size="sm">
            {isBankSectionInEdit ? <List className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isBankSectionInEdit ? "View Accounts" : "Edit Accounts"}
          </Button>
        </CardHeader>
        <CardContent className="p-5">
          {isBankSectionInEdit ? (
            <BankAccountForm />
          ) : (
            userBankAccounts.length > 0 ? (
              <div className="bg-slate-50/50 p-4 rounded-md">
                <ul className="space-y-2 text-sm text-slate-700">
                  {userBankAccounts.map((account, index) => (
                    <li key={index} className="flex justify-between items-center py-1.5 border-b border-slate-200 last:border-b-0">
                      <div>
                        <span className="font-medium text-slate-800 block">{account.bankName}</span>
                        <span className="text-slate-600 text-xs">
                          IFSC: {account.ifsc} - Acc No: {account.accountNumber} ({account.accountType === 'SB' ? 'Savings' : 'Current'})
                        </span>
                      </div>
                      {account.isPrimary && 
                        <span className="font-semibold ml-2 py-0.5 px-2 text-xs bg-sky-100 text-sky-700 rounded-full self-start">
                          Primary
                        </span>
                      }
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic py-3">No bank accounts added by the user. Click 'Edit Accounts' to add new bank account details.</p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 