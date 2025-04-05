
# Domain-Driven Split Plan for itrService.ts

## Directory Structure

```
server/
├── src/
│   ├── transformers/                          # New folder for all transformers
│   │   ├── capital-gains-transformers.ts      # Capital gains related transformers
│   │   ├── other-sources-transformers.ts      # Other sources income transformers
│   │   ├── foreign-income-transformers.ts     # Foreign income transformers
│   │   ├── tax-relief-transformers.ts         # Tax relief transformers
│   │   └── index.ts                           # Exports all transformers
│   │
│   ├── processors/                            # New folder for document processors
│   │   ├── form16-processor.ts                # Form16 document processor
│   │   ├── us-equity-dividend-processor.ts    # US equity dividend processor
│   │   ├── us-capital-gains-processor.ts      # US capital gains processor 
│   │   └── index.ts                           # Exports all processors
│   │
│   ├── services/
│   │   ├── itr-service.ts                     # Simplified core service
│   │   └── transformer-registry.ts            # Registry that imports all transformers
│   │
│   ├── types/                                 # Existing types folder (unchanged)
│   └── utils/                                 # Existing utils folder (unchanged)
```

## Module Responsibilities

### 1. Transformer Modules

Each transformer file will focus on a specific tax domain:

- **capital-gains-transformers.ts**:
  - Schedule CG transformer
  - Part B-TI Capital Gains transformer
  - Merging logic for capital gains

- **other-sources-transformers.ts**:
  - Schedule OS transformer
  - Income from Other Sources transformer
  - Dividend income handling

- **foreign-income-transformers.ts**:
  - Schedule FSI transformer
  - Foreign source income handling

- **tax-relief-transformers.ts**:
  - Schedule TR1 transformer
  - Tax credit calculations

### 2. Document Processors

Dedicated processors for each document type:

- **form16-processor.ts**:
  - Functions to process Form16 documents
  - Conversion to ITR sections

- **us-equity-dividend-processor.ts**:
  - Process US equity dividend documents
  - Convert to appropriate ITR sections

- **us-capital-gains-processor.ts**:
  - Process US capital gains documents
  - Convert to appropriate ITR sections

### 3. Core Services

- **transformer-registry.ts**:
  - Import and register all transformers
  - Provide a unified interface for section transformation

- **itr-service.ts** (simplified):
  - Orchestrate document processing
  - Use transformer registry to apply transformations
  - Handle high-level ITR generation flow

## Implementation Approach

1. Create the new directory structure
2. Extract transformers into their respective domain files
3. Move document processing logic to dedicated processor files
4. Update the core itr-service to use the new modules
5. Create the transformer registry to centralize transformer access

This approach maintains the existing types and utils structure while significantly improving organization and maintainability of the transformation and processing logic.
