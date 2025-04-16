<!--
Last updated: 2025-04-16 10:28 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# Changelog

## [Unreleased]

### Added
- (2025-04-16 10:28) Added custom hooks (`useInjuryForm` and `useInjuryReport`) to extract and manage state logic from components
- (2025-04-16 10:28) Added new UI components for TeacherForm (BasicInfoSection, InjuryDetailsSection, AdditionalInfoSection, ValidationError)
- (2025-04-16 10:28) Added new UI components for MemoView (MemoHeader, MemoContainer)
- (2025-04-15 19:35) Added `docs/instructions.md` with quick reference for common project tasks (start/stop server, git backup, refactoring tips, etc).

### Changed
- (2025-04-16 10:28) Refactored TeacherForm.tsx and MemoView.tsx to use custom hooks and smaller components, improving code organization and maintainability
- (2025-04-15 19:41) Refactored `TeacherForm.tsx` and `MemoView.tsx` to extract large UI sections into subcomponents for better maintainability and readability. No business logic was changed.
- (2025-04-15 19:41) Updated `FormActions` prop types to strictly require event parameter for `onSubmit` and `onReevaluate`, resolving TypeScript errors in `TeacherForm.tsx`.

### Fixed
- (2025-04-16 10:28) Fixed TypeScript errors related to property names and type definitions in the refactored components
- (2025-04-15 18:08) MemoView now displays proper user/child names or "name not retrieved" if unavailable, instead of showing "unknown" or "unknown child".
- (2025-04-15 19:41) Fixed TypeScript errors in `TeacherForm.tsx` due to function signature mismatch for `onReevaluate` and `onSubmit`.

### Removed
- (YYYY-MM-DD HH:mm) <Short, clear description of removal.>

---

## [Version X.Y.Z] - YYYY-MM-DD

# (Move entries from [Unreleased] here on release)
