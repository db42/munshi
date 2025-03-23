import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Trash2, Eye, AlertCircle, Loader, Play } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Card, CardContent } from '../components/ui/card';
import { getDocumentsByUserAndYear, uploadDocument, processDocument, deleteDocument } from '../api/documents';
import { Document, DocumentState, DocumentType } from '../types/document';
import { formatApiError } from '../utils/api-helpers';
import { DEFAULT_USER_ID } from '../api/config';
import { Link } from 'react-router-dom';
import { useAssessmentYear } from '../context/AssessmentYearContext';

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

const DocumentPortal = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const { assessmentYear } = useAssessmentYear();
  
  // Upload state
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | ''>('');
  
  // Delete state
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  
  // Process state
  const [processing, setProcessing] = useState<string | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processSuccess, setProcessSuccess] = useState<boolean>(false);
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents when component mounts
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the assessment year from context
      const fetchedDocuments = await getDocumentsByUserAndYear(DEFAULT_USER_ID, assessmentYear);
      setDocuments(fetchedDocuments);
      
      // Count documents that are not in 'processed' state
      const pending = fetchedDocuments.filter(
        doc => doc.state !== DocumentState.PROCESSED
      ).length;
      setPendingCount(pending);
    } catch (err) {
      setError(formatApiError(err));
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle file selection
  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadFile(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag and drop
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Check if document type is selected
    if (!selectedDocumentType) {
      setUploadError('Please select a document type before uploading.');
      return;
    }
    
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadFile(file);
  };

  // Upload file
  const uploadFile = async (file: File) => {
    try {
      // Check if document type is selected
      if (!selectedDocumentType) {
        setUploadError('Please select a document type before uploading.');
        return;
      }

      setUploading(true);
      setUploadError(null);
      setUploadSuccess(false);

      // Upload the document with assessment year from context
      const documentId = await uploadDocument(
        file,
        DEFAULT_USER_ID,
        assessmentYear, // Use assessment year from context
        selectedDocumentType
      );

      // Optionally, process the document automatically
      // await processDocument(documentId);

      setUploadSuccess(true);
      
      // Reset the selected document type
      setSelectedDocumentType('');
      
      // Refresh the document list
      await fetchDocuments();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err) {
      setUploadError(formatApiError(err));
      console.error('Failed to upload document:', err);
    } finally {
      setUploading(false);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        setDeleting(documentId);
        setDeleteError(null);
        setDeleteSuccess(false);
        
        await deleteDocument(documentId);
        
        setDeleteSuccess(true);
        
        // Remove the document from the state
        setDocuments(prevDocuments => 
          prevDocuments.filter(doc => doc.id !== documentId)
        );
        
        // Update pending count
        setPendingCount(prevCount => {
          const deletedDoc = documents.find(doc => doc.id === documentId);
          if (deletedDoc && deletedDoc.state !== 'processed') {
            return prevCount - 1;
          }
          return prevCount;
        });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setDeleteSuccess(false);
        }, 3000);
      } catch (err) {
        setDeleteError(formatApiError(err));
        console.error('Failed to delete document:', err);
      } finally {
        setDeleting(null);
      }
    }
  };

  // Handle document processing
  const handleProcessDocument = async (documentId: string) => {
    try {
      setProcessing(documentId);
      setProcessError(null);
      setProcessSuccess(false);
      
      await processDocument(documentId);
      
      setProcessSuccess(true);
      
      // Update the document state in the UI
      setDocuments(prevDocuments => 
        prevDocuments.map(doc => 
          doc.id === documentId 
            ? { ...doc, state: DocumentState.PROCESSING } 
            : doc
        )
      );
      
      // Refresh the document list to get updated status
      await fetchDocuments();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setProcessSuccess(false);
      }, 3000);
    } catch (err) {
      setProcessError(formatApiError(err));
      console.error('Failed to process document:', err);
    } finally {
      setProcessing(null);
    }
  };

  // Get status display text and color
  const getStatusDisplay = (state: DocumentState) => {
    switch (state) {
      case DocumentState.PROCESSED:
        return { text: 'Processed', className: 'bg-green-100 text-green-800' };
      case DocumentState.PROCESSING:
        return { text: 'Processing', className: 'bg-blue-100 text-blue-800' };
      case DocumentState.FAILED:
        return { text: 'Failed', className: 'bg-red-100 text-red-800' };
      case DocumentState.UPLOADED:
        return { text: 'Uploaded', className: 'bg-yellow-100 text-yellow-800' };
      default:
        return { text: state, className: 'bg-gray-100 text-gray-800' };
    }
  };

  // Get document type options for the dropdown
  const documentTypeOptions = Object.entries(DocumentType).map(([key, value]) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Portal</h1>
        <p className="text-gray-600">Upload and manage your tax-related documents</p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <div 
          className={`border-2 border-dashed ${uploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'} rounded-lg p-8 text-center`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className={`mx-auto h-12 w-12 ${uploading ? 'text-blue-400 animate-pulse' : 'text-gray-400'}`} />
          <div className="mt-4">
            <div className="mb-2 text-sm font-medium text-gray-700">
              Upload documents for assessment year <span className="font-semibold">{assessmentYear}</span>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.csv,.txt"
            />
            
            {/* Document Type Selector */}
            <div className="mb-4">
              <label htmlFor="document-type" className="block text-sm font-medium text-gray-700 mb-1">
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                id="document-type"
                className="w-full max-w-xs mx-auto block px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={selectedDocumentType}
                onChange={(e) => setSelectedDocumentType(e.target.value as DocumentType | '')}
                disabled={uploading}
                required
              >
                <option value="" disabled>Select Document Type</option>
                {documentTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {selectedDocumentType && (
                <p className="mt-2 text-xs text-blue-600">
                  Document will be uploaded as: <span className="font-semibold">{documentTypeOptions.find(opt => opt.value === selectedDocumentType)?.label}</span>
                </p>
              )}
              {!selectedDocumentType && (
                <p className="mt-2 text-xs text-red-600">
                  Please select a document type before uploading
                </p>
              )}
            </div>
            
            <button 
              className={`${uploading ? 'bg-blue-400 cursor-not-allowed' : !selectedDocumentType ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-md`}
              onClick={handleFileSelect}
              disabled={uploading || !selectedDocumentType}
              title={!selectedDocumentType ? "Please select a document type first" : ""}
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </button>
            <p className="mt-2 text-sm text-gray-600">or drag and drop your files here</p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, JPG, PNG, CSV (Max size: 10MB)</p>
        </div>
      </div>

      {/* Upload Error Alert */}
      {uploadError && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {uploadError}
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Success Alert */}
      {uploadSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Document uploaded successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Status Alert */}
      {pendingCount > 0 && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {pendingCount} document{pendingCount !== 1 ? 's' : ''} pending processing
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert for Delete */}
      {deleteSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Document deleted successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert for Delete */}
      {deleteError && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {deleteError}
          </AlertDescription>
        </Alert>
      )}

      {/* Success Alert for Process */}
      {processSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Document processing started successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert for Process */}
      {processError && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {processError}
          </AlertDescription>
        </Alert>
      )}

      {/* Documents List */}
      <Card>
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Documents</h2>
        </div>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading documents...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p>No documents found</p>
              <p className="text-sm mt-1">Upload documents to get started</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {documents.map(doc => {
                const status = getStatusDisplay(doc.state);
                const canProcess = doc.state === DocumentState.UPLOADED; // Only allow processing for uploaded documents
                
                return (
                  <li key={doc.id} className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center">
                      <FileText className="h-6 w-6 text-gray-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{doc.originalFilename}</p>
                        <p className="text-xs text-gray-500">
                          {doc.documentType || 'Unknown'} • {formatFileSize(doc.fileSize)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${status.className}`}>
                        {status.text}
                      </span>
                      
                      {/* Process button - only show for documents in 'uploaded' state */}
                      {canProcess && (
                        <button 
                          className={`text-gray-400 hover:text-blue-500 ${!canProcess ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => handleProcessDocument(doc.id)}
                          disabled={!canProcess || processing === doc.id}
                          title={canProcess ? "Process document" : "Document cannot be processed"}
                        >
                          {processing === doc.id ? (
                            <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                            <Play className="h-5 w-5" />
                          )}
                        </button>
                      )}
                      
                      <Link to={`/documents/${doc.id}`} className="text-gray-400 hover:text-gray-500">
                        <Eye className="h-5 w-5" />
                      </Link>
                      <button 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteDocument(doc.id)}
                        disabled={deleting === doc.id}
                      >
                        {deleting === doc.id ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentPortal;