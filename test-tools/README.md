# Injury Report Testing Tools

This directory contains tools for testing the Injury Report App's integration with n8n, particularly focusing on the validation of injury reports and the generation of parent narratives.

## Components

1. **Mock API Server** (`mock-api-server.js`): A simple Express server that:
   - Forwards requests to the n8n webhook
   - Logs all requests and responses
   - Provides endpoints for running tests and viewing logs

2. **Test Scripts** (`test-injury-report.js`): Scripts for submitting:
   - Inadequate reports (with minimal information)
   - Adequate reports (with detailed information)

3. **Visualization Interface** (`public/index.html`): A web interface that:
   - Displays test results in a user-friendly format
   - Simulates how the UI would respond to different n8n responses
   - Tracks improvement suggestions

## How to Use

### Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set the n8n webhook URL (optional - defaults to environment variable):
   ```
   $env:REACT_APP_INJURY_REPORT_IMPROVER_URL="https://your-n8n-webhook-url"
   ```

### Running Tests

1. Start the mock API server:
   ```
   npm start
   ```

2. Run tests directly from command line:
   ```
   npm run test:inadequate  # Test with inadequate data
   npm run test:adequate    # Test with adequate data
   ```

3. Or use the web interface:
   - Open http://localhost:3001 in your browser
   - Click the test buttons to run tests
   - View results and logs

### Analyzing Results

The web interface provides:
- Raw request and response data
- Parsed field evaluations and parent narratives
- UI simulation showing how the app would display the results
- An improvement log for tracking needed changes

## Improvement Tracking

Use the improvement log section in the web interface to:
1. Document issues discovered during testing
2. Categorize improvements by component (UI, API, etc.)
3. Assign priorities
4. Build a consolidated list of changes for implementation

All improvements are stored locally in your browser and can be exported for sharing.

## Notes

- This testing environment is completely separate from the main application code
- No changes to the production code are required to use these tools
- Test logs are saved in the `logs` directory for future reference
