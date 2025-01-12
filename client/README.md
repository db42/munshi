# Munshi Client

React-based frontend for the Munshi tax filing application.

## Prerequisites

- Node.js (v18 or later)
- npm (v8 or later)

## Quick Start

1. Install dependencies:
```bash
cd client
npm install
```

2. Initialize Tailwind CSS:
```bash
npx tailwindcss init -p
```
This will create `tailwind.config.js` and `postcss.config.js` files needed for styling.

3. Start development server:
```bash
npm run start
```
The application will be available at `http://localhost:5173`

4. Build for production:
```bash
npm run build
```
## Project Structure

```
client/
├── src/
│   ├── components/     # Reusable components
│   │   ├── layout/     # Layout components
│   │   └── documents/  # Document-related components
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   ├── utils/         # Helper functions
│   └── App.tsx        # Main application component
├── public/           # Static files
└── README.md         # This file
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Development Guidelines

1. **Code Style**
   - Use TypeScript for all new files
   - Follow ESLint and Prettier configurations
   - Use functional components and hooks

2. **Component Structure**
   - Keep components small and focused
   - Use composition over inheritance
   - Place shared components in `components/`
   - Place page components in `pages/`

3. **State Management**
   - Use React hooks for local state
   - Plan to add global state management when needed

4. **Routing**
   - Use React Router for navigation
   - Keep routes organized in App.tsx

5. **TypeScript**
   - Define interfaces for all props
   - Use type inference where possible
   - Export types that are used across files

## Adding New Features

1. Create new components in appropriate directories
2. Add TypeScript interfaces if needed
3. Update routing if adding new pages
4. Add to navigation if it's a main feature

## Coding Standards

- Use meaningful variable and function names
- Add comments for complex logic
- Keep files focused and manageable in size
- Write reusable components
- Include proper error handling