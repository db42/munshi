# Munshi Server

Node.js + TypeScript based server for the Munshi tax filing application.

## Prerequisites

- Node.js (v22 or later)
- npm (v10 or later)

## Project Structure

```
server/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Request handlers
│   ├── db/            # Database schema and migrations
│   ├── document-parsers/ # Parsers for different document types
│   │   ├── geminiAISPDFParser.ts           # Parses Annual Information Statement (AIS) from PDF using Gemini
│   │   ├── geminiForm16PDFParser.ts        # Parses Form 16 PDF using Gemini
│   │   ├── geminiUSEquityPDFParser.ts      # Parses US Equity related PDFs using Gemini
│   │   ├── usEquityCGStatementCSVParser.ts # Parses CSV statements for US equity capital gains
│   │   ├── usEquityDividendCSVParser.ts    # Parses CSV statements for US equity dividend income
│   │   ├── camsMFCapitalGainParser.ts      # Parses CAMS mutual fund capital gain statements
│   │   └── charlesSchwabCSVParser.ts       # Parses Charles Schwab CSV brokerage statements
│   ├── document-processors/ # Logic to convert parsed documents to ITR sections
│   │   ├── form16ToITR.ts                  # Converts Form 16 data to ITR sections
│   │   ├── aisToITR.ts                     # Converts AIS data to ITR sections
│   │   ├── usCGEquityToITR.ts              # Converts US equity capital gains data to ITR sections
│   │   ├── usInvestmentIncomeToITR.ts      # Converts US investment income (dividends, etc.) to ITR sections
│   │   ├── camsMFCapitalGainToITR.ts       # Converts CAMS mutual fund capital gains to ITR sections
│   │   ├── charlesSchwabToITR.ts           # Converts Charles Schwab statement data to ITR sections (e.g., Schedule FA)
│   │   └── userInputToITR.ts               # Converts user-provided input into ITR sections
│   ├── generators/    # Code generators
│   │   └── itr/         # ITR generation logic
│   │       ├── itr.ts   # Main ITR generation orchestrator
│   │       ├── partBTI.ts # Calculates Part B - Total Income
│   │       ├── partBTTI.ts # Calculates Part B - Taxable Total Income
│   │       ├── scheduleCYLA.ts # Calculates Schedule CYLA (Current Year Loss Adjustment)
│   │       ├── calculateScheduleBFLA.ts # Calculates Schedule BFLA (Brought Forward Loss Adjustment)
│   │       ├── scheduleSI.ts   # Calculates Schedule SI (Special Income)
│   │       ├── scheduleAMTC.ts # Calculates Schedule AMTC (Alternative Minimum Tax Credit)
│   │       └── scheduleCGPostProcessing.ts # Post-processes Schedule CG
│   ├── routes/        # API routes
│   ├── scripts/       # Utility scripts
│   ├── services/      # Business logic
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Utility functions
│   └── index.ts       # Main application entry point
├── tests/            # Test files
├── dist/             # Compiled JavaScript files
├── docs/             # Project documentation
├── node_modules/     # Project dependencies
├── schema/           # JSON schemas
├── .env              # Environment variables (gitignored)
├── .env.example      # Example environment variables
├── nodemon.json      # Nodemon configuration
├── package.json      # Project dependencies and scripts
├── package-lock.json # Exact versions of dependencies
└── tsconfig.json     # TypeScript compiler options
```

## High level design

1. **Document Parsing**: The system features a flexible document parsing pipeline:
   - PDF and CSV documents are processed by specialized parsers (e.g., Form 16, AIS, US 1099, CAMS Capital Gains, Charles Schwab statements).
   - Parsers extract structured data, transforming it into standardized JSON formats.
   - This parsed data undergoes validation before being stored in the database.

2. **Modular Document Processing**: The architecture incorporates distinct document processors (e.g., `form16ToITR`, `aisToITR`, `usCGEquityToITR`, `camsMFCapitalGainToITR`). These modules are responsible for converting various parsed document types into relevant ITR sections.

3. **ITR Section Merging**: Sophisticated logic, using a registry of section-specific transformers, is in place to merge data from multiple document sources and user inputs into a consolidated ITR. Each document and user input contributes partial ITR sections, which are then systematically merged into a base ITR structure.

4. **ITR Computation and Post-Processing**: After initial merging, a series of calculations and post-processing steps are performed:
   - **Intra-head set-offs**: Capital gains and losses within `Schedule CG` are set off.
   - **Schedule CYLA (Current Year Loss Adjustment)**: Losses from one head of income are set off against income from another head in the current year.
   - **Schedule BFLA (Brought Forward Loss Adjustment)**: Losses brought forward from previous years are set off against current year income.
   - **PartB-TI (Total Income)**: Calculation of gross total income after all set-offs.
   - **Schedule SI (Special Income)**: Income taxable at special rates is computed.
   - **PartB-TTI (Taxable Total Income & Tax Liability)**: Final tax liability is calculated, considering applicable tax regimes, rebates, surcharge, and cess.
   - **Schedule AMTC (Alternative Minimum Tax Credit)**: Calculated if applicable.

5. **User Input Integration**: The system allows users to provide additional data (e.g., previous year's carried forward losses, bank details for refunds, self-assessment tax payments) which is merged into the ITR at appropriate stages.

## Getting Started

1. Install dependencies:
```bash
nvm use 22
cd server
npm install
npm run generate-itr-types
npm run db:init
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run PostgreSQL
```bash
brew services start postgresql@14
```

if some error `Bootstrap failed: 5: Input/output error`, do:

```bash
brew services stop postgresql@14
```

4. Start development server:
```bash
# Run in development mode with hot reload
npm run dev

# Or build and run in production mode
npm run build
npm start
```
# Run in debug mode
1. open `run and debug` in vscode or cursor
2. run `Debug server npm dev`. This config is defined in `munshi/.vscode/launch.json`


5. [One time] Generate USD_INR data
- generate data on google sheets https://docs.google.com/spreadsheets/d/1G82gVR0Iza3G8SRutVzoToJ-gKeBpd9AdD-rnCcVVjE/edit?gid=0#gid=0 
- download as csv in src/scripts/USD INR data - Sheet1.csv
- run `node src/scripts/parseUSDINR.js`
- this will generate `src/utils/usd_inr_rates.json`

6. [One time] Generate US equity closing price data
- generate data on google sheets https://docs.google.com/spreadsheets/d/1q4SlvPVYFa2Mfe9-UeX1El5H_WT2owGfZrNvO1AUf2o/edit?gid=0#gid=0
- download as csv in src/scripts/US equity price data - Sheet1.csv
- run `node src/scripts/parseUSEquityClosingPriceData.js`
- this will generate src/utils/usd-equity-closing-price-data.json


## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the TypeScript code
- `npm start` - Run the built code in production mode
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Development

The server uses:
- `express` for HTTP server
- `typescript` for type safety
- `nodemon` for development hot reload
- `dotenv` for environment variables
- `winston` for logging

## Environment Variables

Create a `.env` file with these variables:

```env
PORT=3000
NODE_ENV=development
```

## Curl requests

```
curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@/Users/dushyant.bansal/work/munshi/Form-16.pdf" \
  -F "ownerId=123" \
  -F "assessmentYear=2024-25"

curl -X POST 'http://localhost:3000/api/documents/process' \
-H 'Content-Type: application/json' \
-d '{
  "documentId": "600c08ab-9dfc-4489-8b1c-ce372c72f9eb"
}'

curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@/Users/dushyant.bansal/work/munshi/charles-year-end.pdf" \
  -F "ownerId=123" \
  -F "assessmentYear=2024-25" \
  -F "documentType=USEquityCapitalGainStatement"


curl -X POST 'http://localhost:3000/api/documents/process' \
-H 'Content-Type: application/json' \
-d '{
  "documentId": "b77b2368-aeff-4469-82ea-670c2d0885c4"
}'


curl -X POST http://localhost:3000/api/documents/upload \
  -F "file=@/Users/dushyant.bansal/work/munshi/Individual_XXX947_Transactions_20250308-033239.csv;type=text/csv" \
  -F "ownerId=123" \
  -F "assessmentYear=2024-25" \
  -F "documentType=USEquityStatement"

curl -X POST 'http://localhost:3000/api/documents/process' \
-H 'Content-Type: application/json' \
-d '{
  "documentId": "a3304148-8097-4637-a1a7-44b83de59ab4"
}'


```

Goto http://localhost:3000/api/itr/123/2024-25 to see the processes ITR - WIP

**Full integration test**
1. `curl http://localhost:3000/api/itr/123/2024-25 > ../client/public/generated-itr-ay-2024-25.json`
2. goto http://localhost:5173/diff-viewer

## GET Document Endpoints

```
# Get all documents for a user
curl -X GET http://localhost:3000/api/documents/user/123

# Get documents for a user by assessment year
curl -X GET http://localhost:3000/api/documents/user/123/year/2024-25

# Get a single document by ID
curl -X GET http://localhost:3000/api/documents/600c08ab-9dfc-4489-8b1c-ce372c72f9eb
```

## PostgreSQL commands

```
psql -U dushyant.bansal -h localhost -p 5432 -d munshi
\dt
SELECT * FROM documents;
```

