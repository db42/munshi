import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Trash2, Eye, AlertCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { getDocumentsByUser, uploadDocument, processDocument } from '../api/documents';
import { Document, DocumentState, DocumentType } from '../types/document';
import { formatApiError } from '../utils/api-helpers';
import { DEFAULT_USER_ID, DEFAULT_ASSESSMENT_YEAR } from '../api/config';
import { Link } from 'react-router-dom';

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
  
  // Upload state
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  
  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents when component mounts
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedDocuments = await getDocumentsByUser(DEFAULT_USER_ID);
      setDocuments(fetchedDocuments);
      
      // Count documents that are not in 'processed' state
      const pending = fetchedDocuments.filter(
        doc => doc.state !== 'processed'
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
    
    const files = event.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadFile(file);
  };

  // Upload file
  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setUploadError(null);
      setUploadSuccess(false);

      // Upload the document
      const documentId = await uploadDocument(
        file,
        DEFAULT_USER_ID,
        DEFAULT_ASSESSMENT_YEAR
      );

      // Optionally, process the document automatically
      // await processDocument(documentId);

      setUploadSuccess(true);
      
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

  // Get status display text and color
  const getStatusDisplay = (state: DocumentState) => {
    switch (state) {
      case 'processed':
        return { text: 'Processed', className: 'bg-green-100 text-green-800' };
      case 'processing':
        return { text: 'Processing', className: 'bg-blue-100 text-blue-800' };
      case 'failed':
        return { text: 'Failed', className: 'bg-red-100 text-red-800' };
      case 'uploaded':
        return { text: 'Uploaded', className: 'bg-yellow-100 text-yellow-800' };
      default:
        return { text: state, className: 'bg-gray-100 text-gray-800' };
    }
  };

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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.csv,.txt"
            />
            <button 
              className={`${uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-md`}
              onClick={handleFileSelect}
              disabled={uploading}
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

      {/* Documents List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Documents</h2>
        </div>
        
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
                    <Link to={`/documents/${doc.id}`} className="text-gray-400 hover:text-gray-500">
                      <Eye className="h-5 w-5" />
                    </Link>
                    <button className="text-gray-400 hover:text-red-500">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DocumentPortal;