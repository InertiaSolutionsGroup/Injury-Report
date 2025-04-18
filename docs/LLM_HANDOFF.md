<!--
Last updated: 2025-04-18 00:22 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# LLM Project Handoff Document

This document is designed to help any Large Language Model (LLM) assistant quickly orient itself to the current state, context, and next steps of the project. Please read and update this file at every major handoff or before starting a new session.

---

## 1. Current Objective
- Maintain and improve the Injury Reporting App with a focus on code quality, documentation, and robust testing. Ensure all documentation is up to date and centralized in the `docs/` folder.


## 2. Recent Progress
- Updated the database schema to include AI validation tracking fields
- Modified the code to use the new AI validation fields
- Created dedicated `/tests` directory and organized all test assets there
- Created detailed n8n webhook interactions documentation ([docs/n8n-interactions.md](./n8n-interactions.md))
- Implemented a combined n8n workflow for validating injury reports and generating parent narratives
- Improved error handling to display actual error messages from n8n
- Enhanced UI for handling insufficient responses with clear feedback and guidance
- Added positive feedback for sufficient entries with improved visual indicators
- Completely restructured the n8n prompt for GPT-4.1 Mini following best practices
- Improved code comments to clarify logic for handling sufficient and insufficient responses
- Updated the n8n payload to include child_name, injury_time_eastern, and location for improved context
- Made the "Accept All Enhancements" button conditional on all fields being sufficient
- Disabled the submit button when insufficient fields are present
- Added natural language enhancements to the n8n prompt to use child names and time references
- Enhanced n8n prompt with more specific evaluation criteria for each field type
- Added special handling for head injuries in the n8n prompt
- Included examples of sufficient vs. insufficient descriptions in the prompt
- Improved guidance for recognizing and expanding common abbreviations like "TLC"
- Added parent narrative generation to the n8n prompt (only generated when all fields are sufficient)
- Added ParentNarrativeSection component to display the AI-generated parent narrative
- Implemented holistic evaluation approach that considers information across all fields
- Added special handling for action_taken when the first two fields provide good context
- Removed unnecessary alert popup when all fields are sufficient
- Ensured enhanced text is immediately displayed in form fields after validation

## 3. Known Issues / Blockers

## 4. Next Steps
- Add proper TypeScript interfaces for all component props
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
- **Important**: For sufficient responses, the AI provides an improved version of the text with the option to accept or edit
- **Important**: For insufficient responses, the AI provides specific guidance on what information is missing and requires the teacher to update the field
- **Important**: The "Accept All Enhancements" button only appears when all fields are sufficient
- **Important**: The submit button is disabled when any fields are insufficient, requiring the teacher to complete all required information
- **Important**: The n8n prompt contains examples of sufficient vs. insufficient descriptions for teacher reference
- **Important**: The n8n prompt now generates a parent-friendly narrative when all fields are sufficient
- **Important**: The parent narrative is displayed in a dedicated section in the UI
- **Important**: The n8n prompt uses a holistic evaluation approach that considers information across all fields
- **Important**: The action_taken field is evaluated more leniently when the first two fields provide good context
- **Important**: Enhanced text is immediately displayed in form fields after validation, without requiring an extra click

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
  - `src/components/teacher/SuggestionPanel.tsx` - Handles suggestions and parent narrative display
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
  - `/tests/test-scenarios/` - Test data scenarios for validation testing
  - `/tests/test-scenarios/TEST_PLAN.md` - Comprehensive test plan
  - `/tests/n8nPrompt.md` - Prompt for the n8n AI agent
- **Documentation**:
  - `docs/README.md` - Main documentation index
  - `docs/WORKFLOW.md` - Detailed workflow and component status
  - `docs/instructions.md` - Developer quick reference
  - `docs/CHANGELOG.md` - Project change history
  - `docs/ENVIRONMENT.md` - Environment configuration
  - `docs/DATABASE_SCHEMA.md` - Database schema documentation
  - `docs/n8n-interactions.md` - n8n webhook interactions documentation
  - `docs/n8nSysPrompt.md` - System prompt for the n8n AI agent

## 7. Application Workflow Overview
The application follows this general workflow:

1. **Teacher Form Submission**:
   - Teacher fills out injury report details
   - Form data (including child_name, injury_time_eastern, and location) is sent to n8n for validation and parent narrative generation
   - n8n returns evaluations for each field (sufficient or insufficient) with suggestions
   - For sufficient fields: AI provides enhanced text that teachers can accept or edit
   - For insufficient fields: AI provides guidance on what information is missing, requiring teachers to update
   - When all fields are sufficient: AI generates a parent-friendly narrative summarizing the incident
   - Teacher reviews, completes any insufficient fields, and submits to front desk
   - Report (including the parent narrative) is written to Supabase database
   - **Current Status**: Form validation and parent narrative generation are functional through the combined n8n workflow.
   - Currently testing enhanced n8n prompt with GPT-4.1 Mini and improved UI for handling sufficient/insufficient responses

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
