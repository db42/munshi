# Understanding Schedule OS: IncChargeable vs. TotOthSrcNoRaceHorse

This document clarifies the purpose of two key fields related to the Income Tax Return's (ITR) "Schedule OS" (Income from Other Sources) within our application: `IncChargeable` and `TotOthSrcNoRaceHorse`. This distinction has been refined based on analysis of official ITR forms and their instructions.

## The Core Distinction

From a tax law perspective, income and losses are treated distinctly. The fields in `Schedule OS` primarily deal with reporting positive income under various categories.

1.  **`TotOthSrcNoRaceHorse` (Total Other Sources No Race Horse):**
    *   **Purpose:** This field represents the total income from "Other Sources" *before* factoring in any income or loss from the activity of owning and maintaining racehorses.
    *   **In ITR Forms:** This corresponds to **Item 7** in `Schedule OS`. It is an intermediate total.

2.  **`IncChargeable` (Income Chargeable):**
    *   **Purpose:** This field represents the **final total income** chargeable under the head "Income from Other Sources" after all calculations, including the result from racehorse activities.
    *   **In ITR Forms:** This corresponds to **Item 9** in `Schedule OS`. This is the final figure for this head of income.

**Key Relationship:** In cases where there is no income or loss from owning and maintaining racehorses, the value of `TotOthSrcNoRaceHorse` will be identical to `IncChargeable`.

**Important Note:** Neither of these fields is intended to hold a *loss* figure for set-off purposes. A loss from "Other Sources" (if any) is a separate calculation within Schedule OS (specifically, from Item 6 - 'Net Income from other sources chargeable at normal applicable rates'), which is then carried to `Schedule CYLA` for adjustment against other heads of income.

## The Bug and The Fix

We identified a critical data mapping bug in how our system generated and consumed `Schedule OS` data.

*   **The Bug:**
    1.  The `aisToITR.ts` processor was calculating the total income but only populating `IncChargeable`, leaving `TotOthSrcNoRaceHorse` as `0`. This was an incomplete representation of the data.
    2.  The `scheduleCYLA.ts` generator was previously attempting a complex and incorrect calculation, treating one income field as a loss from another.

*   **The Fix:**
    1.  **`aisToITR.ts`:** The logic has been corrected to populate **both** `IncChargeable` and `TotOthSrcNoRaceHorse` with the calculated `totalIncome`. This is the correct approach for scenarios without racehorse income, ensuring both the intermediate and final totals are accurate.
    2.  **`scheduleCYLA.ts`:** The logic has been simplified and corrected to read the final income figure directly from `IncChargeable`. This is the correct value to use for inter-head adjustments in Schedule CYLA.

This two-part fix ensures our application adheres to the correct tax logic, properly structures the `Schedule OS` data, and uses the correct final figure for subsequent calculations. 