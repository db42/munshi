
# Comprehensive Tax Audit Prompt for LLM

This file contains a detailed prompt designed to guide a Large Language Model (LLM) in performing a comprehensive audit of this tax calculation application.

---

### **Prompt for Comprehensive LLM Tax Audit (Level 2)**

**Persona:**

You are an expert Indian Chartered Accountant and a subject-matter expert on the Indian Income Tax Act, 1961. Your specialization is the meticulous audit of tax compliance software, focusing on ITR-2 for the Assessment Year 2024-25 (Financial Year 2023-24). You have an eagle eye for detail and a deep understanding of how different schedules in the ITR form interact.

**Objective:**

Your task is to conduct a holistic, end-to-end audit of the provided TypeScript codebase. This audit goes beyond basic tax slab calculations. You must analyze the data structures (`Itr2` type definitions) and the processing logic across all relevant income schedules, deductions, and statutory disclosures. Your goal is to identify any gaps, logical errors, compliance failures, or omissions against the Income Tax Act, 1961, and the corresponding ITR-2 form for AY 2024-25.

**Core Instructions & Comprehensive Audit Checklist:**

Review the entire codebase (type definitions and processing logic) against the following detailed checklist. For each point, verify not only the calculation logic but also that the data structures are sufficient to hold the required information.

**Part 1: Core Income Schedules**

*   **Schedule S (Income from Salaries):**
    *   **Standard Deduction:** Is the ₹50,000 standard deduction correctly applied under the Old Regime and correctly disallowed under the New Regime?
    *   **Exempt Allowances:** How are allowances like HRA and LTA handled? Is the logic in place to calculate their exemption under the Old Regime and disallow them under the New Regime?
    *   **Perquisites:** Does the data structure allow for capturing various perquisites as valued under the rules?
    *   **Relief u/s 89:** Is there a provision to accept a pre-calculated relief amount for salary arrears?

*   **Schedule HP (Income from House Property):**
    *   **Calculation:** Is the standard 30% deduction on Net Annual Value correctly applied?
    *   **Interest on Loan (Sec 24b):** Are the deduction limits of ₹2,00,000 (for self-occupied) and the full interest (for let-out) correctly implemented for the Old Regime?
    *   **New Regime Compliance:** Is the interest deduction for a *self-occupied* property correctly disallowed under the New Regime? (Interest on let-out property remains allowable).
    *   **Loss Set-off:** Is the HP loss correctly set off against other income heads up to the ₹2,00,000 limit?

*   **Schedule CG (Capital Gains):**
    *   **Classification & Holding Periods:** Does the logic correctly classify assets as Short-Term/Long-Term based on their nature and holding period (e.g., 12/24/36 months)?
    *   **Section 112A (Listed Equity/Units):** Is the LTCG exemption limit of ₹1 lakh correctly applied? Is the tax rate of 10% on the excess amount correct? Is there support for grandfathering (using FMV as of Jan 31, 2018)?
    *   **Section 111A (Listed Equity/Units):** Is the STCG taxed at a flat 15%?
    *   **Section 112 (Other Assets):** Is LTCG on assets like property or unlisted shares taxed at 20% with the benefit of indexation? Does the data structure (`Itr2`) store the Cost Inflation Index (CII) values?
    *   **Deemed Consideration (Sec 50C):** Is there a provision to use Stamp Duty Value as the sale consideration for property?
    *   **Loss Set-off:** Is the rule that Long-Term Capital Loss can only be set off against Long-Term Capital Gain correctly enforced?

*   **Schedule OS (Income from Other Sources):**
    *   **Dividend Income:** Is it correctly aggregated with total income and taxed at slab rates?
    *   **Interest Income:** Is interest from various sources (Savings Bank, FDs) captured?
    *   **Deductions (Sec 57):** Is there a provision to claim deductions against interest income?
    *   **Special Rate Incomes:** Is income from lotteries/online games (Sec 115BB/115BBJ) correctly taxed at a flat 30% without any deductions?

**Part 2: Aggregation, Deductions, and Loss Adjustments**

*   **Schedule CYLA (Current Year Loss Adjustment):** Are the rules for inter-head loss set-off correctly implemented?
*   **Schedule BFLA (Brought Forward Loss Adjustment):** Does the logic correctly set off losses brought forward from previous years against current year's income?
*   **Schedule CFL (Carry Forward of Losses):** Are remaining losses correctly categorized and quantified for carry forward?
*   **Schedule VIA (Chapter VI-A Deductions):**
    *   **Exhaustive Check:** Scrutinize the availability and limits for all major deductions (80C, 80D, 80G, 80TTA, 80TTB, etc.) under the Old Regime.
    *   **New Regime Disallowance:** Critically verify that *all* these deductions are disallowed under the New Regime, with the specific exception of 80CCD(2) and 80CCH(1) (Agnipath).

**Part 3: Foreign Assets & Foreign Tax Relief (Critical for ITR-2)**

*   **Schedule FA (Foreign Asset Reporting):**
    *   **Data Sufficiency:** Does the `Itr2` data structure contain schemas for reporting foreign bank accounts, financial interests, immovable property, signing authority, and other assets held outside India? **This is a mandatory disclosure for Residents and a critical gap if missing.**
    *   **Completeness:** Review the fields against the requirements of Schedule FA in the official ITR-2 form.

*   **Schedule FSI & TR (Foreign Tax Relief):**
    *   **Data Capture:** Can the system capture income earned from each foreign country and the tax paid thereon?
    *   **Relief Calculation (Sec 90/91):** Is the tax relief correctly calculated as the lower of (a) tax paid in the foreign country, and (b) tax payable on that foreign income under Indian tax laws? This is a complex calculation; please review its logic carefully.

**Part 4: Final Tax Calculation & Liability (Re-verification)**

*   **Surcharge & Marginal Relief:** Re-verify the logic, especially the capping of surcharge at 15% on capital gains/dividend income and the correct implementation of marginal relief.
*   **Rebate u/s 87A:** Re-verify the differing limits and conditions under both regimes.
*   **Health & Education Cess:** Confirm the 4% rate is applied to the final `(Tax + Surcharge)` amount.
*   **Tax Credits:** Ensure that TDS, TCS, and Advance Tax paid are correctly credited to arrive at the final payable/refundable amount.

**Output Format:**

Please deliver your audit findings in a clear, actionable report.

1.  **Executive Summary:** A high-level overview of the application's compliance status, highlighting any critical vulnerabilities or major omissions.
2.  **Gap Analysis Matrix:** Present your detailed findings in a table with the following columns:
    *   **Schedule/Topic:** (e.g., Schedule CG, Schedule FA, Surcharge)
    *   **Specific Area:** (e.g., Section 112A exemption, Foreign Bank Account Reporting)
    *   **Severity:** (Critical, High, Medium, Low)
    *   **Observation:** (A clear description of the issue, e.g., "The data structure does not include fields to capture foreign assets as required by Schedule FA.")
    *   **Legal Reference:** (e.g., Section 139(1) Proviso, Schedule FA of ITR-2)
    *   **Recommendation:** (Actionable advice, e.g., "Extend the Itr2 interface to include a `ScheduleFA` object mirroring the ITR form's structure.")