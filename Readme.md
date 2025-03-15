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

# Todo

- Generate ITR - define schema, validate - DONE
- parse form 16 form - DONE
- generate first version of from information parsed from form 16, - DONE
- API to give JSON - DONE
- perfect logic to parse information mentioned in form 16 - use own json from last year - DONE
- US equity - DONE, validate the computations
- handle currency format from US Equity - DONE
- update period for CG gain from US Equity - DONE
- handle sectionFA from US Equity - DONE
- handle peak logic, conversion to INR - DONE
- verify the computations for sectionFA - WIP
- support for previous ITR in the computations for sectionFA - 
- documents portal -> view parsed data for each file
- json renderer in client and ability to update fields in json
- Document Portal - link upload doc
- Document Portal - view docs
- parse form 26AS
- India CG
- add validation

# Resources
- schema and validation rules - https://www.incometax.gov.in/iec/foportal/downloads#itr-2 
