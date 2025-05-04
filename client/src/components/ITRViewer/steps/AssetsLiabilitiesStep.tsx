import React from 'react';
import { ITRData, ITRViewerStepConfig } from '../types';

interface StepProps {
  itrData: ITRData;
  config: ITRViewerStepConfig;
}

export const AssetsLiabilitiesStep: React.FC<StepProps> = ({ itrData, config }) => {
  // TODO: Extract and display relevant data from itrData (Schedule AL)
  console.log('Rendering AssetsLiabilitiesStep with data:', itrData, 'and config:', config);

  return (
    <div>
      <h3>{config.title}</h3>
      <p>Placeholder content for Assets & Liabilities.</p>
      {/* Render actual fields/tables using itrData here later */}
    </div>
  );
}; 