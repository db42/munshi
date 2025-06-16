import React from 'react';
import type { ITRViewerStepConfig } from '../types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Building, Home, Coffee } from 'lucide-react';
import type { Itr1 } from '../../../types/itr-1';
import type { Itr2, Salaries, PropertyDetails, ScheduleOS } from '../../../types/itr';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { formatCurrencyINR } from '../../../utils/formatters';

// --- View Model ---
// This interface defines a consistent shape for income details, abstracting away
// the differences between ITR-1 and ITR-2 data structures.
interface IncomeDetailsViewModel {
  salary: {
    total: number;
    gross: number;
    deductions: number;
    deduction16ia: number;
    deduction16ii: number;
    deduction16iii: number;
    employers: {
      name: string;
      tan: string;
      grossSalary: number;
      salary: number;
      perquisites: number;
      profitsInLieu: number;
    }[];
  } | null;
  houseProperty: {
    total: number;
    properties: {
      address: string;
      annualValue: number;
      localTaxes: number;
      interestPaid: number;
      netIncome: number;
    }[];
  } | null;
  otherSources: {
    total: number;
    breakdown: { description: string; amount: number }[];
  } | null;
  grossTotalIncome: number;
}

const createIncomeDetailsViewModel = (itrData: Itr1 | Itr2): IncomeDetailsViewModel => {
  // ITR-1 Data Mapping
  if ('Form_ITR1' in itrData) {
    const incomeDeductions = itrData.ITR1_IncomeDeductions;
    return {
      salary: {
        total: incomeDeductions.IncomeFromSal,
        gross: incomeDeductions.GrossSalary,
        deductions: incomeDeductions.DeductionUs16,
        deduction16ia: incomeDeductions.DeductionUs16ia ?? 0,
        deduction16ii: incomeDeductions.EntertainmentAlw16ii ?? 0,
        deduction16iii: incomeDeductions.ProfessionalTaxUs16iii ?? 0,
        // ITR-1 doesn't have per-employer breakdown in the same way, so we create a single entry
        employers: [
          {
            name: 'Consolidated Salary',
            tan: 'N/A',
            grossSalary: incomeDeductions.GrossSalary,
            salary: incomeDeductions.Salary ?? 0,
            perquisites: incomeDeductions.PerquisitesValue ?? 0,
            profitsInLieu: incomeDeductions.ProfitsInSalary ?? 0,
          },
        ],
      },
      houseProperty: {
        total: incomeDeductions.TotalIncomeOfHP,
        // ITR-1 doesn't have detailed property breakdown, so create a single entry
        properties: [
          {
            address: 'Consolidated House Property',
            annualValue: incomeDeductions.AnnualValue,
            localTaxes: incomeDeductions.TaxPaidlocalAuth ?? 0,
            interestPaid: incomeDeductions.InterestPayable ?? 0,
            netIncome: incomeDeductions.TotalIncomeOfHP,
          },
        ],
      },
      otherSources: {
        total: incomeDeductions.IncomeOthSrc,
        // ITR-1 `OthersInc` can be mapped to breakdown
        breakdown:
          incomeDeductions.OthersInc?.OthersIncDtlsOthSrc?.map(item => ({
            description: item.OthSrcOthNatOfInc || 'Income from Other Sources',
            amount: item.OthSrcOthAmount,
          })) ?? [],
      },
      grossTotalIncome: incomeDeductions.GrossTotIncome,
    };
  }
  // ITR-2 Data Mapping
  else if ('Form_ITR2' in itrData) {
    const scheduleS = itrData.ScheduleS;
    const scheduleHP = itrData.ScheduleHP;
    const scheduleOS = itrData.ScheduleOS;
    const partBTI = itrData['PartB-TI'];

    return {
      salary: scheduleS
        ? {
            total: partBTI?.Salaries || 0,
            gross: scheduleS.TotalGrossSalary || 0,
            deductions: scheduleS.DeductionUS16 || 0,
            deduction16ia: scheduleS.DeductionUnderSection16ia || 0,
            deduction16ii: scheduleS.EntertainmntalwncUs16ii || 0,
            deduction16iii: scheduleS.ProfessionalTaxUs16iii || 0,
            employers:
              scheduleS.Salaries?.map((emp: Salaries) => ({
                name: emp.NameOfEmployer,
                tan: emp.TANofEmployer || 'N/A',
                grossSalary: emp.Salarys?.GrossSalary || 0,
                salary: emp.Salarys?.Salary || 0,
                perquisites: emp.Salarys?.ValueOfPerquisites || 0,
                profitsInLieu: emp.Salarys?.ProfitsinLieuOfSalary || 0,
              })) ?? [],
          }
        : null,
      houseProperty: scheduleHP
        ? {
            total: partBTI?.IncomeFromHP || 0,
            properties:
              scheduleHP.PropertyDetails?.map((prop: PropertyDetails) => ({
                address: prop.AddressDetailWithZipCode?.AddrDetail || 'Address not specified',
                annualValue: prop.Rentdetails?.AnnualOfPropOwned || 0,
                localTaxes: prop.Rentdetails?.LocalTaxes || 0,
                interestPaid: prop.Rentdetails?.IntOnBorwCap || 0,
                netIncome: prop.Rentdetails?.IncomeOfHP || 0,
              })) ?? [],
          }
        : null,
      otherSources: scheduleOS
        ? {
            total: partBTI?.IncFromOS?.TotIncFromOS || 0,
            breakdown: [
              // Corrected field names based on the type definition for IncOthThanOwnRaceHorse
              {
                description: 'Interest from Savings Bank',
                amount: scheduleOS.IncOthThanOwnRaceHorse?.IntrstFrmSavingBank ?? 0,
              },
              {
                description: 'Interest from Deposits',
                amount: scheduleOS.IncOthThanOwnRaceHorse?.IntrstFrmTermDeposit ?? 0,
              },
              {
                description: 'Interest from Income Tax Refund',
                amount: scheduleOS.IncOthThanOwnRaceHorse?.IntrstFrmIncmTaxRefund ?? 0,
              },
              { description: 'Family Pension', amount: scheduleOS.IncOthThanOwnRaceHorse?.FamilyPension ?? 0 },
              {
                description: 'Any Other Income',
                amount: scheduleOS.IncOthThanOwnRaceHorse?.AnyOtherIncome ?? 0,
              },
            ].filter(item => item.amount > 0),
          }
        : null,
      grossTotalIncome: partBTI?.GrossTotalIncome || 0,
    };
  }
  // Fallback empty view model
  return { salary: null, houseProperty: null, otherSources: null, grossTotalIncome: 0 };
};

// --- Component ---
export const IncomeDetailsStep: React.FC<{ itrData: Itr1 | Itr2, config: ITRViewerStepConfig }> = ({ itrData, config }) => {

  // --- Data Access Adapter ---
  const viewModel = createIncomeDetailsViewModel(itrData);

  return (
    <div className="space-y-6">
      <Alert variant="default" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Income Details</AlertTitle>
        <AlertDescription>
          Review your income from various sources as reported in your ITR.
          <div className="mt-2 font-medium">
            Gross Total Income: {formatCurrencyINR(viewModel.grossTotalIncome)}
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
                <Badge>{formatCurrencyINR(viewModel.salary?.total ?? 0)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewModel.salary ? (
                <div className="space-y-6">
                  {/* Gross Salary Breakdown per Employer */}
                  {viewModel.salary.employers.length > 0 ? (
                    <div className="space-y-6">
                      <h4 className="font-medium">Gross Salary Details (per Employer)</h4>
                      {viewModel.salary.employers.map((employer, index: number) => (
                        <div key={index} className="space-y-4 p-4 border rounded-md bg-slate-50">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{employer.name}</h4>
                            <Badge variant="outline" className="px-2">TAN: {employer.tan}</Badge>
                          </div>
                          <Separator />
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell>Gross Salary</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrencyINR(employer.grossSalary)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="pl-8 text-sm">Salary (as per Section 17(1))</TableCell>
                                <TableCell className="text-right text-sm">{formatCurrencyINR(employer.salary)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="pl-8 text-sm">Value of Perquisites (as per Section 17(2))</TableCell>
                                <TableCell className="text-right text-sm">{formatCurrencyINR(employer.perquisites)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="pl-8 text-sm">Profits in lieu of Salary (as per Section 17(3))</TableCell>
                                <TableCell className="text-right text-sm">{formatCurrencyINR(employer.profitsInLieu)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <Separator />

                  {/* Consolidated Salary Calculation */}
                  <h4 className="font-medium">Net Salary Calculation</h4>
                  <div className="p-4 border rounded-md bg-slate-50">
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Total Gross Salary</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrencyINR(viewModel.salary.gross)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-8 text-gray-600">Less: Deductions under Section 16</TableCell>
                            <TableCell className="text-right font-medium">-{formatCurrencyINR(viewModel.salary.deductions)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-12 text-sm">Standard Deduction u/s 16(ia)</TableCell>
                            <TableCell className="text-right text-sm">-{formatCurrencyINR(viewModel.salary.deduction16ia)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-12 text-sm">Entertainment Allowance u/s 16(ii)</TableCell>
                            <TableCell className="text-right text-sm">-{formatCurrencyINR(viewModel.salary.deduction16ii)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="pl-12 text-sm">Professional Tax u/s 16(iii)</TableCell>
                            <TableCell className="text-right text-sm">-{formatCurrencyINR(viewModel.salary.deduction16iii)}</TableCell>
                          </TableRow>
                          <TableRow className="font-bold border-t">
                            <TableCell>Net Income from Salary</TableCell>
                            <TableCell className="text-right">{formatCurrencyINR(viewModel.salary.total)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                  </div>
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
                <Badge>{formatCurrencyINR(viewModel.houseProperty?.total ?? 0)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewModel.houseProperty && viewModel.houseProperty.properties.length > 0 ? (
                <div className="space-y-6">
                  {viewModel.houseProperty.properties.map((property, index: number) => (
                      <div key={index} className="space-y-4 p-4 border rounded-md mb-4 bg-slate-50">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            Property {index + 1}
                          </h4>
                          <Badge variant={property.netIncome >= 0 ? "default" : "destructive"}>
                            Net: {formatCurrencyINR(property.netIncome)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {property.address}
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
                              <TableCell className="text-right">{formatCurrencyINR(property.annualValue)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Local Taxes Paid</TableCell>
                              <TableCell className="text-right">{formatCurrencyINR(property.localTaxes)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Interest on Housing Loan</TableCell>
                              <TableCell className="text-right">{formatCurrencyINR(property.interestPaid)}</TableCell>
                            </TableRow>
                            <TableRow className="font-medium">
                              <TableCell>Net Income from House Property</TableCell>
                              <TableCell className="text-right">{formatCurrencyINR(property.netIncome)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    ))}
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
                <Badge>{formatCurrencyINR(viewModel.otherSources?.total ?? 0)}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewModel.otherSources && viewModel.otherSources.breakdown.length > 0 ? (
                <div className="p-4 border rounded-md bg-slate-50">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {viewModel.otherSources.breakdown.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(item.amount)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold border-t">
                        <TableCell>Total Income from Other Sources</TableCell>
                        <TableCell className="text-right">{formatCurrencyINR(viewModel.otherSources.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <Alert variant="default" className="bg-amber-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No Other Sources Data</AlertTitle>
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