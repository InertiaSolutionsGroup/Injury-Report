<!--
Last updated: 2025-04-16 17:40 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# LLM Project Handoff Document

This document is designed to help any Large Language Model (LLM) assistant quickly orient itself to the current state, context, and next steps of the project. Please read and update this file at every major handoff or before starting a new session.

---

## 1. Current Objective
- Maintain and improve the Injury Reporting App with a focus on code quality, documentation, and robust testing. Ensure all documentation is up to date and centralized in the `docs/` folder.

## 2. Recent Progress
- Enhanced front desk view to display both the original teacher report and the AI-generated memo
- Added OriginalReportSection component to show complete teacher submission details
- Implemented field-specific AI suggestion display for better user interaction
- Enhanced test scripts to simulate the complete n8n webhook response flow
- Refactored TeacherForm.tsx and MemoView.tsx into smaller subcomponents for maintainability
- Created custom hooks (useInjuryForm and useInjuryReport) to extract and manage state logic
- Extracted UI sections into dedicated components for better organization and readability
- Updated FormActions prop types for strict typing
- Fixed TypeScript errors related to function signatures
- Created and consolidated all documentation in the `docs/` folder
- Reconciled and updated the main documentation index ([docs/README.md](./README.md)), removing duplicates
- Added and updated instructions, changelog, environment, and LLM handoff docs
- Created detailed workflow documentation with component status ([docs/WORKFLOW.md](./WORKFLOW.md))
- Implemented graceful error handling for Supabase operations
- Fixed "Submit as is" functionality to properly write to Supabase database
- Created comprehensive database schema documentation ([docs/DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md))
- Updated the database schema to include AI validation tracking fields
- Modified the code to use the new AI validation fields
- Created automated testing scripts for form submission and Supabase connection
- Created dedicated `/tests` directory and organized all test assets there
- Created detailed n8n webhook interactions documentation ([docs/n8n-interactions.md](./n8n-interactions.md))
- Added React test for AI validation UI to verify suggestion display
- Implemented comprehensive testing infrastructure with test harness UI at `/test`
- Created mock API implementations for testing without live n8n webhooks
- Developed 12 realistic test scenarios covering various injury report situations
- Implemented privacy protection to filter sensitive information before sending to AI
- Updated all documentation to reflect the new testing infrastructure

## 3. Known Issues / Blockers
- n8n webhooks for validation are implemented with both mock and real API modes
- n8n webhooks for memo generation are partially implemented and need further development
- Some test files have TypeScript errors due to missing Jest type definitions (need to run `npm i --save-dev @types/jest`)
- Automated tests do not currently run due to missing or unmocked external dependencies (e.g., API modules). Tests need to be updated with proper mocks for meaningful results
- Some test coverage is minimal; additional unit and integration tests are recommended for new subcomponents.

## 4. Next Steps
- Install Jest type definitions (`npm i --save-dev @types/jest`) to resolve TypeScript errors in test files
- Complete the implementation of the n8n workflow for memo generation
- Refine the test scenarios based on real-world feedback
- Expand the test harness to include more comprehensive evaluation metrics
- Continue refactoring to extract any remaining complex logic into custom hooks
- Add proper TypeScript interfaces for all component props
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
- **Important**: The "Submit as is" functionality should write directly to Supabase, bypassing the n8n validation
- **Important**: Always check the database schema in `supabase/schema.sql` and `supabase/schema_update.sql` when working with database operations
- **Important**: All test scripts should be placed in the `/tests` directory, not in `src/utils/`
- **Important**: Privacy protection is implemented to filter sensitive information (biter/aggressor names) before sending to AI
- **Important**: The testing infrastructure at `/test` provides a way to evaluate AI responses with both mock and real API calls

## 6. Relevant Files
- **Core Hooks**:
  - `src/hooks/useInjuryForm.ts` - Manages form state and validation for TeacherForm
  - `src/hooks/useInjuryReport.ts` - Manages report data and actions for MemoView
- **Teacher Form Components**:
  - `src/components/TeacherForm.tsx` - Main form container
  - `src/components/teacher/BasicInfoSection.tsx` - Child/teacher selection
  - `src/components/teacher/InjuryDetailsSection.tsx` - Incident details
  - `src/components/teacher/AdditionalInfoSection.tsx` - Bite/aggression info
  - `src/components/teacher/ValidationError.tsx` - Error display
  - `src/components/teacher/FormActions.tsx` - Submit buttons
  - `src/components/teacher/AIFeedbackSection.tsx` - AI suggestions display
- **Memo View Components**:
  - `src/components/MemoView.tsx` - Main memo container
  - `src/components/memo/MemoHeader.tsx` - Status and actions
  - `src/components/memo/MemoContainer.tsx` - Content container
  - `src/components/memo/MemoContent.tsx` - Formatted memo
- **Testing Infrastructure**:
  - `src/components/testing/TestHarness.tsx` - Test harness UI for evaluating AI responses
  - `src/lib/mockApi.ts` - Mock API implementations for testing
  - `src/lib/testApi.ts` - Test API functions for both mock and real API calls
  - `src/types/InjuryReport.ts` - Type definitions for injury reports
  - `tests/README.md` - Documentation for the testing infrastructure
- **API & Data Layer**:
  - `src/lib/supabase.ts` - Supabase client and database operations
  - `src/lib/api.ts` - API functions for validation and memo generation
- **Database Schema**:
  - `supabase/schema.sql` - Main database schema definition
  - `supabase/schema_update.sql` - Required schema updates for AI validation tracking
- **Testing**:
  - `/tests/testFormSubmission.js` - Automated test for form submission
  - `/tests/testSupabase.js` - Utility to test Supabase connection
  - `/tests/TeacherForm.AISuggestions.test.tsx` - React test for AI validation UI
- **Documentation**:
  - `docs/README.md` - Main documentation index
  - `docs/WORKFLOW.md` - Detailed workflow and component status
  - `docs/instructions.md` - Developer quick reference
  - `docs/CHANGELOG.md` - Project change history
  - `docs/ENVIRONMENT.md` - Environment configuration
  - `docs/DATABASE_SCHEMA.md` - Database schema documentation
  - `docs/n8n-interactions.md` - n8n webhook interactions documentation

## 7. Application Workflow Overview
The application follows this general workflow:

1. **Teacher Form Submission**:
   - Teacher fills out injury report details
   - Form data is validated (locally and via AI)
   - AI provides suggestions for improvement
   - Teacher accepts or rejects suggestions
   - Report is submitted to Supabase database
   - **Current Status**: Form validation works locally, AI validation is functional with both mock and real API options, direct submission to Supabase is functional

2. **Front Desk Review**:
   - Front desk staff views submitted reports
   - AI generates a parent-friendly memo for each report
   - Front desk staff marks reports as reviewed
   - **Current Status**: Report listing and viewing works, AI memo generation is partially implemented, review marking is functional

3. **Testing Infrastructure**:
   - Test harness UI available at `/test` route
   - 12 realistic test scenarios covering various injury situations
   - Toggle between mock and real API calls
   - View AI suggestions and parent narratives side-by-side
   - **Current Status**: Fully functional with comprehensive test scenarios

See [WORKFLOW.md](./WORKFLOW.md) for a detailed breakdown of each component and its current status.

## 8. References
- [README.md](./README.md) - Project overview and setup instructions
- [WORKFLOW.md](./WORKFLOW.md) - Detailed workflow and component status
- [instructions.md](./instructions.md) - Developer quick reference
- [CHANGELOG.md](./CHANGELOG.md) - Project change history
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment configuration
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database schema documentation
- [n8n-interactions.md](./n8n-interactions.md) - n8n webhook interactions documentation

---

**Note for LLMs:**
When starting a new session, please read this document first, then check [WORKFLOW.md](./WORKFLOW.md) for detailed component status, and finally ask the user if there are any updates or changes before proceeding. Update this document with any new context, blockers, or next steps at the end of your session.
