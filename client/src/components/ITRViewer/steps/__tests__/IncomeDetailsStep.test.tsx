import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect } from 'vitest';
import { IncomeDetailsStep } from '../IncomeDetailsStep';
import itr1Fixture from '@/fixtures/itr-1-old-regime.json';
import { type Itr1 } from '@/types/itr-1';
import { type ITRViewerStepConfig } from '../../types';

// Mock config prop
const mockConfig: ITRViewerStepConfig = {
    id: 'incomeDetails',
    title: 'Income Details',
    isConditional: false,
};

describe('IncomeDetailsStep', () => {
    test('renders income details correctly from ITR-1 fixture data', async () => {
        const itrData = itr1Fixture.itr.ITR.ITR1 as Itr1;
        render(<IncomeDetailsStep itrData={itrData} config={mockConfig} />);

        // 1. Check Gross Total Income in the alert
        // The value is 787673 in the fixture
        const grossIncomeAlert = await screen.findByText(/Gross Total Income: ₹7,87,673\.00/);
        expect(grossIncomeAlert).toBeInTheDocument();

        // 2. Check total salary income
        // The value is 515447 in the fixture
        const salaryCard = await screen.findByText(/Income from Salary\/Pension/);
        expect(salaryCard).toBeInTheDocument();
        // Scope the search to within the card header to find the specific badge
        const salaryHeader = salaryCard.closest('div');
        const salaryBadge = within(salaryHeader!).getByText('₹5,15,447.00');
        expect(salaryBadge).toBeInTheDocument();

        // 3. Switch to "Other Sources" tab and check its total
        const otherSourcesTab = screen.getByRole('tab', { name: /other sources/i });
        await userEvent.click(otherSourcesTab);
        
        // The value is 272226 in the fixture
        const otherSourcesCard = await screen.findByText(/Income from Other Sources/);
        expect(otherSourcesCard).toBeInTheDocument();
        const otherSourcesHeader = otherSourcesCard.closest('div');
        const otherSourcesBadge = within(otherSourcesHeader!).getByText('₹2,72,226.00');
        expect(otherSourcesBadge).toBeInTheDocument();
    });
}); 