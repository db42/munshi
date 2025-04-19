# TODO: Implement Previous Year ITR Document Processor for AMT Credit

## User Story

**As a** taxpayer who has paid Alternative Minimum Tax in previous years  
**I want** the system to automatically extract my previous AMT credits from last year's ITR  
**So that** I can utilize these credits to reduce my tax liability in the current year

## Background

The Alternative Minimum Tax (AMT) credit is a carryforward benefit that taxpayers can use in subsequent years if they've paid AMT previously. Currently, the system calculates AMT for the current year but doesn't have access to previous years' credit information.

## Requirements

1. Create a document processor that extracts AMT credit information from previous year's ITR
   - Parse the ScheduleAMTC section from the uploaded previous year's ITR JSON
   - Extract details of unutilized credits with their assessment years
   - Validate the data for consistency

2. Add transformer for previous ITR AMT credit data
   - Add a new transformer to handle the AMT credit data
   - Create appropriate section type in the ITRSectionType enum
   - Make sure the transformer properly merges with any existing data

3. Update the AMT credit calculation in scheduleAMTC.ts
   - Modify the calculateScheduleAMTC function to incorporate previous years' credits
   - Implement FIFO (First-In-First-Out) logic for utilizing credits
   - Add appropriate validation and edge case handling

4. Update the UI to show AMT credit utilization
   - Add a section in the ITR summary showing AMT credits brought forward
   - Display how much credit was utilized in the current year
   - Show the balance credits being carried forward

## Acceptance Criteria

- The system should correctly extract AMT credit information from previous year's ITR
- Previous years' credits should be correctly applied to reduce current year tax liability
- Credits should be utilized in chronological order (FIFO)
- The interface should clearly display information about AMT credits
- All AMT credit calculations should conform to the tax regulations in section 115JD of the Income Tax Act

## Technical Notes

- The implementation should maintain the separation between document processing and tax calculation
- Credit data structure should follow the ScheduleAMTCDtls format defined in the ITR schema
- The calculation should be performed after PartB-TTI is calculated but before finalizing the ITR 