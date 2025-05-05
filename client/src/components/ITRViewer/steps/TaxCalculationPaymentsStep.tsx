import React from 'react';
import { ITRViewerStepConfig } from '../types';
import { Itr } from '../../../types/itr';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/table';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { AlertCircle, Calculator, Receipt, CreditCard } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { formatAmount } from '../../../utils/formatters';
import _ from 'lodash';

interface StepProps {
  itrData: Itr;
  config: ITRViewerStepConfig;
}

export const TaxCalculationPaymentsStep: React.FC<StepProps> = ({ itrData, config }) => {
  // Extract data from itrData
  const partBTI = itrData.ITR?.ITR2?.["PartB-TI"];
  const partBTTI = itrData.ITR?.ITR2?.["PartB-TTI"];
  const scheduleTDS1 = itrData.ITR?.ITR2?.ScheduleTDS1;
  const scheduleTDS2 = itrData.ITR?.ITR2?.ScheduleTDS2;
  const scheduleTCS = itrData.ITR?.ITR2?.ScheduleTCS;
  const scheduleIT = itrData.ITR?.ITR2?.ScheduleIT;

  // Check if we have tax calculation data
  const hasTaxData = !_.isNil(partBTI) || !_.isNil(partBTTI);
  
  // Check if we have tax payment data
  const hasTaxPayments = !_.isNil(scheduleTDS1) || !_.isNil(scheduleTDS2) || !_.isNil(scheduleTCS) || !_.isNil(scheduleIT);
  
  // Check if we have any data to display
  const hasData = hasTaxData || hasTaxPayments;
  
  if (!hasData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Tax Calculation or Payment Data</AlertTitle>
        <AlertDescription>
          No tax calculation or payment data found in this tax return.
        </AlertDescription>
      </Alert>
    );
  }

  // Extract relevant tax values
  const totalIncome = partBTI?.TotalIncome || 0;
  const grossTotalIncome = partBTI?.GrossTotalIncome || 0;
  const totalTaxPayable = partBTTI?.ComputationOfTaxLiability?.TotalTaxPayable || 0;
  const refundDue = partBTTI?.Refund?.RefundDue || 0;
  const taxPayable = partBTTI?.Refund?.AmtPayableTaxAuth || 0;

  // Calculate total tax paid
  const tdsPaid = (scheduleTDS1?.TotalTDSonSalaries || 0) + 
                 (scheduleTDS2?.TotalTDSonOthThanSals || 0);
  const tcsPaid = scheduleTCS?.TotalSchTCS || 0;
  const advanceTaxPaid = scheduleIT?.TotalTaxPayments || 0;
  const totalTaxesPaid = tdsPaid + tcsPaid + advanceTaxPaid;

  return (
    <div className="space-y-6">
      <Alert variant="default" className="mb-4">
        <Calculator className="h-4 w-4" />
        <AlertTitle>Tax Calculation & Payments</AlertTitle>
        <AlertDescription>
          Review your tax calculation details and payments as reported in your ITR.
          <div className="mt-2 font-medium flex gap-4">
            <span>Total Income: {formatAmount(totalIncome)}</span>
            <span>Tax Payable: {formatAmount(totalTaxPayable)}</span>
            {refundDue > 0 && <span>Refund Due: {formatAmount(refundDue)}</span>}
            {taxPayable > 0 && <span>Amount Payable: {formatAmount(taxPayable)}</span>}
          </div>
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="income-computation" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="income-computation" className="flex items-center" disabled={!partBTI}>
            <Calculator className="h-4 w-4 mr-2" />
            Income Computation
          </TabsTrigger>
          <TabsTrigger value="tax-calculation" className="flex items-center" disabled={!partBTTI}>
            <CreditCard className="h-4 w-4 mr-2" />
            Tax Calculation
          </TabsTrigger>
          <TabsTrigger value="tax-payments" className="flex items-center" disabled={!hasTaxPayments}>
            <Receipt className="h-4 w-4 mr-2" />
            Tax Payments
          </TabsTrigger>
        </TabsList>

        {/* Income Computation Tab */}
        {partBTI && (
          <TabsContent value="income-computation" className="mt-0">
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
          </TabsContent>
        )}

        {/* Tax Calculation Tab */}
        {partBTTI && (
          <TabsContent value="tax-calculation" className="mt-0">
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
                    {/* Tax on Total Income */}
                    {!_.isNil(partBTTI.ComputationOfTaxLiability?.TaxOnTotalIncome) && (
                      <TableRow>
                        <TableCell>Tax on Total Income</TableCell>
                        <TableCell className="text-right">{formatAmount(partBTTI.ComputationOfTaxLiability.TaxOnTotalIncome)}</TableCell>
                      </TableRow>
                    )}
                    
                    {/* Surcharge */}
                    {!_.isNil(partBTTI.Surcharge) && partBTTI.Surcharge !== 0 && (
                      <TableRow>
                        <TableCell>Surcharge</TableCell>
                        <TableCell className="text-right">{formatAmount(partBTTI.Surcharge)}</TableCell>
                      </TableRow>
                    )}
                    
                    {/* Health and Education Cess */}
                    {!_.isNil(partBTTI.HealthEduCess) && partBTTI.HealthEduCess !== 0 && (
                      <TableRow>
                        <TableCell>Health and Education Cess</TableCell>
                        <TableCell className="text-right">{formatAmount(partBTTI.HealthEduCess)}</TableCell>
                      </TableRow>
                    )}
                    
                    {/* Gross Tax Liability */}
                    <TableRow className="bg-slate-50">
                      <TableCell className="font-medium">Gross Tax Liability</TableCell>
                      <TableCell className="text-right font-medium">{formatAmount(partBTTI.ComputationOfTaxLiability?.GrossTaxLiability)}</TableCell>
                    </TableRow>
                    
                    {/* Section 87A Rebate */}
                    {!_.isNil(partBTTI.ComputationOfTaxLiability?.Rebate87A) && partBTTI.ComputationOfTaxLiability.Rebate87A !== 0 && (
                      <TableRow>
                        <TableCell>Less: Rebate under Section 87A</TableCell>
                        <TableCell className="text-right">{formatAmount(partBTTI.ComputationOfTaxLiability.Rebate87A)}</TableCell>
                      </TableRow>
                    )}
                    
                    {/* Tax After Rebate */}
                    {!_.isNil(partBTTI.ComputationOfTaxLiability?.TaxAfterRebate) && (
                      <TableRow>
                        <TableCell>Tax After Rebate</TableCell>
                        <TableCell className="text-right">{formatAmount(partBTTI.ComputationOfTaxLiability.TaxAfterRebate)}</TableCell>
                      </TableRow>
                    )}
                    
                    {/* Relief under Section 89 */}
                    {!_.isNil(partBTTI.ComputationOfTaxLiability?.Relief89) && partBTTI.ComputationOfTaxLiability.Relief89 !== 0 && (
                      <TableRow>
                        <TableCell>Less: Relief under Section 89</TableCell>
                        <TableCell className="text-right">{formatAmount(partBTTI.ComputationOfTaxLiability.Relief89)}</TableCell>
                      </TableRow>
                    )}
                    
                    <Separator className="my-2" />
                    
                    {/* Total Tax Payable */}
                    <TableRow className="bg-slate-100 font-semibold">
                      <TableCell>Total Tax Payable</TableCell>
                      <TableCell className="text-right">{formatAmount(totalTaxPayable)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tax Payments Tab */}
        {hasTaxPayments && (
          <TabsContent value="tax-payments" className="mt-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tax Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* TDS on Salary */}
                  {!_.isNil(scheduleTDS1) && (
                    <div>
                      <h4 className="text-md font-medium mb-2">TDS on Salary</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Employer</TableHead>
                            <TableHead>TAN</TableHead>
                            <TableHead className="text-right">Amount (₹)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scheduleTDS1.TDSonSalary?.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>{entry.EmployerOrDeductorOrCollectDetl?.EmployerOrDeductorOrCollecterName || 'Not Specified'}</TableCell>
                              <TableCell>{entry.EmployerOrDeductorOrCollectDetl?.TAN || 'Not Specified'}</TableCell>
                              <TableCell className="text-right">{formatAmount(entry.TotalTDSSal)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-slate-50 font-medium">
                            <TableCell colSpan={2}>Total TDS on Salary</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleTDS1.TotalTDSonSalaries)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {/* TDS on Other Income */}
                  {!_.isNil(scheduleTDS2) && !_.isEmpty(scheduleTDS2.TDSOthThanSalaryDtls) && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">TDS on Other Income</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Deductor</TableHead>
                            <TableHead>TAN</TableHead>
                            <TableHead className="text-right">Amount (₹)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scheduleTDS2.TDSOthThanSalaryDtls?.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>{'Not Specified'}</TableCell>
                              <TableCell>{entry.TANOfDeductor || 'Not Specified'}</TableCell>
                              <TableCell className="text-right">{formatAmount(entry.AmtCarriedFwd)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-slate-50 font-medium">
                            <TableCell colSpan={2}>Total TDS on Other Income</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleTDS2.TotalTDSonOthThanSals)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {/* TCS */}
                  {!_.isNil(scheduleTCS) && !_.isEmpty(scheduleTCS.TCS) && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">Tax Collected at Source (TCS)</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>TAN</TableHead>
                            <TableHead className="text-right">Amount (₹)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scheduleTCS.TCS?.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>{entry.EmployerOrDeductorOrCollectTAN || 'Not Specified'}</TableCell>
                              <TableCell className="text-right">{formatAmount(entry.AmtCarriedFwd)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-slate-50 font-medium">
                            <TableCell>Total TCS</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleTCS.TotalSchTCS)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {/* Advance Tax / Self-Assessment Tax */}
                  {!_.isNil(scheduleIT) && !_.isEmpty(scheduleIT.TaxPayment) && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">Advance Tax / Self-Assessment Tax</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>BSR Code</TableHead>
                            <TableHead>Date of Payment</TableHead>
                            <TableHead className="text-right">Amount (₹)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {scheduleIT.TaxPayment?.map((entry, index) => (
                            <TableRow key={index}>
                              <TableCell>{entry.BSRCode || 'Not Specified'}</TableCell>
                              <TableCell>{entry.DateDep || 'Not Specified'}</TableCell>
                              <TableCell className="text-right">{formatAmount(entry.Amt)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-slate-50 font-medium">
                            <TableCell colSpan={2}>Total Tax Payments</TableCell>
                            <TableCell className="text-right">{formatAmount(scheduleIT.TotalTaxPayments)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {/* Summary of Tax Payments */}
                  <div className="mt-6">
                    <Separator className="my-4" />
                    <h4 className="text-md font-medium mb-2">Summary of Tax Payments</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type of Tax</TableHead>
                          <TableHead className="text-right">Amount (₹)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tdsPaid > 0 && (
                          <TableRow>
                            <TableCell>TDS</TableCell>
                            <TableCell className="text-right">{formatAmount(tdsPaid)}</TableCell>
                          </TableRow>
                        )}
                        {tcsPaid > 0 && (
                          <TableRow>
                            <TableCell>TCS</TableCell>
                            <TableCell className="text-right">{formatAmount(tcsPaid)}</TableCell>
                          </TableRow>
                        )}
                        {advanceTaxPaid > 0 && (
                          <TableRow>
                            <TableCell>Advance/Self-Assessment Tax</TableCell>
                            <TableCell className="text-right">{formatAmount(advanceTaxPaid)}</TableCell>
                          </TableRow>
                        )}
                        <TableRow className="bg-slate-100 font-semibold">
                          <TableCell>Total Taxes Paid</TableCell>
                          <TableCell className="text-right">{formatAmount(totalTaxesPaid)}</TableCell>
                        </TableRow>
                        <TableRow className="bg-slate-50">
                          <TableCell>Total Tax Payable</TableCell>
                          <TableCell className="text-right">{formatAmount(totalTaxPayable)}</TableCell>
                        </TableRow>
                        {refundDue > 0 && (
                          <TableRow className="bg-green-50">
                            <TableCell>Refund Due</TableCell>
                            <TableCell className="text-right">{formatAmount(refundDue)}</TableCell>
                          </TableRow>
                        )}
                        {taxPayable > 0 && (
                          <TableRow className="bg-amber-50">
                            <TableCell>Amount Payable</TableCell>
                            <TableCell className="text-right">{formatAmount(taxPayable)}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}; 