import React from 'react';
import { DocumentType } from '../../types/document';
import JsonDataViewer from './JsonDataViewer';
import { 
  ParsedDocumentData, 
  USEquityStatementData,
  USEquityCGStatementData,
  getParsedDataType 
} from '../../types/parsedDocuments';
import USEquityStatementViewer from './parsedDocumentViewers/USEquityStatementViewer';
import USEquityCGStatementViewer from './parsedDocumentViewers/USEquityCGStatementViewer';
import GenericDocumentViewer from './parsedDocumentViewers/GenericDocumentViewer';

interface ParsedDocumentViewerProps {
  documentType: DocumentType;
  parsedData: ParsedDocumentData;
}

/**
 * Component that selects the appropriate specialized viewer based on document type
 */
const ParsedDocumentViewer: React.FC<ParsedDocumentViewerProps> = ({ 
  documentType, 
  parsedData 
}) => {
  // If no parsed data is available, show a message
  if (!parsedData) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-500 text-center">No parsed data available for this document.</p>
      </div>
    );
  }

  // Select the appropriate viewer based on document type
  switch (documentType) {
    case DocumentType.US_EQUITY_STATEMENT:
      return <USEquityStatementViewer data={parsedData as USEquityStatementData} />;
    
    case DocumentType.US_EQUITY_CG_STATEMENT:
      return <USEquityCGStatementViewer data={parsedData as USEquityCGStatementData} />;
    
    // Add more specialized viewers as they are implemented
    
    default:
      // For document types without a specialized viewer, use the generic viewer
      return <GenericDocumentViewer data={parsedData} documentType={documentType} />;
  }
};

export default ParsedDocumentViewer; 