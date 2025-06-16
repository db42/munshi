import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatAmount } from '../../../../utils/formatters';
import type { Itr1 } from '../../../../types/itr-1';
import type { Itr2 } from '../../../../types/itr';
import _ from 'lodash';

// --- View Model ---
interface TaxCalculationTabViewModel {
  taxPayableOnTotInc: number;
  surcharge: number;
  healthEduCess: number;
  grossTaxLiability: number;
  rebate87A: number;
  relief89: number;
  totalTaxPayable: number;
  totalTaxesPaid: number;
  netTaxLiability: number;
  refundDue: number;
}

// --- Data Adapter ---
export const createTaxCalculationTabViewModel = (
  itrData: Itr1 | Itr2,
): TaxCalculationTabViewModel | null => {
  if ('Form_ITR1' in itrData) { // ITR-1
    const ITR1_TaxComputation = itrData.ITR1_TaxComputation;
    if (!ITR1_TaxComputation) return null;

    // For ITR-1, "Tax on Total Income" is not a direct field. 
    // It's the GrossTaxLiability minus the cess. The GrossTaxLiability itself already includes the cess.
    const taxOnTotalIncome = ITR1_TaxComputation.GrossTaxLiability - ITR1_TaxComputation.EducationCess;
    
    return {
      taxPayableOnTotInc: taxOnTotalIncome,
      surcharge: 0, // Not explicitly in ITR1_TaxComputation
      healthEduCess: ITR1_TaxComputation.EducationCess,
      grossTaxLiability: ITR1_TaxComputation.GrossTaxLiability,
      rebate87A: ITR1_TaxComputation.Rebate87A,
      relief89: ITR1_TaxComputation.Section89,
      totalTaxPayable: ITR1_TaxComputation.NetTaxLiability,
      totalTaxesPaid: itrData.TaxPaid?.TaxesPaid?.TotalTaxesPaid ?? 0,
      netTaxLiability: itrData.TaxPaid?.BalTaxPayable ?? 0,
      refundDue: itrData.Refund?.RefundDue ?? 0,
    };
  } else { // ITR-2
    const partBTTI = itrData.PartB_TTI;
    if (!partBTTI) return null;

    const computationOfTaxLiability = partBTTI.ComputationOfTaxLiability;
    const taxPaidData = partBTTI.TaxPaid;
    const refundData = partBTTI.Refund;
    const taxOnTotalIncome = computationOfTaxLiability.TaxPayableOnTI;
    const surcharge = partBTTI.Surcharge || 0;

    return {
      taxPayableOnTotInc: taxOnTotalIncome.TaxPayableOnTotInc,
      surcharge,
      healthEduCess: partBTTI.HealthEduCess || 0,
      grossTaxLiability: computationOfTaxLiability.GrossTaxLiability ?? taxOnTotalIncome.TaxPayableOnTotInc + surcharge,
      rebate87A: computationOfTaxLiability.Rebate87A || 0,
      relief89: computationOfTaxLiability.TaxRelief?.Section89 || 0,
      totalTaxPayable: computationOfTaxLiability.NetTaxLiability || 0,
      totalTaxesPaid: taxPaidData.TaxesPaid.TotalTaxesPaid,
      netTaxLiability: taxPaidData.BalTaxPayable || 0,
      refundDue: refundData.RefundDue || 0,
    };
  }
};


interface TaxCalculationTabProps {
  viewModel: TaxCalculationTabViewModel;
}

export const TaxCalculationTab: React.FC<TaxCalculationTabProps> = ({ viewModel }) => {
  const {
    taxPayableOnTotInc,
    surcharge,
    healthEduCess,
    grossTaxLiability,
    rebate87A,
    relief89,
    totalTaxPayable,
    totalTaxesPaid,
    netTaxLiability,
    refundDue
  } = viewModel;

  if (!viewModel) {
    return <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No Tax Calculation Data</AlertTitle>
      <AlertDescription>
        Tax calculation details are not available in this tax return.
      </AlertDescription>
    </Alert>;
  }

  const amountPayableToTaxAuth = netTaxLiability > 0 ? netTaxLiability : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Computation of Tax Liability</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!_.isNil(taxPayableOnTotInc) && (
              <TableRow>
                <TableCell>Tax on Total Income</TableCell>
                <TableCell className="text-right">{formatAmount(taxPayableOnTotInc)}</TableCell>
              </TableRow>
            )}
            {!_.isNil(surcharge) && surcharge !== 0 && (
              <TableRow>
                <TableCell>Surcharge</TableCell>
                <TableCell className="text-right">{formatAmount(surcharge)}</TableCell>
              </TableRow>
            )}
            {!_.isNil(healthEduCess) && healthEduCess !== 0 && (
              <TableRow>
                <TableCell>Health and Education Cess</TableCell>
                <TableCell className="text-right">{formatAmount(healthEduCess)}</TableCell>
              </TableRow>
            )}
            <TableRow className="bg-slate-50">
              <TableCell className="font-medium">Gross Tax Liability</TableCell>
              <TableCell className="text-right font-medium">{formatAmount(grossTaxLiability)}</TableCell>
            </TableRow>

            {!_.isNil(rebate87A) && rebate87A !== 0 && (
              <TableRow>
                <TableCell>Less: Rebate under Section 87A</TableCell>
                <TableCell className="text-right">{formatAmount(rebate87A)}</TableCell>
              </TableRow>
            )}
            
            {!_.isNil(relief89) && relief89 !== 0 && (
              <TableRow>
                <TableCell>Less: Relief under Section 89</TableCell>
                <TableCell className="text-right">{formatAmount(relief89)}</TableCell>
              </TableRow>
            )}
            
            <TableRow><TableCell colSpan={2} className='p-0'><Separator className="my-2" /></TableCell></TableRow>
            
            <TableRow className="bg-slate-100 font-semibold">
              <TableCell>Total Tax Payable</TableCell>
              <TableCell className="text-right">{formatAmount(totalTaxPayable)}</TableCell>
            </TableRow>

            <TableRow><TableCell colSpan={2} className='p-0'><Separator className="my-2" /></TableCell></TableRow>

            {!_.isNil(totalTaxesPaid) && (
              <TableRow>
                <TableCell>Total Taxes Paid (TDS, TCS, Advance, Self-Assessment)</TableCell>
                <TableCell className="text-right">{formatAmount(totalTaxesPaid)}</TableCell>
              </TableRow>
            )}

            <TableRow><TableCell colSpan={2} className='p-0'><Separator className="my-2" /></TableCell></TableRow>

            {amountPayableToTaxAuth > 0 ? (
              <TableRow className="bg-red-50 text-red-700 font-semibold">
                <TableCell>Net Tax Payable</TableCell>
                <TableCell className="text-right">{formatAmount(amountPayableToTaxAuth)}</TableCell>
              </TableRow>
            ) : refundDue > 0 ? (
              <TableRow className="bg-green-50 text-green-700 font-semibold">
                <TableCell>Refund Due</TableCell>
                <TableCell className="text-right">{formatAmount(refundDue)}</TableCell>
              </TableRow>
            ) : (
              <TableRow className="font-semibold">
                <TableCell>Net Tax Liability (after paid taxes)</TableCell>
                <TableCell className="text-right">{formatAmount(netTaxLiability)}</TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}; 