# Test Scenarios for Teacher Form
<!-- Last updated: 2025-04-18 00:35 EDT -->

This directory contains test scenarios for the Teacher Form component. These scenarios are used to populate the form with predefined data for testing how the form handles different types of input and how the validation system responds to these inputs.

## Purpose

- Test how the form handles different quality descriptions across all fields
- Verify validation responses for different input qualities
- Test the parent narrative generation when all fields are sufficient
- Verify the holistic evaluation approach, especially for action_taken when other fields provide good context
- Allow rapid testing without manual data entry
- Support iterative improvement of the form, validation, and parent narrative generation

## Usage

1. Select a test scenario from the dropdown in the Test Data Selector section
2. Click "Load Test Data" to populate the form fields
3. Submit the form to see how the validation system responds
4. Observe the UI behavior, including:
   - Field evaluations (sufficient/insufficient)
   - Enhanced text suggestions
   - Parent narrative generation (when all fields are sufficient)
   - Conditional display of "Accept All Enhancements" button

## Available Scenarios

- `adequate-descriptions.json`: All fields have sufficient detail; tests parent narrative generation
- `inadequate-descriptions.json`: All fields lack sufficient detail; tests insufficient field handling
- `mixed-quality-descriptions.json`: Some fields good, some need improvement; tests mixed response handling
- `minimal-payload-test.json`: Minimal test with basic content for all fields

## Suggested Additional Scenarios

The following test scenarios would be valuable additions to test specific features:

- Head injury scenario: To test special handling for head injuries which require more detailed descriptions
- Action-taken context scenario: To test holistic evaluation approach where action_taken is evaluated based on context from other fields

## Expected Behavior

### For Sufficient Fields:
- Green indicator is displayed
- Enhanced text is shown in the form field
- "Accept Enhancement" button is available

### For Insufficient Fields:
- Yellow indicator is displayed
- Guidance on what information is missing is shown
- Original text is preserved but field is marked for improvement

### Parent Narrative:
- Only displayed when all fields are sufficient
- Shows a concise, parent-friendly summary of the incident
- Appears in a dedicated section below the validation results

## Adding New Scenarios

To add a new test scenario:
1. Create a new JSON file in this directory
2. Follow the same structure as existing scenarios:
```json
{
  "child_name": "Test Child",
  "injury_date": "2025-04-18",
  "injury_time": "10:30",
  "location": "Playground",
  "incident_description": "...",
  "injury_description": "...",
  "action_taken": "..."
}
```
3. The file will automatically appear in the dropdown

## Testing Tips

- Test the holistic evaluation approach by providing good context in incident_description and injury_description but less detail in action_taken
- Test parent narrative generation by ensuring all fields are sufficient
- Consider creating scenarios for head injuries to verify the special handling for these cases
- Use the "Accept All Enhancements" button to quickly accept all suggestions when available
