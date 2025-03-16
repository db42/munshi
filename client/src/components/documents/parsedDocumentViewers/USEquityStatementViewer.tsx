import React, { useState } from 'react';
import { USEquityStatementData, CharlesSchwabRecord } from '../../../types/parsedDocuments';
import { Card, CardHeader, CardContent, CardTitle } from '../../ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../ui/table';
import { Input } from '../../ui/input';

interface USEquityStatementViewerProps {
  data: USEquityStatementData;
}

/**
 * Specialized viewer for US Equity Statements (Charles Schwab)
 */
const USEquityStatementViewer: React.FC<USEquityStatementViewerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'buy' | 'sell' | 'dividend' | 'other'>('all');
  const [sortField, setSortField] = useState<keyof CharlesSchwabRecord>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Format date for display
  const formatDate = (dateStr: Date | string): string => {
    if (!dateStr) return 'N/A';
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString();
  };
  
  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Filter records based on active tab
  const filterRecords = (): CharlesSchwabRecord[] => {
    if (!data || !data.records) return [];
    
    let filtered = [...data.records];
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(record => {
        const action = record.action.toLowerCase();
        switch (activeTab) {
          case 'buy':
            return action.includes('buy');
          case 'sell':
            return action.includes('sell');
          case 'dividend':
            return action.includes('dividend');
          case 'other':
            return !action.includes('buy') && 
                   !action.includes('sell') && 
                   !action.includes('dividend');
          default:
            return true;
        }
      });
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record => 
        record.symbol.toLowerCase().includes(term) ||
        record.description.toLowerCase().includes(term) ||
        record.action.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle date comparison
      if (sortField === 'date') {
        aValue = new Date(aValue as Date | string).getTime();
        bValue = new Date(bValue as Date | string).getTime();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  };
  
  // Handle sort click
  const handleSort = (field: keyof CharlesSchwabRecord) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Get sort indicator
  const getSortIndicator = (field: keyof CharlesSchwabRecord): string => {
    if (field !== sortField) return '';
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  // Calculate summary statistics
  const calculateSummary = () => {
    const records = data?.records || [];
    
    // Initialize summary
    const summary = {
      totalBuy: 0,
      totalSell: 0,
      totalDividends: 0,
      totalFees: 0,
      uniqueSymbols: new Set<string>(),
      symbolCounts: {} as Record<string, number>
    };
    
    // Calculate summary values
    records.forEach(record => {
      const action = record.action.toLowerCase();
      
      // Track unique symbols
      summary.uniqueSymbols.add(record.symbol);
      
      // Count occurrences of each symbol
      if (!summary.symbolCounts[record.symbol]) {
        summary.symbolCounts[record.symbol] = 0;
      }
      summary.symbolCounts[record.symbol]++;
      
      // Track financial totals
      if (action.includes('buy')) {
        summary.totalBuy += Math.abs(record.amount);
      } else if (action.includes('sell')) {
        summary.totalSell += Math.abs(record.amount);
      } else if (action.includes('dividend')) {
        summary.totalDividends += record.amount;
      }
      
      // Track fees
      summary.totalFees += record.feesAndCommissions || 0;
    });
    
    return summary;
  };
  
  const summary = calculateSummary();
  const filteredRecords = filterRecords();
  
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-1">Account: {data.accountNumber}</p>
            <p className="text-sm mb-1">Total Records: {data.records.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Total Buys:</span>
                <span className="font-medium">{summary.totalBuy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Sells:</span>
                <span className="font-medium">{summary.totalSell}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Dividends:</span>
                <span className="font-medium">{summary.totalDividends}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Other Transactions:</span>
                <span className="font-medium">{summary.totalOther}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Total Spent (Buys):</span>
                <span className="font-medium text-red-600">{formatCurrency(summary.totalBuyAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Received (Sells):</span>
                <span className="font-medium text-green-600">{formatCurrency(summary.totalSellAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Dividends:</span>
                <span className="font-medium text-green-600">{formatCurrency(summary.totalDividendAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Fees:</span>
                <span className="font-medium text-red-600">{formatCurrency(summary.totalFees)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Transactions</CardTitle>
          
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3 items-center mt-3">
            <div className="flex-grow">
              <Input
                type="text"
                placeholder="Search by symbol, description, or action..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === 'all' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('buy')}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === 'buy' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === 'sell' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Sell
              </button>
              <button
                onClick={() => setActiveTab('dividend')}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === 'dividend' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Dividends
              </button>
              <button
                onClick={() => setActiveTab('other')}
                className={`px-3 py-1 rounded text-sm ${
                  activeTab === 'other' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Other
              </button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 mt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    Date {getSortIndicator('date')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('action')}
                  >
                    Action {getSortIndicator('action')}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('symbol')}
                  >
                    Symbol {getSortIndicator('symbol')}
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    Quantity {getSortIndicator('quantity')}
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    Price {getSortIndicator('price')}
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('feesAndCommissions')}
                  >
                    Fees {getSortIndicator('feesAndCommissions')}
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    Amount {getSortIndicator('amount')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record, index) => {
                    // Determine color based on action type
                    const actionLower = record.action.toLowerCase();
                    const isBuy = actionLower.includes('buy');
                    const isSell = actionLower.includes('sell');
                    const isDividend = actionLower.includes('dividend');
                    
                    let actionClass = '';
                    if (isBuy) actionClass = 'text-red-600';
                    else if (isSell) actionClass = 'text-green-600';
                    else if (isDividend) actionClass = 'text-blue-600';
                    
                    // Determine amount color
                    const amountClass = record.amount >= 0 ? 'text-green-600' : 'text-red-600';
                    
                    return (
                      <TableRow key={`${record.date}-${record.action}-${record.symbol}-${index}`}>
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell className={actionClass}>{record.action}</TableCell>
                        <TableCell className="font-medium">{record.symbol}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                        <TableCell className="text-right">{record.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(record.price)}</TableCell>
                        <TableCell className="text-right text-red-600">{formatCurrency(record.feesAndCommissions)}</TableCell>
                        <TableCell className={`text-right ${amountClass}`}>{formatCurrency(record.amount)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default USEquityStatementViewer; 