import React from 'react';
import { Itr, PersonalInfo } from '../../../types/itr';
import { ITRViewerStepConfig } from '../types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export interface StepProps {
  itrData: Itr;
  config: ITRViewerStepConfig;
}

export const PersonalInfoStep: React.FC<StepProps> = ({ itrData, config }) => {
  // TODO: Extract and display relevant data from itrData based on config.associatedSchedules (e.g., PartA)
  console.log('Rendering PersonalInfoStep with data:', itrData, 'and config:', config);

  // Example paths - adjust these based on your actual itrData structure
  const personalInfo = itrData.ITR?.ITR2?.PartA_GEN1.PersonalInfo as PersonalInfo;
  const address = personalInfo.Address;

  return (
    <div className="space-y-4">
      {/* Removed h3 as title is handled by parent */}
      {/* <h3 className="text-lg font-medium">{config.title}</h3> */}

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-1">
          <Label htmlFor="pan">PAN</Label>
          <Input id="pan" readOnly value={personalInfo.PAN ?? '-'} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            readOnly 
            value={`${personalInfo.AssesseeName?.FirstName ?? ''} ${personalInfo.AssesseeName?.SurNameOrOrgName ?? ''}`.trim() || '-'} 
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="text" readOnly value={personalInfo.DOB ?? '-'} />
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
          <Input id="aadhaar" readOnly value={personalInfo.AadhaarCardNo ?? '-'} />
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
    </div>
  );
}; 