# Munshi Server

Node.js + TypeScript based server for the Munshi tax filing application.

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

## Project Structure

```
server/
├── src/
│   ├── config/        # Configuration files
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── index.ts       # Main application entry
├── tests/            # Test files
├── dist/             # Compiled JavaScript files
└── package.json      # Project dependencies
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
- download as csv in src/scripts/USD-INR-data.csv
- run `node src/scripts/parseUSDINR.js`
- move `src/scripts/usd_inr_rates.json` to `src/utils/usd_inr_rates.json`


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

## PostgreSQL commands

```
psql -U dushyant.bansal -h localhost -p 5432 -d munshi
\dt
SELECT * FROM documents;
```
