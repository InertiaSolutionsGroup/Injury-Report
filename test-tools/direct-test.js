/**
 * Direct Test Script for n8n Webhook
 * 
 * This script directly tests the connection to n8n without any server middleware.
 * It sends a test payload to the n8n webhook and logs the response.
 */

const axios = require('axios');

// Configuration - USING PRODUCTION URL
const N8N_WEBHOOK_URL = 'https://rmkernanai.app.n8n.cloud/webhook/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd';

// Test data - inadequate report
const inadequateData = {
  child_id: 'child123',
  child_name: 'Test Child',
  injury_time_eastern: '2025-04-17 11:30 AM EDT',
  location: 'Playground',
  submitting_user_id: 'teacher456',
  incident_description: '2',
  injury_description: '2',
  action_taken: '2',
  is_bite: false,
  is_peer_aggression: false
};

// Test data - mixed adequacy report
const mixedData = {
  child_id: 'child123',
  child_name: 'Test Child',
  injury_time_eastern: '2025-04-17 11:30 AM EDT',
  location: 'Playground',
  submitting_user_id: 'teacher456',
  incident_description: 'Child was running on the playground and tripped over a toy truck.',
  injury_description: '2',
  action_taken: '2',
  is_bite: false,
  is_peer_aggression: false
};

// Test data - adequate report
const adequateData = {
  child_id: 'child123',
  child_name: 'Test Child',
  injury_time_eastern: '2025-04-17 11:30 AM EDT',
  location: 'Playground',
  submitting_user_id: 'teacher456',
  incident_description: 'Child was running on the playground and tripped over a toy truck.',
  injury_description: 'Small scrape on left knee, about 1 inch long with minor redness.',
  action_taken: 'Cleaned the area with soap and water, applied a bandage, and comforted the child by reading a book together.',
  is_bite: false,
  is_peer_aggression: false
};

// Get test type from command line arguments
const testType = process.argv[2];

// Select test data based on test type
let testData;
switch (testType) {
  case 'mixed':
    testData = mixedData;
    break;
  case 'adequate':
    testData = adequateData;
    break;
  case 'inadequate':
    testData = inadequateData;
    break;
  default:
    throw new Error('Invalid test type');
}

console.log('=== DIRECT TEST TO N8N ===');
console.log(`Test type: ${testType}`);
console.log(`Webhook URL: ${N8N_WEBHOOK_URL}`);
console.log('Sending payload:');
console.log(JSON.stringify(testData, null, 2));
console.log('------------------------');

// Send the request
async function runTest() {
  try {
    console.log('Sending request...');
    const startTime = Date.now();
    
    const response = await axios.post(N8N_WEBHOOK_URL, testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    const endTime = Date.now();
    console.log(`Request completed in ${endTime - startTime}ms`);
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    // Parse the output if it's a string
    if (response.data && response.data.output && typeof response.data.output === 'string') {
      try {
        const parsedOutput = JSON.parse(response.data.output);
        console.log('\nParsed output:');
        console.log(JSON.stringify(parsedOutput, null, 2));
      } catch (error) {
        console.error('Error parsing output:', error.message);
      }
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('ERROR:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('No response received.');
      console.error('Request URL:', N8N_WEBHOOK_URL);
      console.error('This could indicate a network issue or an incorrect webhook URL.');
    }
    
    console.error('Test failed!');
  }
}

// Run the test
runTest();
