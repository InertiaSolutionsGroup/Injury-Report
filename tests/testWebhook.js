// Test script for sending payloads to n8n webhooks
const axios = require('axios');
require('dotenv').config();

// Get webhook URLs from environment variables
const INJURY_REPORT_IMPROVER_WEBHOOK_URL = process.env.REACT_APP_INJURY_REPORT_IMPROVER_WEBHOOK_URL || 
  'https://rmkernanai.app.n8n.cloud/webhook-test/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd';

// Sample test data
const sampleInjuryReports = [
  {
    // Basic injury report
    child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
    child_name: "Emma Johnson",
    injury_timestamp: new Date().toISOString(),
    location: "Playground",
    submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
    incident_description: "Child fell while playing on the playground equipment.",
    injury_description: "Small scrape on right knee.",
    action_taken: "Cleaned with antiseptic wipe.",
    is_bite: false,
    biter_child_id: null,
    biter_child_name: null,
    is_peer_aggression: false,
    aggressor_child_id: null,
    aggressor_child_name: null
  },
  {
    // Bite incident
    child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
    child_name: "Noah Williams",
    injury_timestamp: new Date().toISOString(),
    location: "Classroom",
    submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
    incident_description: "Child was bitten by another child during playtime.",
    injury_description: "Small bite mark on left arm.",
    action_taken: "Washed area with soap and water.",
    is_bite: true,
    biter_child_id: "d65bcde6-f88d-5373-bg5c-8fe8dce5664f",
    biter_child_name: "Olivia Martinez",
    is_peer_aggression: true,
    aggressor_child_id: "d65bcde6-f88d-5373-bg5c-8fe8dce5664f",
    aggressor_child_name: "Olivia Martinez"
  },
  {
    // Peer aggression
    child_id: "c54abdc5-e77c-4262-af4b-7ed7dbe4553e",
    child_name: "Liam Thompson",
    injury_timestamp: new Date().toISOString(),
    location: "Playground",
    submitting_user_id: "8f88c596-ea77-4805-b1cb-3e7db4f4c3d9",
    incident_description: "Child was pushed by another child.",
    injury_description: "Bruise on arm.",
    action_taken: "Applied ice pack.",
    is_bite: false,
    biter_child_id: null,
    biter_child_name: null,
    is_peer_aggression: true,
    aggressor_child_id: "d65bcde6-f88d-5373-bg5c-8fe8dce5664f",
    aggressor_child_name: "Sophia Garcia"
  }
];

// Mock response for testing when n8n is not available
const mockSuccessResponse = {
  status: "success",
  suggestions: [
    {
      field: "incident_description",
      original: "Child fell while playing on the playground equipment.",
      suggestion: "Emma fell from the slide while playing on the playground equipment.",
      reason: "Adding specific details about where Emma fell from provides important context for understanding the incident."
    },
    {
      field: "injury_description",
      original: "Small scrape on right knee.",
      suggestion: "Small scrape (approximately 1 inch) on Emma's right knee with minor redness but no bleeding.",
      reason: "Including size and appearance details helps assess the severity of Emma's injury."
    },
    {
      field: "action_taken",
      original: "Cleaned with antiseptic wipe.",
      suggestion: "Cleaned Emma's scrape with antiseptic wipe and applied a bandage. Emma was able to return to activities after 5 minutes of rest.",
      reason: "Specifying the complete treatment and recovery details provides a clearer record of care."
    }
  ]
};

// Function to send test data to webhook
async function testInjuryReportImprover(reportIndex = 0, useMock = false) {
  if (reportIndex < 0 || reportIndex >= sampleInjuryReports.length) {
    console.error(`Invalid report index: ${reportIndex}. Must be between 0 and ${sampleInjuryReports.length - 1}`);
    return;
  }

  const testData = sampleInjuryReports[reportIndex];
  console.log(`\nSending test data to Injury Report Improver webhook (sample #${reportIndex + 1}):`);
  console.log(JSON.stringify(testData, null, 2));
  
  if (useMock) {
    console.log('\n⚠️ Using MOCK response (not actually calling webhook)');
    console.log(JSON.stringify(mockSuccessResponse, null, 2));
    return mockSuccessResponse;
  }
  
  try {
    console.log(`\nPOST request to: ${INJURY_REPORT_IMPROVER_WEBHOOK_URL}`);
    const response = await axios.post(INJURY_REPORT_IMPROVER_WEBHOOK_URL, testData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    console.log('\nResponse received:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Validate response structure
    if (response.data.status === 'success') {
      console.log('\n✅ SUCCESS: Webhook returned a valid response');
      
      if (response.data.suggestions && response.data.suggestions.length > 0) {
        console.log(`Found ${response.data.suggestions.length} suggestions:`);
        response.data.suggestions.forEach((suggestion, index) => {
          console.log(`\nSuggestion #${index + 1}:`);
          console.log(`Field: ${suggestion.field}`);
          console.log(`Original: ${suggestion.original}`);
          console.log(`Suggestion: ${suggestion.suggestion}`);
          console.log(`Reason: ${suggestion.reason}`);
        });
      } else {
        console.log('No suggestions were provided.');
      }
    } else {
      console.log(`\n⚠️ WARNING: Webhook returned status: ${response.data.status}`);
      if (response.data.message) {
        console.log(`Message: ${response.data.message}`);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('\n❌ ERROR: Failed to connect to webhook');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
      
      // If we get a 500 error, it might be because the n8n workflow isn't set up yet
      if (error.response.status === 500) {
        console.log('\n⚠️ The n8n workflow might not be properly configured yet.');
        console.log('Please check the n8n workflow setup guide in docs/n8n-interactions.md');
        console.log('You can use the --mock flag to test with a mock response until the workflow is ready.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    return {
      status: 'error',
      message: error.message
    };
  }
}

// Function to run all tests
async function runAllTests(useMock = false) {
  console.log('Running all test cases for Injury Report Improver webhook...');
  
  for (let i = 0; i < sampleInjuryReports.length; i++) {
    console.log(`\n======= TEST CASE ${i + 1} =======`);
    await testInjuryReportImprover(i, useMock);
  }
  
  console.log('\n✅ All tests completed');
}

// Parse command line arguments
const args = process.argv.slice(2);
let useMock = false;
let testIndex = 0;
let runAll = false;

// Parse arguments
args.forEach(arg => {
  if (arg === '--mock' || arg === '-m') {
    useMock = true;
  } else if (arg === 'all') {
    runAll = true;
  } else if (!isNaN(parseInt(arg, 10))) {
    testIndex = parseInt(arg, 10);
  }
});

// Run the tests
if (runAll) {
  runAllTests(useMock);
} else {
  testInjuryReportImprover(testIndex, useMock);
}

// Export functions for potential use in other scripts
module.exports = {
  testInjuryReportImprover,
  runAllTests,
  sampleInjuryReports,
  mockSuccessResponse
};
