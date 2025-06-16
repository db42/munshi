import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatAmount, formatDate } from '@/utils/formatters';
import type { Itr1 } from '@/types/itr-1';
import type { Itr2, TDSonSalary, TDSOthThanSalaryDtls, TaxPayment, Tc } from '@/types/itr';

interface TaxPaymentViewModel {
  tdsOnSalary: TDSonSalary[];
  tdsOnOtherIncome: TDSOthThanSalaryDtls[];
  advanceTax: TaxPayment[];
  selfAssessmentTax: TaxPayment[];
  tcs: Tc[];
  otherTaxPayments: TaxPayment[];
  totals: {
    tdsOnSalary: number;
    tdsOnOtherIncome: number;
    tcs: number;
    advanceSelfAssessmentTax: number;
    grandTotal: number;
  };
  hasTaxPayments: boolean;
}

const createTaxPaymentsViewModel = (itrData: Itr1 | Itr2): TaxPaymentViewModel => {
  const isItr1 = (data: Itr1 | Itr2): data is Itr1 => 'ITR1_IncomeDeductions' in data;

  let tdsOnSalary: TDSonSalary[] = [];
  let tdsOnOtherIncome: TDSOthThanSalaryDtls[] = [];
  let taxPayments: TaxPayment[] = [];
  let tcs: Tc[] = [];

  if (isItr1(itrData)) {
    tdsOnSalary = itrData.TDSonSalaries?.TDSonSalary || [];
    tdsOnOtherIncome = (itrData.TDSonOthThanSals?.TDSonOthThanSal || []).map(item => ({
        // This is a mapping from Itr1's TDSonOthThanSal to Itr2's TDSOthThanSalaryDtls
        TANOfDeductor: item.EmployerOrDeductorOrCollectDetl.TAN,
        GrossAmount: item.AmtForTaxDeduct,
        TaxDeductCreditDtls: {
          TaxClaimedTDS: item.ClaimOutOfTotTDSOnAmtPaid,
        },
        // Below are required fields for TDSOthThanSalaryDtls, providing default values
        AmtCarriedFwd: 0,
        TDSCreditName: 'S', 
      } as TDSOthThanSalaryDtls
    ));
    taxPayments = itrData.TaxPayments?.TaxPayment || [];
    tcs = itrData.ScheduleTCS?.TCS || [];
  } else {
    tdsOnSalary = itrData.ScheduleTDS1?.TDSonSalary || [];
    tdsOnOtherIncome = itrData.ScheduleTDS2?.TDSOthThanSalaryDtls || [];
    taxPayments = itrData.ScheduleIT?.TaxPayment || [];
    tcs = itrData.ScheduleTCS?.TCS || [];
  }

  const advanceTax = taxPayments.filter(p => p.SrlNoOfChaln === 2801);
  const selfAssessmentTax = taxPayments.filter(p => p.SrlNoOfChaln === 2802);
  const otherTaxPayments = taxPayments.filter(p => p.SrlNoOfChaln !== 2801 && p.SrlNoOfChaln !== 2802);
  
  const totalTDSOnSalary = tdsOnSalary.reduce((sum, tds) => sum + (tds.TotalTDSSal || 0), 0);
  const totalTDSOnOtherIncome = tdsOnOtherIncome.reduce((sum, tds) => sum + (tds.TaxDeductCreditDtls?.TaxClaimedTDS || 0), 0);
  const totalTCS = tcs.reduce((sum, tcsItem) => sum + (tcsItem.TCSClaimedThisYearDtls?.TCSAmtCollOwnHand || 0), 0);
  const totalAdvanceSelfAssessmentTax = taxPayments.reduce((sum, payment) => sum + (payment.Amt || 0), 0);
  const grandTotal = totalTDSOnSalary + totalTDSOnOtherIncome + totalTCS + totalAdvanceSelfAssessmentTax;
  
  const hasTaxPayments = tdsOnSalary.length > 0 || tdsOnOtherIncome.length > 0 || taxPayments.length > 0 || tcs.length > 0;

  return {
    tdsOnSalary,
    tdsOnOtherIncome,
    advanceTax,
    selfAssessmentTax,
    tcs,
    otherTaxPayments,
    totals: {
      tdsOnSalary: totalTDSOnSalary,
      tdsOnOtherIncome: totalTDSOnOtherIncome,
      tcs: totalTCS,
      advanceSelfAssessmentTax: totalAdvanceSelfAssessmentTax,
      grandTotal,
    },
    hasTaxPayments,
  };
};


interface TaxPaymentsTabProps {
  itrData: Itr1 | Itr2;
}

export const TaxPaymentsTab: React.FC<TaxPaymentsTabProps> = ({ itrData }) => {
  const viewModel = createTaxPaymentsViewModel(itrData);

  const {
    tdsOnSalary,
    tdsOnOtherIncome,
    advanceTax,
    selfAssessmentTax,
    tcs,
    otherTaxPayments,
    totals,
    hasTaxPayments,
  } = viewModel;
  
  const hasTDS1 = tdsOnSalary.length > 0;
  const hasTDS2 = tdsOnOtherIncome.length > 0;
  const hasOtherTaxPayments = otherTaxPayments.length > 0;
  const hasTCS = tcs.length > 0;
  const hasAnyScheduleITPayments = advanceTax.length > 0 || selfAssessmentTax.length > 0 || otherTaxPayments.length > 0;


  if (!hasTaxPayments) {
    return (
      <>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Tax Payment Data</AlertTitle>
          <AlertDescription>
            No tax payment data found in this tax return. Click "Edit Tax Payments" to add self-assessment tax details.
          </AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      {/* Summary Card */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tax Payments Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {totals.tdsOnSalary > 0 && (
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">TDS on Salary</p>
                <p className="text-lg font-semibold text-blue-700">{formatAmount(totals.tdsOnSalary)}</p>
              </div>
            )}
            {totals.tdsOnOtherIncome > 0 && (
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">TDS on Other Income</p>
                <p className="text-lg font-semibold text-green-700">{formatAmount(totals.tdsOnOtherIncome)}</p>
              </div>
            )}
            {totals.tcs > 0 && (
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">TCS</p>
                <p className="text-lg font-semibold text-purple-700">{formatAmount(totals.tcs)}</p>
              </div>
            )}
            {totals.advanceSelfAssessmentTax > 0 && (
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Advance/Self-Assessment</p>
                <p className="text-lg font-semibold text-orange-700">{formatAmount(totals.advanceSelfAssessmentTax)}</p>
              </div>
            )}
          </div>
          <Separator className="my-4" />
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Tax Payments</p>
            <p className="text-2xl font-bold text-gray-900">{formatAmount(totals.grandTotal)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Details of Tax Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {hasTDS1 && (
            <>
              <h3 className="text-md font-semibold mb-2">TDS on Salary (Form 16)</h3>
              {tdsOnSalary?.map((tdsDetail, index) => (
                <div key={index} className="mb-4 p-3 border rounded-md">
                  <p><strong>Employer:</strong> {tdsDetail.EmployerOrDeductorOrCollectDetl?.EmployerOrDeductorOrCollecterName || "-"}</p>
                  <p><strong>TAN:</strong> {tdsDetail.EmployerOrDeductorOrCollectDetl?.TAN || "-"}</p>
                  <p><strong>Total Tax Deducted:</strong> {formatAmount(tdsDetail.TotalTDSSal)}</p>
                </div>
              ))}
              <Separator className="my-4" />
            </>
          )}

          {hasTDS2 && (
            <>
              <h3 className="text-md font-semibold mb-2">TDS on Income Other than Salary (Form 16A/26AS)</h3>
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Payer TAN</TableHead>
                    <TableHead>Payer Name</TableHead>
                    <TableHead className="text-right">Amount Paid/Credited (₹)</TableHead>
                    <TableHead className="text-right">TDS Deducted (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tdsOnOtherIncome?.map((tds, index) => (
                    <TableRow key={index}>
                      <TableCell>{tds.TANOfDeductor || "-"}</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right">{formatAmount(tds.GrossAmount)}</TableCell>
                      <TableCell className="text-right">{formatAmount(tds.TaxDeductCreditDtls?.TaxClaimedTDS)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-4" />
            </>
          )}

          {hasTCS && (
            <>
              <h3 className="text-md font-semibold mb-2">Tax Collected at Source (TCS)</h3>
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Collector TAN</TableHead>
                    <TableHead>Collector Name</TableHead>
                    <TableHead className="text-right">Amount Subject to TCS (₹)</TableHead>
                    <TableHead className="text-right">TCS Collected (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tcs?.map((tcsItem, index) => (
                    <TableRow key={index}>
                      <TableCell>{tcsItem.EmployerOrDeductorOrCollectTAN || "-"}</TableCell>
                      <TableCell>{"-"}</TableCell>
                      <TableCell className="text-right">{"-"}</TableCell>
                      <TableCell className="text-right">{formatAmount(tcsItem.TCSClaimedThisYearDtls?.TCSAmtCollOwnHand)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-4" />
            </>
          )}

          {hasAnyScheduleITPayments && (
            <>
              <h3 className="text-md font-semibold mb-2">Advance Tax and Self-Assessment Tax Payments</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>BSR Code</TableHead>
                    <TableHead>Date of Deposit</TableHead>
                    <TableHead>Challan No.</TableHead>
                    <TableHead className="text-right">Amount (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advanceTax.map((payment: TaxPayment, index: number) => (
                    <TableRow key={`adv-${index}`}>
                      <TableCell><Badge variant="outline">Advance Tax</Badge></TableCell>
                      <TableCell>{payment.BSRCode || "-"}</TableCell>
                      <TableCell>{formatDate(payment.DateDep)}</TableCell>
                      <TableCell>{payment.SrlNoOfChaln || "-"}</TableCell>
                      <TableCell className="text-right">{formatAmount(payment.Amt)}</TableCell>
                    </TableRow>
                  ))}
                  {selfAssessmentTax.map((payment: TaxPayment, index: number) => (
                    <TableRow key={`sa-${index}`}>
                      <TableCell><Badge>Self-Assessment</Badge></TableCell>
                      <TableCell>{payment.BSRCode || "-"}</TableCell>
                      <TableCell>{formatDate(payment.DateDep)}</TableCell>
                      <TableCell>{payment.SrlNoOfChaln || "-"}</TableCell>
                      <TableCell className="text-right">{formatAmount(payment.Amt)}</TableCell>
                    </TableRow>
                  ))}
                  {/* Show other tax payments if any */}
                  {hasOtherTaxPayments && otherTaxPayments.map((payment: TaxPayment, index: number) => (
                    <TableRow key={`misc-${index}`}>
                      <TableCell><Badge variant="secondary">Tax Payment</Badge></TableCell> 
                      <TableCell>{payment.BSRCode || "-"}</TableCell>
                      <TableCell>{formatDate(payment.DateDep)}</TableCell>
                      <TableCell>{payment.SrlNoOfChaln || "-"}</TableCell>
                      <TableCell className="text-right">{formatAmount(payment.Amt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};