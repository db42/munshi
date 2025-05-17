import React from 'react';
import { ITRViewerStepConfig } from '../types';
import { Itr } from '../../../types/itr';

interface StepProps {
  itrData: Itr;
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