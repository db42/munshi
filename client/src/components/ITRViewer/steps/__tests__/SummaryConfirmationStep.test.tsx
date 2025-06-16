import { render, screen, within } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { SummaryConfirmationStep } from '../SummaryConfirmationStep';
import itrData from '../../../../fixtures/itr-1-old-regime.json';
import type { ITRViewerStepConfig } from '../../types';
import type { Itr1 } from '../../../../types/itr-1';

// Mock config for the step
const mockConfig: ITRViewerStepConfig = {
  id: 'summary-confirmation',
  title: 'Summary & Confirmation',
};

describe('SummaryConfirmationStep', () => {
    test('renders summary and confirmation details correctly from ITR-1 data', async () => {
        render(<SummaryConfirmationStep itrData={itrData.itr.ITR.ITR1 as Itr1} config={mockConfig} />);

        // 1. Check for Assessee Name and PAN in the header
        expect(await screen.findByText('Prepared for John Doe')).toBeInTheDocument();
        expect(screen.getByText('ABCDE1234F')).toBeInTheDocument();

        // 2. Check key financial figures in the table
        const gtiCell = await screen.findByText('Gross Total Income');
        const gtiRow = gtiCell.closest('tr');
        expect(within(gtiRow!).getByText('₹7,87,673.00')).toBeInTheDocument();

        const dedCell = screen.getByText('Total Deductions (Chapter VI-A)');
        const dedRow = dedCell.closest('tr');
        expect(within(dedRow!).getByText('-₹2,05,000.00')).toBeInTheDocument();

        const tiCell = screen.getByText('Total Income');
        const tiRow = tiCell.closest('tr');
        expect(within(tiRow!).getByText('₹5,82,673.00')).toBeInTheDocument();

        const tlCell = screen.getByText('Total Tax Liability');
        const tlRow = tlCell.closest('tr');
        expect(within(tlRow!).getByText('₹30,196.00')).toBeInTheDocument();
        
        // 3. Check for the "No Dues or Refund" message
        expect(await screen.findByText('No Dues or Refund')).toBeInTheDocument();

        // 4. Check final confirmation
        const confirmationCheckbox = screen.getByLabelText(/I, John Doe, agree to the terms and conditions./i);
        expect(confirmationCheckbox).toBeInTheDocument();
    });
});
