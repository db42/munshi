import React from 'react';
import { ITRViewerStepConfig } from '../types';
import { Itr } from '../../../types/itr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { formatCurrencyINR } from '../../../utils/formatters';

interface StepProps {
  itrData: Itr;
  config: ITRViewerStepConfig;
}

export const ForeignAssetsIncomeStep: React.FC<StepProps> = ({ itrData, config }) => {
  // Extract data from itrData
  const scheduleFA = itrData.ITR?.ITR2?.ScheduleFA || {};
  const scheduleFSI = itrData.ITR?.ITR2?.ScheduleFSI || { ScheduleFSIDtls: [] };

  // Check if any foreign assets data exists
  const hasForeignBankAccounts = (scheduleFA.DetailsForiegnBank?.length ?? 0) > 0;
  const hasForeignCustodialAccounts = (scheduleFA.DtlsForeignCustodialAcc?.length ?? 0) > 0;
  const hasForeignEquityDebtInterests = (scheduleFA.DtlsForeignEquityDebtInterest?.length ?? 0) > 0;
  const hasForeignCashValueInsurance = (scheduleFA.DtlsForeignCashValueInsurance?.length ?? 0) > 0;
  const hasFinancialInterests = (scheduleFA.DetailsFinancialInterest?.length ?? 0) > 0;
  const hasImmovableProperty = (scheduleFA.DetailsImmovableProperty?.length ?? 0) > 0;
  const hasOtherAssets = (scheduleFA.DetailsOthAssets?.length ?? 0) > 0;
  const hasAccountsWithSigningAuth = (scheduleFA.DetailsOfAccntsHvngSigningAuth?.length ?? 0) > 0;
  const hasTrustsOutsideIndia = (scheduleFA.DetailsOfTrustOutIndiaTrustee?.length ?? 0) > 0;
  const hasOtherSourcesIncomeOutsideIndia = (scheduleFA.DetailsOfOthSourcesIncOutsideIndia?.length ?? 0) > 0;

  const hasForeignAssets = 
    hasForeignBankAccounts || 
    hasForeignCustodialAccounts || 
    hasForeignEquityDebtInterests || 
    hasForeignCashValueInsurance || 
    hasFinancialInterests || 
    hasImmovableProperty || 
    hasOtherAssets || 
    hasAccountsWithSigningAuth || 
    hasTrustsOutsideIndia || 
    hasOtherSourcesIncomeOutsideIndia;

  // Check if FSI data exists
  const hasForeignSourceIncome = (scheduleFSI.ScheduleFSIDtls?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">{config.title}</h3>
      
      {/* Foreign Assets Section */}
      <Card>
        <CardHeader>
          <CardTitle>Foreign Assets</CardTitle>
        </CardHeader>
        <CardContent>
          {hasForeignAssets ? (
            <Tabs defaultValue="equity-investments">
              <TabsList className="mb-4">
                {hasForeignBankAccounts && <TabsTrigger value="bank-accounts">Bank Accounts</TabsTrigger>}
                {hasForeignCustodialAccounts && <TabsTrigger value="custodial-accounts">Custodial Accounts</TabsTrigger>}
                {hasForeignEquityDebtInterests && <TabsTrigger value="equity-investments">Equity Investments</TabsTrigger>}
                {hasForeignCashValueInsurance && <TabsTrigger value="insurance">Cash Value Insurance</TabsTrigger>}
                {hasFinancialInterests && <TabsTrigger value="financial-interests">Financial Interests</TabsTrigger>}
                {hasImmovableProperty && <TabsTrigger value="immovable-property">Immovable Property</TabsTrigger>}
                {hasOtherAssets && <TabsTrigger value="other-assets">Other Assets</TabsTrigger>}
                {hasAccountsWithSigningAuth && <TabsTrigger value="signing-auth">Signing Authority</TabsTrigger>}
                {hasTrustsOutsideIndia && <TabsTrigger value="trusts">Trusts Outside India</TabsTrigger>}
                {hasOtherSourcesIncomeOutsideIndia && <TabsTrigger value="other-sources">Other Income Sources</TabsTrigger>}
              </TabsList>

              {/* Bank Accounts Tab */}
              {hasForeignBankAccounts && (
                <TabsContent value="bank-accounts">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bank Name</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead className="text-right">Peak Balance</TableHead>
                        <TableHead className="text-right">Closing Balance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleFA.DetailsForiegnBank?.map((account, index) => (
                        <TableRow key={index}>
                          <TableCell>{account.Bankname}</TableCell>
                          <TableCell>{account.CountryName}</TableCell>
                          <TableCell>{account.ForeignAccountNumber}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(account.PeakBalanceDuringYear)}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(account.ClosingBalance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              )}

              {/* Custodial Accounts Tab */}
              {hasForeignCustodialAccounts && (
                <TabsContent value="custodial-accounts">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Institution</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead className="text-right">Peak Balance</TableHead>
                        <TableHead className="text-right">Closing Balance</TableHead>
                        <TableHead>Nature of Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleFA.DtlsForeignCustodialAcc?.map((account, index) => (
                        <TableRow key={index}>
                          <TableCell>{account.FinancialInstName}</TableCell>
                          <TableCell>{account.CountryName}</TableCell>
                          <TableCell>{account.AccountNumber}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(account.PeakBalanceDuringPeriod)}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(account.ClosingBalance)}</TableCell>
                          <TableCell>{getNatureOfAmountLabel(account.NatureOfAmount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              )}

              {/* Equity Investments Tab */}
              {hasForeignEquityDebtInterests && (
                <TabsContent value="equity-investments">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entity Name</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Acquisition Date</TableHead>
                        <TableHead className="text-right">Initial Investment</TableHead>
                        <TableHead className="text-right">Peak Value</TableHead>
                        <TableHead className="text-right">Closing Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleFA.DtlsForeignEquityDebtInterest?.map((investment, index) => (
                        <TableRow key={index}>
                          <TableCell>{investment.NameOfEntity}</TableCell>
                          <TableCell>{investment.CountryName}</TableCell>
                          <TableCell>{formatDate(investment.InterestAcquiringDate)}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(investment.InitialValOfInvstmnt)}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(investment.PeakBalanceDuringPeriod)}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(investment.ClosingBalance)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              )}

              {/* Insurance Tab */}
              {hasForeignCashValueInsurance && (
                <TabsContent value="insurance">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Institution</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Contract Date</TableHead>
                        <TableHead className="text-right">Cash Value</TableHead>
                        <TableHead className="text-right">Gross Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleFA.DtlsForeignCashValueInsurance?.map((insurance, index) => (
                        <TableRow key={index}>
                          <TableCell>{insurance.FinancialInstName}</TableCell>
                          <TableCell>{insurance.CountryName}</TableCell>
                          <TableCell>{formatDate(insurance.ContractDate)}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(insurance.CashValOrSurrenderVal)}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(insurance.TotGrossAmtPaidCredited)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              )}

              {/* Add other tabs for remaining asset types (simplified for brevity) */}
              {/* Financial Interests, Immovable Property, Other Assets, etc. */}
              {hasFinancialInterests && (
                <TabsContent value="financial-interests">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Entity Name</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Nature of Interest</TableHead>
                        <TableHead className="text-right">Total Investment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleFA.DetailsFinancialInterest?.map((interest, index) => (
                        <TableRow key={index}>
                          <TableCell>{interest.NameOfEntity}</TableCell>
                          <TableCell>{interest.CountryName}</TableCell>
                          <TableCell>{interest.NatureOfInt}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(interest.TotalInvestment)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              )}

              {/* Immovable Property Tab */}
              {hasImmovableProperty && (
                <TabsContent value="immovable-property">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Address</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Acquisition Date</TableHead>
                        <TableHead className="text-right">Total Investment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleFA.DetailsImmovableProperty?.map((property, index) => (
                        <TableRow key={index}>
                          <TableCell>{property.AddressOfProperty}</TableCell>
                          <TableCell>{property.CountryName}</TableCell>
                          <TableCell>{formatDate(property.DateOfAcq)}</TableCell>
                          <TableCell className="text-right">{formatCurrencyINR(property.TotalInvestment)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <Alert variant="default" className="bg-amber-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Foreign Assets Reported</AlertTitle>
              <AlertDescription>
                No foreign assets information found in this return.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Foreign Source Income Section */}
      <Card>
        <CardHeader>
          <CardTitle>Foreign Source Income</CardTitle>
        </CardHeader>
        <CardContent>
          {hasForeignSourceIncome ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>Tax ID Number</TableHead>
                  <TableHead className="text-right">Income From Salary</TableHead>
                  <TableHead className="text-right">Income From House Property</TableHead>
                  <TableHead className="text-right">Capital Gains</TableHead>
                  <TableHead className="text-right">Other Sources</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Tax Paid Outside</TableHead>
                  <TableHead className="text-right">Tax Relief</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleFSI.ScheduleFSIDtls?.map((income, index) => (
                  <TableRow key={index}>
                    <TableCell>{income.CountryName}</TableCell>
                    <TableCell>{income.TaxIdentificationNo}</TableCell>
                    <TableCell className="text-right">{formatCurrencyINR(income.IncFromSal?.IncFrmOutsideInd || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrencyINR(income.IncFromHP?.IncFrmOutsideInd || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrencyINR(income.IncCapGain?.IncFrmOutsideInd || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrencyINR(income.IncOthSrc?.IncFrmOutsideInd || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrencyINR(income.TotalCountryWise?.IncFrmOutsideInd || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrencyINR(income.TotalCountryWise?.TaxPaidOutsideInd || 0)}</TableCell>
                    <TableCell className="text-right">{formatCurrencyINR(income.TotalCountryWise?.TaxReliefinInd || 0)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Alert variant="default" className="bg-amber-50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Foreign Source Income Reported</AlertTitle>
              <AlertDescription>
                No foreign source income information found in this return.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateString;
  }
};

const getNatureOfAmountLabel = (code?: string): string => {
  const labels: Record<string, string> = {
    'I': 'Interest',
    'D': 'Dividend',
    'S': 'Proceeds from Sale/Redemption',
    'O': 'Other Income',
    'N': 'No Amount Paid/Credited'
  };
  
  return code ? (labels[code] || code) : '';
}; 