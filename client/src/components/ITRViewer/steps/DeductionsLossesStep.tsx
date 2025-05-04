import React from 'react';
import { ITRData, ITRViewerStepConfig } from '../types';

interface StepProps {
  itrData: ITRData;
  config: ITRViewerStepConfig;
}

export const DeductionsLossesStep: React.FC<StepProps> = ({ itrData, config }) => {
  // TODO: Extract and display relevant data from itrData (Schedules VIA, CYLA, BFLA, CFL)
  console.log('Rendering DeductionsLossesStep with data:', itrData, 'and config:', config);

  return (
    <div>
      <h3>{config.title}</h3>
      <p>Placeholder content for Deductions & Losses.</p>
      {/* Render actual fields/tables using itrData here later */}
    </div>
  );
}; 