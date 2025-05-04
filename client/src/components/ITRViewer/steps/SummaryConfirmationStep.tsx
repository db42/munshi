import React from 'react';
import { ITRData, ITRViewerStepConfig } from '../types';

interface StepProps {
  itrData: ITRData;
  config: ITRViewerStepConfig;
}

export const SummaryConfirmationStep: React.FC<StepProps> = ({ itrData, config }) => {
  // TODO: Extract and display summary data from itrData
  console.log('Rendering SummaryConfirmationStep with data:', itrData, 'and config:', config);

  return (
    <div>
      <h3>{config.title}</h3>
      <p>Placeholder content for Summary & Confirmation.</p>
      {/* Render actual summary fields using itrData here later */}
    </div>
  );
}; 