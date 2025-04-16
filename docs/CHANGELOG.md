<!--
Last updated: 2025-04-15 20:26 EDT
NOTE: Update this timestamp whenever the document is updated.
-->

# Changelog

## [Unreleased]

### Added
- (2025-04-15 19:35) Added `docs/instructions.md` with quick reference for common project tasks (start/stop server, git backup, refactoring tips, etc).

### Changed
- (2025-04-15 19:41) Refactored `TeacherForm.tsx` and `MemoView.tsx` to extract large UI sections into subcomponents for better maintainability and readability. No business logic was changed.
- (2025-04-15 19:41) Updated `FormActions` prop types to strictly require event parameter for `onSubmit` and `onReevaluate`, resolving TypeScript errors in `TeacherForm.tsx`.

### Fixed
- (2025-04-15 18:08) MemoView now displays proper user/child names or "name not retrieved" if unavailable, instead of showing "unknown" or "unknown child".
- (2025-04-15 19:41) Fixed TypeScript errors in `TeacherForm.tsx` due to function signature mismatch for `onReevaluate` and `onSubmit`.

### Removed
- (YYYY-MM-DD HH:mm) <Short, clear description of removal.>

---

## [Version X.Y.Z] - YYYY-MM-DD

# (Move entries from [Unreleased] here on release)
