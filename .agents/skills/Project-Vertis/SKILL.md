```markdown
# Project-Vertis Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and coding conventions used in the Project-Vertis repository, a TypeScript project built with the Vite framework. You'll learn about file naming, import/export styles, commit message habits, and the structure for writing and running tests. This guide is ideal for onboarding new contributors or maintaining consistency across the codebase.

## Coding Conventions

### File Naming
- Use **camelCase** for all file names.

  **Example:**
  ```
  userProfile.ts
  fetchData.ts
  ```

### Import Style
- Always use **relative imports**.

  **Example:**
  ```typescript
  import fetchData from './fetchData';
  import userProfile from '../models/userProfile';
  ```

### Export Style
- Use **default exports** for modules.

  **Example:**
  ```typescript
  // fetchData.ts
  const fetchData = () => { /* ... */ };
  export default fetchData;
  ```

### Commit Messages
- Commit messages are **freeform** (no enforced type or prefix).
- Average commit message length: ~36 characters.

  **Example:**
  ```
  Fix login redirect issue on mobile
  Add user profile fetch logic
  ```

## Workflows

_No automated workflows were detected in this repository._

## Testing Patterns

- **Test files** follow the pattern: `*.test.*`
- The **testing framework is unknown**, but tests are likely written in TypeScript.
- Place test files alongside the modules they test or in a dedicated test directory.

  **Example:**
  ```
  fetchData.test.ts
  userProfile.test.ts
  ```

## Commands

| Command | Purpose |
|---------|---------|
| /test   | Run all test files matching `*.test.*` |
| /lint   | Lint the codebase for style and errors |
| /build  | Build the project using Vite           |
| /dev    | Start the Vite development server      |
```
