import React, { useState } from 'react';
import { ITRViewerStepConfig } from '../types';
import { Itr } from '../../../types/itr';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { AlertCircle, Gift, TrendingUp, ArrowLeftRight, Edit, PenTool } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { formatAmount } from '../../../utils/formatters';
import _ from 'lodash';
import { useEditMode } from '../context/EditModeContext';
import { useUserInput } from '../context/UserInputContext';
import { EditModeToggleButton } from '../ui/EditModeToggleButton';
import { CarryForwardLossForm } from '../forms/CarryForwardLossForm';

interface StepProps {
  itrData: Itr;
  config: ITRViewerStepConfig;
}

export const DeductionsLossesStep: React.FC<StepProps> = ({ itrData, config }) => {
  // Extract data from itrData
  const scheduleVIA = itrData.ITR?.ITR2?.ScheduleVIA;
  const scheduleCYLA = itrData.ITR?.ITR2?.ScheduleCYLA;
  const scheduleBFLA = itrData.ITR?.ITR2?.ScheduleBFLA;
  const scheduleCFL = itrData.ITR?.ITR2?.ScheduleCFL;
  
  // Get total deductions from Part B-TI
  const totalDeductions = itrData.ITR?.ITR2?.["PartB-TI"]?.TotalChapVIADeductions || 0;
  
  // Check if we have any deductions data
  const hasDeductions = !_.isNil(scheduleVIA) && !_.isNil(scheduleVIA.DeductUndChapVIA);
  
  // Check if we have any loss adjustment data
  const hasLossAdjustments = !_.isNil(scheduleCYLA) || !_.isNil(scheduleBFLA) || !_.isNil(scheduleCFL);
  
  // Check if we have any data to display
  const hasData = hasDeductions || hasLossAdjustments;
  
  // Edit mode and user input state
  const { isEditMode } = useEditMode();
  const { userInput } = useUserInput();
  const [activeTab, setActiveTab] = useState<string>(hasDeductions ? "deductions" : "cyla");
  
  if (!hasData && !isEditMode && _.isEmpty(userInput.scheduleCFLAdditions?.lossesToCarryForward)) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Deductions or Losses Data</AlertTitle>
          <AlertDescription>
            No deductions or loss adjustment data found in this tax return.
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-end">
          <EditModeToggleButton />
        </div>
        
        {isEditMode && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Add Carry Forward Losses</CardTitle>
            </CardHeader>
            <CardContent>
              <CarryForwardLossForm />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert variant="default" className="mb-4">
        <Gift className="h-4 w-4" />
        <AlertTitle>Deductions & Losses</AlertTitle>
        <AlertDescription>
          Review your tax deductions under Chapter VI-A and loss adjustments as reported in your ITR.
          {hasDeductions && (
            <div className="mt-2 font-medium">
              Total Deductions: {formatAmount(totalDeductions)}
            </div>
          )}
        </AlertDescription>
      </Alert>
      
      <div className="flex justify-end mb-4">
        <EditModeToggleButton />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="deductions" className="flex items-center" disabled={!hasDeductions}>
            <Gift className="h-4 w-4 mr-2" />
            Deductions
          </TabsTrigger>
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

        {/* Deductions Tab */}
        {hasDeductions && (
          <TabsContent value="deductions" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  Chapter VI-A Deductions
                  <Badge>
                    {formatAmount(scheduleVIA?.DeductUndChapVIA?.TotalChapVIADeductions)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Section 80C - Investment related deductions */}
                    {scheduleVIA?.DeductUndChapVIA?.Section80C && (
                      <TableRow>
                        <TableCell>80C</TableCell>
                        <TableCell>Life Insurance, PPF, NSC, etc.</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80C)}</TableCell>
                      </TableRow>
                    )}
                    
                    {/* Section 80CCC - Pension scheme */}
                    {scheduleVIA?.DeductUndChapVIA?.Section80CCC && (
                      <TableRow>
                        <TableCell>80CCC</TableCell>
                        <TableCell>Contribution to pension scheme</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80CCC)}</TableCell>
                      </TableRow>
                    )}
                    
                    {/* Section 80CCD(1B) - NPS */}
                    {scheduleVIA?.DeductUndChapVIA?.Section80CCD1B && (
                      <TableRow>
                        <TableCell>80CCD(1B)</TableCell>
                        <TableCell>Additional contribution to NPS</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80CCD1B)}</TableCell>
                      </TableRow>
                    )}
                    
                    {/* Section 80D - Medical insurance */}
                    {scheduleVIA?.DeductUndChapVIA?.Section80D && (
                      <TableRow>
                        <TableCell>80D</TableCell>
                        <TableCell>Medical Insurance Premium</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80D)}</TableCell>
                      </TableRow>
                    )}
                    
                    {/* Section 80G - Donations */}
                    {scheduleVIA?.DeductUndChapVIA?.Section80G && (
                      <TableRow>
                        <TableCell>80G</TableCell>
                        <TableCell>Donations to charitable institutions</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80G)}</TableCell>
                      </TableRow>
                    )}
                    
                    {/* Other common deductions */}
                    {scheduleVIA?.DeductUndChapVIA?.Section80E && (
                      <TableRow>
                        <TableCell>80E</TableCell>
                        <TableCell>Interest on education loan</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80E)}</TableCell>
                      </TableRow>
                    )}
                    
                    {scheduleVIA?.DeductUndChapVIA?.Section80EEA && (
                      <TableRow>
                        <TableCell>80EEA</TableCell>
                        <TableCell>Interest on loan for affordable housing</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80EEA)}</TableCell>
                      </TableRow>
                    )}
                    
                    {scheduleVIA?.DeductUndChapVIA?.Section80GG && (
                      <TableRow>
                        <TableCell>80GG</TableCell>
                        <TableCell>Rent paid when HRA not received</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80GG)}</TableCell>
                      </TableRow>
                    )}
                    
                    {scheduleVIA?.DeductUndChapVIA?.Section80TTA && (
                      <TableRow>
                        <TableCell>80TTA</TableCell>
                        <TableCell>Interest on savings account</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80TTA)}</TableCell>
                      </TableRow>
                    )}
                    
                    {scheduleVIA?.DeductUndChapVIA?.Section80TTB && (
                      <TableRow>
                        <TableCell>80TTB</TableCell>
                        <TableCell>Interest income for senior citizens</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80TTB)}</TableCell>
                      </TableRow>
                    )}
                    
                    {scheduleVIA?.DeductUndChapVIA?.Section80U && (
                      <TableRow>
                        <TableCell>80U</TableCell>
                        <TableCell>Deduction for person with disability</TableCell>
                        <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.Section80U)}</TableCell>
                      </TableRow>
                    )}
                    
                    <Separator className="my-2" />
                    <TableRow className="bg-slate-100 font-semibold">
                      <TableCell colSpan={2}>Total Deductions under Chapter VI-A</TableCell>
                      <TableCell className="text-right">{formatAmount(scheduleVIA.DeductUndChapVIA.TotalChapVIADeductions)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Current Year Loss Adjustment (CYLA) Tab */}
        {scheduleCYLA && (
          <TabsContent value="cyla" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Current Year Loss Adjustment (CYLA)</CardTitle>
              </CardHeader>
              <CardContent>
                {scheduleCYLA ? (
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
                        {/* Salary */}
                        {scheduleCYLA.Salary && (
                          <TableRow>
                            <TableCell>Salary</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleCYLA.Salary.IncCYLA?.IncOfCurrYr)}</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleCYLA.Salary.IncCYLA?.TotalLossSetOff)}</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleCYLA.Salary.IncCYLA?.BalanceInc)}</TableCell>
                          </TableRow>
                        )}
                        
                        {/* House Property */}
                        {scheduleCYLA.HP && (
                          <TableRow>
                            <TableCell>House Property</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleCYLA.HP.IncCYLA?.IncOfCurrYr)}</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleCYLA.HP.IncCYLA?.TotalLossSetOff)}</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleCYLA.HP.IncCYLA?.BalanceInc)}</TableCell>
                          </TableRow>
                        )}
                        
                        {/* Other income sources */}
                        {scheduleCYLA.OthSrcExclRaceHorse && (
                          <TableRow>
                            <TableCell>Other Sources (Excl. Race Horses)</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleCYLA.OthSrcExclRaceHorse.IncCYLA?.IncOfCurrYr)}</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleCYLA.OthSrcExclRaceHorse.IncCYLA?.TotalLossSetOff)}</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleCYLA.OthSrcExclRaceHorse.IncCYLA?.BalanceInc)}</TableCell>
                          </TableRow>
                        )}
                        
                        <Separator className="my-2" />
                        <TableRow className="bg-slate-100 font-semibold">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">{formatAmount(scheduleCYLA.TotalCurYr?.IncOfCurrYr)}</TableCell>
                          <TableCell className="text-right">{formatAmount(scheduleCYLA.TotalLossSetOff?.TotalLossSetOff)}</TableCell>
                          <TableCell className="text-right">{formatAmount(scheduleCYLA.TotalCurYr?.BalanceInc)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <Alert variant="default" className="bg-amber-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No CYLA Data</AlertTitle>
                    <AlertDescription>
                      No Current Year Loss Adjustment data found in this return.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Brought Forward Loss Adjustment (BFLA) Tab */}
        {scheduleBFLA && (
          <TabsContent value="bfla" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Brought Forward Loss Adjustment (BFLA)</CardTitle>
              </CardHeader>
              <CardContent>
                {scheduleBFLA ? (
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
                        {/* House Property */}
                        {scheduleBFLA.HP && (
                          <TableRow>
                            <TableCell>House Property</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleBFLA.HP.IncBFLA?.IncOfCurrYrUndHeadAftrSetOff)}</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleBFLA.HP.IncBFLA?.TotalBFLossSetOff)}</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleBFLA.HP.IncBFLA?.BalIncAfterBFLossSetOff)}</TableCell>
                          </TableRow>
                        )}
                        
                        {/* Other sections like STCG15Per, LTCG10Per, etc. can be added in a similar way */}
                        
                        <Separator className="my-2" />
                        <TableRow className="bg-slate-100 font-semibold">
                          <TableCell>Total</TableCell>
                          <TableCell className="text-right">{formatAmount(scheduleBFLA.IncomeOfCurrYrAftCYLABFLA)}</TableCell>
                          <TableCell className="text-right">{formatAmount(scheduleBFLA.TotalBFLossSetOff?.TotalBFLossSetOff)}</TableCell>
                          <TableCell className="text-right">{formatAmount(scheduleBFLA.IncomeOfCurrYrAftCYLABFLA)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <Alert variant="default" className="bg-amber-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No BFLA Data</AlertTitle>
                    <AlertDescription>
                      No Brought Forward Loss Adjustment data found in this return.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Carried Forward Losses (CFL) Tab */}
        {scheduleCFL && (
          <TabsContent value="cfl" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Carried Forward Losses (CFL)</CardTitle>
              </CardHeader>
              <CardContent>
                {scheduleCFL ? (
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
                        {/* This section would need to be populated based on the actual structure of scheduleCFL */}
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-gray-500">
                            Details of carried forward losses will be displayed here when available
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <Alert variant="default" className="bg-amber-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No CFL Data</AlertTitle>
                    <AlertDescription>
                      No Carried Forward Losses data found in this return.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {/* New tab for editing carry forward losses */}
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
      </Tabs>
    </div>
  );
}; 