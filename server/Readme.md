# Munshi Server

Node.js + TypeScript based server for the Munshi tax filing application.

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

## Project Structure

```
server/
├── dist/                 # Compiled JavaScript output
├── node_modules/         # Project dependencies (usually not committed)
├── src/
│   ├── config/           # Configuration (database, APIs like Gemini)
│   ├── db/               # Database related files (e.g., init scripts)
│   ├── document-parsers/ # Logic to parse raw document data (PDFs, CSVs) using various methods
│   ├── document-processors/ # Logic to convert parsed data into specific ITR sections
│   ├── generators/       # Logic to generate final ITR structure (e.g., calculations like PartB-TI, PartB-TTI)
│   │   └── itr/          # ITR-specific generation logic
│   ├── routes/           # API route definitions (Express)
│   ├── scripts/          # Utility scripts (data parsing, setup, one-off tasks)
│   ├── services/         # Business logic, database interactions, external API calls
│   ├── types/            # TypeScript type definitions (shared interfaces for Form16, ITR, etc.)
│   ├── uploads/          # Directory for uploaded files (may need cleanup strategy)
│   ├── utils/            # Shared utility functions (dates, logging, currency, formatting)
│   ├── index.ts          # Main application entry point
│   └── example.ts        # Example usage or script (if relevant)
├── tests/                # Test files (if any)
├── .env                  # Environment variables (local, not committed)
├── .env.example          # Example environment variables
├── .gitignore            # Files/directories ignored by Git
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Exact dependency versions
├── README.md             # This file
└── tsconfig.json         # TypeScript compiler options
```

## Getting Started

1. Install dependencies:
```bash
nvm use 18
cd server
npm install
npm run generate-itr-types
npm run db-init
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Run PostgreSQL
```bash
brew services start postgresql
```

4. Start development server:
```bash
# Run in development mode with hot reload
npm run dev

# Or build and run in production mode
npm run build
npm start
```

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
