import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { PersonalInfoStep } from '../PersonalInfoStep';
import itr1Fixture from '../../../../fixtures/itr-1-old-regime.json';
import type { Itr1 } from '../../../../types/itr-1';
import type { ITRViewerStepConfig } from '../../types';

const mockConfig: ITRViewerStepConfig = {
    id: 'personal-info',
    title: 'Personal Information',
};

describe('PersonalInfoStep', () => {
    test('renders personal information from ITR-1 fixture data', () => {
        const itrData = itr1Fixture.itr.ITR.ITR1 as Itr1;
        render(<PersonalInfoStep itrData={itrData} config={mockConfig} />);

        // Check for multiple fields to ensure the component is rendering correctly
        expect(screen.getByLabelText(/pan/i)).toHaveValue('ABCDE1234F');
        expect(screen.getByLabelText(/full name/i)).toHaveValue('John Doe');
        // Check for fallback value since DOB is empty in the fixture
        expect(screen.getByLabelText(/date of birth/i)).toHaveValue('');
    });
}); 