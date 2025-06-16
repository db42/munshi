import { render, screen, within } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { DeductionsStep } from '../DeductionsStep';
import itr1Fixture from '@/fixtures/itr-1-old-regime.json';
import { type Itr1 } from '@/types/itr-1';
import { type ITRViewerStepConfig } from '../../types';

// Mock the context hooks used by the component
vi.mock('../context/EditModeContext', () => ({
    useEditMode: () => ({ isEditMode: false }),
}));

vi.mock('../context/UserInputContext', () => ({
    useUserInput: () => ({ userInput: {} }),
}));

// Mock config prop
const mockConfig: ITRViewerStepConfig = {
    id: 'deductions',
    title: 'Deductions',
    isConditional: false,
};

describe('DeductionsStep', () => {
    test('renders deduction details correctly from ITR-1 fixture data', async () => {
        const itrData = itr1Fixture.itr.ITR.ITR1 as Itr1;
        render(<DeductionsStep itrData={itrData} config={mockConfig} />);

        // Check for the total deductions in the alert, which uses formatAmount
        const totalDeductionsAlert = await screen.findByText(/Total Deductions: ₹2,05,000\.00/);
        expect(totalDeductionsAlert).toBeInTheDocument();

        // Check for specific deduction rows and their amounts
        const row80C = screen.getByRole('row', { name: /80C/i });
        expect(within(row80C).getByText('₹1,50,000.00')).toBeInTheDocument();

        const row80D = screen.getByRole('row', { name: /80D/i });
        expect(within(row80D).getByText('₹5,000.00')).toBeInTheDocument();

        const row80TTB = screen.getByRole('row', { name: /80TTB/i });
        expect(within(row80TTB).getByText('₹50,000.00')).toBeInTheDocument();

        // Check for the total in the table footer
        const totalRow = screen.getByRole('row', { name: /Total Deductions under Chapter VI-A/i });
        expect(within(totalRow).getByText('₹2,05,000.00')).toBeInTheDocument();
    });
});
