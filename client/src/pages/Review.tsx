import React, { useState, useEffect } from 'react';
import { useAssessmentYear } from '../context/AssessmentYearContext';
import { getITRByUserAndYear } from '../api/itr';
import { useUser } from '../context/UserContext';
import { Itr } from '../types/itr';
import JsonDataViewer from '@/components/documents/JsonDataViewer';
import { AlertCircle, Loader, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Review = () => {
  const [itrData, setItrData] = useState<Itr | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { assessmentYear } = useAssessmentYear();
  const { currentUser } = useUser();

  useEffect(() => {
    const fetchITRData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        
        const data = await getITRByUserAndYear(currentUser.id, assessmentYear);
        setItrData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch ITR data');
        console.error('Failed to fetch ITR data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchITRData();
  }, [assessmentYear, currentUser]);

  const handleDownload = () => {
    if (!itrData) return;
    
    const jsonString = JSON.stringify(itrData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ITR-${assessmentYear}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ITR Review</h1>
        <p className="text-gray-600">
          Review your Income Tax Return (ITR) data for assessment year {assessmentYear}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-600">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* ITR Data */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between py-4 bg-gray-50">
          <CardTitle>Income Tax Return Details</CardTitle>
          {itrData && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Download className="h-4 w-4" />
              Download JSON
            </button>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="ml-2 text-gray-600">Loading ITR data...</span>
            </div>
          ) : itrData ? (
            <JsonDataViewer data={itrData} title="ITR Data" />
          ) : (
            <div className="py-20 text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-700 font-medium">No ITR data available</p>
              <p className="text-gray-500 text-sm mt-1">
                ITR data for assessment year {assessmentYear} could not be found.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Review; 