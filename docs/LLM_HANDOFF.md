<!--
Last updated: 2025-04-16 21:06 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# LLM Project Handoff Document

This document is designed to help any Large Language Model (LLM) assistant quickly orient itself to the current state, context, and next steps of the project. Please read and update this file at every major handoff or before starting a new session.

---

## 1. Current Objective
- Maintain and improve the Injury Reporting App with a focus on code quality, documentation, and robust testing. Ensure all documentation is up to date and centralized in the `docs/` folder.
- Refine the n8n prompt to correctly handle various types of data received from teachers.

## 2. Recent Progress
- Refactored TeacherForm.tsx and MemoView.tsx into smaller subcomponents for maintainability
- Created custom hooks (useInjuryForm and useInjuryReport) to extract and manage state logic
- Extracted UI sections into dedicated components for better organization and readability
- Updated FormActions prop types for strict typing
- Fixed TypeScript errors related to function signatures
- Created and consolidated all documentation in the `docs/` folder
- Implemented graceful error handling for Supabase operations
- Fixed "Submit as is" functionality to properly write to Supabase database
- Created comprehensive database schema documentation ([docs/DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md))
- Updated the database schema to include AI validation tracking fields
- Modified the code to use the new AI validation fields
- Created dedicated `/tests` directory and organized all test assets there
- Created detailed n8n webhook interactions documentation ([docs/n8n-interactions.md](./n8n-interactions.md))
- Implemented a combined n8n workflow for validating injury reports and generating parent narratives
- Removed the separate memo generation workflow and associated code
- Enhanced JSON parsing logic to handle various response formats from the n8n webhook

## 3. Known Issues / Blockers
- The n8n prompt may need refinement to correctly handle various types of data it might receive from teachers

## 4. Next Steps
- Refine the n8n prompt to correctly handle various types of data received from teachers
- Add proper TypeScript interfaces for all component props
- Continue adding inline code comments and JSDoc for major components
- Keep all documentation in the `docs/` folder and update as the project evolves

## 5. Key Decisions / Context for LLMs
- State and business logic should remain in parent components unless otherwise specified
- Prefer simple, iterative improvements and avoid introducing new patterns without necessity
- Always check for and avoid code duplication
- Maintain environment separation (dev, test, prod)
- Do not mock or stub data outside of tests
- Write concise, readable code and documentation
- Always update this handoff document after major changes
- **Important**: The "Submit as is" functionality should write directly to Supabase, bypassing the n8n validation
- **Important**: Always check the database schema in `supabase/schema.sql` and `supabase/schema_update2.sql` when working with database operations
- **Important**: All test scripts should be placed in the `/tests` directory, not in `src/utils/`
- **Important**: The application now uses a combined n8n workflow for both validation and parent narrative generation
- **Important**: The JSON parsing logic has been enhanced to handle various response formats from the n8n webhook

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
  - `src/lib/api.ts` - API functions for validation and parent narrative generation
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
   - Form data is validated/improved and parent narrative is generated via AI agent in n8n workflow and retruned to teacher for review
   - Teacher reviews and sends back to n8n or to front desk
   - Report is written to Supabase database
   - **Current Status**: Form validation and parent narrative generation are functional through the combined n8n workflow.
   - Need to test and iterate n8n prompt based on test teacher submissions

2. **Front Desk Review**:
   - Front desk staff views submitted reports
   - Parent narrative is already generated during the validation step
   - Front desk staff marks reports as reviewed
   - **Current Status**: Report listing, viewing, and review marking are functional

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
