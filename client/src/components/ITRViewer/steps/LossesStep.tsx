import React, { useState } from 'react';
import type { ITRViewerStepConfig } from '../types';
import type { Itr1 } from '../../../types/itr-1';
import type { Itr2, ScheduleCFL, ScheduleCYLA, ScheduleBFLA } from '../../../types/itr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, ArrowLeftRight, PenTool } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatAmount } from '../../../utils/formatters';
import _ from 'lodash';
import { useEditMode } from '../context/EditModeContext';
import { useUserInput } from '../context/UserInputContext';
import { CarryForwardLossForm } from '../forms/CarryForwardLossForm';

interface StepProps {
  itrData: Itr1 | Itr2;
  config: ITRViewerStepConfig;
}

const CYLATab = ({ scheduleCYLA }: { scheduleCYLA: ScheduleCYLA }) => {
  if (!scheduleCYLA) return null;
  
  return (
    <TabsContent value="cyla" className="mt-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Current Year Loss Adjustment (CYLA)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This section shows how your current year losses from one head of income are set off against income from other heads.
            </p>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Income Head</TableHead>
                  <TableHead className="text-right">Income</TableHead>
                  <TableHead className="text-right">Loss Set Off</TableHead>
                  <TableHead className="text-right">Remaining Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleCYLA.Salary && (
                  <TableRow>
                    <TableCell>Salary</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleCYLA.Salary.IncCYLA?.IncOfCurYrUnderThatHead)}</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleCYLA.Salary.IncCYLA?.HPlossCurYrSetoff)}</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleCYLA.Salary.IncCYLA?.IncOfCurYrAfterSetOff)}</TableCell>
                  </TableRow>
                )}
                
                {scheduleCYLA.HP && (
                  <TableRow>
                    <TableCell>House Property</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleCYLA.HP.IncCYLA?.IncOfCurYrUnderThatHead)}</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleCYLA.HP.IncCYLA?.OthSrcLossNoRaceHorseSetoff)}</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleCYLA.HP.IncCYLA?.IncOfCurYrAfterSetOff)}</TableCell>
                  </TableRow>
                )}
                
                {scheduleCYLA.OthSrcExclRaceHorse && (
                  <TableRow>
                    <TableCell>Other Sources (Excl. Race Horses)</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleCYLA.OthSrcExclRaceHorse.IncCYLA?.IncOfCurYrUnderThatHead)}</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleCYLA.OthSrcExclRaceHorse.IncCYLA?.HPlossCurYrSetoff)}</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleCYLA.OthSrcExclRaceHorse.IncCYLA?.IncOfCurYrAfterSetOff)}</TableCell>
                  </TableRow>
                )}
                
                <Separator className="my-2" />
                <TableRow className="bg-slate-100 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{formatAmount(scheduleCYLA.TotalCurYr?.TotHPlossCurYr)}</TableCell>
                  <TableCell className="text-right">{formatAmount(scheduleCYLA.TotalLossSetOff?.TotOthSrcLossNoRaceHorseSetoff)}</TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

const BFLATab = ({ scheduleBFLA }: { scheduleBFLA: ScheduleBFLA }) => {
  if (!scheduleBFLA) return null;
  
  return (
    <TabsContent value="bfla" className="mt-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Brought Forward Loss Adjustment (BFLA)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This section shows how your brought forward losses from previous years are set off against current year income.
            </p>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Income Head</TableHead>
                  <TableHead className="text-right">Current Year Income (after CYLA)</TableHead>
                  <TableHead className="text-right">B/F Loss Set Off</TableHead>
                  <TableHead className="text-right">Remaining Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleBFLA.HP && (
                  <TableRow>
                    <TableCell>House Property</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleBFLA.HP.IncBFLA?.IncOfCurYrUndHeadFromCYLA)}</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleBFLA.HP.IncBFLA?.BFlossPrevYrUndSameHeadSetoff)}</TableCell>
                    <TableCell className="text-right">{formatAmount(scheduleBFLA.HP.IncBFLA?.IncOfCurYrAfterSetOffBFLosses)}</TableCell>
                  </TableRow>
                )}
                
                <Separator className="my-2" />
                <TableRow className="bg-slate-100 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{formatAmount(scheduleBFLA.TotalBFLossSetOff?.TotBFLossSetoff)}</TableCell>
                  <TableCell className="text-right">{formatAmount(scheduleBFLA.IncomeOfCurrYrAftCYLABFLA)}</TableCell>
                  <TableCell className="text-right">{formatAmount(scheduleBFLA.IncomeOfCurrYrAftCYLABFLA)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

const CFLTab = ({ scheduleCFL }: { scheduleCFL: ScheduleCFL }) => {
  if (!scheduleCFL) return null;
  
  const hasOthSrcLoss = () => {
    return (scheduleCFL.TotalOfBFLossesEarlierYrs?.LossSummaryDetail?.OthSrcLossRaceHorseCF || 0) > 0;
  };
  
  return (
    <TabsContent value="cfl" className="mt-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Carried Forward Losses (CFL)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              This section shows losses that could not be set off and are being carried forward to future years.
            </p>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Income Head</TableHead>
                  <TableHead className="text-right">Loss to be Carried Forward</TableHead>
                  <TableHead className="text-right">Applicable Assessment Years</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleCFL.TotalOfBFLossesEarlierYrs?.LossSummaryDetail && (
                  <>
                    {scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalHPPTILossCF > 0 && (
                      <TableRow>
                        <TableCell>House Property Loss</TableCell>
                        <TableCell className="text-right">
                          {formatAmount(scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalHPPTILossCF)}
                        </TableCell>
                        <TableCell className="text-right">AY 2024-25 onwards</TableCell>
                      </TableRow>
                    )}
                    
                    {scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalSTCGPTILossCF > 0 && (
                      <TableRow>
                        <TableCell>Short Term Capital Loss</TableCell>
                        <TableCell className="text-right">
                          {formatAmount(scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalSTCGPTILossCF)}
                        </TableCell>
                        <TableCell className="text-right">Next 8 Assessment Years</TableCell>
                      </TableRow>
                    )}
                    
                    {scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalLTCGPTILossCF > 0 && (
                      <TableRow>
                        <TableCell>Long Term Capital Loss</TableCell>
                        <TableCell className="text-right">
                          {formatAmount(scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalLTCGPTILossCF)}
                        </TableCell>
                        <TableCell className="text-right">Next 8 Assessment Years</TableCell>
                      </TableRow>
                    )}
                    
                    {hasOthSrcLoss() && (
                      <TableRow>
                        <TableCell>Loss from Owning & Maintaining Race Horses</TableCell>
                        <TableCell className="text-right">
                          {formatAmount(scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.OthSrcLossRaceHorseCF)}
                        </TableCell>
                        <TableCell className="text-right">Next 4 Assessment Years</TableCell>
                      </TableRow>
                    )}
                    
                    <TableRow className="bg-slate-100 font-semibold">
                      <TableCell>Total Carried Forward Losses</TableCell>
                      <TableCell className="text-right">
                        {formatAmount(
                          (scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalHPPTILossCF || 0) +
                          (scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalSTCGPTILossCF || 0) +
                          (scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.TotalLTCGPTILossCF || 0) +
                          (scheduleCFL.TotalOfBFLossesEarlierYrs.LossSummaryDetail.OthSrcLossRaceHorseCF || 0)
                        )}
                      </TableCell>
                      <TableCell className="text-right"></TableCell>
                    </TableRow>
                  </>
                )}
                
                {(scheduleCFL.LossCFFromPrev8thYearFromAY || scheduleCFL.LossCFFromPrev7thYearFromAY || 
                  scheduleCFL.LossCFFromPrev6thYearFromAY || scheduleCFL.LossCFFromPrev5thYearFromAY || 
                  scheduleCFL.LossCFFromPrev4thYearFromAY || scheduleCFL.LossCFFromPrev3rdYearFromAY || 
                  scheduleCFL.LossCFFromPrev2ndYearFromAY || scheduleCFL.LossCFFromPrevYrToAY) && (
                  <>
                    <TableRow>
                      <TableCell colSpan={3} className="pt-4 pb-2">
                        <h4 className="font-medium text-sm">Year-wise Breakdown</h4>
                      </TableCell>
                    </TableRow>
                    
                    {scheduleCFL.LossCFFromPrev8thYearFromAY?.CarryFwdLossDetail && (
                      <TableRow>
                        <TableCell>Losses from AY (8th year)</TableCell>
                        <TableCell className="text-right">
                          {formatAmount(
                            (scheduleCFL.LossCFFromPrev8thYearFromAY.CarryFwdLossDetail.TotalHPPTILossCF || 0) +
                            (scheduleCFL.LossCFFromPrev8thYearFromAY.CarryFwdLossDetail.TotalSTCGPTILossCF || 0) +
                            (scheduleCFL.LossCFFromPrev8thYearFromAY.CarryFwdLossDetail.TotalLTCGPTILossCF || 0)
                          )}
                        </TableCell>
                        <TableCell className="text-right">Filed: {scheduleCFL.LossCFFromPrev8thYearFromAY.CarryFwdLossDetail.DateOfFiling}</TableCell>
                      </TableRow>
                    )}
                    
                    {scheduleCFL.CurrentAYloss?.LossSummaryDetail && (
                      <TableRow>
                        <TableCell>Current Assessment Year Losses</TableCell>
                        <TableCell className="text-right">
                          {formatAmount(
                            (scheduleCFL.CurrentAYloss.LossSummaryDetail.TotalHPPTILossCF || 0) +
                            (scheduleCFL.CurrentAYloss.LossSummaryDetail.TotalSTCGPTILossCF || 0) +
                            (scheduleCFL.CurrentAYloss.LossSummaryDetail.TotalLTCGPTILossCF || 0) +
                            (scheduleCFL.CurrentAYloss.LossSummaryDetail.OthSrcLossRaceHorseCF || 0)
                          )}
                        </TableCell>
                        <TableCell className="text-right">Current Year</TableCell>
                      </TableRow>
                    )}
                  </>
                )}
                
                {!scheduleCFL.TotalOfBFLossesEarlierYrs?.LossSummaryDetail && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      No carried forward losses found in this return
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

const EditCFLTab = () => {
  return (
    <TabsContent value="cfl-edit" className="mt-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Edit Carry Forward Losses</CardTitle>
        </CardHeader>
        <CardContent>
          <CarryForwardLossForm />
        </CardContent>
      </Card>
    </TabsContent>
  );
};


export const LossesStep: React.FC<StepProps> = ({ itrData, config }) => {
  // --- Type Guard ---
  if (!('ScheduleCFL' in itrData)) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Applicable for ITR-1</AlertTitle>
        <AlertDescription>
          Detailed loss adjustment schedules (CYLA, BFLA, CFL) are not part of the ITR-1 return.
        </AlertDescription>
      </Alert>
    );
  }

  const scheduleCYLA = (itrData as Itr2).ScheduleCYLA;
  const scheduleBFLA = (itrData as Itr2).ScheduleBFLA;
  const scheduleCFL = (itrData as Itr2).ScheduleCFL;
  
  const hasLossAdjustments = !_.isNil(scheduleCYLA) || !_.isNil(scheduleBFLA) || !_.isNil(scheduleCFL);
  
  const { isEditMode } = useEditMode();
  const { userInput } = useUserInput();

  const getDefaultTab = () => {
      if (scheduleCYLA) return "cyla";
      if (scheduleBFLA) return "bfla";
      if (scheduleCFL) return "cfl";
      if (isEditMode) return "cfl-edit";
      return "cyla";
  }
  const [activeTab, setActiveTab] = useState<string>(getDefaultTab());
  
  const hasUserInputLosses = !_.isEmpty(userInput.scheduleCFLAdditions?.lossesToCarryForward);

  if (!hasLossAdjustments && !isEditMode && !hasUserInputLosses) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Loss Data</AlertTitle>
        <AlertDescription>
          No loss adjustment data found in this tax return. You can add carry forward losses in edit mode.
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasLossAdjustments && isEditMode) {
      return <CarryForwardLossForm />;
  }

  return (
    <div className="space-y-6">
      <Alert variant="default" className="mb-4">
        <ArrowLeftRight className="h-4 w-4" />
        <AlertTitle>Losses</AlertTitle>
        <AlertDescription>
          Review your loss adjustments as reported in your ITR. This includes current year adjustments, brought forward losses, and carried forward losses.
        </AlertDescription>
      </Alert>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="cyla" className="flex items-center" disabled={!scheduleCYLA}>
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Current Year Loss Adj.
          </TabsTrigger>
          <TabsTrigger value="bfla" className="flex items-center" disabled={!scheduleBFLA}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Brought Forward Losses
          </TabsTrigger>
          <TabsTrigger value="cfl" className="flex items-center" disabled={!scheduleCFL}>
            <AlertCircle className="h-4 w-4 mr-2" />
            Carried Forward Losses
          </TabsTrigger>
          <TabsTrigger value="cfl-edit" className="flex items-center">
            <PenTool className="h-4 w-4 mr-2" />
            Edit CF Losses
          </TabsTrigger>
        </TabsList>

        {scheduleCYLA && <CYLATab scheduleCYLA={scheduleCYLA} />}
        {scheduleBFLA && <BFLATab scheduleBFLA={scheduleBFLA} />}
        {scheduleCFL && <CFLTab scheduleCFL={scheduleCFL} />}
        <EditCFLTab />
      </Tabs>
    </div>
  );
}; 