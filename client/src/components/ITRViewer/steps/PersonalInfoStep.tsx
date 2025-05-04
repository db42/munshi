import React from 'react';
import { Itr, PersonalInfo } from '../../../types/itr';
import { ITRViewerStepConfig } from '../types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { getNestedValue } from '../../../utils/helpers';

interface StepProps {
  personalInfo?: PersonalInfo;
  config: ITRViewerStepConfig;
}

export const PersonalInfoStep: React.FC<StepProps> = ({ personalInfo, config }) => {
  // TODO: Extract and display relevant data from itrData based on config.associatedSchedules (e.g., PartA)
  console.log('Rendering PersonalInfoStep with data:', personalInfo, 'and config:', config);

  // Example paths - adjust these based on your actual itrData structure
  const address = personalInfo?.Address;

  return (
    <div className="space-y-4">
      {/* Removed h3 as title is handled by parent */}
      {/* <h3 className="text-lg font-medium">{config.title}</h3> */}

      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="space-y-1">
          <Label htmlFor="pan">PAN</Label>
          <Input id="pan" readOnly value={getNestedValue(personalInfo, 'PAN')} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            readOnly 
            value={`${getNestedValue(personalInfo, 'AssesseeName.FirstName', '')} ${getNestedValue(personalInfo, 'AssesseeName.SurNameOrOrgName', '')}`.trim() || '-'} 
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="text" readOnly value={getNestedValue(personalInfo, 'DOB')} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input id="mobile" readOnly value={getNestedValue(address, 'MobileNo')} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" readOnly value={getNestedValue(address, 'EmailAddress')} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="aadhaar">Aadhaar Number</Label>
          <Input id="aadhaar" readOnly value={getNestedValue(personalInfo, 'AadhaarCardNo')} />
        </div>
      </div>

      {/* Residential Address Section */}
      <div className="space-y-2 pt-4">
        <Label className="text-base font-medium">Residential Address</Label>
        <div className="space-y-2">
          <Label htmlFor="address1" className="text-xs text-gray-500">Flat/Door/Block No.</Label>
          <Input id="address1" readOnly value={getNestedValue(address, 'ResidenceNo')} />
        </div>
        <div className="space-y-2">
           <Label htmlFor="address2" className="text-xs text-gray-500">Premises/Building/Village</Label>
           <Input id="address2" readOnly value={getNestedValue(address, 'ResidenceName')} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-2">
          <div className="space-y-1">
            <Label htmlFor="city">City/Town/District</Label>
            <Input id="city" readOnly value={getNestedValue(address, 'CityOrTownOrDistrict')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="state">State</Label>
            <Input id="state" readOnly value={getNestedValue(address, 'StateCode')} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="pincode">PIN Code</Label>
            <Input id="pincode" readOnly value={getNestedValue(address, 'PinCode')} />
          </div>
        </div>
      </div>
    </div>
  );
}; 