const axios = require('axios');

// Get the test type from command line arguments
const testType = process.argv[2] || 'inadequate';

// Define test data based on test type
let testData = {};

switch (testType) {
  case 'mixed':
    testData = {
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
    break;
  case 'adequate':
    testData = {
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
    break;
  case 'inadequate':
  default:
    testData = {
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
    break;
}

// Log the test data
console.log(`Running ${testType} report test with data:`, JSON.stringify(testData, null, 2));

// Send the test data to the webhook
// Using production URL - workflow must be set to active
const webhookUrl = 'https://rmkernanai.app.n8n.cloud/webhook/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd';

async function runTest() {
  try {
    console.log(`Sending request to ${webhookUrl}`);
    const response = await axios.post(webhookUrl, testData);
    
    console.log("\nResponse status:", response.status);
    console.log("Response data:", JSON.stringify(response.data, null, 2));
    
    // Parse the output if it's a string
    if (response.data && response.data.output && typeof response.data.output === 'string') {
      try {
        const parsedOutput = JSON.parse(response.data.output);
        console.log("\nParsed output:");
        console.log(JSON.stringify(parsedOutput, null, 2));
        
        // Check for field evaluations - handle both array and object formats
        if (Array.isArray(parsedOutput)) {
          console.log("\nField Evaluations Summary:");
          parsedOutput.forEach(field => {
            console.log(`- ${field.field}: ${field.status}`);
            console.log(`  Suggestion: ${field.suggestion}`);
          });
        } else if (parsedOutput.fieldEvaluations && Array.isArray(parsedOutput.fieldEvaluations)) {
          console.log("\nField Evaluations Summary:");
          parsedOutput.fieldEvaluations.forEach(field => {
            console.log(`- ${field.field}: ${field.status}`);
            console.log(`  Suggestion: ${field.suggestion}`);
          });
        }
        
        // Check for parent narrative
        if (parsedOutput.parent_narrative) {
          console.log("\nParent Narrative:");
          console.log(parsedOutput.parent_narrative);
        }
      } catch (error) {
        console.error("Error parsing output:", error.message);
      }
    }
    
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
  }
}

runTest();
