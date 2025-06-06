# ITR Processing Knowledge Base

This folder contains critical implementation knowledge and lessons learned from developing and fixing the ITR (Income Tax Return) processing system.

## Documents

### 1. [Section 112A LTCG Tax Calculations](./section-112a-ltcg-tax-calculations.md)
**Key Learning**: The ₹1 lakh exemption under Section 112A should only be applied during tax calculation, not when determining reportable income amounts.

**Impact**: Fixed incorrect LTCG tax calculations that were reducing reportable income instead of just the tax liability.

**Validation Sources**: 
- CBDT official FAQ
- ClearTax professional documentation  
- Income Tax Department ITR-2 user manual

### 2. [ITR Calculation Sequence & Dependencies](./itr-calculation-sequence.md) 
**Key Learning**: Schedule SI (Special Income) must be calculated **after** Schedule BFLA (Brought Forward Loss Adjustment) to ensure correct tax calculations.

**Impact**: Fixed a critical bug where capital gains taxes were calculated on pre-BFLA amounts instead of post-BFLA adjusted amounts.

**Evidence**: Test case showing ₹64,384 → ₹7,902 tax correction

### 3. [Part B-TI Income Field Distinctions](./part-b-ti-income-field-distinctions.md)
**Key Learning**: Different income fields in Part B-TI serve distinct purposes and must be calculated differently to avoid double taxation.

**Impact**: Fixed critical bugs in TotalTI and AggregateIncome calculations that were causing incorrect tax computations.

**Evidence**: Real test case showing proper field separation and ₹52,401 tax liability correction

## Major Fixes Documented

### 1. Section 112A Exemption Timing
- **Problem**: Applying ₹1L exemption to `SplRateInc` field instead of tax calculation
- **Solution**: Show gross amount in `SplRateInc`, apply exemption only in `SplRateIncTax`
- **Result**: Correct ITR compliance and proper tax calculation

### 2. Schedule Calculation Dependencies  
- **Problem**: Schedule SI calculated before brought forward losses applied
- **Solution**: Ensured ScheduleSI uses post-BFLA amounts, not original ScheduleCG amounts
- **Result**: Accurate tax computation reflecting loss adjustments

### 3. Part B-TI Field Distinctions
- **Problem**: TotalTI and AggregateIncome incorrectly calculated, causing double taxation
- **Solution**: TotalTI shows income before BFLA, AggregateIncome excludes special rate income
- **Result**: Proper tax separation between normal and special rates

## Test Validation

Both fixes have been validated against:
- ITR AY 2024-25 regression test suite
- Real-world test cases with complex capital gains scenarios  
- Official documentation and expert sources

## Implementation Files

Key files where these learnings are implemented:
- `/server/src/generators/itr/scheduleSI.ts` - Section 112A calculations
- `/server/src/generators/itr/itr.ts` - Overall calculation sequence (lines 905-921)
- `/server/src/generators/itr/scheduleBFLA.ts` - Loss adjustment calculations

## Regression Prevention

These documents serve as:
1. **Implementation guides** for future developers
2. **Validation checklists** for testing complex tax scenarios
3. **Source references** for tax law interpretation
4. **Debugging aids** when similar issues arise

---

**Last Updated**: December 2024  
**Contributing**: When adding new knowledge, follow the pattern of:
1. Clear problem statement
2. Root cause analysis  
3. Solution with code examples
4. Official source validation
5. Test case evidence 