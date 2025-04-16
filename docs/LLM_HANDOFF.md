<!--
Last updated: 2025-04-16 10:55 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# LLM Project Handoff Document

This document is designed to help any Large Language Model (LLM) assistant quickly orient itself to the current state, context, and next steps of the project. Please read and update this file at every major handoff or before starting a new session.

---

## 1. Current Objective
- Maintain and improve the Injury Reporting App with a focus on code quality, documentation, and robust testing. Ensure all documentation is up to date and centralized in the `docs/` folder.

## 2. Recent Progress
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

## 3. Known Issues / Blockers
- n8n webhooks for validation and memo generation are currently stubbed out and not functional
- Automated tests do not currently run due to missing or unmocked external dependencies (e.g., API modules). Tests need to be updated with proper mocks for meaningful results.
- Some test coverage is minimal; additional unit and integration tests are recommended for new subcomponents.
- **Database Schema**: The Supabase database schema is missing fields for AI validation tracking. See the schema update section below.

## 4. Next Steps
- Implement the n8n workflows for validation and memo generation
- Apply the database schema updates in `supabase/schema_update.sql` to enable AI validation tracking
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
- **Memo View Components**:
  - `src/components/MemoView.tsx` - Main memo container
  - `src/components/memo/MemoHeader.tsx` - Status and actions
  - `src/components/memo/MemoContainer.tsx` - Content container
  - `src/components/memo/MemoContent.tsx` - Formatted memo
- **API & Data Layer**:
  - `src/lib/supabase.ts` - Supabase client and database operations
  - `src/lib/api.ts` - API functions for validation and memo generation
- **Database Schema**:
  - `supabase/schema.sql` - Main database schema definition
  - `supabase/schema_update.sql` - Required schema updates for AI validation tracking
- **Testing Utilities**:
  - `src/utils/testFormSubmission.js` - Automated test for form submission
  - `src/utils/testSupabase.js` - Utility to test Supabase connection
- **Documentation**:
  - `docs/README.md` - Main documentation index
  - `docs/WORKFLOW.md` - Detailed workflow and component status
  - `docs/instructions.md` - Developer quick reference
  - `docs/CHANGELOG.md` - Project change history
  - `docs/ENVIRONMENT.md` - Environment configuration

## 7. Application Workflow Overview
The application follows this general workflow:

1. **Teacher Form Submission**:
   - Teacher fills out injury report details
   - Form data is validated (locally and optionally via AI)
   - Report is submitted to Supabase database
   - **Current Status**: Form validation works locally, AI validation is stubbed, direct submission to Supabase is functional

2. **Front Desk Review**:
   - Front desk staff views submitted reports
   - AI generates a parent-friendly memo for each report
   - Front desk staff marks reports as reviewed
   - **Current Status**: Report listing and viewing works, AI memo generation is stubbed, review marking is functional

See [WORKFLOW.md](./WORKFLOW.md) for a detailed breakdown of each component and its current status.

## 8. References
- [README.md](./README.md) - Project overview and setup instructions
- [WORKFLOW.md](./WORKFLOW.md) - Detailed workflow and component status
- [instructions.md](./instructions.md) - Developer quick reference
- [CHANGELOG.md](./CHANGELOG.md) - Project change history
- [ENVIRONMENT.md](./ENVIRONMENT.md) - Environment configuration

## 9. Database Schema Updates

The application requires the following schema updates to fully support AI validation tracking:

```sql
-- Add AI validation fields to InjuryReports table
ALTER TABLE "InjuryReports"
ADD COLUMN IF NOT EXISTS ai_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ai_suggestions_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_suggestions_accepted INTEGER DEFAULT 0;
```

These updates are available in the `supabase/schema_update.sql` file. To apply them:

1. Navigate to the Supabase project dashboard
2. Go to the SQL Editor
3. Paste the contents of `supabase/schema_update.sql`
4. Run the SQL commands

After applying these updates, the application will be able to track AI validation metrics, including whether a report was validated by AI, how many suggestions were provided, and how many were accepted by the user.

---

**Note for LLMs:**
When starting a new session, please read this document first, then check [WORKFLOW.md](./WORKFLOW.md) for detailed component status, and finally ask the user if there are any updates or changes before proceeding. Update this document with any new context, blockers, or next steps at the end of your session.
