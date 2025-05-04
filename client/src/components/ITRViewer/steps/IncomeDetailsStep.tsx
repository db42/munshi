import React from 'react';
import { ITRViewerStepConfig } from '../types';
import { Input } from '../ui/input'; 
import { Label } from '../ui/label'; 
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle } from 'lucide-react';
import { getNestedValue } from '../../../utils/helpers';
import { Itr } from '../../../types/itr';

interface StepProps {
  itrData: Itr;
  config: ITRViewerStepConfig;
}

export const IncomeDetailsStep: React.FC<StepProps> = ({ itrData, config }) => {
  // Assuming itrData contains the structured JSON
  // Example paths - these need to match the actual ITR JSON structure
  const scheduleS = itrData?.ITR?.ITR2.ScheduleS;
  const scheduleHP = itrData?.ITR?.ITR2.ScheduleHP;
  const scheduleOS = itrData?.ITR?.ITR2.ScheduleOS;

  return (
    <div className="space-y-6">
      
      {/* --- Section: Income from Salary/Pension --- */}
      {scheduleS && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Income from Salary/Pension</h3>
          
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Details displayed as per Form 16 / Salary Schedule (Schedule S).
            </AlertDescription>
          </Alert>

          {/* Assuming ScheduleS is an array of employers */}
          {Array.isArray(scheduleS) ? scheduleS.map((employer: any, index: number) => (
            <div key={index} className="space-y-4 p-4 border rounded-md mb-4">
              <div className="space-y-2">
                <Label htmlFor={`employer-${index}`}>Employer Name</Label>
                <Input id={`employer-${index}`} readOnly value={getNestedValue(employer, 'employerName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`tan-${index}`}>TAN of Employer</Label>
                <Input id={`tan-${index}`} readOnly value={getNestedValue(employer, 'employerTan')} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <Label htmlFor={`salary-${index}`}>Gross Salary</Label>
                  <Input id={`salary-${index}`} readOnly value={`₹${getNestedValue(employer, 'salary.grossSalary')}`} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`allowances-${index}`}>Allowances Exempt</Label>
                  <Input id={`allowances-${index}`} readOnly value={`₹${getNestedValue(employer, 'salary.exemptAllowances')}`} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`net-salary-${index}`}>Net Salary</Label>
                  <Input id={`net-salary-${index}`} readOnly value={`₹${getNestedValue(employer, 'salary.netSalary')}`} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`deductions-salary-${index}`}>Deductions u/s 16</Label>
                  <Input id={`deductions-salary-${index}`} readOnly value={`₹${getNestedValue(employer, 'salary.deductions16')}`} />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`tax-paid-${index}`}>Income Tax Paid/TDS (Salary)</Label>
                <Input id={`tax-paid-${index}`} readOnly value={`₹${getNestedValue(employer, 'tdsDetails.tdsSalary')}`} />
              </div>
            </div>
          )) : (
            <p className="text-sm text-gray-500 italic">No Salary (Schedule S) data found.</p>
          )} 
        </div>
      )}

      {/* --- Section: Income from House Property --- */}
      {scheduleHP && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium">Income from House Property</h3>
          
          {/* Assuming ScheduleHP is an array of properties */}
          {Array.isArray(scheduleHP) ? scheduleHP.map((property: any, index: number) => (
            <div key={index} className="space-y-4 p-4 border rounded-md mb-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                 <div className="space-y-1">
                   <Label htmlFor={`property-type-${index}`}>Type of Property</Label>
                   {/* Use Input for now, could replace with Select later */}
                   <Input id={`property-type-${index}`} readOnly value={getNestedValue(property, 'propertyType')} /> 
                 </div>
                 <div className="space-y-1">
                   <Label htmlFor={`property-address-${index}`}>Property Address</Label>
                   {/* Combine address fields? Example assumes a single field */}
                   <Input id={`property-address-${index}`} readOnly value={getNestedValue(property, 'address.fullAddress')} />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <Label htmlFor={`annual-value-${index}`}>Annual Value / Rent Received</Label>
                  <Input id={`annual-value-${index}`} readOnly value={`₹${getNestedValue(property, 'incomeDetails.rentReceived')}`} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`municipal-tax-${index}`}>Municipal Tax Paid</Label>
                  <Input id={`municipal-tax-${index}`} readOnly value={`₹${getNestedValue(property, 'incomeDetails.municipalTax')}`} />
                </div>
              </div>

              <div className="space-y-1">
                 <Label htmlFor={`interest-paid-${index}`}>Interest Paid on Housing Loan</Label>
                 <Input id={`interest-paid-${index}`} readOnly value={`₹${getNestedValue(property, 'incomeDetails.interestPaid')}`} />
              </div>

              {/* Optional: Add note similar to reference if needed */}
              {/* <Alert variant="info"> ... </Alert> */} 
            </div>
           )) : (
            <p className="text-sm text-gray-500 italic">No House Property (Schedule HP) data found.</p>
           )}
        </div>
      )}

      {/* --- Section: Income from Other Sources --- */}
      {scheduleOS && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-medium">Income from Other Sources</h3>

          {/* Assuming ScheduleOS holds the relevant fields directly */}
          {typeof scheduleOS === 'object' && scheduleOS !== null ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <Label htmlFor="interest-savings">Interest from Savings Account</Label>
                  <Input id="interest-savings" readOnly value={`₹${getNestedValue(scheduleOS, 'interestIncome.savingsBank')}`} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="interest-fd">Interest from Fixed Deposits</Label>
                  <Input id="interest-fd" readOnly value={`₹${getNestedValue(scheduleOS, 'interestIncome.fixedDeposits')}`} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="dividends">Dividends</Label>
                  <Input id="dividends" readOnly value={`₹${getNestedValue(scheduleOS, 'dividends')}`} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="other-income">Other Income (Specify)</Label>
                  <Input id="other-income" readOnly value={`₹${getNestedValue(scheduleOS, 'otherIncome')}`} />
                </div>
              </div>
              <div className="space-y-1 pt-2">
                <Label htmlFor="deduction-57">Deduction under Section 57</Label>
                <Input id="deduction-57" readOnly value={`₹${getNestedValue(scheduleOS, 'deductions57')}`} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No Other Sources (Schedule OS) data found.</p>
          )}
        </div>
      )}

    </div>
  );
}; 