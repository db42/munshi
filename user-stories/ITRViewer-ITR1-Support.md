# User Story: ITR-1 Support in ITR Viewer

**As a** developer working on Munshi,
**I want to** implement a robust and maintainable architecture for supporting ITR-1 in the `ITRViewer` component,
**So that** users with simpler tax situations can review their ITR-1 data with the same clarity and interactivity as ITR-2 users.

---

## Architectural Decisions & Implementation Plan

This document outlines the agreed-upon strategy for integrating ITR-1 support into the client-side `ITRViewer`. The scope is **view-only**.

### 1. Guiding Principle: "Strict WYSIWYG"

The fundamental principle is that **what you see is what you get (WYSIWYG)**. The data rendered in the viewer must be derived from the exact same data structure that the user will eventually download for filing. This ensures data integrity and user trust.

*   **Backend Responsibility:** The backend is the single source of truth. It will perform all calculations, determine if a user is eligible for ITR-1, and generate the final, spec-compliant `Itr1` or `Itr2` object.
*   **API Contract:** The API (`/api/itr/{userId}/{assessmentYear}`) will return a payload containing *either* an `ITR1` object or an `ITR2` object under the `ITR` key.

### 2. Frontend Component Strategy: The Hybrid Approach

We will adopt a hybrid strategy for UI components to balance code reuse with simplicity.

*   **Reuse Components for Shared Sections:** For steps that are conceptually similar between ITR-1 and ITR-2 (e.g., `PersonalInfoStep`, `TaxCalculationPaymentsStep`), we will adapt the existing components.
*   **Create New Components for Unique Sections:** For steps that are unique to a specific form, we will create new components. For example, `IncomeAndDeductionsStep` is specific to the ITR-1 wizard, while `CapitalGainsStep` is specific to ITR-2.

### 3. Data Access Within Reusable Components

To manage the two different data shapes (`Itr1` | `Itr2`) inside a reusable, view-only component, a simple data access pattern will be used.

For a component like `PersonalInfoStep`:

1.  **Prop Type:** The component's props will be updated to accept `itrData: Itr1 | Itr2`.
2.  **Data Normalization:** Inside the component, a normalized object (a "view model") will be created using `useMemo`. This object's sole purpose is to provide a consistent data structure for the component's rendering logic.
3.  **Derivation Logic:** The `useMemo` hook will check if the `itrData` prop contains an `ITR1` or `ITR2` object and will map the fields from the appropriate source structure to the consistent view model.
4.  **Rendering:** The component's JSX will bind to this simple, stable view model for displaying data, keeping the rendering logic clean and free of conditional checks.

### 4. Implementation within Reusable Components: The Adapter Pattern

ON HOLD

To manage the complexity inside components that handle both `Itr1` and `Itr2` data, we will use a "Data Adapter" pattern.

For a component like `PersonalInfoStep`:

1.  **Create a View Model:** A consistent, normalized "view model" object will be created using `useMemo`. This object will always have the same shape (e.g., `{ firstName, lastName, ... }`).
2.  **Derive the View Model:** The `useMemo` hook will derive the view model's values by:
    a. Identifying the correct base data from the `itrData` prop (whether it's `Itr1` or `Itr2`).
    b. Merging the user's overrides from the `UserInputContext` on top of the base data.
3.  **Bind Inputs:** The component's JSX input fields will bind to this stable view model for both reading values and handling `onChange` events.
4.  **Update Context:** The `onChange` handlers will update the `UserInputContext`, which in turn triggers the backend recalculation loop described in the previous section.

This pattern isolates the data-mapping complexity, keeping the rendering logic (JSX) clean and ensuring user inputs are handled in a consistent and reliable way. 