import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDocumentById, processDocument } from '../api/documents';
import { getParsedDocumentData } from '../api/parsedDocuments';
import { Document, DocumentType, DocumentState } from '../types/document';
import { ParsedDocument } from '../types/parsedDocument';
import DocumentPreviewModal from '../components/documents/DocumentPreviewModal';
import ParsedDocumentViewer from '../components/documents/ParsedDocumentViewer';
import { formatFileSize } from '../utils/formatters';
import { formatApiError } from '../utils/api-helpers';
import { Loader, FileText, AlertCircle, Play, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

const DocumentDetail = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [parsedDocument, setParsedDocument] = useState<ParsedDocument | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  // Process state
  const [processing, setProcessing] = useState<boolean>(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processSuccess, setProcessSuccess] = useState<boolean>(false);

  const fetchData = async () => {
    if (!documentId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch document details
      const documentData = await getDocumentById(documentId);
      setDocument(documentData);
      
      // Fetch parsed data if document is processed
      if (documentData.state === DocumentState.PROCESSED) {
        try {
          const parsedDocument = await getParsedDocumentData(documentId);
          setParsedDocument(parsedDocument);
        } catch (parseErr) {
          console.error('Failed to fetch parsed data:', parseErr);
          // Don't set the main error state, just log it
        }
      }
    } catch (err) {
      setError(formatApiError(err));
      console.error('Failed to fetch document details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [documentId]);

  const handleProcessDocument = async () => {
    if (!documentId) return;
    
    try {
      setProcessing(true);
      setProcessError(null);
      setProcessSuccess(false);
      
      await processDocument(documentId);
      
      setProcessSuccess(true);
      
      // Update the document state in the UI
      if (document) {
        setDocument({
          ...document,
          state: DocumentState.PROCESSING
        });
      }
      
      // Refresh the document data after a short delay to get updated status
      setTimeout(() => {
        fetchData();
      }, 2000);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setProcessSuccess(false);
      }, 3000);
    } catch (err) {
      setProcessError(formatApiError(err));
      console.error('Failed to process document:', err);
    } finally {
      setProcessing(false);
    }
  };

  const getDocumentUrl = () => {
    // This would be the URL to fetch the actual document file
    // You might need to implement an endpoint that serves the file
    return `/api/documents/${documentId}/file`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading document details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
        <Link to="/documents" className="text-blue-500 hover:underline">
          &larr; Back to Documents
        </Link>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Document not found
          </AlertDescription>
        </Alert>
        <Link to="/documents" className="text-blue-500 hover:underline">
          &larr; Back to Documents
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-4">
        <Link to="/documents" className="text-blue-500 hover:underline">
          &larr; Back to Documents
        </Link>
      </div>
      
      {/* Process Success Alert */}
      {processSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Document processing started successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Process Error Alert */}
      {processError && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {processError}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Document Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {document.originalFilename}
            </h1>
            <div className="text-sm text-gray-500 space-y-1">
              <p>Type: {document.documentType || 'Unknown'}</p>
              <p>Size: {formatFileSize(document.fileSize)}</p>
              <p>Uploaded: {new Date(document.createdAt).toLocaleString()}</p>
              <p>Status: <span className={`px-2 py-1 text-xs rounded-full ${
                document.state === DocumentState.PROCESSED 
                  ? 'bg-green-100 text-green-800' 
                  : document.state === DocumentState.FAILED
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>{document.state}</span></p>
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            View Document
          </button>
        </div>
      </div>
      
      {/* Document Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {document.state !== DocumentState.PROCESSED && !parsedDocument ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Not Yet Processed</h3>
            <p className="text-gray-600 mb-4">
              This document is currently in '{document.state}' state and hasn't been fully processed yet.
            </p>
            {document.state === DocumentState.UPLOADED && (
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center mx-auto"
                onClick={handleProcessDocument}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Process Document
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Processed Document Data</h3>
              {(document.state === DocumentState.PROCESSED || document.state === DocumentState.FAILED) && (
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                  onClick={handleProcessDocument}
                  disabled={processing}
                  title="Reprocess document"
                >
                  {processing ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Reprocessing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reprocess Document
                    </>
                  )}
                </button>
              )}
            </div>
            <ParsedDocumentViewer 
              parsedData={parsedDocument?.parsed_data.data} 
              documentType={document.documentType || DocumentType.OTHER} 
            />
          </>
        )}
      </div>
      
      {/* Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        documentUrl={getDocumentUrl()}
        documentType={document.mimeType}
        documentName={document.originalFilename}
      />
    </div>
  );
};

export default DocumentDetail; 