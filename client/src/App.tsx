import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import DocumentPortal from './pages/DocumentsPortal';
import DocumentDetail from './pages/DocumentDetail';

// Simple placeholder components
const Dashboard = () => <div>Dashboard Content</div>;
const Documents = () => <div>Documents Content</div>;
const ITRGeneration = () => <div>ITR Generation Content</div>;
const Review = () => <div>Review Content</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/documents" element={<DocumentPortal />} />
          <Route path="/documents/:documentId" element={<DocumentDetail />} />
          <Route path="/itr-generation/*" element={<ITRGeneration />} />
          <Route path="/review" element={<Review />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;