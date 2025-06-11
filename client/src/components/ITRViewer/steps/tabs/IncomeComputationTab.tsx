import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { formatAmount } from '../../../../utils/formatters';
import { PartBTI, ScheduleVIA } from '../../../../types/itr';
import _ from 'lodash';

interface IncomeComputationTabProps {
  partBTI?: PartBTI;
  isNewRegime?: boolean;
  scheduleVIA?: ScheduleVIA;
}

export const IncomeComputationTab: React.FC<IncomeComputationTabProps> = ({ partBTI, isNewRegime, scheduleVIA }) => {
  if (!partBTI) {
    return <div>No Income Computation data available.</div>;
  }

  const {
    GrossTotalIncome = 0,
    BalanceAfterSetoffLosses = 0,
    BroughtFwdLossesSetoff = 0,
    DeductionsUnderScheduleVIA = 0,
    Salaries = 0,
    IncomeFromHP = 0,
    CapGain,
    IncFromOS,
  } = partBTI;

  const ded80CCD2 = scheduleVIA?.DeductUndChapVIA?.Section80CCDEmployer || 0;
  const allowedDeductionsNewRegime = ded80CCD2;

  const totalIncome = isNewRegime 
    ? GrossTotalIncome - allowedDeductionsNewRegime 
    : partBTI.TotalIncome || 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          Computation of Total Income (Part B-TI)
          {isNewRegime !== undefined && (
            <span className="text-sm font-medium text-gray-500 ml-2">
              ({isNewRegime ? 'New Regime' : 'Old Regime'})
            </span>
          )}
        </CardTitle>
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
            {!_.isNil(Salaries) && Salaries !== 0 && (
              <TableRow>
                <TableCell>Income from Salary</TableCell>
                <TableCell className="text-right">{formatAmount(Salaries)}</TableCell>
              </TableRow>
            )}
            
            {/* House Property Income */}
            {!_.isNil(IncomeFromHP) && IncomeFromHP !== 0 && (
              <TableRow>
                <TableCell>Income from House Property</TableCell>
                <TableCell className="text-right">{formatAmount(IncomeFromHP)}</TableCell>
              </TableRow>
            )}
            
            {/* Capital Gains */}
            {!_.isNil(CapGain?.TotalCapGains) && CapGain.TotalCapGains !== 0 && (
              <TableRow>
                <TableCell>Capital Gains</TableCell>
                <TableCell className="text-right">{formatAmount(CapGain.TotalCapGains)}</TableCell>
              </TableRow>
            )}
            
            {/* Other Sources Income */}
            {!_.isNil(IncFromOS?.TotIncFromOS) && IncFromOS.TotIncFromOS !== 0 && (
              <TableRow>
                <TableCell>Income from Other Sources</TableCell>
                <TableCell className="text-right">{formatAmount(IncFromOS.TotIncFromOS)}</TableCell>
              </TableRow>
            )}
            
            {/* Balance After Current Year Loss Set-off */}
            {!_.isNil(BalanceAfterSetoffLosses) && (
              <TableRow>
                <TableCell>Balance After Current Year Loss Set-off</TableCell>
                <TableCell className="text-right">{formatAmount(BalanceAfterSetoffLosses)}</TableCell>
              </TableRow>
            )}

            {/* Brought Forward Losses Set-off */}
            {!_.isNil(BroughtFwdLossesSetoff) && BroughtFwdLossesSetoff !== 0 && (
              <TableRow>
                <TableCell>Less: Brought Forward Losses Set-off</TableCell>
                <TableCell className="text-right">{formatAmount(BroughtFwdLossesSetoff)}</TableCell>
              </TableRow>
            )}

            {/* Gross Total Income */}
            <TableRow className="bg-slate-50">
              <TableCell className="font-medium">Gross Total Income</TableCell>
              <TableCell className="text-right font-medium">{formatAmount(GrossTotalIncome)}</TableCell>
            </TableRow>
            
            {/* Deductions */}
            {isNewRegime ? (
              <>
                <TableRow>
                  <TableCell>Less: Deductions under Chapter VI-A</TableCell>
                  <TableCell className="text-right">{formatAmount(allowedDeductionsNewRegime)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8 text-sm">Section 80CCD(2)</TableCell>
                  <TableCell className="text-right text-sm">{formatAmount(allowedDeductionsNewRegime)}</TableCell>
                </TableRow>
              </>
            ) : (
              !_.isNil(DeductionsUnderScheduleVIA) && DeductionsUnderScheduleVIA !== 0 && (
                <TableRow>
                  <TableCell>Less: Deductions under Chapter VI-A</TableCell>
                  <TableCell className="text-right">{formatAmount(DeductionsUnderScheduleVIA)}</TableCell>
                </TableRow>
              )
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