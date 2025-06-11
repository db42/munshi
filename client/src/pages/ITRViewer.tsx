import React, { useState, useMemo } from 'react';
import { useITRData } from '@/components/ITRViewer/useITRData';
import { itr2StepsConfig } from '@/components/ITRViewer/config/itr-2-config';
import { ITRViewerStepConfig } from '@/components/ITRViewer/types';
import { Itr } from '../types/itr';
// Import UI components using correct relative paths
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { EditModeProvider } from '@/components/ITRViewer/context/EditModeContext';
import { UserInputProvider, useUserInput } from '@/components/ITRViewer/context/UserInputContext';

// Import Step Components using correct relative paths
import { PersonalInfoStep } from '@/components/ITRViewer/steps/PersonalInfoStep';
import { TaxRegimeStep } from '@/components/ITRViewer/steps/TaxRegimeStep';
import { IncomeDetailsStep } from '@/components/ITRViewer/steps/IncomeDetailsStep';
import { CapitalGainsStep } from '@/components/ITRViewer/steps/CapitalGainsStep';
import { DeductionsStep } from '@/components/ITRViewer/steps/DeductionsStep';
import { LossesStep } from '@/components/ITRViewer/steps/LossesStep';
import { ForeignAssetsIncomeStep } from '@/components/ITRViewer/steps/ForeignAssetsIncomeStep';
import { AssetsLiabilitiesStep } from '@/components/ITRViewer/steps/AssetsLiabilitiesStep';
import { TaxCalculationPaymentsStep } from '@/components/ITRViewer/steps/TaxCalculationPaymentsStep';
import { SummaryConfirmationStep } from '@/components/ITRViewer/steps/SummaryConfirmationStep';
import { useAssessmentYear } from '../context/AssessmentYearContext';
import { useUser } from '../context/UserContext';
import { TaxRegimePreference, TaxRegimeComparison } from '../types/tax.types';

// Map Step IDs to Components
const stepComponentMap: { [key: string]: React.FC<{ itrData: Itr; config: ITRViewerStepConfig, taxRegimeComparison?: TaxRegimeComparison }> } = {
  personalInfo: PersonalInfoStep,
  taxRegimeSelection: TaxRegimeStep,
  incomeDetails: IncomeDetailsStep,
  capitalGains: CapitalGainsStep,
  deductions: DeductionsStep,
  losses: LossesStep,
  foreignAssetsIncome: ForeignAssetsIncomeStep,
  assetsLiabilities: AssetsLiabilitiesStep,
  taxCalculationPayments: TaxCalculationPaymentsStep,
  summaryConfirmation: SummaryConfirmationStep,
};

const ITRViewerContent: React.FC = () => {
  const { assessmentYear } = useAssessmentYear();
  const { currentUser } = useUser();
  const { userInput } = useUserInput();
  const userId = currentUser.id;
  
  const taxRegimePreference = userInput.generalInfoAdditions?.taxRegimePreference || TaxRegimePreference.AUTO;

  // Only call the hook if userId is available
  const { data: itrData, isLoading, error } = useITRData(String(userId), assessmentYear, taxRegimePreference);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const allStepsConfig = itr2StepsConfig;

  const visibleSteps = useMemo(() => {
    if (!itrData?.itr) return [];
    return allStepsConfig.filter(step => {
      if (!step.isConditional) return true;
      // TODO: Replace with actual condition check
      return !!itrData.itr;
    });
  }, [allStepsConfig, itrData]);

  const currentStepConfig = visibleSteps[currentStepIndex];
  const totalVisibleSteps = visibleSteps.length;
  const CurrentStepComponent = currentStepConfig ? stepComponentMap[currentStepConfig.id] : null;

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
  };

  const handleNext = () => {
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalVisibleSteps - 1));
  };

  const handlePrevious = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  // --- Loading/Error States --- 
  if (isLoading) {
    // TODO: Use Skeleton component?
    return <div>Loading ITR Data...</div>;
  }
  if (error) {
    // TODO: Use Alert component?
    return <div>Error loading ITR Data: {error.message}</div>;
  }
  if (!itrData || !itrData.itr || !currentStepConfig || totalVisibleSteps === 0) {
    return <div>No ITR Data found or steps not configured correctly.</div>;
  }

  return (
    <Card className="max-w-4xl mx-auto my-8">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-2xl">Income Tax Return (ITR-2)</CardTitle>
        <CardDescription>Assessment Year {assessmentYear}</CardDescription>
      </CardHeader>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStepIndex + 1} of {totalVisibleSteps}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(((currentStepIndex + 1) / totalVisibleSteps) * 100)}% Complete
          </span>
        </div>
        <Progress value={((currentStepIndex + 1) / totalVisibleSteps) * 100} className="h-2" />

        <div className="flex flex-wrap gap-2 mt-4 mb-4 border-b pb-4">
          {visibleSteps.map((step, index) => (
            <Button
              key={step.id}
              variant={index === currentStepIndex ? "default" : "outline"}
              size="sm"
              onClick={() => handleStepClick(index)}
              className="text-xs h-8"
            >
              {step.title}
            </Button>
          ))}
        </div>
      </div>

      <CardContent className="pt-0 pb-6 px-6">
        {CurrentStepComponent ? (
          <CurrentStepComponent 
            itrData={itrData.itr} 
            config={currentStepConfig} 
            taxRegimeComparison={itrData.taxRegimeComparison}
          />
        ) : (
          `Step component not found for ID: ${currentStepConfig?.id}`
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4 px-6 pb-4">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStepIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <Button variant="outline" className="mx-2">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>

        {currentStepIndex < totalVisibleSteps - 1 ? (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button className="bg-green-600 hover:bg-green-700" disabled>
            {/* <FileCheck className="h-4 w-4 mr-2" /> */}
            Submit ITR (Disabled)
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export const ITRViewer: React.FC = () => {
  const { assessmentYear } = useAssessmentYear();

  return (
    <EditModeProvider>
      <UserInputProvider assessmentYear={assessmentYear}>
        <ITRViewerContent />
      </UserInputProvider>
    </EditModeProvider>
  );
}; 