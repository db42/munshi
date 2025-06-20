import React, { useState } from 'react';
import type { ITRViewerStepConfig } from '../types';
import type { Itr1 } from '../../../types/itr-1';
import type { Itr2, DeductUndChapVIA } from '../../../types/itr';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Gift, Edit, PenTool } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatAmount } from '../../../utils/formatters';
import _ from 'lodash';
import { useEditMode } from '../context/EditModeContext';
import { useUserInput } from '../context/UserInputContext';
import { Chapter6ADeductionsForm } from '../forms/Chapter6ADeductionsForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Chapter6ADeductions } from '../../../types/userInput.types';

interface StepProps {
  itrData: Itr1 | Itr2;
  config: ITRViewerStepConfig;
}

const UserInputDeductionsView: React.FC<{ deductions: Chapter6ADeductions }> = ({ deductions }) => {
  const deductionItems = Object.entries(deductions)
    .filter(([, value]) => value && value > 0)
    .map(([key, value]) => ({
      key,
      amount: value,
      label: _.startCase(key.replace(/_/g, ' ')),
    }));

  if (deductionItems.length === 0) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          User-Provided Deductions
          <Badge variant="secondary">Not from ITR</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deduction</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deductionItems.map(item => (
              <TableRow key={item.key}>
                <TableCell>{item.label}</TableCell>
                <TableCell className="text-right">{formatAmount(item.amount as number)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const DeductionsStep: React.FC<StepProps> = ({ itrData, config }) => {
  
  let deductionsUnderScheduleVIA: DeductUndChapVIA | undefined;
  if ('Form_ITR1' in itrData) {
    deductionsUnderScheduleVIA = itrData.ITR1_IncomeDeductions?.DeductUndChapVIA;
  } else {
    deductionsUnderScheduleVIA = itrData.ScheduleVIA?.DeductUndChapVIA;
  }
  const hasDeductions = deductionsUnderScheduleVIA != null;
  
  const { isEditMode } = useEditMode();
  const { userInput } = useUserInput();
  const hasUserInput = !_.isEmpty(userInput.chapter6aDeductions) && Object.values(userInput.chapter6aDeductions).some(v => v && v > 0);

  const defaultTab = (isEditMode && !hasDeductions && !hasUserInput) ? 'edit' : 'summary';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  if (!hasDeductions && !isEditMode && !hasUserInput) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Deductions Data</AlertTitle>
        <AlertDescription>
          No Chapter VI-A deductions found in this tax return. You can add them in edit mode.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="edit">
          <PenTool className="h-4 w-4 mr-2" />
          Edit
        </TabsTrigger>
      </TabsList>
      <TabsContent value="summary" className="space-y-6 mt-4">
        <Alert variant="default" className="mb-4">
          <Gift className="h-4 w-4" />
          <AlertTitle>Deductions under Chapter VI-A</AlertTitle>
          <AlertDescription>
            Review your tax deductions as reported in your ITR.
            {hasDeductions && deductionsUnderScheduleVIA && (
              <div className="mt-2 font-medium">
                Total Deductions: {formatAmount(deductionsUnderScheduleVIA.TotalChapVIADeductions)}
              </div>
            )}
          </AlertDescription>
        </Alert>
        
        {hasDeductions && deductionsUnderScheduleVIA && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Chapter VI-A Deductions
                <Badge>
                  {formatAmount(deductionsUnderScheduleVIA.TotalChapVIADeductions)}
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
                  {deductionsUnderScheduleVIA.Section80C ? (
                    <TableRow>
                      <TableCell>80C</TableCell>
                      <TableCell>Life Insurance, PPF, NSC, etc.</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80C)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  {deductionsUnderScheduleVIA.Section80CCC ? (
                    <TableRow>
                      <TableCell>80CCC</TableCell>
                      <TableCell>Contribution to pension scheme</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80CCC)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  {deductionsUnderScheduleVIA.Section80CCD1B ? (
                    <TableRow>
                      <TableCell>80CCD(1B)</TableCell>
                      <TableCell>Additional contribution to NPS</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80CCD1B)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  {deductionsUnderScheduleVIA.Section80D ? (
                    <TableRow>
                      <TableCell>80D</TableCell>
                      <TableCell>Medical Insurance Premium</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80D)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  {deductionsUnderScheduleVIA.Section80G ? (
                    <TableRow>
                      <TableCell>80G</TableCell>
                      <TableCell>Donations to charitable institutions</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80G)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  {deductionsUnderScheduleVIA.Section80E ? (
                    <TableRow>
                      <TableCell>80E</TableCell>
                      <TableCell>Interest on education loan</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80E)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  {deductionsUnderScheduleVIA.Section80EEA ? (
                    <TableRow>
                      <TableCell>80EEA</TableCell>
                      <TableCell>Interest on loan for affordable housing</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80EEA)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  {deductionsUnderScheduleVIA.Section80GG ? (
                    <TableRow>
                      <TableCell>80GG</TableCell>
                      <TableCell>Rent paid when HRA not received</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80GG)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  {deductionsUnderScheduleVIA.Section80TTA ? (
                    <TableRow>
                      <TableCell>80TTA</TableCell>
                      <TableCell>Interest on savings account</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80TTA)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  {deductionsUnderScheduleVIA.Section80TTB ? (
                    <TableRow>
                      <TableCell>80TTB</TableCell>
                      <TableCell>Interest income for senior citizens</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80TTB)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  {deductionsUnderScheduleVIA.Section80U ? (
                    <TableRow>
                      <TableCell>80U</TableCell>
                      <TableCell>Deduction for person with disability</TableCell>
                      <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.Section80U)}</TableCell>
                    </TableRow>
                  ) : null}
                  
                  <TableRow><TableCell colSpan={3} className='p-0'><Separator className="my-2" /></TableCell></TableRow>
                  
                  <TableRow className="bg-slate-100 font-semibold">
                    <TableCell colSpan={2}>Total Deductions under Chapter VI-A</TableCell>
                    <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA.TotalChapVIADeductions)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
        {hasUserInput && userInput.chapter6aDeductions && (
          <UserInputDeductionsView deductions={userInput.chapter6aDeductions} />
        )}
        
        {!hasDeductions && !hasUserInput && (
          <Alert variant="default" className="border-l-4 border-blue-500 bg-blue-50 p-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Deductions</AlertTitle>
              <AlertDescription>
                  No deductions were found in your ITR. You can add them in the 'Edit' tab.
              </AlertDescription>
          </Alert>
        )}
      </TabsContent>
      <TabsContent value="edit">
        <Chapter6ADeductionsForm 
          onSave={() => setActiveTab('summary')}
          onCancel={() => setActiveTab('summary')}
        />
      </TabsContent>
    </Tabs>
  );
}; 