<!--
Last updated: 2025-04-15 20:26 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# LLM Project Handoff Document

This document is designed to help any Large Language Model (LLM) assistant quickly orient itself to the current state, context, and next steps of the project. Please read and update this file at every major handoff or before starting a new session.

---

## 1. Current Objective
- Maintain and improve the Injury Reporting App with a focus on code quality, documentation, and robust testing. Ensure all documentation is up to date and centralized in the `docs/` folder.

## 2. Recent Progress
- Refactored TeacherForm.tsx and MemoView.tsx into smaller subcomponents for maintainability
- Updated FormActions prop types for strict typing
- Fixed TypeScript errors related to function signatures
- Created and consolidated all documentation in the `docs/` folder
- Reconciled and updated the main documentation index ([docs/README.md](./README.md)), removing duplicates
- Added and updated instructions, changelog, environment, and LLM handoff docs
- Attempted to run automated tests; identified need for mocking external dependencies for successful test execution

## 3. Known Issues / Blockers
- Automated tests do not currently run due to missing or unmocked external dependencies (e.g., API modules). Tests need to be updated with proper mocks for meaningful results.
- Some test coverage is minimal; additional unit and integration tests are recommended for new subcomponents.

## 4. Next Steps
- Prioritize refactoring TeacherForm.tsx and MemoView.tsx to further extract logic and reduce file size, focusing on custom hooks for state/logic and reusable UI components. (This should be among the first items tackled in the new conversation.)
- Mock external dependencies in tests to enable automated test runs
- Expand test coverage for critical flows (form validation, modal interactions, etc.)
- Continue adding inline code comments and JSDoc for major components
- Keep all documentation in the `docs/` folder and update as the project evolves

## 5. Key Decisions / Context for LLMs
- State and business logic should remain in parent components unless otherwise specified
- Refactoring should not break existing functionality
- Prefer simple, iterative improvements and avoid introducing new patterns without necessity
- Always check for and avoid code duplication
- Maintain environment separation (dev, test, prod)
- Do not mock or stub data outside of tests
- Write concise, readable code and documentation
- Always update this handoff document after major changes

## 6. Relevant Files
- `src/components/TeacherForm.tsx`
- `src/components/MemoView.tsx`
- `src/components/teacher/FormActions.tsx`
- `docs/README.md`
- `docs/instructions.md`
- `docs/CHANGELOG.md`
- `docs/ENVIRONMENT.md`

## 7. References
- [README.md](./README.md)
- [instructions.md](./instructions.md)
- [CHANGELOG.md](./CHANGELOG.md)
- [ENVIRONMENT.md](./ENVIRONMENT.md)

---

**Note for LLMs:**
When starting a new session, please read this document first, then ask the user if there are any updates or changes before proceeding. Update this document with any new context, blockers, or next steps at the end of your session.
