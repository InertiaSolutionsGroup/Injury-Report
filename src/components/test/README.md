# Test Components

This directory contains components used for testing purposes only. These components should not be included in production builds.

## Components

### TestDataSelector

A component that allows selecting and loading test scenarios into the teacher form for testing n8n responses without manual data entry.

#### Usage

The component is automatically included in the TeacherForm component when running in development mode (`process.env.NODE_ENV !== 'production'`).

To use it:
1. Select a test scenario from the dropdown
2. Click "Load Test Data" to populate the form
3. Submit the form as normal to see how n8n responds

#### Test Scenarios

Test scenarios are stored in two locations:
- Source files in `tests/test-scenarios` directory as JSON files
- Copies in `public/tests/test-scenarios` directory for runtime access

Each scenario includes:
- Metadata (name, description)
- Form data to populate the teacher form

**Note:** The files must exist in the public directory for the component to work properly. If you add new test scenarios, make sure to copy them to the public directory as well.

#### Removal

To remove this test functionality:
1. Delete the `src/components/test` directory
2. Delete the `src/utils/testUtils.ts` file
3. Delete the `public/tests/test-scenarios` directory
4. Remove the following sections from `src/components/TeacherForm.tsx`:
   - The import statements marked with `TEST-ONLY`
   - The `handleSelectTestData` function marked with `TEST-ONLY`
   - The conditional render statement marked with `TEST-ONLY`

## Implementation Details

The test components use DOM manipulation to populate form fields, triggering the appropriate React events to ensure state is updated correctly. This approach avoids modifying the core form logic while still allowing for automated testing.

## Server Management

When testing:
1. Kill any existing test servers: `taskkill /f /im node.exe` (if needed)
2. Start a new server: `npm start` from the project root
3. Verify the server is running before proceeding with tests
