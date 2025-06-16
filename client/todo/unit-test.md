# Todo

This document outlines the steps to set up a testing environment for the client application.

- [x] Install testing dependencies
- [x] Configure Vite for testing
- [x] Create a test setup file
- [x] Write a sample test
- [x] Add a test script to package.json

---

### ITR-1 Component Testing

- [x] Capture ITR-1 API response and save as a fixture.
- [x] Identify the main ITR-1 rendering component.
- [x] Write a test for ITRViewer, mocking the `useITRData` hook to use fixture data.

---

### ITR-1 Step Component Tests

- [x] Write test for `PersonalInfoStep`.
- [x] Write test for `IncomeDetailsStep`.
- [x] Write test for `DeductionsStep`.
- [x] Write test for `TaxRegimeStep`.
- [x] `TaxCalculationPaymentsStep.tsx`
  - [x] Renders `IncomeComputationTab` correctly
  - [x] Renders `TaxCalculationTab` correctly
  - [x] Renders `TaxPaymentsTab` correctly
- [x] `SummaryConfirmationStep.tsx`

### Future Fixes
- [ ] Fix `TaxRegimeStep` test to correctly simulate user clicks and assert state changes.