# Testing Process: What Happens When You Run `npm test`

This document outlines the sequence of events that occurs when the `npm test` command is executed in this project.

### 1. Script Execution

-   **`npm`** looks inside `client/package.json` in the `scripts` section.
-   It finds the key `"test"` and runs the associated command: `vitest`.

### 2. Vitest Initialization

-   The **`vitest`** process starts.
-   It automatically finds and reads the project's Vite configuration from `client/vite.config.ts`.

### 3. Test Environment Setup

Based on the `test` object in the Vite config, Vitest performs several key setup actions:

-   `environment: 'jsdom'`: It creates a **simulated browser environment**. This gives tests access to browser-specific globals like `window` and `document`, even though they run in Node.js.
-   `globals: true`: It injects its testing functions (`describe`, `it`, `expect`, `vi`, etc.) into the global scope, so you don't need to import them in every test file.
-   `setupFiles: './src/setupTests.ts'`: It identifies the path to the global test setup file.

### 4. Global Setup File Execution

Before any tests run, Vitest executes `src/setupTests.ts`, which does two critical things:
1.  **Imports Matchers**: It imports `@testing-library/jest-dom`, which adds useful assertion methods like `.toBeInTheDocument()` to Vitest's `expect` function.
2.  **Mocks Browser APIs**: It mocks `window.matchMedia`, defining a fake version of this function so that components relying on it don't crash in the `jsdom` environment.

### 5. Test Discovery and Execution

-   Vitest scans the project for test files (e.g., files ending in `.test.tsx` or located in `__tests__` directories).
-   It discovers `client/src/__tests__/App.test.tsx` and begins executing the code inside it.

### 6. Component Rendering

-   Inside the test, the `customRender(<App />)` helper function is called.
-   This renders the `<App />` component, but critically wraps it with the necessary context providers (`UserProvider`, `AssessmentYearProvider`, etc.) defined in the test file.
-   The entire React component tree is rendered into the virtual DOM provided by `jsdom`.

### 7. Assertion

-   The assertion line, `expect(screen.getByText('Dashboard Content')).toBeInTheDocument()`, runs.
-   `screen.getByText(...)` searches the rendered virtual DOM for the specified text.
-   `.toBeInTheDocument()` confirms that the element was successfully found.

### 8. Reporting and Watch Mode

-   Since the assertion passes, Vitest marks the test as successful (`✓`).
-   It prints a summary of the results to the console.
-   By default, `vitest` then enters **watch mode**, waiting for file changes to intelligently re-run only the relevant tests, providing rapid feedback during development. 