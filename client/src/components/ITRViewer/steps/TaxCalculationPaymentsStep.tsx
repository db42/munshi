import React, { useState } from 'react';
import _ from 'lodash';
import type { ITRViewerStepConfig } from '../types';
import type { Itr1 } from '../../../types/itr-1';
import type { Itr2, PartBTI, PartBTTI, ScheduleVIA, ScheduleTDS1, ScheduleTDS2, ScheduleIT, ScheduleTCS } from '../../../types/itr';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Calculator, Receipt, Edit, PenTool, AlertCircle, CreditCard } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { Button } from '@/components/ui/button';
import { IncomeComputationTab, createIncomeComputationViewModel } from './tabs/IncomeComputationTab';
import { TaxCalculationTab, createTaxCalculationTabViewModel } from './tabs/TaxCalculationTab';
import { TaxPaymentsTab } from './tabs/TaxPaymentsTab';
import { EditTaxPaymentTab } from './tabs/EditTaxPaymentTab';

interface StepProps {
  itrData: Itr1 | Itr2;
  config: ITRViewerStepConfig;
}

export const TaxCalculationPaymentsStep: React.FC<StepProps> = ({ itrData, config }) => {
  const taxCalculationStepViewModel = createTaxCalculationTabViewModel(itrData);
  const incomeComputationStepViewModel = createIncomeComputationViewModel(itrData);
  
  const { isEditMode, toggleEditMode } = useEditMode();

  // Initialize the active tab based on available data and mode
  const initialTab = isEditMode ? "edit-tax-payment" : "income-computation";

  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight">{config.title}</h2>
        <Button onClick={toggleEditMode} variant={isEditMode ? "default" : "outline"} size="sm">
          <Edit className="h-4 w-4 mr-2" />
          {isEditMode ? "View Summary" : "Edit Tax Payments"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger 
            value="income-computation" 
            className="flex items-center"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Income Computation
          </TabsTrigger>
          
          <TabsTrigger 
            value="tax-calculation" 
            className="flex items-center"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Tax Calculation
          </TabsTrigger>
          
          <TabsTrigger 
            value="tax-payments-display" 
            className="flex items-center"
          >
            <Receipt className="h-4 w-4 mr-2" />
            Tax Payments Summary
          </TabsTrigger>
          
          <TabsTrigger 
            value="edit-tax-payment" 
            className="flex items-center"
            disabled={!isEditMode}
          >
            <PenTool className="h-4 w-4 mr-2" />
            Edit Tax Payments
          </TabsTrigger>
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="income-computation" className="mt-0">
          {incomeComputationStepViewModel && (
            <IncomeComputationTab
              viewModel={incomeComputationStepViewModel}
            />
          )}
        </TabsContent>
        
        <TabsContent value="tax-calculation" className="mt-0">
          {taxCalculationStepViewModel && (
            <TaxCalculationTab viewModel={taxCalculationStepViewModel} />
          )}
        </TabsContent>
        
        <TabsContent value="tax-payments-display" className="mt-0">
          {<TaxPaymentsTab itrData={itrData} />}
        </TabsContent>
        
        <TabsContent value="edit-tax-payment" className="mt-0">
          {isEditMode && <EditTaxPaymentTab />}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 