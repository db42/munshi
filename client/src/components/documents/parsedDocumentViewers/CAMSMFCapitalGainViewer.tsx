import React from 'react';
import { CAMSMFCapitalGainData } from '../../../types/parsedDocuments';
import { formatDate, formatCurrency } from '../../../utils/formatters';

interface CAMSMFCapitalGainViewerProps {
  data: CAMSMFCapitalGainData;
}

const CAMSMFCapitalGainViewer: React.FC<CAMSMFCapitalGainViewerProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">CAMS Mutual Fund Capital Gain Statement</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Statement Period</p>
            <p className="font-medium">
              {/* Assuming formatDate can handle string or convert: new Date(...) */} 
              {formatDate(new Date(data.statementPeriod.fromDate))} to {formatDate(new Date(data.statementPeriod.toDate))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Investor</p>
            <p className="font-medium">{data.investorDetails.name || 'N/A'}</p> 
            {data.investorDetails.pan && <p className="text-sm">PAN: {data.investorDetails.pan}</p>}
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-medium mb-2">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-4 text-center">
          {/* Equity */}
          <div className="p-2 bg-green-50 rounded">
            <p className="text-xs text-gray-600">Equity STCG</p>
            <p className={`text-md font-semibold ${data.summary.equityStcg >= 0 ? 'text-green-700' : 'text-red-600'}`}>
              {formatCurrency(data.summary.equityStcg)}
            </p>
          </div>
          <div className="p-2 bg-blue-50 rounded">
            <p className="text-xs text-gray-600">Equity LTCG</p>
            <p className={`text-md font-semibold ${data.summary.equityLtcg >= 0 ? 'text-blue-700' : 'text-red-600'}`}>
              {formatCurrency(data.summary.equityLtcg)}
            </p>
          </div>
          {/* Debt */}
          <div className="p-2 bg-yellow-50 rounded">
            <p className="text-xs text-gray-600">Debt STCG</p>
            <p className={`text-md font-semibold ${data.summary.debtStcg >= 0 ? 'text-yellow-700' : 'text-red-600'}`}>
              {formatCurrency(data.summary.debtStcg)}
            </p>
          </div>
          <div className="p-2 bg-orange-50 rounded">
            <p className="text-xs text-gray-600">Debt LTCG</p>
            <p className={`text-md font-semibold ${data.summary.debtLtcg >= 0 ? 'text-orange-700' : 'text-red-600'}`}>
              {formatCurrency(data.summary.debtLtcg)}
            </p>
          </div>
          {/* Total */}
          <div className="p-2 bg-gray-100 rounded col-span-2 md:col-span-1">
            <p className="text-xs text-gray-600">Total Gain/Loss</p>
            <p className={`text-md font-semibold ${data.summary.totalGainLoss >= 0 ? 'text-black' : 'text-red-600'}`}>
              {formatCurrency(data.summary.totalGainLoss)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Transactions Table */}
      <div>
        <h3 className="text-md font-medium mb-2">Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund Name</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Folio</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Date</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy Value</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Value</th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.transactions.map((transaction, index) => (
                <tr key={index} className={transaction.capitalGainType === 'STCG' ? 'bg-green-50' : 'bg-blue-50'}>
                  <td className="px-3 py-2 text-xs">{transaction.fundName}</td>
                  <td className="px-3 py-2 text-xs">{transaction.folioNo}</td>
                  <td className="px-3 py-2 text-xs">{formatDate(transaction.saleDate)}</td>
                  <td className="px-3 py-2 text-xs">{transaction.units.toFixed(3)}</td>
                  <td className="px-3 py-2 text-xs">{formatCurrency(transaction.acquisitionValue)}</td>
                  <td className="px-3 py-2 text-xs">{formatCurrency(transaction.saleValue)}</td>
                  <td className={`px-3 py-2 text-xs text-right font-medium ${transaction.gainOrLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(transaction.gainOrLoss)}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      transaction.capitalGainType === 'STCG' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transaction.capitalGainType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CAMSMFCapitalGainViewer; 