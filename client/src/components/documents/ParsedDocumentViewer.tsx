import React from 'react';
import { DocumentType } from '../../types/document';
import JsonDataViewer from './JsonDataViewer';
import { 
  ParsedDocumentData, 
  USEquityStatementData,
  USEquityCGStatementData,
  USInvestmentIncomeData,
  getParsedDataType 
} from '../../types/parsedDocuments';
import USEquityStatementViewer from './parsedDocumentViewers/USEquityStatementViewer';
import USEquityCGStatementViewer from './parsedDocumentViewers/USEquityCGStatementViewer';
import GenericDocumentViewer from './parsedDocumentViewers/GenericDocumentViewer';
import USInvestmentIncomeViewer from './parsedDocumentViewers/USInvestmentIncomeViewer';

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
    case DocumentType.US_EQUITY_CG_STATEMENT_CSV:
      return <USEquityCGStatementViewer data={parsedData as USEquityCGStatementData} />;
    
    case DocumentType.US_EQUITY_DIVIDEND_CSV:
      // For dividend data, we can use the existing CG statement viewer 
      // since it already has dividend display capabilities
      return <USInvestmentIncomeViewer data={parsedData as USInvestmentIncomeData} />;
    
    // Add more specialized viewers as they are implemented
    
    default:
      // For document types without a specialized viewer, use the generic viewer
      return <GenericDocumentViewer data={parsedData} documentType={documentType} />;
  }
};

export default ParsedDocumentViewer; 