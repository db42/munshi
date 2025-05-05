import React from 'react';
import { ITRViewerStepConfig } from '../types';
import { Input } from '../ui/input'; 
import { Label } from '../ui/label'; 
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle, Building, Home, Coffee } from 'lucide-react';
import { getNestedValue } from '../../../utils/helpers';
import { Itr } from '../../../types/itr';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { formatCurrencyINR } from '../../../utils/formatters';

interface StepProps {
  itrData: Itr;
  config: ITRViewerStepConfig;
}

export const IncomeDetailsStep: React.FC<StepProps> = ({ itrData, config }) => {
  // Safely access the ITR data
  const scheduleS = itrData.ITR?.ITR2?.ScheduleS;
  const scheduleHP = itrData.ITR?.ITR2?.ScheduleHP;
  const scheduleOS = itrData.ITR?.ITR2?.ScheduleOS as any; // Cast to any to avoid type errors

  // Get the official total salary income from Part B-TI instead of calculating it manually
  const totalSalaryIncome = itrData.ITR?.ITR2?.["PartB-TI"]?.Salaries || 0;
  const totalHousePropertyIncome = itrData.ITR?.ITR2?.["PartB-TI"]?.IncomeFromHP || 0;
  const totalOtherSourcesIncome = itrData.ITR?.ITR2?.["PartB-TI"]?.IncFromOS?.TotIncFromOS || 0;
  
  // Get Gross Total Income from Part B-TI
  const grossTotalIncome = itrData.ITR?.ITR2?.["PartB-TI"]?.GrossTotalIncome || 0;

  return (
    <div className="space-y-6">
      <Alert variant="default" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Income Details</AlertTitle>
        <AlertDescription>
          Review your income from various sources as reported in your ITR.
          <div className="mt-2 font-medium">
            Gross Total Income: {formatCurrencyINR(grossTotalIncome)}
          </div>
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="salary" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="salary" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Salary
          </TabsTrigger>
          <TabsTrigger value="house" className="flex items-center">
            <Home className="h-4 w-4 mr-2" />
            House Property
          </TabsTrigger>
          <TabsTrigger value="other" className="flex items-center">
            <Coffee className="h-4 w-4 mr-2" />
            Other Sources
          </TabsTrigger>
        </TabsList>

        {/* --- Salary Tab Content --- */}
        <TabsContent value="salary" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Income from Salary/Pension
                <Badge>{formatCurrencyINR(totalSalaryIncome)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(scheduleS) && scheduleS.length > 0 ? (
                <div className="space-y-6">
                  {scheduleS.map((employer: any, index: number) => (
                    <div key={index} className="space-y-4 p-4 border rounded-md mb-4 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{employer?.employerName || 'Employer'}</h4>
                        <Badge variant="outline" className="px-2">TAN: {employer?.employerTan || 'N/A'}</Badge>
                      </div>
                      <Separator />
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Gross Salary</TableCell>
                            <TableCell className="text-right">{formatCurrencyINR(parseFloat(employer?.salary?.grossSalary) || 0)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Exempt Allowances</TableCell>
                            <TableCell className="text-right">{formatCurrencyINR(parseFloat(employer?.salary?.exemptAllowances) || 0)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Deductions u/s 16</TableCell>
                            <TableCell className="text-right">{formatCurrencyINR(parseFloat(employer?.salary?.deductions16) || 0)}</TableCell>
                          </TableRow>
                          <TableRow className="font-medium">
                            <TableCell>Net Salary</TableCell>
                            <TableCell className="text-right">{formatCurrencyINR(parseFloat(employer?.salary?.netSalary) || 0)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>TDS on Salary</TableCell>
                            <TableCell className="text-right">{formatCurrencyINR(parseFloat(employer?.tdsDetails?.tdsSalary) || 0)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant="default" className="bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Salary Data</AlertTitle>
                  <AlertDescription>
                    No income from salary or pension reported in this return.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- House Property Tab Content --- */}
        <TabsContent value="house" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Income from House Property
                <Badge>{formatCurrencyINR(totalHousePropertyIncome)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Array.isArray(scheduleHP) && scheduleHP.length > 0 ? (
                <div className="space-y-6">
                  {scheduleHP.map((property: any, index: number) => {
                    // Calculate net income from house property
                    const annualValue = parseFloat(property?.incomeDetails?.rentReceived) || 0;
                    const municipalTax = parseFloat(property?.incomeDetails?.municipalTax) || 0;
                    const interestPaid = parseFloat(property?.incomeDetails?.interestPaid) || 0;
                    const netIncome = annualValue - municipalTax - interestPaid;
                    
                    return (
                      <div key={index} className="space-y-4 p-4 border rounded-md mb-4 bg-slate-50">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {property?.propertyType || 'Property'} {index + 1}
                          </h4>
                          <Badge variant={netIncome >= 0 ? "default" : "destructive"}>
                            Net: {formatCurrencyINR(netIncome)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {property?.address?.fullAddress || 'Address not specified'}
                        </p>
                        <Separator />
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Annual Value / Rent Received</TableCell>
                              <TableCell className="text-right">{formatCurrencyINR(annualValue)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Municipal Tax Paid</TableCell>
                              <TableCell className="text-right">{formatCurrencyINR(municipalTax)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Interest on Housing Loan</TableCell>
                              <TableCell className="text-right">{formatCurrencyINR(interestPaid)}</TableCell>
                            </TableRow>
                            <TableRow className="font-medium">
                              <TableCell>Net Income from House Property</TableCell>
                              <TableCell className="text-right">{formatCurrencyINR(netIncome)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Alert variant="default" className="bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No House Property Data</AlertTitle>
                  <AlertDescription>
                    No income from house property reported in this return.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Other Sources Tab Content --- */}
        <TabsContent value="other" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Income from Other Sources
                <Badge>{formatCurrencyINR(totalOtherSourcesIncome)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeof scheduleOS === 'object' && scheduleOS !== null ? (
                <div className="p-4 border rounded-md bg-slate-50">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Interest from Savings Account</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(parseFloat(scheduleOS?.interestIncome?.savingsBank) || 0)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Interest from Fixed Deposits</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(parseFloat(scheduleOS?.interestIncome?.fixedDeposits) || 0)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dividends</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(parseFloat(scheduleOS?.dividends) || 0)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other Income</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(parseFloat(scheduleOS?.otherIncome) || 0)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Deduction under Section 57</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(parseFloat(scheduleOS?.deductions57) || 0)}
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-medium">
                        <TableCell>Net Income from Other Sources</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(
                            (parseFloat(scheduleOS?.interestIncome?.savingsBank) || 0) +
                            (parseFloat(scheduleOS?.interestIncome?.fixedDeposits) || 0) +
                            (parseFloat(scheduleOS?.dividends) || 0) +
                            (parseFloat(scheduleOS?.otherIncome) || 0) -
                            (parseFloat(scheduleOS?.deductions57) || 0)
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert variant="default" className="bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Other Income Data</AlertTitle>
                  <AlertDescription>
                    No income from other sources reported in this return.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 