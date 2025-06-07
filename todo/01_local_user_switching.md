### Plan: Local User Account Switching

This plan outlines the steps to add basic user account switching for local development without a full authentication system.

**Backend Setup**
- [x] **Update Database Schema (`server/src/db/init.sql`)**
  - [x] Create `users` table with an `INT` primary key.
  - [x] Update `documents` and `user_itr_inputs` to use `owner_id INT` with a foreign key to `users(id)`.
  - [x] Seed the `users` table with sample users for development.
- [ ] **Create API Endpoint to Fetch Users (Skipped for now)**
  - [ ] Create `server/src/services/userService.ts` with a `getAllUsers` function.
  - [ ] Create `server/src/controllers/userController.ts` to handle the HTTP request.
  - [ ] Create `server/src/routes/userRoutes.ts` for the `/api/users` endpoint.
  - [ ] Register the new routes in `server/src/index.ts`.

**Frontend State Management**
- [x] **Create User Context (`client/src/context/UserContext.tsx`)**
  - [x] **(Adjusted)** Use a hardcoded list of users instead of fetching from an API.
  - [x] Manage `currentUser` state.
  - [x] Provide a `useUser` hook.
- [x] **Fix User ID Type in Context**
  - [x] In `client/src/context/UserContext.tsx`, change the `User` interface's `id` property from `string` to `number`.
- [x] **Update API Config (`client/src/api/config.ts`)**
  - [x] Remove the hardcoded `DEFAULT_USER_ID`.
- [x] **Provide Context to App (`client/src/main.tsx`)**
  - [x] Wrap the main `<App />` component with the `<UserProvider />`.

**Frontend UI**
- [x] **Create User Switcher Component (`client/src/components/UserSwitcher.tsx`)**
  - [x] Create a dropdown/select component to display users.
  - [x] Use the `useUser` hook to get the user list and update the current user on change.
- [x] **Add Switcher to Layout (`client/src/components/layouts/MainLayout.tsx`)**
  - [x] Add the `<UserSwitcher />` to the main layout's header.
  - [x] Display the current user's name.

**Refactor Data Fetching**
- [x] **Update API Service Files**
  - [x] `client/src/api/documents.ts`: Remove default user ID parameters from functions and align to numeric ID.
  - [x] `client/src/api/itr.ts`: Remove default user ID parameters from functions and align to numeric ID.
  - [x] `client/src/api/userInput.ts`: Remove default user ID parameters from functions and align to numeric ID.
- [x] **Update Page Components**
  - [x] `client/src/pages/DocumentsPortal.tsx`:
    - [x] Use `useUser` to get `currentUser`.
    - [x] Pass `currentUser.id` to API calls instead of `DEFAULT_USER_ID`.
  - [x] `client/src/pages/Review.tsx`:
    - [x] Use `useUser` hook.
    - [x] Pass `currentUser.id` to API calls.
    - [x] **Fix:** Correct the type import from `ITR` to `Itr`.
  - [x] `client/src/pages/ITRViewer.tsx`:
    - [x] Use `useUser` hook.
    - [x] Pass `currentUser.id` to API calls.
  - [x] `client/src/components/ITRViewer/context/UserInputContext.tsx`:
    - [x] Use `useUser` hook.
    - [x] Pass `currentUser.id` to API calls. 