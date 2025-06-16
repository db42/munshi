import React from 'react';
import type { ITRViewerStepConfig } from '../types';
import type { Itr1 } from '../../../types/itr-1';
import type { Itr2 } from '../../../types/itr';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyINR } from '../../../utils/formatters';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// --- View Model ---
interface SummaryViewModel {
  grossTotalIncome: number;
  totalDeductions: number;
  totalIncome: number;
  totalTaxLiability: number;
  netTaxPayable: number;
  refundAmount: number;
  assesseeName: string;
  pan: string;
  assessmentYear: string;
}

// --- Data Adapter ---
const createSummaryViewModel = (itrData: Itr1 | Itr2): SummaryViewModel => {
  if ('Form_ITR1' in itrData) { // ITR-1 Data
    return {
      grossTotalIncome: itrData.ITR1_IncomeDeductions.GrossTotIncome,
      totalDeductions: itrData.ITR1_IncomeDeductions.DeductUndChapVIA.TotalChapVIADeductions,
      totalIncome: itrData.ITR1_IncomeDeductions.TotalIncome,
      totalTaxLiability: itrData.ITR1_TaxComputation.NetTaxLiability,
      netTaxPayable: itrData.ITR1_TaxComputation.TotalTaxPayable,
      refundAmount: itrData.Refund.RefundDue,
      assesseeName: `${itrData.PersonalInfo.AssesseeName.FirstName} ${itrData.PersonalInfo.AssesseeName.SurNameOrOrgName}`,
      pan: itrData.PersonalInfo.PAN,
      assessmentYear: itrData.Form_ITR1.AssessmentYear,
    };
  } else { // ITR-2 Data
    return {
      grossTotalIncome: itrData['PartB-TI'].GrossTotalIncome,
      totalDeductions: itrData['PartB-TI'].DeductionsUnderScheduleVIA,
      totalIncome: itrData['PartB-TI'].TotalIncome,
      totalTaxLiability: itrData.PartB_TTI.ComputationOfTaxLiability.NetTaxLiability,
      netTaxPayable: itrData.PartB_TTI.TaxPaid.BalTaxPayable || 0,
      refundAmount: itrData.PartB_TTI.Refund.RefundDue,
      assesseeName: `${itrData.PartA_GEN1.PersonalInfo.AssesseeName.FirstName} ${itrData.PartA_GEN1.PersonalInfo.AssesseeName.SurNameOrOrgName}`,
      pan: itrData.PartA_GEN1.PersonalInfo.PAN,
      assessmentYear: itrData.Form_ITR2.AssessmentYear,
    };
  }
};

interface StepProps {
  itrData: Itr1 | Itr2;
  config: ITRViewerStepConfig;
}

export const SummaryConfirmationStep: React.FC<StepProps> = ({ itrData, config }) => {
  const viewModel = createSummaryViewModel(itrData);

  const {
    grossTotalIncome,
    totalDeductions,
    totalIncome,
    totalTaxLiability,
    netTaxPayable,
    refundAmount,
    assesseeName,
    pan,
    assessmentYear,
  } = viewModel;

  const isRefund = refundAmount > 0;
  const isTaxDue = netTaxPayable > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{config.title} for AY {assessmentYear}</span>
            <Badge variant="secondary">{pan}</Badge>
          </CardTitle>
          <p className="text-sm text-gray-500">Prepared for {assesseeName}</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Gross Total Income</TableCell>
                <TableCell className="text-right">{formatCurrencyINR(grossTotalIncome)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Deductions (Chapter VI-A)</TableCell>
                <TableCell className="text-right text-red-600">-{formatCurrencyINR(totalDeductions)}</TableCell>
              </TableRow>
              <TableRow className="bg-slate-50 font-bold">
                <TableCell>Total Income</TableCell>
                <TableCell className="text-right">{formatCurrencyINR(totalIncome)}</TableCell>
              </TableRow>
              <TableRow className="bg-slate-50 font-bold">
                <TableCell>Total Tax Liability</TableCell>
                <TableCell className="text-right">{formatCurrencyINR(totalTaxLiability)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {isRefund && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Refund Due</AlertTitle>
          <AlertDescription className="text-green-700">
            You are eligible for a refund of <span className="font-bold">{formatCurrencyINR(refundAmount)}</span>.
          </AlertDescription>
        </Alert>
      )}

      {isTaxDue && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Net Tax Payable</AlertTitle>
          <AlertDescription className="text-red-700">
            You have a balance tax payment of <span className="font-bold">{formatCurrencyINR(netTaxPayable)}</span> due.
          </AlertDescription>
        </Alert>
      )}

      {!isRefund && !isTaxDue && (
         <Alert variant="default" className="bg-blue-50 border-blue-200">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">No Dues or Refund</AlertTitle>
          <AlertDescription className="text-blue-700">
            Your tax liability is settled. No payment is due and no refund will be issued.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Final Confirmation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-4">
            By submitting this return, you confirm that all information provided is accurate and complete to the best of your knowledge.
          </p>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="confirmation-checkbox" />
            <label htmlFor="confirmation-checkbox" className="text-sm">I, {assesseeName}, agree to the terms and conditions.</label>
          </div>
        </CardContent>
        <CardFooter>
          <Button disabled className="w-full">
            Proceed to E-Verification (Not Implemented)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}; 