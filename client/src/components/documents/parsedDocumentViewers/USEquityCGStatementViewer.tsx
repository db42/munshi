import React, { useEffect } from 'react';
import { USEquityCGStatementData, DividendIncome, USCGEquityTransaction } from '../../../types/parsedDocuments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface USEquityCGStatementViewerProps {
  data: USEquityCGStatementData;
}

const USEquityCGStatementViewer: React.FC<USEquityCGStatementViewerProps> = ({ data }) => {
  // Add debugging to check the data structure
  useEffect(() => {
    console.log('USEquityCGStatementData:', data);
    console.log('Transactions:', data.transactions);
    console.log('Capital Gains:', data.capitalGains);
  }, [data]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return 'N/A';
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate holding period in days
  const calculateHoldingPeriod = (buyDate: string | Date | undefined, sellDate: string | Date | undefined): string => {
    if (!buyDate || !sellDate) return 'N/A';
    
    const buy = typeof buyDate === 'string' ? new Date(buyDate) : buyDate;
    const sell = typeof sellDate === 'string' ? new Date(sellDate) : sellDate;
    
    const diffTime = Math.abs(sell.getTime() - buy.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days`;
  };

  // Calculate if a transaction is long term (> 365 days)
  const isLongTerm = (buyDate: string | Date | undefined, sellDate: string | Date | undefined): boolean => {
    if (!buyDate || !sellDate) return false;
    
    const buy = typeof buyDate === 'string' ? new Date(buyDate) : buyDate;
    const sell = typeof sellDate === 'string' ? new Date(sellDate) : sellDate;
    
    const diffTime = Math.abs(sell.getTime() - buy.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 365;
  };

  // Calculate capital gains summary
  const calculateCapitalGainsSummary = () => {
    // Add debugging
    console.log('Using pre-computed capital gains data...');
    console.log('Capital Gains data:', data.capitalGains);
    
    // Check if capital gains data exists
    if (!data.capitalGains) {
      console.log('No capital gains data found');
      return {
        shortTerm: {
          proceeds: 0,
          costBasis: 0,
          fees: 0,
          gain: 0,
          foreignTaxPaid: 0
        },
        longTerm: {
          proceeds: 0,
          costBasis: 0,
          fees: 0,
          gain: 0,
          foreignTaxPaid: 0
        },
        total: {
          gain: 0,
          foreignTaxPaid: 0
        }
      };
    }
    
    // Use the pre-computed values directly
    const shortTerm = data.capitalGains.shortTerm || {
      totalProceeds: 0,
      totalCostBasis: 0,
      totalGain: 0,
      totalForeignTaxPaid: 0
    };
    
    const longTerm = data.capitalGains.longTerm || {
      totalProceeds: 0,
      totalCostBasis: 0,
      totalGain: 0,
      totalForeignTaxPaid: 0
    };
    
    // Calculate total gain and foreign tax paid
    const totalGain = (shortTerm.totalGain || 0) + (longTerm.totalGain || 0);
    const totalForeignTaxPaid = (shortTerm.totalForeignTaxPaid || 0) + (longTerm.totalForeignTaxPaid || 0);
    
    console.log('Using pre-computed values:', {
      shortTerm,
      longTerm,
      totalGain,
      totalForeignTaxPaid
    });
    
    return {
      shortTerm: {
        proceeds: shortTerm.totalProceeds || 0,
        costBasis: shortTerm.totalCostBasis || 0,
        // Fees are included in cost basis in the pre-computed data
        fees: 0,
        gain: shortTerm.totalGain || 0,
        foreignTaxPaid: shortTerm.totalForeignTaxPaid || 0
      },
      longTerm: {
        proceeds: longTerm.totalProceeds || 0,
        costBasis: longTerm.totalCostBasis || 0,
        // Fees are included in cost basis in the pre-computed data
        fees: 0,
        gain: longTerm.totalGain || 0,
        foreignTaxPaid: longTerm.totalForeignTaxPaid || 0
      },
      total: {
        gain: totalGain,
        foreignTaxPaid: totalForeignTaxPaid
      }
    };
  };

  // Calculate dividend summary
  const calculateDividendSummary = () => {
    const totalGross = data.dividends.reduce((sum, d) => sum + d.grossAmount, 0);
    const totalTaxWithheld = data.dividends.reduce((sum, d) => sum + d.taxWithheld, 0);
    const totalNet = data.dividends.reduce((sum, d) => sum + d.netAmount, 0);
    
    // In a real app, we would have logic to determine qualified vs ordinary dividends
    // For this example, we'll assume 70% qualified, 30% ordinary
    const qualifiedDividends = totalGross * 0.7;
    const ordinaryDividends = totalGross * 0.3;
    
    return {
      totalGross,
      totalTaxWithheld,
      totalNet,
      qualifiedDividends,
      ordinaryDividends
    };
  };

  const capitalGainsSummary = calculateCapitalGainsSummary();
  const dividendSummary = calculateDividendSummary();

  return (
    <div className="space-y-8">
      {/* 1. Header Section */}
      <Card>
        <CardHeader>
          <CardTitle>US Equity Capital Gains Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Account Information</h3>
              <p className="text-sm">Broker: <span className="font-medium">{data.brokerName}</span></p>
              <p className="text-sm">Account: <span className="font-medium">{data.brokerAccountNumber}</span></p>
              <p className="text-sm">Period: <span className="font-medium">{formatDate(data.statementPeriod.startDate)} - {formatDate(data.statementPeriod.endDate)}</span></p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Taxpayer Information</h3>
              <p className="text-sm">Name: <span className="font-medium">{data.taxpayerName}</span></p>
              <p className="text-sm">PAN: <span className="font-medium">{data.taxpayerPAN}</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Capital Gain Details */}
      <Card>
        <CardHeader>
          <CardTitle>Capital Gain Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Short-Term Capital Gains */}
            <div>
              <h3 className="text-sm font-medium mb-3">Short-Term Capital Gains</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total proceeds:</span>
                  <span className="text-sm font-medium">{formatCurrency(capitalGainsSummary.shortTerm.proceeds)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total cost basis:</span>
                  <span className="text-sm font-medium">{formatCurrency(capitalGainsSummary.shortTerm.costBasis)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total fees/commissions:</span>
                  <span className="text-sm font-medium">{formatCurrency(capitalGainsSummary.shortTerm.fees)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Net short-term gain/loss:</span>
                  <span className={`text-sm font-medium ${capitalGainsSummary.shortTerm.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(capitalGainsSummary.shortTerm.gain)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Foreign tax paid:</span>
                  <span className="text-sm font-medium">{formatCurrency(capitalGainsSummary.shortTerm.foreignTaxPaid)}</span>
                </div>
              </div>
            </div>

            {/* Long-Term Capital Gains */}
            <div>
              <h3 className="text-sm font-medium mb-3">Long-Term Capital Gains</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total proceeds:</span>
                  <span className="text-sm font-medium">{formatCurrency(capitalGainsSummary.longTerm.proceeds)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total cost basis:</span>
                  <span className="text-sm font-medium">{formatCurrency(capitalGainsSummary.longTerm.costBasis)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total fees/commissions:</span>
                  <span className="text-sm font-medium">{formatCurrency(capitalGainsSummary.longTerm.fees)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Net long-term gain/loss:</span>
                  <span className={`text-sm font-medium ${capitalGainsSummary.longTerm.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(capitalGainsSummary.longTerm.gain)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Foreign tax paid:</span>
                  <span className="text-sm font-medium">{formatCurrency(capitalGainsSummary.longTerm.foreignTaxPaid)}</span>
                </div>
              </div>
            </div>

            {/* Combined Capital Gains */}
            <div>
              <h3 className="text-sm font-medium mb-3">Combined Capital Gains</h3>
              <div className="space-y-2">
                <div className="flex justify-between pt-2">
                  <span className="text-sm font-medium">Total capital gain/loss:</span>
                  <span className={`text-sm font-medium ${capitalGainsSummary.total.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(capitalGainsSummary.total.gain)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total foreign tax paid:</span>
                  <span className="text-sm font-medium">{formatCurrency(capitalGainsSummary.total.foreignTaxPaid)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Capital Gains Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Capital Gains Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Security</TableHead>
                  <TableHead>Acquisition Date</TableHead>
                  <TableHead>Sell Date</TableHead>
                  <TableHead>Holding Period</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Cost Basis</TableHead>
                  <TableHead className="text-right">Proceeds</TableHead>
                  <TableHead className="text-right">Fees</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.transactions.map((transaction, index) => {
                    const gain = transaction.totalProceeds - transaction.totalCost - transaction.feesBrokerage;
                    const longTerm = isLongTerm(transaction.acquisitionDate, transaction.sellDate);
                    
                    return (
                      <TableRow key={transaction.transactionId || index}>
                        <TableCell>
                          <div className="font-medium">{transaction.symbol}</div>
                          <div className="text-xs text-gray-500">{transaction.securityName}</div>
                        </TableCell>
                        <TableCell>{formatDate(transaction.acquisitionDate)}</TableCell>
                        <TableCell>{formatDate(transaction.sellDate)}</TableCell>
                        <TableCell>{calculateHoldingPeriod(transaction.acquisitionDate, transaction.sellDate)}</TableCell>
                        <TableCell className="text-right">{transaction.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(transaction.totalCost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(transaction.totalProceeds)}</TableCell>
                        <TableCell className="text-right text-red-600">{formatCurrency(transaction.feesBrokerage)}</TableCell>
                        <TableCell className={`text-right ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(gain)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 text-xs rounded-full ${longTerm ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {longTerm ? 'Long-term' : 'Short-term'}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Dividend Income Details */}
      <Card>
        <CardHeader>
          <CardTitle>Dividend Income Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Dividend Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total gross dividends:</span>
                  <span className="text-sm font-medium">{formatCurrency(dividendSummary.totalGross)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total tax withheld:</span>
                  <span className="text-sm font-medium text-red-600">{formatCurrency(dividendSummary.totalTaxWithheld)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Total net dividends:</span>
                  <span className="text-sm font-medium text-green-600">{formatCurrency(dividendSummary.totalNet)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3">Dividend Classification</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Qualified dividends:</span>
                  <span className="text-sm font-medium">{formatCurrency(dividendSummary.qualifiedDividends)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Ordinary dividends:</span>
                  <span className="text-sm font-medium">{formatCurrency(dividendSummary.ordinaryDividends)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Dividend Income Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dividend Income Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Security</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead className="text-right">Gross Amount</TableHead>
                  <TableHead className="text-right">Tax Withheld</TableHead>
                  <TableHead className="text-right">Net Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.dividends.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No dividend payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.dividends.map((dividend, index) => (
                    <TableRow key={`${dividend.symbol}-${dividend.paymentDate}-${index}`}>
                      <TableCell>
                        <div className="font-medium">{dividend.symbol}</div>
                        <div className="text-xs text-gray-500">{dividend.securityName}</div>
                      </TableCell>
                      <TableCell>{formatDate(dividend.paymentDate)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(dividend.grossAmount)}</TableCell>
                      <TableCell className="text-right text-red-600">{formatCurrency(dividend.taxWithheld)}</TableCell>
                      <TableCell className="text-right text-green-600">{formatCurrency(dividend.netAmount)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 6. Tax Withholding Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Withholding Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md mx-auto">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Dividend tax withheld:</span>
                <span className="text-sm font-medium">{formatCurrency(data.taxWithheld.dividendTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Capital gains tax withheld:</span>
                <span className="text-sm font-medium">{formatCurrency(data.taxWithheld.capitalGainsTax)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm font-medium">Total tax withheld:</span>
                <span className="text-sm font-medium">{formatCurrency(data.taxWithheld.dividendTax + data.taxWithheld.capitalGainsTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Foreign tax credits:</span>
                <span className="text-sm font-medium">{formatCurrency(capitalGainsSummary.total.foreignTaxPaid)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default USEquityCGStatementViewer; 