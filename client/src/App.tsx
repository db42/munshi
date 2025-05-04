import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import DocumentPortal from './pages/DocumentsPortal';
import DocumentDetail from './pages/DocumentDetail';
import Review from './pages/Review';
import { AssessmentYearProvider } from './context/AssessmentYearContext';
import ItrDiffViewer from './components/ItrDiffViewer';
import { ITRViewer } from './pages/ITRViewer';

// Simple placeholder components
const Dashboard = () => <div>Dashboard Content</div>;

function App() {
  return (
    <AssessmentYearProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentPortal />} />
            <Route path="/documents/:documentId" element={<DocumentDetail />} />
            <Route 
                path="/itr-generation"
                element={<ITRViewer />}
            />
            <Route path="/review" element={<Review />} />
            <Route path="/diff-viewer" element={<ItrDiffViewer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AssessmentYearProvider>
  );
}

export default App;