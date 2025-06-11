import React from 'react';
import { X } from 'lucide-react';
import PdfViewer from './PdfViewer';
import TextViewer from './TextViewer';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentType: string;
  documentName: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentType,
  documentName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{documentName}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {documentType === 'application/pdf' ? (
            <PdfViewer fileUrl={documentUrl} />
          ) : (
            <TextViewer fileUrl={documentUrl} />
          )}
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <a 
            href={documentUrl} 
            download={documentName}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
          >
            Download
          </a>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal; 