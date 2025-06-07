# Move to 12.5% Tax Rate for Foreign Equity LTCG

## Overview
**Post-Budget 2024**, Long Term Capital Gains (LTCG) on foreign equity (like US stocks) and unlisted shares should be taxed at **12.5%** instead of the current 20% rate. This requires adding a new tax category and updating the processing logic.

## Current Issue
- **Problem**: Foreign equity LTCG is being taxed at 20% rate instead of the correct 12.5% rate
- **Root Cause**: No 12.5% tax category exists in the current ITR schema
- **Impact**: Non-compliance with post-Budget 2024 tax regulations

## User Story
**As a** taxpayer with foreign equity investments  
**I want** my US stock LTCG to be taxed at the correct 12.5% rate post-Budget 2024  
**So that** my tax computation is accurate and compliant with current tax laws

## Acceptance Criteria

### 🔄 12.5% Tax Rate Implementation (Pending Schema Update)
- [ ] **Add new ITR type definitions** (requires IT Department schema update):
  - `InLtcg125Per` interface
  - Update `CurrYrLosses` to include `InLtcg125Per?`
  - Update set-off interfaces for 12.5% category
- [ ] **Add new CapitalGainTaxCategory**: `LTCG_12_5_PER`
- [ ] **Update US equity processor** to categorize foreign equity as 12.5% instead of 20%
- [ ] **Add ScheduleSI support** for reading 12.5% amounts from proper data hierarchy
- [ ] **Update post-processing logic** to handle 12.5% set-offs

## Technical Implementation Plan

### Phase 1: Type System Updates (Blocked - Awaiting Schema)
```typescript
// New interface needed in itr.ts (auto-generated)
export interface InLtcg125Per {
    CurrYearIncome:     number;
    CurrYrCapGain:      number;
    LtclSetOff10Per:    number;
    LtclSetOff20Per:    number;
    LtclSetOffDTAARate: number;
    StclSetoff15Per:    number;
    StclSetoff30Per:    number;
    StclSetoffAppRate:  number;
    StclSetoffDTAARate: number;
}
```

### Phase 2: Processing Logic Updates
1. **Add to CapitalGainTaxCategory enum**:
   ```typescript
   LTCG_12_5_PER = 'LTCG_12_5_PER', // Post-Budget 2024: Foreign equity, unlisted shares (12.5%)
   ```

2. **Update US equity processor** (`usCGEquityToITR.ts`):
   - Change from `InLtcg20Per` to `InLtcg125Per` for foreign equity
   - Update CurrYrLosses creation logic

3. **Add ScheduleSI support**:
   ```typescript
   const ltcg125Amount = itr.ScheduleBFLA?.LTCG125Per?.IncBFLA?.IncOfCurYrAfterSetOffBFLosses ?? 
                        itr.ScheduleCYLA?.LTCG125Per?.IncCYLA?.IncOfCurYrAfterSetOff ?? 0;
   ```

4. **Update post-processing logic** in `scheduleCGPostProcessing.ts`:
   - Add LTCG_12_5_PER to category initialization
   - Update set-off rules and precedence

## Assets Affected by 12.5% Rate
- Foreign equity (US stocks, international shares)
- Unlisted shares in Indian companies
- Other specified assets as per Budget 2024 amendments

## Section Code Mapping
- **Current**: Section `21` (20% with indexation)
- **New**: Section `5ACA1b` (12.5% for foreign equity)
- **Usage**: Use `SECCode.The5ACA1B` in ScheduleSI

## Dependencies
- **Blocker**: Updated ITR schema from IT Department
- **Requires**: New type definitions for 12.5% category
- **Testing**: Verify with sample foreign equity transactions

## Definition of Done
- [ ] Schema updates received and types regenerated
- [ ] Foreign equity LTCG shows 12.5% rate in ScheduleSI  
- [ ] Set-off logic works correctly with 12.5% category
- [ ] Integration tests pass with foreign equity data
- [ ] Tax computation reflects correct 12.5% rate for foreign assets

## Notes
- This is a **post-Budget 2024 compliance requirement**
- Currently foreign equity is incorrectly taxed at 20% instead of 12.5%
- Requires schema update for 12.5% category support
- Priority: High (tax law compliance)

## Related Files
- `server/src/generators/itr/scheduleSI.ts`
- `server/src/document-processors/usCGEquityToITR.ts`
- `server/src/generators/itr/scheduleCGPostProcessing.ts`
- `server/src/types/itr.ts` (auto-generated, requires schema update)
- `server/src/generators/itr/taxUtils.ts` 