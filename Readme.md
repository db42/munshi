This is a income tax return filing utility written from scratch to bake generative AI into the architecture. This is for India.

There are three key workflows:

### Workflow 1: Classify and parse documents

Workflow 1.1

Classify documents. This will use generative AI

Workflow 1.2

Parse documents (PDFs) to structured CSVs. 
- For form 16, we'll use generative AI to parse.
- This can be deterministic code for other forms generated with help from generative AI.

### Workflow 2: Core ITR generation and calculation engine

This will compute the final taxes based on both new and old tax regime.

### Workflow 3: Review ITR

This is the key differentiator of this project. This workflow will use generative AIs in:

- Decide which ITR to file
- Reviewing the generated ITR for accuracy e.g. advice to fill certain mandatory sections if TDS has been claimed for foreign taxes
- Providing recommendations for saving taxes both in current return as well as plan for future

## Detailed workflows

### Documents portal
- upload docs
- UI to upload, list and view all 
 
Implementation
- upload all docs to S3
- one folder per user and per ITR
- define a relational table (documents) to keep track of all of these files

### Core ITR generation and calculation engine  

- define in-memory data structure for a tax return
- ability to export to JSON
- support different types of ITRs

High level approach:

This is a bunch of steps where each step will generate details for one section - either logical section or mapping directly to section defined by ITR.

(Based on ITR selected)

ITR -> Generate Income sources -> Generate deductions -> Fill Schedule FA -> Validation

# MVP

Tech Stack:
- Use Typescript in both backend and client
- Backend: Nodejs based service
- Client: ReactJS app
- Client and backend talk in REST APIs
- Validation can be used using tool like Zod


Folder structure:
munshi
* client
* server

# Resources
- schema and validation rules - https://www.incometax.gov.in/iec/foportal/downloads#itr-2 
