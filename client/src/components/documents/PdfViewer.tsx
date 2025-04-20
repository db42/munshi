import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


interface PdfViewerProps {
  fileUrl: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => Math.min(Math.max(prevPageNumber + offset, 1), numPages || 1));
  };

  const zoomIn = () => setScale(prevScale => Math.min(prevScale + 0.2, 2.0));
  const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.2, 0.6));

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex items-center space-x-4">
        <button 
          onClick={() => changePage(-1)} 
          disabled={pageNumber <= 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pageNumber} of {numPages || '--'}
        </span>
        <button 
          onClick={() => changePage(1)} 
          disabled={pageNumber >= (numPages || 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
        <button onClick={zoomOut} className="px-3 py-1 bg-gray-200 rounded">-</button>
        <span>{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn} className="px-3 py-1 bg-gray-200 rounded">+</button>
      </div>

      <div className="border rounded shadow-sm overflow-auto" style={{ maxHeight: '70vh' }}>
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="p-4 text-center">Loading PDF...</div>}
          error={<div className="p-4 text-center text-red-500">Failed to load PDF</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer; 