import React from 'react';
import { ITRData, ITRViewerStepConfig } from '../types';

interface StepProps {
  itrData: ITRData;
  config: ITRViewerStepConfig;
}

export const ForeignAssetsIncomeStep: React.FC<StepProps> = ({ itrData, config }) => {
  // TODO: Extract and display relevant data from itrData (Schedule FA)
  console.log('Rendering ForeignAssetsIncomeStep with data:', itrData, 'and config:', config);

  return (
    <div>
      <h3>{config.title}</h3>
      <p>Placeholder content for Foreign Assets & Income.</p>
      {/* Render actual fields/tables using itrData here later */}
    </div>
  );
}; 