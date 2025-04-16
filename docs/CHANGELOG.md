<!--
Last updated: 2025-04-16 11:57 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# Changelog

## [Unreleased]

### Added
- (2025-04-16 11:57) Created dedicated `/tests` directory for all test scripts and assets
- (2025-04-16 11:57) Added React test for AI validation UI (`tests/TeacherForm.AISuggestions.test.tsx`)
- (2025-04-16 11:57) Created `n8n-interactions.md` documenting all webhook interactions
- (2025-04-16 11:26) Created comprehensive database schema documentation in `docs/DATABASE_SCHEMA.md`
- (2025-04-16 11:26) Created automated testing scripts for form submission and Supabase connection
- (2025-04-16 11:26) Added AI validation tracking fields to the database schema
- (2025-04-16 10:28) Added custom hooks (`useInjuryForm` and `useInjuryReport`) to extract and manage state logic from components
- (2025-04-16 10:28) Added new UI components for TeacherForm (BasicInfoSection, InjuryDetailsSection, AdditionalInfoSection, ValidationError)
- (2025-04-16 10:28) Added new UI components for MemoView (MemoHeader, MemoContainer)
- (2025-04-15 19:35) Added `docs/instructions.md` with quick reference for common project tasks (start/stop server, git backup, refactoring tips, etc).

### Changed
- (2025-04-16 11:57) Moved all test scripts from `src/utils/` to the dedicated `/tests` directory
- (2025-04-16 11:26) Updated the InjuryReport type definition to include AI validation fields
- (2025-04-16 11:26) Modified form submission to track AI validation metrics
- (2025-04-16 10:28) Refactored TeacherForm.tsx and MemoView.tsx to use custom hooks and smaller components, improving code organization and maintainability
- (2025-04-15 19:41) Refactored `TeacherForm.tsx` and `MemoView.tsx` to extract large UI sections into subcomponents for better maintainability and readability. No business logic was changed.
- (2025-04-15 19:41) Updated `FormActions` prop types to strictly require event parameter for `onSubmit` and `onReevaluate`, resolving TypeScript errors in `TeacherForm.tsx`.

### Fixed
- (2025-04-16 11:26) Fixed "Submit as is" functionality to properly write to Supabase database
- (2025-04-16 11:26) Fixed TypeScript errors related to null vs. undefined in optional fields
- (2025-04-16 10:28) Fixed TypeScript errors related to property names and type definitions in the refactored components
- (2025-04-15 18:08) MemoView now displays proper user/child names or "name not retrieved" if unavailable, instead of showing "unknown" or "unknown child".
- (2025-04-15 19:41) Fixed TypeScript errors in `TeacherForm.tsx` due to function signature mismatch for `onReevaluate` and `onSubmit`.

### Removed
- (2025-04-16 11:57) Removed test scripts from `src/utils/` folder (moved to `/tests`)

---

## [Version X.Y.Z] - YYYY-MM-DD

# (Move entries from [Unreleased] here on release)
