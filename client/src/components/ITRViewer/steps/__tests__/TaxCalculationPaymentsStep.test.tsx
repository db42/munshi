import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import { TaxCalculationPaymentsStep } from '../TaxCalculationPaymentsStep';
import itr1Fixture from '@/fixtures/itr-1-old-regime.json';
import { type Itr1 } from '@/types/itr-1';
import { type ITRViewerStepConfig } from '../../types';

// Mock the context hooks used by the component and its children
vi.mock('../context/EditModeContext', () => ({
    useEditMode: () => ({ isEditMode: false, toggleEditMode: vi.fn() }),
}));

// Mock config prop
const mockConfig: ITRViewerStepConfig = {
    id: 'taxCalc',
    title: 'Tax Calculation & Payments',
    isConditional: false,
};

const itrData = itr1Fixture.itr.ITR.ITR1 as unknown as Itr1;

describe('TaxCalculationPaymentsStep', () => {
    test('renders Income Computation tab correctly', async () => {
        render(<TaxCalculationPaymentsStep itrData={itrData} config={mockConfig} />);

        // The tab should be active by default. Let's check a few key values.
        // Find the text and then its parent row to be more specific.
        const grossTotalIncomeCell = await screen.findByText(/^Gross Total Income$/i);
        const grossTotalIncomeRow = grossTotalIncomeCell.closest('tr');
        expect(within(grossTotalIncomeRow!).getByText('₹7,87,673.00')).toBeInTheDocument();

        const totalIncomeCell = await screen.findByText(/^Total Income$/i);
        const totalIncomeRow = totalIncomeCell.closest('tr');
        expect(within(totalIncomeRow!).getByText('₹5,82,673.00')).toBeInTheDocument();
    });

    test('renders Tax Calculation tab correctly after clicking', async () => {
        render(<TaxCalculationPaymentsStep itrData={itrData} config={mockConfig} />);

        // Click the "Tax Calculation" tab
        const taxCalcTab = await screen.findByRole('tab', { name: /Tax Calculation/i });
        await userEvent.click(taxCalcTab);

        // Check for key values from the ITR1_TaxComputation part of the fixture
        const grossTaxLiabilityCell = await screen.findByText(/^Gross Tax Liability$/i);
        const grossTaxLiabilityRow = grossTaxLiabilityCell.closest('tr');
        expect(within(grossTaxLiabilityRow!).getByText('₹30,196.00')).toBeInTheDocument();

        const netTaxLiabilityCell = await screen.findByText(/^Net Tax Liability \(after paid taxes\)$/i);
        const netTaxLiabilityRow = netTaxLiabilityCell.closest('tr');
        expect(within(netTaxLiabilityRow!).getByText('₹0.00')).toBeInTheDocument();
    });
    
    test('renders Tax Payments Summary tab correctly after clicking', async () => {
        render(<TaxCalculationPaymentsStep itrData={itrData} config={mockConfig} />);

        // Click the "Tax Payments Summary" tab
        const taxPaymentsTab = await screen.findByRole('tab', { name: /Tax Payments Summary/i });
        await userEvent.click(taxPaymentsTab);

        // --- Check Summary Card ---
        // There are multiple elements with this text, so we find all and then identify the card title.
        const summaryCardTitleCandidates = await screen.findAllByText('Tax Payments Summary');
        const summaryCardTitle = summaryCardTitleCandidates.find(e => e.tagName.toLowerCase() === 'div');
        const summaryCard = summaryCardTitle!.closest('div.rounded-lg.border') as HTMLElement;
        expect(summaryCard).toBeInTheDocument();

        // Check for the "TDS on Other Income" value specifically within the summary card
        const tdsOnOtherIncomeContainer = await within(summaryCard).findByText('TDS on Other Income');
        const tdsOnOtherIncomeValue = tdsOnOtherIncomeContainer.parentElement?.querySelector('p:last-child');
        expect(tdsOnOtherIncomeValue).toHaveTextContent('₹26,405.00');

        // Check for the total tax payments value
        const totalTaxPaymentsContainer = await within(summaryCard).findByText('Total Tax Payments');
        const totalAmountElement = totalTaxPaymentsContainer.nextElementSibling;
        expect(totalAmountElement).toHaveTextContent('₹26,405.00');

        // --- Check Details Card ---
        const detailsCardTitleCandidates = await screen.findAllByText('Details of Tax Payments');
        const detailsCardTitle = detailsCardTitleCandidates.find(e => e.tagName.toLowerCase() === 'div');
        const detailsCard = detailsCardTitle!.closest('div.rounded-lg.border') as HTMLElement;
        expect(detailsCard).toBeInTheDocument();
        
        // Check the table within the details card
        const detailsTable = within(detailsCard).getByRole('table');
        expect(within(detailsTable).getByText('DELC12345D')).toBeInTheDocument();
        expect(within(detailsTable).getByText('₹2,64,049.00')).toBeInTheDocument();
        expect(within(detailsTable).getByText('₹26,405.00')).toBeInTheDocument();
    });
}); 