import React from 'react';
import { DocumentType } from '../../../types/document';
import JsonDataViewer from '../JsonDataViewer';
import { GenericParsedData, getParsedDataType } from '../../../types/parsedDocuments';

interface GenericDocumentViewerProps {
  data: GenericParsedData;
  documentType: DocumentType;
}

/**
 * A generic viewer for document types without specialized viewers
 */
const GenericDocumentViewer: React.FC<GenericDocumentViewerProps> = ({ 
  data, 
  documentType 
}) => {
  const dataType = getParsedDataType(documentType, data);
  
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-blue-800 font-medium mb-2">Document Information</h3>
        <p className="text-sm text-blue-700">
          This is a generic viewer for {dataType} documents. 
          A specialized viewer for this document type has not yet been implemented.
        </p>
      </div>
      
      <JsonDataViewer 
        data={data} 
        title={`${dataType} Data`}
      />
    </div>
  );
};

export default GenericDocumentViewer; 