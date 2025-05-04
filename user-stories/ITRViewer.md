# User Story: ITR Viewer

**As a** taxpayer using Munshi,
**I want to** view the generated Income Tax Return (ITR) data in a clear, structured, and user-friendly format that resembles the official ITR form,
**So that** I can easily review and verify the accuracy and completeness of my return before proceeding with filing or downloading the final JSON.

---

## Acceptance Criteria:

1.  **Data Fetching:**
    *   AC1: The viewer (client-side component) can fetch the final generated ITR JSON data from the backend endpoint (`GET /api/itr/{userId}/{assessmentYear}`).

2.  **Structure and Readability:**
    *   AC1: The viewer displays the ITR data organized into sections and schedules corresponding to the official ITR form structure (e.g., Part A, Schedule S, Schedule HP, Schedule CG, Chapter VI-A, Part B-TI, Part B-TTI, etc.).
    *   AC2: Clear headings and labels are used, matching official terminology where practical.
    *   AC3: Data within schedules is presented logically (e.g., tables for Capital Gains, lists for deductions).
    *   AC4: Key calculated totals (Gross Total Income, Total Deductions, Total Income, Tax Payable/Refund) are prominently displayed.

3.  **Navigation:**
    *   AC1: Users can easily navigate between different major sections/schedules of the ITR (e.g., using a sidebar menu or tabs).

4.  **Basic Functionality:**
    *   AC1: The viewer accurately renders the data received from the backend API.
    *   AC2: Supports viewing different ITR types (e.g., ITR-1, ITR-2) by conditionally displaying relevant sections based on the generated ITR data type.

5.  **(Optional/Enhancement) Data Source Indication:**
    *   AC1: The viewer can optionally display subtle indicators showing the origin of specific data points (e.g., "From Form 16", "From AIS", "Manual Input").

6.  **(Optional/Enhancement) Download:**
    *   AC1: A button or link allows the user to download the raw ITR JSON file as fetched from the API.

## Technical Notes:

*   This is primarily a client-side feature (React component).
*   Relies on the backend providing the complete and final ITR JSON via `GET /api/itr/{userId}/{assessmentYear}`.
*   The initial version focuses on *viewing* only. Editing capabilities within the viewer are a separate, future enhancement.
*   Needs careful UI/UX design to handle the complexity and volume of data in an ITR form. 

---

## Proposed Wizard Flow (ITR-2 Review):

1.  **Personal Information:** Review Part A General Information.
2.  **Income Details:** Review Schedules S (Salary), HP (House Property), OS (Other Sources).
3.  **Capital Gains:** Review Schedule CG.
4.  **Foreign Assets & Income:** Review Schedule FA. *(Conditional step)*
5.  **Deductions & Losses:** Review Schedules VI-A (Deductions), CYLA, BFLA, CFL (Losses).
6.  **Tax Calculation & Payments:** Review Part B-TI, Part B-TTI, and Tax Paid details.
7.  **Assets & Liabilities:** Review Schedule AL. *(Conditional step)*
8.  **Summary & Confirmation:** Final overview and confirmation.

*(Note: Conditional steps 4 and 7 are displayed only if the relevant schedules exist in the user's ITR data for the given assessment year).*

---

## Design Principles:

1.  **Schema-Driven Rendering:** Maintain a configuration (e.g., JSON/YAML) mapping ITR types (starting with ITR-2) to ordered sections, labels, and field definitions. The viewer dynamically renders based on this schema and applicable conditions (e.g., income thresholds for Schedule AL).
2.  **Component Library:** Develop generic, reusable UI primitives (`<Section>`, `<Field>`, `<DataTable>`, `<Accordion>`, `<Card>`, etc.) and compose them to build the viewer UI, avoiding repetitive markup.
3.  **Responsive & Themeable UI:** Ensure the design is mobile-friendly and supports future theming capabilities like dark mode.
4.  **Accessibility (a11y):** Adhere to accessibility best practices (semantic HTML, keyboard navigation, ARIA attributes, sufficient contrast).
5.  **Clear Data Formatting:** Consistently format numbers (currency with Lakh/Crore separators) and dates according to Indian standards.
6.  **Informative Presentation:** Prioritize clarity over exact form replication. Use UI patterns to structure dense information logically and distinguish labels from values clearly.
7.  **Robust Error Handling:** Provide clear feedback for API errors or unexpected data issues during rendering.

---

## Implementation Plan:

**Phase 1: Setup & Core Structure**
*   Create directory structure (`components/ITRViewer`, `types.ts`, `config/`, `steps/`, `ui/`).
*   Implement `useITRData` hook for data fetching (`GET /api/itr/{userId}/{assessmentYear}`).
*   Create the main `ITRViewer.tsx` shell with hook integration, step state, and loading/error states.

**Phase 2: Schema & Configuration**
*   Define the schema structure for `itr-2-config.json` (steps, titles, schedules, conditions).
*   Implement logic to load the configuration in `ITRViewer.tsx`.

**Phase 3: Wizard Logic & Navigation**
*   Implement step rendering logic in `ITRViewer.tsx` based on config and state.
*   Handle conditional step filtering (FA, AL).
*   Implement navigation controls ("Previous", "Next") and state updates.

**Phase 4: Step Component Implementation (Initial)**
*   Create initial versions of step components (e.g., `PersonalInformationStep.tsx`, `IncomeDetailsStep.tsx`, etc.).
*   Pass relevant ITR data props to these components.
*   Use basic HTML/placeholders to display data logically, focusing on data mapping.

**Phase 5: Reusable UI Primitives**
*   Develop generic UI components (`<WizardLayout>`, `<Section>`, `<Field>`, `<DataTable>`, etc.) in `components/ITRViewer/ui/`.
*   Apply basic styling (considering responsiveness and theming).
*   Ensure primitives are accessible.

**Phase 6: Refinement & Integration**
*   Refactor Step Components: Replace basic HTML/placeholders with the Reusable UI Primitives from Phase 5.
*   Apply clear data formatting and ensure informative presentation using the primitives.
*   Refine overall styling and layout.
*   Enhance error handling.

**Phase 7: Integration & Testing**
*   Integrate `ITRViewer` into the main application.
*   Write tests (unit, integration). 