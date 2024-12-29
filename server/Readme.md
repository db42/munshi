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
cd server
npm install
npm run generate-itr-types
npm run db-init
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start development server:
```bash
# Run in development mode with hot reload
npm run dev

# Or build and run in production mode
npm run build
npm start
```

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
  -F "file=@/Users/dushyant.bansal/Downloads/Form-16.pdf" \
  -F "ownerId=123" \
  -F "assessmentYear=2024-25"

curl -X POST 'http://localhost:3000/api/documents/process' \
-H 'Content-Type: application/json' \
-d '{
  "documentId": "fd54348a-b049-45b1-8026-ebfad4122dce"
}'
```