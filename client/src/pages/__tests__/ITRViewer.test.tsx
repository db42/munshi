import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ITRViewer } from '../ITRViewer';
import { UserProvider } from '@/context/UserContext';
import { AssessmentYearProvider } from '@/context/AssessmentYearContext';
import { useITRData } from '@/components/ITRViewer/useITRData';
import itr1Fixture from '@/fixtures/itr-1-old-regime.json';

// Mock the useITRData hook
vi.mock('@/components/ITRViewer/useITRData');
const mockedUseITRData = useITRData as jest.Mock;

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserProvider>
            <AssessmentYearProvider>{children}</AssessmentYearProvider>
        </UserProvider>
    );
};

const customRender = (ui: React.ReactElement, options?: any) =>
    render(ui, { wrapper: AllTheProviders, ...options });

describe('ITRViewer', () => {
    beforeEach(() => {
        // Reset mocks before each test
        mockedUseITRData.mockReset();
    });

    test('renders ITR-1 data correctly from a fixture', async () => {
        // Setup the mock to return our fixture data
        mockedUseITRData.mockReturnValue({
            data: itr1Fixture,
            isLoading: false,
            error: null,
        });

        customRender(<ITRViewer />);

        // Check for the ITR type in the title using a regex to be more flexible
        expect(await screen.findByText(/ITR-1/i)).toBeInTheDocument();

        // Check that the first step button is rendered
        expect(screen.getByRole('button', { name: 'Personal Information' })).toBeInTheDocument();

        // Check for some content from the first step
        await waitFor(() => {
            expect(screen.getByLabelText(/full name/i)).toHaveValue('John Doe');
        });
    });
}); 