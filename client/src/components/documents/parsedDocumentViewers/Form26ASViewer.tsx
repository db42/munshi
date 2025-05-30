import React from 'react';
import { Form26ASData } from '../../../types/parsedDocuments';
import JsonDataViewer from '../JsonDataViewer';

interface Form26ASViewerProps {
  data: Form26ASData;
}

/**
 * A viewer for Form 26AS documents.
 * For now, it uses the generic JsonDataViewer.
 * TODO: Enhance this viewer to display Form 26AS data in a more structured and user-friendly way.
 */
const Form26ASViewer: React.FC<Form26ASViewerProps> = ({ data }) => {
  return (
    <JsonDataViewer 
      data={data} 
      title="Form 26AS Data (Raw JSON)" 
    />
  );
};

export default Form26ASViewer; 