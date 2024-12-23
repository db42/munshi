import React, { useState } from 'react';
import { Upload, FileText, Trash2, Eye, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DocumentPortal = () => {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Form16.pdf', status: 'processed', type: 'Form 16', size: '1.2 MB' },
    { id: 2, name: 'Investment_Proof.pdf', status: 'processing', type: 'Investment Proof', size: '850 KB' }
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Portal</h1>
        <p className="text-gray-600">Upload and manage your tax-related documents</p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Choose Files
            </button>
            <p className="mt-2 text-sm text-gray-600">or drag and drop your files here</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, JPG, PNG (Max size: 10MB)</p>
        </div>
      </div>

      {/* Status Alert */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          2 documents pending classification
        </AlertDescription>
      </Alert>

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Documents</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {documents.map(doc => (
            <li key={doc.id} className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-gray-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  doc.status === 'processed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status}
                </span>
                <button className="text-gray-400 hover:text-gray-500">
                  <Eye className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DocumentPortal;