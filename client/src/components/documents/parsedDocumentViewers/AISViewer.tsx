import React from 'react';
import { AISData } from '../../../types/parsedDocuments';
import JsonDataViewer from '../JsonDataViewer';

interface AISViewerProps {
  data: AISData;
}

/**
 * A specialized viewer for Annual Information Statement (AIS) documents
 */
const AISViewer: React.FC<AISViewerProps> = ({ data }) => {
  // Extract key information from the AIS data
  const { taxpayerInfo, assessmentYear, financialYear, tdsDetails, sftDetails, taxPaymentDetails, demandRefundDetails } = data;

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-blue-800 font-medium mb-2">Annual Information Statement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <p className="text-sm text-gray-600">Taxpayer: <span className="font-medium text-gray-800">{taxpayerInfo.name}</span></p>
            <p className="text-sm text-gray-600">PAN: <span className="font-medium text-gray-800">{taxpayerInfo.pan}</span></p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Assessment Year: <span className="font-medium text-gray-800">{assessmentYear}</span></p>
            <p className="text-sm text-gray-600">Financial Year: <span className="font-medium text-gray-800">{financialYear}</span></p>
          </div>
        </div>
      </div>

      {/* TDS Section */}
      {tdsDetails && tdsDetails.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="font-medium">TDS Information</h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductor</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Deducted (₹)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tdsDetails.map((tds, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{tds.deductorCollectorName}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{tds.amountPaidCredited.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{tds.taxDeductedCollected.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SFT Section */}
      {sftDetails && sftDetails.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="font-medium">Specified Financial Transactions</h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporting Entity</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sftDetails.map((sft, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{sft.description}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{sft.reportingEntityName}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{sft.transactionValue.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tax Payments Section */}
      {taxPaymentDetails && taxPaymentDetails.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h3 className="font-medium">Tax Payments</h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taxPaymentDetails.map((payment, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{payment.type}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{payment.dateOfDeposit}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{payment.amount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Advanced View */}
      <JsonDataViewer 
        data={data} 
        title="Complete AIS Data"
      />
    </div>
  );
};

export default AISViewer; 