# Schedule CG Post-Processing (`scheduleCGPostProcessing.ts`)

## 1. Introduction

The `server/src/generators/itr/scheduleCGPostProcessing.ts` module is responsible for performing critical calculations and data transformations on the `ScheduleCGFor23` (Capital Gains Schedule for ITR-2 for Assessment Year 2023-24 onwards). Its primary purpose is to:

1.  **Calculate Intra-Head Set-offs:** Apply the tax rules for setting off capital losses against capital gains within the same head of income (Capital Gains).
2.  **Populate Derived Fields:** Fill in various fields in the `ScheduleCGFor23.CurrYrLosses` sub-object that detail these set-offs, the losses remaining to be carried forward, and total set-off amounts.
3.  **Calculate Final Capital Gains Income:** Determine the `SumOfCGIncm` (total capital gains income chargeable to tax) after all intra-head set-offs.

This post-processing step is crucial because the initial aggregation of `ScheduleCGFor23` from various document processors (e.g., for US equities, mutual funds) provides raw gains and losses per category. This module then applies the complex set-off logic as required by income tax regulations before the data is used for final tax computation or other schedules like `ScheduleCYLA` (Current Year Loss Adjustment) and `ScheduleCFL` (Carry Forward of Losses).

## 2. High-Level Design

The `scheduleCGPostProcessing.ts` module functions as a specialized calculation engine within the larger ITR (Income Tax Return) generation pipeline. 

**Placement in ITR Generation:**

1.  **Upstream:** Various document processors (e.g., for CAMS MF statements, US equity reports, Charles Schwab data) parse raw financial data and generate initial, unprocessed ITR schedule sections, including a preliminary `ScheduleCGFor23` (Capital Gains Schedule).
2.  **Aggregation:** The main ITR generator (`server/src/generators/itr/itr.ts`) aggregates these sections from multiple sources into a single, comprehensive `ScheduleCGFor23`.
3.  **`scheduleCGPostProcessing.ts` (This Module):** Takes the aggregated `ScheduleCGFor23` as its primary input.
4.  **Downstream:** The processed `ScheduleCGFor23`, now with accurate intra-head set-offs and derived totals, is used for:
    *   Calculating `PartB-TI` (Total Income) and `PartB-TTI` (Total Tax Liability).
    *   Providing input to `ScheduleCYLA` (Current Year Loss Adjustment) for inter-head set-offs.
    *   Providing input to `ScheduleCFL` (Carry Forward of Losses) for losses that remain unadjusted.

**Inputs & Outputs:**

*   **Primary Input:** An aggregated `ScheduleCGFor23` object, which contains initial capital gains and losses for the current assessment year, typically populated in its `CurrYrLosses` section under various tax rate categories (e.g., `InLtcg10Per`, `InStcgAppRate`).
*   **Primary Output:** A modified `ScheduleCGFor23` object where:
    *   `CurrYrLosses.InLossSetOff` is populated with summaries of losses set off.
    *   Detailed set-off fields within each `InLtcg...` and `InStcg...` object are updated.
    *   `CurrYrLosses.TotLossSetOff` summarizes the total set-offs.
    *   `CurrYrLosses.LossRemainSetOff` details losses to be carried forward.
    *   `SumOfCGIncm` and `TotScheduleCGFor23` reflect the net taxable capital gains after intra-head adjustments.

**Core Responsibility:**

The module's central responsibility is the **intra-head set-off of capital gains and losses**. This means applying Indian income tax rules that dictate how a capital loss from one type of asset/holding period can be adjusted against a capital gain from another type of asset/holding period *within the Capital Gains head of income*.

**Understanding Derived Fields in Schedule CG:**

It's important to understand that many fields within `ScheduleCGFor23.CurrYrLosses` (and some top-level fields in `ScheduleCGFor23` itself) are **derived fields**. They are not meant to be populated directly by upstream document processors. Instead, their values are calculated and populated by this `scheduleCGPostProcessing.ts` module based on:
1.  The initial `CurrYrCapGain` values (raw gains/losses) provided for each tax category.
2.  The results of the intra-head set-off logic applied by this module.

Examples of such derived fields that this module computes include:

*   `CurrYrLosses.InLossSetOff`: Summarizes how LTC losses and STC losses were set off against various gain categories.
*   Detailed set-off fields within each specific gain category object (e.g., `InLtcg10Per.LtclSetOff20Per`, `InStcgAppRate.StclSetoff15Per`): These show precisely which *other* loss categories were used to offset the gain in that particular category.
*   `CurrYrLosses.TotLossSetOff`: Summarizes the total losses set off within the Capital Gains schedule.
*   `CurrYrLosses.LossRemainSetOff`: Details the losses from each category that remain unadjusted and are to be carried forward to `ScheduleCFL`.
*   `SumOfCGIncm`: The final net capital gains income after all intra-head set-offs.
*   `TotScheduleCGFor23`: The total figure for Schedule CG, usually mirroring `SumOfCGIncm`.

The upstream document processors should focus on accurately providing the `CurrYrCapGain` for each relevant tax rate within the `InLtcg...` and `InStcg...` objects. This module then handles the complex calculations to derive the remaining fields accurately.

**General Processing Approach:**

1.  **Categorization & Aggregation:** Gains and losses from the input `ScheduleCGFor23` are first mapped to a standardized internal `CapitalGainTaxCategory` enum. An internal `ProcessedCapitalGains` map tracks the state (original gain/loss, net gain, loss used, loss remaining) for each category.
2.  **Rule-Based Set-off:** A series of prioritized rules are applied:
    *   LTCG Loss vs. LTCG Gain
    *   Remaining LTCG Loss vs. STCG Gain
    *   STCL Loss vs. STCG Gain
    *   Remaining STCL Loss vs. LTCG Gain
    A helper function (`performSetOff`) updates the internal `ProcessedCapitalGains` map during these operations.
3.  **ITR Field Population:** After all set-offs are performed on the internal map, dedicated logic populates the various derived fields in the output `ScheduleCGFor23` object. This includes summary fields (`InLossSetOff`, `TotLossSetOff`, `LossRemainSetOff`) and detailed breakdowns within the specific income categories (e.g., `InLtcg10Per.LtclSetOff20Per`).
4.  **Final Calculation:** The final net capital gains income (`SumOfCGIncm`) is calculated based on the results of the set-off process.

This modular design ensures that the complex logic of capital gains set-off is encapsulated and can be applied consistently to the aggregated capital gains data before further ITR calculations proceed.

## 3. Core Data Structures

Several key data structures are used to manage and track gains, losses, and set-offs:

### `CapitalGainTaxCategory` (Enum)

Defines distinct tax categories for capital gains and losses, allowing for precise application of set-off rules.

```typescript
export enum CapitalGainTaxCategory {
    STCG_15_PER = 'STCG_15_PER',         // Sec 111A (STT paid equity)
    STCG_30_PER = 'STCG_30_PER',         // e.g., certain STCG for FIIs without STT
    STCG_APP_RATE = 'STCG_APP_RATE',     // Slab rates (e.g., debt MF STCG)
    STCG_DTAA_RATE = 'STCG_DTAA_RATE',   // STCG taxed at DTAA rates
    LTCG_10_PER = 'LTCG_10_PER',         // Sec 112A (STT paid equity over 1L exemption)
    LTCG_20_PER = 'LTCG_20_PER',         // Sec 112 (e.g., debt MF LTCG with indexation)
    LTCG_DTAA_RATE = 'LTCG_DTAA_RATE',   // LTCG taxed at DTAA rates
}
```

### `ProcessedTaxCategory` (Interface)

An internal structure to track the state of each tax category throughout the set-off process.

```typescript
export interface ProcessedTaxCategory {
    originalGainOrLoss: number; // Initial gain (+) or loss (-)
    netGainAfterSetOff: number; // Gain remaining after losses from *other* categories were set off against it
    lossFromThisCategoryUsed: number; // How much of this category's loss was used to set off *other* gains
    lossSetOffAgainstThisCategory: number; // How much loss from *other* categories was set off against this category's gain
    remainingLossToCarry: number;   // Absolute value of this category's loss remaining after all intra-head set-offs
}
```

### `ProcessedCapitalGains` (Map)

A map that holds `ProcessedTaxCategory` data for all `CapitalGainTaxCategory` enum members.
`Map<CapitalGainTaxCategory, ProcessedTaxCategory>`

## 4. Processing Steps

The `postProcessScheduleCG` function executes the following steps:

### 4.1. Initialization

1.  **Deep Clone:** Creates a deep copy of the input `scheduleCG` to avoid modifying the original object passed by reference.
2.  **Zero-Out Derived Fields:** Resets various set-off related fields within `processedScheduleCG.CurrYrLosses` (like `InLossSetOff`, `TotLossSetOff`, `LossRemainSetOff`, and detailed set-off fields within `InLtcg...` and `InStcg...` objects) to zero. This ensures a clean slate for recalculation.

### 4.2. Aggregation of Initial Gains and Losses

1.  The `initializeCategory` helper function is called for each capital gain tax category.
2.  It reads the `CurrYrCapGain` (current year capital gain/loss) amount from the corresponding `InLtcg...` or `InStcg...` sub-object within `processedScheduleCG.CurrYrLosses`.
3.  This data populates the `aggregatedGainsLosses` map with initial `ProcessedTaxCategory` objects.
    *   `originalGainOrLoss` is set to the `CurrYrCapGain`.
    *   `netGainAfterSetOff` is initialized to the positive part of `originalGainOrLoss`.
    *   `remainingLossToCarry` is initialized to the absolute value of the negative part of `originalGainOrLoss`.

### 4.3. Application of Intra-Head Set-off Rules

The core set-off logic is applied in a specific order, using the `performSetOff` helper function.

**`performSetOff` Helper:**
This function takes two `ProcessedTaxCategory` objects (one with a loss, one with a gain) and:
1.  Determines the actual `setOffAmount` (minimum of available loss and available gain).
2.  Decreases `remainingLossToCarry` for the loss category.
3.  Increases `lossFromThisCategoryUsed` for the loss category.
4.  Decreases `netGainAfterSetOff` for the gain category.
5.  Increases `lossSetOffAgainstThisCategory` for the gain category.

**Set-off Rules (Simplified Order):**
The code iterates through predefined arrays of loss categories and gain categories for each rule.

1.  **Rule 1: LTCG Loss vs LTCG Gain**
    *   Losses from `LTCG_20_PER`, `LTCG_DTAA_RATE`, `LTCG_10_PER` are set off against gains in `LTCG_10_PER`, `LTCG_20_PER`, `LTCG_DTAA_RATE`.
2.  **Rule 2: Remaining LTCG Loss vs STCG Gain**
    *   Any remaining LTCG losses are set off against STCG gains (e.g., `STCG_APP_RATE`, `STCG_15_PER`, etc.).
3.  **Rule 3: STCL Loss vs STCG Gain**
    *   Losses from STCG categories are set off against gains in other STCG categories.
    *   *Note: Specific rules for STCL under Sec 111A (`STCG_15_PER` loss) are currently simplified and marked as a TODO for refinement (it should only be set off against `STCG_15_PER` gain).*
4.  **Rule 4: Remaining STCL Loss vs LTCG Gain**
    *   Any remaining STCL losses are set off against LTCG gains.
    *   *Note: Similar to Rule 3, restrictions for `STCG_15_PER` loss apply here (it should not be set off against LTCG).*

### 4.4. Populating ITR Schedule CG Fields

After the set-offs are calculated in `aggregatedGainsLosses`, the derived fields in `processedScheduleCG.CurrYrLosses` are populated:

**`recordSetOffInITRFields` Helper:**
This function is called after each successful `performSetOff` operation.
1.  **Updates `CurrYrLosses.InLossSetOff`:** This object summarizes the set-offs. For example, if an LTCG 20% loss is set off against an LTCG 10% gain, `InLossSetOff.LtclSetOff10Per` is incremented. It handles LTCvLTC and STCvSTC summary fields. Cross-type set-offs (LTCvSTC, STCvLTC) are logged for now, as `InLossSetOff` may not have dedicated fields for all such detailed combinations, which might be reported in `ScheduleCYLA`.
2.  **Updates Detailed Intra-Category Set-off Fields:**
    *   For **LTCG Gain Categories** (e.g., `processedScheduleCG.CurrYrLosses.InLtcg10Per`): It updates fields like `LtclSetOff20Per` (if LTCG 20% loss was used) or `StclSetoffAppRate` (if STCG App Rate loss was used against this LTCG 10% gain).
    *   For **STCG Gain Categories** (e.g., `processedScheduleCG.CurrYrLosses.InStcgAppRate`): It updates fields like `StclSetoff15Per` (if STCG 15% loss was used against this STCG App Rate gain). As per the analyzed ITR schema, these STCG objects do not contain fields to detail LTC losses set off against them.

**Populating Other `CurrYrLosses` Fields:**

1.  **`TotLossSetOff`:** This object (assumed to mirror `InLossSetOff` structure) is populated by copying the values from the updated `InLossSetOff`. It reflects the total losses set off against each type of gain.
2.  **`LossRemainSetOff`:** This object is populated with the `remainingLossToCarry` from `aggregatedGainsLosses` for each category. The field names (e.g., `LtclSetOff10Per` for remaining LTCG 10% loss) reflect the original category of the loss being carried forward.
3.  **`SumOfCGIncm` and `TotScheduleCGFor23`:** These are calculated as the sum of `netGainAfterSetOff` for all categories in `aggregatedGainsLosses`. This represents the final taxable capital gains after intra-head set-offs.

## 5. Illustrative Example

Let's consider a scenario:

*   `LTCG_20_PER` (e.g., from Debt MF): Gain of +100,000
*   `LTCG_10_PER` (Sec 112A, e.g., from Equity Shares >1L): Loss of -30,000
*   `STCG_APP_RATE` (e.g., from Debt MF ST): Gain of +50,000
*   `STCG_15_PER` (Sec 111A, e.g., from Equity Shares ST): Loss of -40,000

**Processing Flow (Simplified):**

1.  **Initialization & Aggregation:**
    `aggregatedGainsLosses` map:
    *   `LTCG_20_PER`: `{ originalGainOrLoss: 100000, netGainAfterSetOff: 100000, remainingLossToCarry: 0, ... }`
    *   `LTCG_10_PER`: `{ originalGainOrLoss: -30000, netGainAfterSetOff: 0, remainingLossToCarry: 30000, ... }`
    *   `STCG_APP_RATE`: `{ originalGainOrLoss: 50000, netGainAfterSetOff: 50000, remainingLossToCarry: 0, ... }`
    *   `STCG_15_PER`: `{ originalGainOrLoss: -40000, netGainAfterSetOff: 0, remainingLossToCarry: 40000, ... }`

2.  **Set-off Rules:**
    *   **Rule 1 (LTCG Loss vs LTCG Gain):**
        *   `LTCG_10_PER` loss of 30,000 vs `LTCG_20_PER` gain of 100,000.
        *   `setOffAmount` = 30,000.
        *   `LTCG_10_PER`: `remainingLossToCarry` becomes 0, `lossFromThisCategoryUsed` becomes 30,000.
        *   `LTCG_20_PER`: `netGainAfterSetOff` becomes 70,000, `lossSetOffAgainstThisCategory` becomes 30,000.
        *   `recordSetOffInITRFields` updates:
            *   `InLossSetOff.LtclSetOff20Per` += 30,000 (assuming this field indicates LTC loss set off against LTCG 20% gain). *Correction: This field in InLossSetOff indicates an LTC loss set off against *this gain category*, so if the gain category is LTCG_20_PER, then `InLossSetOff.LtclSetOff20Per` would be where an LTC loss (from any other LTC category) would be recorded. If the loss is from LTCG_10_PER and gain is LTCG_20_PER, it means an LTC loss was set off against LTCG 20%.*
            *   `CurrYrLosses.InLtcg20Per.LtclSetOff10Per` += 30,000.
    *   No remaining LTCG losses.
    *   **Rule 3 (STCL Loss vs STCG Gain):**
        *   `STCG_15_PER` loss of 40,000 vs `STCG_APP_RATE` gain of 50,000.
        *   *(Simplified rule application - ignoring 111A restriction for this example)*
        *   `setOffAmount` = 40,000.
        *   `STCG_15_PER`: `remainingLossToCarry` becomes 0, `lossFromThisCategoryUsed` becomes 40,000.
        *   `STCG_APP_RATE`: `netGainAfterSetOff` becomes 10,000, `lossSetOffAgainstThisCategory` becomes 40,000.
        *   `recordSetOffInITRFields` updates:
            *   `InLossSetOff.StclSetoffAppRate` += 40,000.
            *   `CurrYrLosses.InStcgAppRate.StclSetoff15Per` += 40,000.
    *   No remaining STCL losses.

3.  **Populating ITR Fields (Final State):**
    *   `aggregatedGainsLosses`:
        *   `LTCG_20_PER`: `{ netGainAfterSetOff: 70000, remainingLossToCarry: 0, ... }`
        *   `LTCG_10_PER`: `{ netGainAfterSetOff: 0, remainingLossToCarry: 0, lossFromThisCategoryUsed: 30000, ... }`
        *   `STCG_APP_RATE`: `{ netGainAfterSetOff: 10000, remainingLossToCarry: 0, ... }`
        *   `STCG_15_PER`: `{ netGainAfterSetOff: 0, remainingLossToCarry: 0, lossFromThisCategoryUsed: 40000, ... }`
    *   `CurrYrLosses.InLossSetOff`:
        *   `LtclSetOff20Per`: 30,000 (LTC loss from 10% category set-off against LTCG 20% gain)
        *   `StclSetoffAppRate`: 40,000 (STC loss from 15% category set-off against STCG App Rate gain)
    *   `CurrYrLosses.LossRemainSetOff`: All fields would be 0.
    *   `SumOfCGIncm`: 70,000 (LTCG) + 10,000 (STCG) = 80,000.
    *   `TotScheduleCGFor23`: 80,000.

## 6. Key Considerations / Current TODOs

*   **STCL 111A Set-off Rules:** The most critical remaining task is to refine the set-off logic for losses under `CapitalGainTaxCategory.STCG_15_PER` (Section 111A). Currently, these losses might be incorrectly set off against non-111A STCG or LTCG. The correct rule is that STCL from Sec 111A can only be set off against STCG from Sec 111A. This was explicitly skipped for now and requires careful implementation in the set-off rule loops (Rules 3 and 4).
*   **Schema Dependency:** The population of detailed set-off fields within `InLtcg...` and `InStcg...` types is highly dependent on the exact field names and structure defined in `server/src/types/itr.ts`. The current implementation is based on the schema analyzed during development. Any changes to the ITR type definitions might require corresponding updates in this module.
*   **Order of Set-off:** The order in which losses are set off against gains (especially when multiple loss/gain categories exist) can sometimes impact which losses are utilized versus carried forward. The current implementation uses predefined arrays for iterating, which implies a certain priority. This order should align with general tax practices or specific requirements.

## 7. Conclusion

`scheduleCGPostProcessing.ts` plays a vital role in ensuring that capital gains and losses are correctly set off according to income tax rules, and that the `ScheduleCGFor23` accurately reflects these operations for subsequent tax computation and reporting. The module transforms raw gain/loss data into a structured format ready for ITR filing, detailing how various capital losses have been adjusted against capital gains. 