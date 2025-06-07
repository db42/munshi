import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatAmount } from '../../../../utils/formatters';
import { PartBTTI, ComputationOfTaxLiability, TaxPaid, Refund } from '../../../../types/itr';
import _ from 'lodash';

interface TaxCalculationTabProps {
  partBTTI: PartBTTI;
}

export const TaxCalculationTab: React.FC<TaxCalculationTabProps> = ({ partBTTI }) => {
  const computationOfTaxLiability: ComputationOfTaxLiability  = partBTTI.ComputationOfTaxLiability;
  const taxPaidData: TaxPaid = partBTTI.TaxPaid;
  const refundData = partBTTI.Refund;

  const taxOnTotalIncome = computationOfTaxLiability.TaxPayableOnTI;
  const surcharge = partBTTI.Surcharge || 0;
  const healthEduCess = partBTTI.HealthEduCess || 0;
  const grossTaxLiability = computationOfTaxLiability.GrossTaxLiability !== undefined 
                            ? computationOfTaxLiability.GrossTaxLiability 
                            : taxOnTotalIncome.TaxPayableOnTotInc + surcharge;

  const rebate87A = computationOfTaxLiability.Rebate87A || 0;
  const relief89 = computationOfTaxLiability.TaxRelief?.Section89 || 0;
  const totalTaxPayable = computationOfTaxLiability.NetTaxLiability || 0;

  const totalTaxesActuallyPaid = taxPaidData.TaxesPaid || 0;

  const netTaxLiability = partBTTI.TaxPaid.BalTaxPayable || 0;
  const refundDue = refundData.RefundDue || 0;
  const amountPayableToTaxAuth = refundData.RefundDue || 0;

  if (!partBTTI) {
    return <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No Tax Calculation Data</AlertTitle>
      <AlertDescription>
        Tax calculation details (Part B-TTI) are not available in this tax return.
      </AlertDescription>
    </Alert>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Computation of Tax Liability (Part B-TTI)</CardTitle>
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
            {!_.isNil(computationOfTaxLiability.TaxPayableOnTI) && (
              <TableRow>
                <TableCell>Tax on Total Income</TableCell>
                <TableCell className="text-right">{formatAmount(taxOnTotalIncome.TaxPayableOnTotInc)}</TableCell>
              </TableRow>
            )}
            {!_.isNil(partBTTI.Surcharge) && partBTTI.Surcharge !== 0 && (
              <TableRow>
                <TableCell>Surcharge</TableCell>
                <TableCell className="text-right">{formatAmount(surcharge)}</TableCell>
              </TableRow>
            )}
            {!_.isNil(partBTTI.HealthEduCess) && partBTTI.HealthEduCess !== 0 && (
              <TableRow>
                <TableCell>Health and Education Cess</TableCell>
                <TableCell className="text-right">{formatAmount(healthEduCess)}</TableCell>
              </TableRow>
            )}
            <TableRow className="bg-slate-50">
              <TableCell className="font-medium">Gross Tax Liability</TableCell>
              <TableCell className="text-right font-medium">{formatAmount(grossTaxLiability)}</TableCell>
            </TableRow>

            {!_.isNil(computationOfTaxLiability?.Rebate87A) && rebate87A !== 0 && (
              <TableRow>
                <TableCell>Less: Rebate under Section 87A</TableCell>
                <TableCell className="text-right">{formatAmount(rebate87A)}</TableCell>
              </TableRow>
            )}
            
            {!_.isNil(computationOfTaxLiability.TaxRelief?.Section89) && relief89 !== 0 && (
              <TableRow>
                <TableCell>Less: Relief under Section 89</TableCell>
                <TableCell className="text-right">{formatAmount(relief89)}</TableCell>
              </TableRow>
            )}
            
            <Separator className="my-2" />
            
            <TableRow className="bg-slate-100 font-semibold">
              <TableCell>Total Tax Payable</TableCell>
              <TableCell className="text-right">{formatAmount(totalTaxPayable)}</TableCell>
            </TableRow>

            <Separator className="my-2" />

            {!_.isNil(taxPaidData.TaxesPaid) && (
              <TableRow>
                <TableCell>Total Taxes Paid (TDS, TCS, Advance, Self-Assessment)</TableCell>
                <TableCell className="text-right">{formatAmount(totalTaxesActuallyPaid.TotalTaxesPaid)}</TableCell>
              </TableRow>
            )}

            <Separator className="my-2" />

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