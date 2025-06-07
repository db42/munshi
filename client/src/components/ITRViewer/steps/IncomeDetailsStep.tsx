import React from 'react';
import { ITRViewerStepConfig } from '../types';
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Building, Home, Coffee } from 'lucide-react';
import { getNestedValue } from '../../../utils/helpers';
import { Itr, Salaries, PropertyDetails, ScheduleOS } from '../../../types/itr';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyINR } from '../../../utils/formatters';

interface StepProps {
  itrData: Itr;
  config: ITRViewerStepConfig;
}

export const IncomeDetailsStep: React.FC<StepProps> = ({ itrData, config }) => {
  // Safely access the ITR data
  const scheduleS = itrData.ITR?.ITR2?.ScheduleS;
  const scheduleHP = itrData.ITR?.ITR2?.ScheduleHP;
  const scheduleOS = itrData.ITR?.ITR2?.ScheduleOS as ScheduleOS | undefined;

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
              {Array.isArray(scheduleS?.Salaries) && scheduleS?.Salaries?.length > 0 ? (
                <div className="space-y-6">
                  {scheduleS.Salaries.map((employer: Salaries, index: number) => (
                    <div key={index} className="space-y-4 p-4 border rounded-md mb-4 bg-slate-50">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{employer?.NameOfEmployer || 'Employer'}</h4>
                        <Badge variant="outline" className="px-2">TAN: {employer?.TANofEmployer || 'N/A'}</Badge>
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
                            <TableCell className="text-right">{formatCurrencyINR(employer?.Salarys?.GrossSalary || 0)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Salary</TableCell>
                            <TableCell className="text-right">{formatCurrencyINR(employer?.Salarys?.Salary || 0)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Perquisites</TableCell>
                            <TableCell className="text-right">{formatCurrencyINR(employer?.Salarys?.ValueOfPerquisites || 0)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Profits in lieu of Salary</TableCell>
                            <TableCell className="text-right">{formatCurrencyINR(employer?.Salarys?.ProfitsinLieuOfSalary || 0)}</TableCell>
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
              {Array.isArray(scheduleHP?.PropertyDetails) && scheduleHP.PropertyDetails.length > 0 ? (
                <div className="space-y-6">
                  {scheduleHP.PropertyDetails.map((property: PropertyDetails, index: number) => {
                    // Calculate net income from house property
                    const annualValue = property?.Rentdetails?.AnnualOfPropOwned || 0;
                    const localTaxes = property?.Rentdetails?.LocalTaxes || 0;
                    const interestPaid = property?.Rentdetails?.IntOnBorwCap || 0;
                    const netIncome = property?.Rentdetails?.IncomeOfHP || 0;
                    
                    return (
                      <div key={index} className="space-y-4 p-4 border rounded-md mb-4 bg-slate-50">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            Property {index + 1}
                          </h4>
                          <Badge variant={netIncome >= 0 ? "default" : "destructive"}>
                            Net: {formatCurrencyINR(netIncome)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {property?.AddressDetailWithZipCode?.AddrDetail || 'Address not specified'}
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
                              <TableCell>Annual Value</TableCell>
                              <TableCell className="text-right">{formatCurrencyINR(annualValue)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Local Taxes Paid</TableCell>
                              <TableCell className="text-right">{formatCurrencyINR(localTaxes)}</TableCell>
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
              {scheduleOS ? (
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
                          {formatCurrencyINR(scheduleOS?.IncOthThanOwnRaceHorse?.IntrstFrmSavingBank || 0)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Interest from Fixed Deposits</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(scheduleOS?.IncOthThanOwnRaceHorse?.IntrstFrmTermDeposit || 0)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dividends</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(scheduleOS?.IncOthThanOwnRaceHorse?.DividendGross || 0)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other Income</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(scheduleOS?.IncOthThanOwnRaceHorse?.AnyOtherIncome || 0)}
                        </TableCell>
                      </TableRow>
                      <TableRow className="font-medium">
                        <TableCell>Total Income from Other Sources</TableCell>
                        <TableCell className="text-right">
                          {formatCurrencyINR(totalOtherSourcesIncome)}
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