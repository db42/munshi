# Linter Errors TODO

Total: 237 errors to fix

## Categories of Errors

### 1. Unused Variables/Imports (89 errors)
**Priority: High** - These are easy to fix and safe

#### Files with unused imports:
- `camsMFCapitalGainParser.ts`: `fs` import (line 1)
- `charlesSchwabCSVParser.ts`: `USCGEquityTransaction`, `TaxpayerInfo` (lines 4, 7)
- `geminiForm16PDFParser.ts`: Multiple unused imports (lines 5-8, 29)
- `geminiUSEquityPDFParser.ts`: Multiple unused imports (lines 5-7)
- `usEquityCGStatementCSVParser.ts`: `CapitalGainSummary` (line 7)
- `aisToITR.ts`: `createDateRangeWithQuarterDistribution` (line 145)
- `camsMFCapitalGainToITR.ts`: Multiple unused imports (lines 1, 5)
- `form26ASToITR.ts`: Multiple unused imports (lines 6, 22-31)
- `formITR2.ts`: `form16` (line 4)
- `initializers.ts`: Multiple unused imports (lines 4, 13-26)
- `scheduleTDS1.ts`: `StateCode` (line 2)
- `usCGEquityToITR.ts`: Multiple unused imports (lines 2, 25-26)
- `usInvestmentIncomeToITR.ts`: Multiple unused imports (lines 1, 3-4)
- `userInputToITR.ts`: Multiple unused imports (lines 2, 6)
- `documentService.ts`: `DocumentType` (line 2)
- `parsedDocumentService.ts`: Multiple unused imports (lines 8-14)
- And many more...

#### Files with unused variables:
- `aisToITR.ts`: `epfInterestDistribution` (line 239)
- `camsMFCapitalGainToITR.ts`: Multiple unused variables (lines 366-367, 541)
- `charlesSchwabToITR.ts`: `accountNumber`, `isInCalendarYear` (lines 74, 160)
- `example.ts`: `validatedITR`, `validatedPersonalInfo` (lines 60, 73)
- And many more...

### 2. Explicit 'any' Types (78 errors)
**Priority: Medium** - Need proper typing

#### Files to fix:
- `camsMFCapitalGainParser.ts`: 22 instances
- `types/itr.ts`: 43 instances  
- `services/validations.ts`: 7 instances
- `tests/eval-itr-test.ts`: 11 instances
- `utils/logger.ts`: 8 instances
- And others...

### 3. Regex Escape Characters (12 errors)
**Priority: Low** - Easy fixes in regex patterns

#### Files:
- `camsMFCapitalGainParser.ts`: Lines 396-398, 411

### 4. Irregular Whitespace (4 errors)
**Priority: Low** - Simple whitespace fixes

#### Files:
- `types/itr.ts`: Lines 507, 565, 1030, 2877

### 5. Other Issues (54 errors)
**Priority: Variable**

#### no-undef:
- `routes/documents.ts`: `Express` not defined (line 37)

#### no-prototype-builtins:
- `types/itr.ts`: hasOwnProperty usage (lines 6827-6829)

#### no-empty:
- `types/itr.ts`: Empty block statement (line 6769)

#### no-useless-escape:
- Various regex patterns

## Fixing Strategy

### Phase 1: Unused Variables/Imports ✅ START HERE
- Safe to remove
- No functional impact
- Quick wins

### Phase 2: Simple Fixes (Regex, Whitespace)
- Low risk changes
- Easy to validate

### Phase 3: Type Fixes
- Replace `any` with proper types
- More complex but important for type safety

### Phase 4: Other Issues
- Handle remaining edge cases

## Current Status
- [🔄] Phase 1: Unused Variables/Imports (Progress: 237→197 errors, 40 fixed)
  - ✅ Fixed: camsMFCapitalGainParser.ts unused import
  - ✅ Fixed: charlesSchwabCSVParser.ts unused imports  
  - ✅ Fixed: geminiForm16PDFParser.ts unused imports
  - ✅ Fixed: geminiUSEquityPDFParser.ts unused imports
  - ✅ Fixed: usEquityCGStatementCSVParser.ts unused imports
  - ✅ Fixed: creationInfo.ts, formITR2.ts unused parameters
  - ✅ Fixed: equityPriceUtils.ts unused variable
  - ✅ Fixed: scheduleTDS1.ts, initializers.ts unused imports
  - ✅ Fixed: index.ts unused variables
  - ✅ Fixed: routes/documents.ts Express typing issue
  - ✅ Fixed: userInputToITR.ts, usCGEquityToITR.ts, camsMFCapitalGainToITR.ts unused imports
  - ✅ Deleted: Problematic example.ts and tax calculator files
- [ ] Phase 2: Simple Fixes (16 errors)  
- [ ] Phase 3: Type Fixes (78 errors)
- [ ] Phase 4: Other Issues (54 errors)

**Current: 197 errors remaining** 