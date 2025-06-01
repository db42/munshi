# Plan for Implementing Form 26AS Support

1. [done] **Define Parsed Form 26AS Data Type**: Create a new TypeScript interface in `server/src/types/form26AS.ts` for the structured data that will be extracted from Form 26AS.
1.5. [done] **Verify Client-Side Upload for Form 26AS**: Ensure the client UI (`DocumentsPortal.tsx`) correctly allows selecting "Form 26AS" and uses the `form26AS` document type identifier during upload.
2. [done] **Create Form 26AS Parser**:
    *   [done] Add a new file, `server/src/document-parsers/form26ASPDFParser.ts`. This will contain logic to parse Form 26AS PDF (identified by `documentType: 'form26AS'`) and output the `ParsedForm26AS` JSON structure (`AnnualTaxStatement`). (Pending manual testing)
3. [wip] **Identify and Define ITR Section Types & Merger Logic**:
    *   [done] `ScheduleTDS1`: Implemented in form26ASToITR.ts with proper section 192 filtering for salary TDS.
    *   [done] `ScheduleTDS2`: Implemented in form26ASToITR.ts with non-salary TDS processing and proper transaction filtering.
    *   [done] `ScheduleTCS`: Implemented in form26ASToITR.ts with Part VI collector data processing.
    *   [done] `ScheduleIT`: Implemented in form26ASToITR.ts with Part III challan payment details processing.
    *   [done] `ScheduleOS`: Implemented in form26ASToITR.ts with section 194A interest income processing.
    *   [done] `ScheduleSI`: Implemented in form26ASToITR.ts with special income rates for lottery/horse race winnings.
    *   [done] `ScheduleS`: Implemented in form26ASToITR.ts with salary data from section 192 transactions.
    *   [todo] Create merger functions in `server/src/generators/itr/itr.ts` for the new schedules.
4. [done] **Create Form 26AS Processor**:
    *   [done] Add a new file, `server/src/document-processors/form26ASToITR.ts`. This processor takes `ParsedForm26AS` JSON and converts it into ITR schedule objects with proper section-based filtering and type safety improvements.
5. [todo] **Update `parsedDocuments` Service**:
    *   [todo] Add a new method in `server/src/services/parsedDocument.ts` to retrieve parsed Form 26AS data (documents with `documentType: 'form26AS'`).
6. [todo] **Update ITR Generation Logic (`server/src/generators/itr/itr.ts`)**:
    *   [todo] Add `ITRSectionType.SCHEDULE_TCS` to the `ITRSectionType` enum (if not already present from `ScheduleTCS` type definition).
    *   [todo] Add the new transformers for all Form 26AS schedules to the `sectionTransformers` object.
    *   [todo] In the `generateITR` function, add logic to fetch parsed Form 26AS data (via the new `parsedDocuments` service method), call the new `form26ASToITR` processor, and add the resulting `ITRSection` objects to the `sectionsToMerge` array.
7. [todo] **Update `Readme.md`**:
    *   [todo] Update the project documentation to reflect Form 26AS support, including the new parser and processor files in the project structure overview.

## Questions Answered:

1.  **Define the parsed datatype for this document:**
    The file `server/src/types/form26AS.ts` has been updated with a comprehensive `AnnualTaxStatement` interface and its related types, as provided by the user. The main exported type is `ParsedForm26AS = AnnualTaxStatement;`. This includes detailed structures for:
    *   `DocumentHeader`
    *   `PartIDetails` (TDS)
    *   `PartIIDetails` (TDS for 15G/15H)
    *   `PartIIIDetails` (Transactions under Proviso to section 194B/...)
    *   `PartIVDetails` (TDS u/s 194IA/194IB/194M/194S)
    *   `PartVDetails` (Transactions u/s 194S as per Form-26QE)
    *   `PartVIDetails` (TCS)
    *   `PartVIIDetails` (Paid Refund)
    *   `PartVIIIDetails` (TDS u/s 194IA/194IB/194M/194S for Buyer/Tenant)
    *   `PartIXDetails` (Transactions/Demand Payments u/s 194S as per Form 26QE)
    *   `PartXDetails` (TDS/TCS Defaults)
    *   `ContactInformationEntry`
    *   `LegendsContainer`
    *   `SectionEntry`
    *   `MinorOrMajorHeadEntry`
    *   `GlossaryEntry`

2.  **What all sections should be impacted by this form?**
    *   **`ScheduleTDS1` & `ScheduleTDS2` (Tax Deducted at Source)**: Information from `PartIDetails`, `PartIIDetails`, `PartIIIDetails`, `PartIVDetails`, `PartVIIIDetails` will likely feed into these. `PartI` (TDS) seems most relevant for `ScheduleTDS2`. TDS on salary (if present in Form 26AS `PartI`) would go to `ScheduleTDS1`, but usually Form 16 is the primary source for that.
    *   **`ScheduleTCS` (Tax Collected at Source)**: Information from `PartVIDetails` will populate this.
    *   **`ScheduleIT` (Details of Advance Tax and Self Assessment Tax Payments)**: Although Form 26AS has sections for various tax payments (e.g., within Part IV, V, VIII, IX for specific transaction-related TDS/deposits), traditional Advance Tax / Self-Assessment tax challans are typically reported directly by the user or via other statements. We need to clarify if any part of *this specific* Form 26AS structure directly maps to general advance/self-assessment tax payments that should go into `ScheduleIT`. User-provided challan details via `userInputToITR.ts` currently populate `ScheduleIT`.
    *   **`PartVIIDetails` (Paid Refund)**: This information is important for reconciliation and reporting but might not directly map to a schedule that sums to total income or tax liability. It could be used for verification or in a summary section.
    *   **`PartXDetails` (TDS/TCS Defaults)**: This is important for noting defaults but doesn't directly contribute to income/tax calculations, more for compliance verification.
    *   **Verification**: `DocumentHeader` (PAN, Name, AY, FY) is crucial for validating the document against user details.
    *   Other parts (Legends, Sections, Glossary, etc.) are for informational/parsing context.

    The key ITR schedules to focus on for data extraction and merging from Form 26AS will be `ScheduleTDS1`, `ScheduleTDS2`, `ScheduleTCS`, and potentially `ScheduleIT` if direct Advance/Self-Assessment tax payments are found within its structure (beyond transactional tax deposits). 