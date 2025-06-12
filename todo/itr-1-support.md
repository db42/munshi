# ITR-1 Support Implementation Plan

This document tracks the tasks required to add support for generating ITR-1 by transforming it from a fully computed ITR-2.

- [x] **Task 1: Create ITR-1 Type Definitions**
    - [x] ~~Create `src/types/itr-1.ts`~~ This file already exists at `server/src/types/itr-1.ts`.

- [x] **Task 2: Implement ITR-1 Eligibility Check**
    - [x] Create a new file `server/src/generators/itr/itrEligibility.ts`.
    - [x] Implement the `isEligibleForITR1(itr2: Itr2): boolean` function as outlined in the user story. This function will contain all the logic to validate if an `Itr2` object can be converted to `Itr1`.

- [x] **Task 3: Implement ITR-2 to ITR-1 Transformer**
    - [x] Create a new file `server/src/generators/itr/transformITR.ts`.
    - [x] Implement the `transformITR2toITR1(itr2: Itr2): Itr1` function. This function will handle the mapping and aggregation of data from `Itr2` to `Itr1`.

- [x] **Task 4: Update `generateITR` Orchestrator**
    - [x] Modify the `generateITR` function in `server/src/generators/itr/itr.ts`.
    - [x] Import and use `isEligibleForITR1` after the complete `Itr2` object is constructed.
    - [x] If eligible, call `transformITR2toITR1` to get the final `Itr1` object.
    - [x] Structure the final return object correctly based on whether `ITR1` or `ITR2` is generated.

- [ ] **Task 5: Update Documentation**
    - [ ] Edit `Readme.md` to reflect the new "superset-first" design approach for generating different ITR forms as suggested in the user story. 