# User Story: Manual ITR Data Input

**As a** taxpayer using Munshi,
**I want to** provide specific financial details directly into the application (like carry-forward losses, self-assessment tax payments, foreign asset declarations, or specific deductions) that are not typically found in my uploaded documents,
**So that** my generated ITR is complete, accurate, and includes all necessary information for filing.

---

## Acceptance Criteria:

1.  **Data Persistence:**
    *   AC1: A mechanism exists (backend API `PUT /api/user-inputs/{ownerId}/{assessmentYear}`) to save user-provided data persistently.
    *   AC2: The saved data is associated with the correct user (`ownerId`) and `assessmentYear`.
    *   AC3: Subsequent requests to save data for the same user/year update the existing record (upsert behavior).
    *   AC4: A mechanism exists (backend API `GET /api/user-inputs/{ownerId}/{assessmentYear}`) to retrieve previously saved user input data.

2.  **ITR Generation Integration:**
    *   AC1: The core ITR generation logic (`server/src/itr/itr.ts` or similar) fetches the saved user input data via a dedicated service (`userInputService.ts` -> `userInput.get`).
    *   AC2: A specific processor (`userInputToITR`) transforms the saved user input JSON into standardized ITR section objects.
    *   AC3: The ITR merge logic correctly combines sections generated from user input with sections generated from parsed documents.

3.  **Specific Data Points (Examples - requires corresponding UI in Client):**
    *   AC1 (Carry Forward Losses): User input for Schedule CFL (previous AY, loss amounts per head) is captured, saved, and reflected in the final ITR's Schedule CFL and affects Part B-TTI calculations.
    *   AC2 (Self-Assessment Tax): User input for Self-Assessment Tax payments (BSR code, date, challan no, amount) is captured, saved, and reflected in the final ITR's "Taxes Paid" section.
    *   AC3 (Schedule FA): User input for Foreign Assets (asset details per type) is captured, saved, and reflected in the final ITR's Schedule FA.
    *   AC4 (Deductions): User input for specific Chapter VI-A deductions (e.g., amounts for 80C components, 80D premiums, 80G donation details) is captured, saved, and reflected in the final ITR's Chapter VI-A schedule and affects Part B-TI calculations.
    *   AC5 (Other Schedules): Similar capability exists for adding data to other relevant schedules like Schedule HP (House Property), Schedule OS (Other Sources), etc.

## Technical Notes:

*   User input stored in `user_itr_inputs` table (JSONB column `input_data`).
*   Backend structure involves:
    *   Routes: `server/src/routes/userInputRoutes.ts`
    *   Service Aggregator: `server/src/services/userInput.ts`
    *   Service Logic: `server/src/services/userInputService.ts` (using pool injection)
    *   Types: `server/src/types/userInput.types.ts`
*   Assumes client-side UI (ITR Viewer or dedicated forms) will be built to capture this input and call the `PUT` API.
*   Initial focus is on *adding* data; editing data derived from documents is a separate future enhancement.
*   Input validation (e.g., using Zod) should be added at the API route level (`userInputRoutes.ts`) before data is passed to the service. 