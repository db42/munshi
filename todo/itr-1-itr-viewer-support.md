# TODO: Implement ITR-1 Viewer Support

This task tracks the client-side changes required to display ITR-1 data in the `ITRViewer`. The architecture uses a hybrid approach: some components are reused for both ITR-1 and ITR-2 (via a "Data Adapter" pattern), while others are purpose-built for a single ITR type. The scope is view-only.

## Component Strategy Overview

This table summarizes the component used for each step in the ITR-1 and ITR-2 viewer flows.

| Step ID | ITR-1 Component | ITR-2 Component | Status |
| :--- | :--- | :--- | :--- |
| `personalInfo` | `PersonalInfoStep` (Shared) | `PersonalInfoStep` (Shared) | ✅ Done |
| `taxRegimeSelection`| `TaxRegimeStep` (Shared) | `TaxRegimeStep` (Shared) | ✅ Done |
| `itr1IncomeDetails`| `ITR1IncomeDetailsStep` (ITR-1 only) | N/A | ✅ Done |
| `incomeDetails` | N/A | `IncomeDetailsStep` (ITR-2 only) | ✅ Done |
| `itr1Deductions` | `ITR1DeductionsStep` (ITR-1 only) | N/A | ✅ Done |
| `deductions` | N/A | `DeductionsStep` (ITR-2 only) | ✅ Done |
| `capitalGains` | N/A | `CapitalGainsStep` (ITR-2 only) | ✅ Done |
| `losses` | N/A | `LossesStep` (ITR-2 only) | ⏳ To Do |
| `foreignAssetsIncome` | N/A | `ForeignAssetsIncomeStep` (ITR-2 only)| ⏳ To Do |
| `assetsLiabilities`| N/A | `AssetsLiabilitiesStep` (ITR-2 only)| ⏳ To Do |
| `taxCalculationPayments`| `TaxCalculationPaymentsStep` (Shared)| `TaxCalculationPaymentsStep` (Shared)| ✅ Done |
| `summaryConfirmation`| `SummaryConfirmationStep` (Shared) | `SummaryConfirmationStep` (Shared)| ✅ Done |

---

## Action Items

### Completed Tasks ✅

- [x] **Restore Type Definitions:** Restored `client/src/types/itr.ts` and copied all required type definition files (`itr-1.ts`, `common-itr.ts`, etc.) from the server.
- [x] **Refactor `ITRViewer.tsx`:**
    - [x] Updated the main viewer component to handle both `Itr1` and `Itr2` data types.
    - [x] Updated `stepComponentMap` to correctly map step IDs to their respective components.
    - [x] Resolved all type errors related to component props.
- [x] **Adapt `PersonalInfoStep.tsx`:** Updated props and implemented a data adapter (`useMemo`) to handle both ITR-1 and ITR-2.
- [x] **Adapt `TaxRegimeStep.tsx`:** Updated props.
- [x] **Adapt `IncomeDetailsStep.tsx`:** Updated for ITR-2 and created `ITR1IncomeDetailsStep.tsx` for ITR-1.
- [x] **Adapt `DeductionsStep.tsx`:** Updated for ITR-2 and created `ITR1DeductionsStep.tsx` for ITR-1.
- [x] **Adapt `CapitalGainsStep.tsx`:** Refactored for clarity and updated to be ITR-2 specific.
- [x] **Adapt Shared `TaxCalculationPaymentsStep.tsx`:**
    - [x] Updated props to accept `itrData: Itr1 | Itr2`.
    - [x] Implemented the view-only "Data Access Pattern" to create a normalized view model from either `Itr1` or `Itr2` data.
    - [x] Updated the JSX to render data from the new view model.

### Remaining Tasks ⏳

- [ ] **Update ITR-2 Only Components:**
    - [ ] **`LossesStep.tsx`**: Update props to accept `Itr1 | Itr2` and add a type guard to ensure it only renders for ITR-2.
    - [ ] **`ForeignAssetsIncomeStep.tsx`**: Apply the same pattern.
    - [ ] **`AssetsLiabilitiesStep.tsx`**: Apply the same pattern.

- [ ] **Final Review & Cleanup:**
    - [ ] Remove any dead code or unused types.
    - [ ] Manually test the display flow for both ITR-1 and ITR-2 to ensure the correct steps and components are shown. 