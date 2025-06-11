# ITR Generation Enhancement: Schedule VIA Deductions

This document outlines the plan to integrate Chapter VI-A deductions into the ITR generation process.

### Phase 1: Data Modeling & API/UI Specification

- [x] **1. Define `ScheduleVIA` Data Structure:**
    -   **File:** `server/src/types/itr.ts`
    -   **Action:** Verify the existing `ScheduleVIA` interface. Ensure it meets all requirements. No changes are expected as it's already defined.

- [x] **2. Specify User Input Model & UI Plan:**
    -   **File:** `server/src/types/userInput.types.ts`
    -   **Action:** Define the `Chapter6ADeductions` interface and add it as an optional property to the `UserInputData` interface. This will serve as the contract for the frontend.
- [x] Implement the UI for editing deductions in `DeductionsLossesStep.tsx`, creating a new `Chapter6ADeductionsForm.tsx` component.

### Phase 2: Data Extraction & Merging Logic

- [x] **1. Update Document Processors:**
    -   **File:** `server/src/document-processors/form16ToITR.ts`
    -   **Action:** Enhance the processor to extract Chapter VI-A deductions from the parsed Form 16 data and map them to the `ScheduleVIA` model. Update the `Form16ITRSections` type to include `scheduleVIA?: ScheduleVIA;`.
    -   **File:** `server/src/document-processors/userInputToITR.ts`
    -   **Action:** Implement logic to convert the user-provided `Chapter6ADeductions` data into the standard `ScheduleVIA` model. Update `UserInputITRSections` to include `scheduleVIA?: ScheduleVIA;`.

- [x] **2. Implement Merging Logic:**
    -   **File:** `server/src/document-processors/scheduleVIA.ts`
    -   **Action:** Create a `mergeScheduleVIA` function. This function will take the `ScheduleVIA` objects from Form 16 and user input, and combine the values for each deduction section, producing a single, consolidated `ScheduleVIA` object.

### Phase 3: Refactor Tax Computations

- [x] **1. Refactor `PartB-TI` Calculation:**
    -   **File:** `server/src/generators/itr/partBTI.ts`
    -   **Action:** Refactor the `calculatePartBTI` function to accept the merged `ScheduleVIA` and the applicable tax regime. It now applies deductions based on the regime to calculate the final `TotalIncome`.

- [ ] **2. Update Central ITR Generator:**
    -   **File:** `server/src/generators/itr/itr.ts`
    -   **Action:** Update the main `generateITR` function to merge the `ScheduleVIA` data and pass it, along with the tax regime, to the refactored `calculatePartBTI` for both old and new regime calculations. 