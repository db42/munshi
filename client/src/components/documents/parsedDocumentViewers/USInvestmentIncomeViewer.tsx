import React from 'react';
import type { USInvestmentIncomeData, DividendIncome } from '../../../types/parsedDocuments';
import { formatCurrency, formatDate } from '../../../utils/formatters';

// Enhance the DividendIncome type with the fields we need
interface EnhancedDividendIncome extends DividendIncome {
  date?: string | Date; // Alternative for paymentDate
}

interface USInvestmentIncomeViewerProps {
  data: USInvestmentIncomeData;
}

const USInvestmentIncomeViewer: React.FC<USInvestmentIncomeViewerProps> = ({ data }) => {
  // Calculate summary statistics
  const totalDividends = data.summary.totalDividends;
  const totalQualifiedDividends = data.summary.totalQualifiedDividends;
  const totalNonQualifiedDividends = data.summary.totalNonQualifiedDividends;
  const totalInterest = data.summary.totalInterestIncome;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Investment Income Statement</h2>
        <p className="text-gray-600">{data.assessmentYear}</p>
      </div>

      {/* Taxpayer & Broker Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Taxpayer Information</h3>
          <p><span className="font-medium">Name:</span> {data.taxpayerName}</p>
          {data.taxpayerPAN && <p><span className="font-medium">PAN:</span> {data.taxpayerPAN}</p>}
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Broker Information</h3>
          <p><span className="font-medium">Name:</span> {data.brokerName}</p>
          <p><span className="font-medium">Account:</span> {data.brokerAccountNumber}</p>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-3">Income Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Dividends</p>
            <p className="text-xl font-bold text-blue-600">{formatCurrency(totalDividends)}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Qualified Dividends</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalQualifiedDividends)}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Interest</p>
            <p className="text-xl font-bold text-purple-600">{formatCurrency(totalInterest)}</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Tax Withheld</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency((data.taxWithheld?.dividendTax || 0) + (data.taxWithheld?.interestTax || 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Income Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                <th className="py-2 px-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="py-2 px-3 border-b text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="py-2 px-3 border-b text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qualified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.dividends.map((income, index) => {
                const enhancedIncome = income as EnhancedDividendIncome;
                return (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-3 text-sm text-gray-900">{formatDate(enhancedIncome.paymentDate || enhancedIncome.date || new Date())}</td>
                    <td className="py-2 px-3 text-sm font-medium text-gray-900">{enhancedIncome.symbol || '-'}</td>
                    <td className="py-2 px-3 text-sm text-gray-900">{enhancedIncome.securityName || '-'}</td>
                    <td className="py-2 px-3 text-sm text-gray-900">
                      {enhancedIncome.isInterest ? 'Interest' : 
                      enhancedIncome.incomeType ? enhancedIncome.incomeType : 'Dividend'}
                    </td>
                    <td className="py-2 px-3 text-sm text-right text-gray-900 font-medium">{formatCurrency(enhancedIncome.grossAmount)}</td>
                    <td className="py-2 px-3 text-center">
                      {enhancedIncome.isInterest ? (
                        <span className="text-gray-400">N/A</span>
                      ) : enhancedIncome.isQualifiedDividend ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Yes</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">No</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source Information */}
      <div className="text-xs text-gray-500 mt-6 pt-4 border-t">
        <p>Source: {data.sourceFileType}</p>
        <p>Parser Version: {data.parserVersion}</p>
      </div>
    </div>
  );
};

export default USInvestmentIncomeViewer; 