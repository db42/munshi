import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../ui/table';
import { Alert, AlertTitle, AlertDescription } from '../../ui/alert';
import { AlertCircle } from 'lucide-react';
import { Badge } from '../../ui/badge';
import { Separator } from '../../ui/separator';
import { formatAmount, formatDate } from '../../../../utils/formatters';
import { Itr, ScheduleTDS1, TDSonSalary, ScheduleTDS2, TDSOthThanSalaryDtls, ScheduleIT, TaxPayment, ScheduleTCS, Tc } from '../../../../types/itr';
import _ from 'lodash';

interface TaxPaymentsTabProps {
  itrData: Itr;
}

export const TaxPaymentsTab: React.FC<TaxPaymentsTabProps> = ({ itrData }) => {
  const scheduleTDS1Data = itrData.ITR?.ITR2?.ScheduleTDS1;
  const scheduleTDS2Data = itrData.ITR?.ITR2?.ScheduleTDS2;
  const scheduleITData = itrData.ITR?.ITR2?.ScheduleIT;
  const scheduleTCSData = itrData.ITR?.ITR2?.ScheduleTCS;

  // Ensure we handle arrays correctly
  const taxPaymentsArray: TaxPayment[] = scheduleITData?.TaxPayment || [];

  // Process tax payment types 
  const advanceTaxPayments = taxPaymentsArray.filter(p => p.SrlNoOfChaln === 2801);
  const selfAssessmentTaxPayments = taxPaymentsArray.filter(p => p.SrlNoOfChaln === 2802);
  
  // Handle payments without explicit type
  const allOtherTaxPayments = taxPaymentsArray.filter(p => 
    p.SrlNoOfChaln !== 2801 && 
    p.SrlNoOfChaln !== 2802
  );

  // Normalize arrays for different data types
  const tdsOnSalaryDetailsArray: TDSonSalary[] = scheduleTDS1Data?.TDSonSalary || [];

  const scheduleTDS2Array: TDSOthThanSalaryDtls[] = scheduleTDS2Data?.TDSOthThanSalaryDtls || [];
    
  const scheduleTCSArray: Tc[] = scheduleTCSData?.TCS || [];

  // Check if we have data for each section
  const hasTDS1 = tdsOnSalaryDetailsArray.length > 0;
  const hasTDS2 = scheduleTDS2Array.length > 0;
  const hasOtherTaxPayments = allOtherTaxPayments.length > 0;
  const hasTCS = scheduleTCSArray.length > 0;
  const hasAnyScheduleITPayments = taxPaymentsArray.length > 0;
  const hasTaxPayments = hasTDS1 || hasTDS2 || hasAnyScheduleITPayments || hasTCS;

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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Details of Tax Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {hasTDS1 && (
            <>
              <h3 className="text-md font-semibold mb-2">TDS on Salary (Form 16)</h3>
              {tdsOnSalaryDetailsArray?.map((tdsDetail, index) => (
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
                  {scheduleTDS2Array?.map((tds, index) => (
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
                  {scheduleTCSArray?.map((tcs, index) => (
                    <TableRow key={index}>
                      <TableCell>{tcs.EmployerOrDeductorOrCollectTAN || "-"}</TableCell>
                      <TableCell>{"-"}</TableCell>
                      <TableCell className="text-right">{"-"}</TableCell>
                      <TableCell className="text-right">{formatAmount(tcs.TCSClaimedThisYearDtls?.TCSAmtCollOwnHand)}</TableCell>
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
                  {advanceTaxPayments.map((payment: TaxPayment, index: number) => (
                    <TableRow key={`adv-${index}`}>
                      <TableCell><Badge variant="outline">Advance Tax</Badge></TableCell>
                      <TableCell>{payment.BSRCode || "-"}</TableCell>
                      <TableCell>{formatDate(payment.DateDep)}</TableCell>
                      <TableCell>{payment.SrlNoOfChaln || "-"}</TableCell>
                      <TableCell className="text-right">{formatAmount(payment.Amt)}</TableCell>
                    </TableRow>
                  ))}
                  {selfAssessmentTaxPayments.map((payment: TaxPayment, index: number) => (
                    <TableRow key={`sa-${index}`}>
                      <TableCell><Badge>Self-Assessment</Badge></TableCell>
                      <TableCell>{payment.BSRCode || "-"}</TableCell>
                      <TableCell>{formatDate(payment.DateDep)}</TableCell>
                      <TableCell>{payment.SrlNoOfChaln || "-"}</TableCell>
                      <TableCell className="text-right">{formatAmount(payment.Amt)}</TableCell>
                    </TableRow>
                  ))}
                  {/* For payments with no type, show as generic "Tax Paid" */}
                  {advanceTaxPayments.length === 0 && selfAssessmentTaxPayments.length === 0 && taxPaymentsArray.map((payment: TaxPayment, index: number) => (
                    <TableRow key={`other-${index}`}>
                      <TableCell><Badge variant="secondary">Tax Paid</Badge></TableCell> 
                      <TableCell>{payment.BSRCode || "-"}</TableCell>
                      <TableCell>{formatDate(payment.DateDep)}</TableCell>
                      <TableCell>{payment.SrlNoOfChaln || "-"}</TableCell>
                      <TableCell className="text-right">{formatAmount(payment.Amt)}</TableCell>
                    </TableRow>
                  ))}
                  {/* Show other tax payments if any */}
                  {hasOtherTaxPayments && allOtherTaxPayments.map((payment: TaxPayment, index: number) => (
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