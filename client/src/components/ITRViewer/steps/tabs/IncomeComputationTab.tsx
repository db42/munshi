import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../ui/table';
import { Separator } from '../../ui/separator';
import { formatAmount } from '../../../../utils/formatters';
import { PartBTI } from '../../../../types/itr';
import _ from 'lodash';

interface IncomeComputationTabProps {
  partBTI?: PartBTI;
}

export const IncomeComputationTab: React.FC<IncomeComputationTabProps> = ({ partBTI }) => {
  const grossTotalIncome = partBTI?.GrossTotalIncome || 0;
  const totalIncome = partBTI?.TotalIncome || 0;

  if (!partBTI) {
    return <div>No Income Computation data available.</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Computation of Total Income (Part B-TI)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Income Source</TableHead>
              <TableHead className="text-right">Amount (₹)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Salary Income */}
            {!_.isNil(partBTI.Salaries) && (
              <TableRow>
                <TableCell>Income from Salary</TableCell>
                <TableCell className="text-right">{formatAmount(partBTI.Salaries)}</TableCell>
              </TableRow>
            )}
            
            {/* House Property Income */}
            {!_.isNil(partBTI.IncomeFromHP) && (
              <TableRow>
                <TableCell>Income from House Property</TableCell>
                <TableCell className="text-right">{formatAmount(partBTI.IncomeFromHP)}</TableCell>
              </TableRow>
            )}
            
            {/* Capital Gains */}
            {!_.isNil(partBTI.CapGain?.TotalCapGains) && partBTI.CapGain.TotalCapGains !== 0 && (
              <TableRow>
                <TableCell>Capital Gains</TableCell>
                <TableCell className="text-right">{formatAmount(partBTI.CapGain.TotalCapGains)}</TableCell>
              </TableRow>
            )}
            
            {/* Other Sources Income */}
            {!_.isNil(partBTI.IncFromOS?.TotIncFromOS) && (
              <TableRow>
                <TableCell>Income from Other Sources</TableCell>
                <TableCell className="text-right">{formatAmount(partBTI.IncFromOS.TotIncFromOS)}</TableCell>
              </TableRow>
            )}
            
            {/* Gross Total Income */}
            <TableRow className="bg-slate-50">
              <TableCell className="font-medium">Gross Total Income</TableCell>
              <TableCell className="text-right font-medium">{formatAmount(grossTotalIncome)}</TableCell>
            </TableRow>
            
            {/* Current Year Losses */}
            {!_.isNil(partBTI.CurrentYearLoss) && partBTI.CurrentYearLoss !== 0 && (
              <TableRow>
                <TableCell>Less: Current Year Losses</TableCell>
                <TableCell className="text-right">{formatAmount(partBTI.CurrentYearLoss)}</TableCell>
              </TableRow>
            )}
            
            {/* Balance After Loss Set-off */}
            {!_.isNil(partBTI.BalanceAfterSetoffLosses) && (
              <TableRow>
                <TableCell>Balance After Current Year Loss Set-off</TableCell>
                <TableCell className="text-right">{formatAmount(partBTI.BalanceAfterSetoffLosses)}</TableCell>
              </TableRow>
            )}
            
            {/* Brought Forward Losses Set-off */}
            {!_.isNil(partBTI.BroughtFwdLossesSetoff) && partBTI.BroughtFwdLossesSetoff !== 0 && (
              <TableRow>
                <TableCell>Less: Brought Forward Losses Set-off</TableCell>
                <TableCell className="text-right">{formatAmount(partBTI.BroughtFwdLossesSetoff)}</TableCell>
              </TableRow>
            )}
            
            {/* Aggregate Income */}
            {!_.isNil(partBTI.AggregateIncome) && (
              <TableRow>
                <TableCell>Aggregate Income</TableCell>
                <TableCell className="text-right">{formatAmount(partBTI.AggregateIncome)}</TableCell>
              </TableRow>
            )}
            
            {/* Deductions */}
            {!_.isNil(partBTI.DeductionsUnderScheduleVIA) && partBTI.DeductionsUnderScheduleVIA !== 0 && (
              <TableRow>
                <TableCell>Less: Deductions under Chapter VI-A</TableCell>
                <TableCell className="text-right">{formatAmount(partBTI.DeductionsUnderScheduleVIA)}</TableCell>
              </TableRow>
            )}
            
            <Separator className="my-2" />
            
            {/* Total Income */}
            <TableRow className="bg-slate-100 font-semibold">
              <TableCell>Total Income</TableCell>
              <TableCell className="text-right">{formatAmount(totalIncome)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}; 