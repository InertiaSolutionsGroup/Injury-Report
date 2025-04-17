# Test Scenarios for Teacher Form

This directory contains test scenarios for the Teacher Form component. These scenarios are used to populate the form with predefined data for testing how the form handles different types of input and how n8n responds to these inputs.

## Purpose

- Test how the form handles adequate and inadequate descriptions
- Verify n8n responses for different input qualities
- Allow rapid testing without manual data entry
- Support iterative improvement of the form and n8n prompts

## Usage

1. Select a test scenario from the dropdown in the Test Data Selector section
2. Click "Load Test Data" to populate the form fields
3. Submit the form as normal to see how n8n responds
4. Observe the UI behavior and n8n response

## Available Scenarios

- `adequate-descriptions.json`: All fields have sufficient detail
- `inadequate-descriptions.json`: All fields lack sufficient detail
- `mixed-quality-descriptions.json`: Some fields good, some need improvement
- `minimal-payload-test.json`: Minimal test with "1" for all description fields

## Adding New Scenarios

To add a new test scenario:
1. Create a new JSON file in this directory
2. Follow the same structure as existing scenarios
3. The file will automatically appear in the dropdown

## Server Management

Before testing:
1. Kill any existing test servers: `taskkill /f /im node.exe` (if needed)
2. Start a new server: `npm start` from the project root
3. Verify the server is running before proceeding with tests
