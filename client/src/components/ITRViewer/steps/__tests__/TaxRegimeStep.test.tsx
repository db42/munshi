import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { TaxRegimeStep } from '../TaxRegimeStep';
import { TaxRegimePreference, type TaxRegimeComparison } from '@/types/tax.types';
import { type Itr1 } from '@/types/itr-1';
import { type ITRViewerStepConfig } from '../../types';

// Mock the context to a simple version for rendering
vi.mock('../context/UserInputContext', () => ({
    useUserInput: () => ({
        userInput: {},
        saveUserInputData: vi.fn(),
    }),
}));

const mockConfig: ITRViewerStepConfig = {
    id: 'taxRegime',
    title: 'Tax Regime Selection',
    isConditional: false,
};

// Create a well-typed mock tax comparison object
const mockTaxComparison: TaxRegimeComparison = {
    oldRegimeTax: 30195.98,
    newRegimeTax: 35117.99,
    savings: 4922.01,
    recommendation: TaxRegimePreference.OLD,
};

// Create a minimal mock of Itr1 data that the component needs
const mockItr1Data = {} as Itr1;

describe('TaxRegimeStep', () => {
    test('renders tax regime comparison correctly based on props', async () => {
        render(<TaxRegimeStep itrData={mockItr1Data} config={mockConfig} taxRegimeComparison={mockTaxComparison} />);

        // 1. Check for the recommendation text
        const recommendation = await screen.findByText(/Recommendation: OLD Tax Regime/);
        expect(recommendation).toBeInTheDocument();

        // 2. Check for the savings amount
        const savingsText = await screen.findByText(/You can save ₹4,922.01/);
        expect(savingsText).toBeInTheDocument();

        // 3. Check that the recommended option is visually highlighted
        const recommendedOption = screen.getByText(/Recommended - Save/);
        expect(recommendedOption).toBeInTheDocument();
    });
});
