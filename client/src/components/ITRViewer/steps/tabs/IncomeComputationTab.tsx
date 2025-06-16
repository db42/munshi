import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { formatAmount } from '../../../../utils/formatters';
import type { Itr1 } from '../../../../types/itr-1';
import type { Itr2, PartBTI, ScheduleVIA } from '../../../../types/itr';
import _ from 'lodash';

// --- View Model ---
interface IncomeComputationViewModel {
  grossTotalIncome: number;
  balanceAfterSetoffLosses?: number;
  broughtFwdLossesSetoff?: number;
  deductionsUnderScheduleVIA: number;
  salaries?: number;
  incomeFromHP?: number;
  totalCapGains?: number;
  totIncFromOS?: number;
  totalIncome: number;
  isNewRegime: boolean;
  allowedDeductionsNewRegime: number;
}

// --- Data Adapter ---
export const createIncomeComputationViewModel = (
  itrData: Itr1 | Itr2,
): IncomeComputationViewModel | null => {
  if ('Form_ITR1' in itrData) { // ITR-1
    const partBTI = itrData.ITR1_IncomeDeductions;
    if (!partBTI) return null;

    const isNewRegime = itrData.FilingStatus.OptOutNewTaxRegime === 'N';
    const ded80CCD2 = 0; // ITR-1 doesn't have Section80CCDEmployer in ScheduleVIA equivalent
    return {
      grossTotalIncome: partBTI.GrossTotIncome,
      deductionsUnderScheduleVIA: partBTI.DeductUndChapVIA?.TotalChapVIADeductions || 0,
      salaries: partBTI.IncomeFromSal,
      incomeFromHP: partBTI.TotalIncomeOfHP,
      totalCapGains: 0, // Not applicable for ITR-1
      totIncFromOS: partBTI.IncomeOthSrc,
      totalIncome: partBTI.TotalIncome,
      isNewRegime,
      allowedDeductionsNewRegime: ded80CCD2,
    };
  } else { // ITR-2
    const partBTI = itrData['PartB-TI'];
    if (!partBTI) return null;

    const scheduleVIA = itrData.ScheduleVIA;
    const isNewRegime = itrData.PartA_GEN1.FilingStatus.OptOutNewTaxRegime === 'N';
    const ded80CCD2 = scheduleVIA?.DeductUndChapVIA?.Section80CCDEmployer || 0;
    const allowedDeductionsNewRegime = ded80CCD2;
    const totalIncome = isNewRegime
      ? partBTI.GrossTotalIncome - allowedDeductionsNewRegime
      : partBTI.TotalIncome || 0;

    return {
      grossTotalIncome: partBTI.GrossTotalIncome || 0,
      balanceAfterSetoffLosses: partBTI.BalanceAfterSetoffLosses,
      broughtFwdLossesSetoff: partBTI.BroughtFwdLossesSetoff,
      deductionsUnderScheduleVIA: partBTI.DeductionsUnderScheduleVIA || 0,
      salaries: partBTI.Salaries,
      incomeFromHP: partBTI.IncomeFromHP,
      totalCapGains: partBTI.CapGain?.TotalCapGains,
      totIncFromOS: partBTI.IncFromOS?.TotIncFromOS,
      totalIncome,
      isNewRegime,
      allowedDeductionsNewRegime,
    };
  }
};


interface IncomeComputationTabProps {
  viewModel: IncomeComputationViewModel;
}

export const IncomeComputationTab: React.FC<IncomeComputationTabProps> = ({ viewModel }) => {
  if (!viewModel) {
    return <div>No Income Computation data available.</div>;
  }

  const {
    grossTotalIncome,
    balanceAfterSetoffLosses,
    broughtFwdLossesSetoff,
    deductionsUnderScheduleVIA,
    salaries,
    incomeFromHP,
    totalCapGains,
    totIncFromOS,
    totalIncome,
    isNewRegime,
    allowedDeductionsNewRegime,
  } = viewModel;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">
          Computation of Total Income
          <span className="text-sm font-medium text-gray-500 ml-2">
            ({isNewRegime ? 'New Regime' : 'Old Regime'})
          </span>
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
            {!_.isNil(salaries) && salaries !== 0 && (
              <TableRow>
                <TableCell>Income from Salary</TableCell>
                <TableCell className="text-right">{formatAmount(salaries)}</TableCell>
              </TableRow>
            )}
            
            {/* House Property Income */}
            {!_.isNil(incomeFromHP) && incomeFromHP !== 0 && (
              <TableRow>
                <TableCell>Income from House Property</TableCell>
                <TableCell className="text-right">{formatAmount(incomeFromHP)}</TableCell>
              </TableRow>
            )}
            
            {/* Capital Gains */}
            {!_.isNil(totalCapGains) && totalCapGains !== 0 && (
              <TableRow>
                <TableCell>Capital Gains</TableCell>
                <TableCell className="text-right">{formatAmount(totalCapGains)}</TableCell>
              </TableRow>
            )}
            
            {/* Other Sources Income */}
            {!_.isNil(totIncFromOS) && totIncFromOS !== 0 && (
              <TableRow>
                <TableCell>Income from Other Sources</TableCell>
                <TableCell className="text-right">{formatAmount(totIncFromOS)}</TableCell>
              </TableRow>
            )}
            
            {/* Balance After Current Year Loss Set-off */}
            {!_.isNil(balanceAfterSetoffLosses) && (
              <TableRow>
                <TableCell>Balance After Current Year Loss Set-off</TableCell>
                <TableCell className="text-right">{formatAmount(balanceAfterSetoffLosses)}</TableCell>
              </TableRow>
            )}

            {/* Brought Forward Losses Set-off */}
            {!_.isNil(broughtFwdLossesSetoff) && broughtFwdLossesSetoff !== 0 && (
              <TableRow>
                <TableCell>Less: Brought Forward Losses Set-off</TableCell>
                <TableCell className="text-right">{formatAmount(broughtFwdLossesSetoff)}</TableCell>
              </TableRow>
            )}

            {/* Gross Total Income */}
            <TableRow className="bg-slate-50">
              <TableCell className="font-medium">Gross Total Income</TableCell>
              <TableCell className="text-right font-medium">{formatAmount(grossTotalIncome)}</TableCell>
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
              !_.isNil(deductionsUnderScheduleVIA) && deductionsUnderScheduleVIA !== 0 && (
                <TableRow>
                  <TableCell>Less: Deductions under Chapter VI-A</TableCell>
                  <TableCell className="text-right">{formatAmount(deductionsUnderScheduleVIA)}</TableCell>
                </TableRow>
              )
            )}
            
            <TableRow><TableCell colSpan={2} className='p-0'><Separator className="my-2" /></TableCell></TableRow>
            
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