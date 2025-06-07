import React, { useState } from 'react';
import _ from 'lodash';
import { ITRViewerStepConfig } from '../types';
import { Itr } from '../../../types/itr';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Calculator, Receipt, Edit, PenTool, AlertCircle, CreditCard } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { Button } from '@/components/ui/button';
import { IncomeComputationTab } from './tabs/IncomeComputationTab';
import { TaxCalculationTab } from './tabs/TaxCalculationTab';
import { TaxPaymentsTab } from './tabs/TaxPaymentsTab';
import { EditTaxPaymentTab } from './tabs/EditTaxPaymentTab';

interface StepProps {
  itrData: Itr;
  config: ITRViewerStepConfig;
}

export const TaxCalculationPaymentsStep: React.FC<StepProps> = ({ itrData, config }) => {
  const partBTI = itrData.ITR?.ITR2?.["PartB-TI"];
  const partBTTI = itrData.ITR?.ITR2?.PartB_TTI;
  const scheduleTDS1 = itrData.ITR?.ITR2?.ScheduleTDS1;
  const scheduleTDS2 = itrData.ITR?.ITR2?.ScheduleTDS2;
  const scheduleIT = itrData.ITR?.ITR2?.ScheduleIT;
  const scheduleTCS = itrData.ITR?.ITR2?.ScheduleTCS;

  const { isEditMode, toggleEditMode } = useEditMode();

  const taxPaymentsArray = Array.isArray(scheduleIT?.TaxPayment) 
    ? scheduleIT.TaxPayment 
    : scheduleIT?.TaxPayment ? [scheduleIT.TaxPayment] : [];


  const scheduleTDS1Array = Array.isArray(scheduleTDS1) ? scheduleTDS1 : (scheduleTDS1 ? [scheduleTDS1] : []);
  const scheduleTDS2Array = Array.isArray(scheduleTDS2) ? scheduleTDS2 : (scheduleTDS2 ? [scheduleTDS2] : []);
  const scheduleTCSArray = Array.isArray(scheduleTCS) ? scheduleTCS : (scheduleTCS ? [scheduleTCS] : []);

  const hasTDS = scheduleTDS1Array.length > 0 || scheduleTDS2Array.length > 0;
  const hasTCS = scheduleTCSArray.length > 0;
  const hasAnyScheduleITPayments = taxPaymentsArray.length > 0;
  
  const hasTaxPaymentsData = hasTDS || hasAnyScheduleITPayments || hasTCS;

  const showIncomeComputationTab = !_.isNil(partBTI);
  const showTaxCalculationTab = !_.isNil(partBTTI);
  const showTaxPaymentsDisplayTab = hasTaxPaymentsData;
  const showEditTaxPaymentTab = isEditMode;

  // Initialize the active tab based on available data and mode
  let initialTab = "income-computation";
  if (isEditMode) {
    initialTab = "edit-tax-payment";
  } else if (showIncomeComputationTab) {
    initialTab = "income-computation";
  } else if (showTaxCalculationTab) {
    initialTab = "tax-calculation";
  } else if (showTaxPaymentsDisplayTab) {
    initialTab = "tax-payments-display";
  }

  const [activeTab, setActiveTab] = useState(initialTab);

  const noDataAndNotInEditMode = !showIncomeComputationTab && !showTaxCalculationTab && !hasTaxPaymentsData && !isEditMode;

  if (noDataAndNotInEditMode) {
    return (
      <div className="space-y-4">
         <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-tight">{config.title}</h2>
          <Button onClick={toggleEditMode} variant={"outline"} size="sm">
            <Edit className="h-4 w-4 mr-2" />
            {"Enter Tax Payments"}
          </Button>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Data Available</AlertTitle>
          <AlertDescription>
            There is no income computation, tax calculation, or tax payment data to display. You can enter tax payment details.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
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
            disabled={!partBTI}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Income Computation
          </TabsTrigger>
          
          <TabsTrigger 
            value="tax-calculation" 
            className="flex items-center"
            disabled={!partBTTI}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Tax Calculation
          </TabsTrigger>
          
          <TabsTrigger 
            value="tax-payments-display" 
            className="flex items-center"
            disabled={!hasTaxPaymentsData}
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
          {partBTI && <IncomeComputationTab partBTI={partBTI} />}
        </TabsContent>
        
        <TabsContent value="tax-calculation" className="mt-0">
          {partBTTI && <TaxCalculationTab partBTTI={partBTTI} />}
        </TabsContent>
        
        <TabsContent value="tax-payments-display" className="mt-0">
          {itrData && <TaxPaymentsTab itrData={itrData} />}
        </TabsContent>
        
        <TabsContent value="edit-tax-payment" className="mt-0">
          {isEditMode && <EditTaxPaymentTab />}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 