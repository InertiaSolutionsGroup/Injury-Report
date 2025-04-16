// Test script for injury report form with predefined scenarios
const axios = require('axios');
require('dotenv').config();
const testScenarios = require('./testScenarios');

// Get webhook URLs from environment variables
const INJURY_REPORT_IMPROVER_WEBHOOK_URL = process.env.REACT_APP_INJURY_REPORT_IMPROVER_WEBHOOK_URL || 
  'https://rmkernanai.app.n8n.cloud/webhook-test/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd';

// Function to test a specific scenario
async function testScenario(scenarioIndex = 0, useMock = false) {
  if (scenarioIndex < 0 || scenarioIndex >= testScenarios.length) {
    console.error(`Invalid scenario index: ${scenarioIndex}. Must be between 0 and ${testScenarios.length - 1}`);
    return;
  }

  const scenario = testScenarios[scenarioIndex];
  console.log(`\nTesting scenario: ${scenario.name}`);
  console.log(`Description: ${scenario.description}`);
  console.log(`\nSending test data to webhook:`);
  console.log(JSON.stringify(scenario.data, null, 2));
  
  if (useMock) {
    console.log('\n⚠️ Using MOCK response (not actually calling webhook)');
    const mockResponse = generateMockResponse(scenario.data);
    console.log(JSON.stringify(mockResponse, null, 2));
    return mockResponse;
  }
  
  try {
    console.log(`\nPOST request to: ${INJURY_REPORT_IMPROVER_WEBHOOK_URL}`);
    const response = await axios.post(INJURY_REPORT_IMPROVER_WEBHOOK_URL, scenario.data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    console.log('\nResponse received:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Save response to file for later review
    const fs = require('fs');
    const responseDir = './test-responses';
    if (!fs.existsSync(responseDir)) {
      fs.mkdirSync(responseDir);
    }
    
    fs.writeFileSync(
      `${responseDir}/response-${scenarioIndex}-${scenario.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`, 
      JSON.stringify(response.data, null, 2)
    );
    
    console.log(`\nResponse saved to ${responseDir}/response-${scenarioIndex}-${scenario.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
    
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
        console.log('Please check the n8n workflow setup guide in docs/n8n-workflow-setup.md');
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

// Function to generate a mock response for testing
function generateMockResponse(data) {
  const childName = data.child_name || 'the child';
  const childFirstName = childName.split(' ')[0];
  
  // Create suggestions based on the quality of the input
  const suggestions = [];
  
  // Check incident description
  if (data.incident_description && data.incident_description.length < 20) {
    suggestions.push({
      field: 'incident_description',
      original: data.incident_description,
      suggestion: `${childFirstName} ${data.incident_description.toLowerCase().replace('child', '').trim()} while playing in the ${data.location.toLowerCase()}.`,
      reason: "Adding more context about what the child was doing helps understand how the incident occurred."
    });
  }
  
  // Check injury description
  if (data.injury_description && data.injury_description.length < 20) {
    suggestions.push({
      field: 'injury_description',
      original: data.injury_description,
      suggestion: `${data.injury_description.replace('.', '')} on ${childFirstName}'s right leg. No bleeding, just a small red mark.`,
      reason: "Specifying the exact location and appearance of the injury helps assess its severity."
    });
  }
  
  // Check action taken
  if (data.action_taken && data.action_taken.length < 20) {
    suggestions.push({
      field: 'action_taken',
      original: data.action_taken,
      suggestion: `${data.action_taken.replace('.', '')} with soap and water and gave ${childFirstName} a hug to help them feel better.`,
      reason: "Including both the first aid provided and comfort measures helps show complete care."
    });
  }
  
  // Generate a parent narrative
  let parentNarrative = `${childFirstName} had a minor incident today in the ${data.location.toLowerCase()}. `;
  
  if (data.is_bite) {
    parentNarrative += "Another child bit them during play. ";
  } else if (data.is_peer_aggression) {
    parentNarrative += "They were pushed by another child. ";
  } else {
    parentNarrative += `They ${data.incident_description.toLowerCase().replace(childFirstName, '').replace('child', '').trim()}. `;
  }
  
  parentNarrative += `We ${data.action_taken.toLowerCase().replace('.', '')} and made sure ${childFirstName} was comfortable before returning to activities.`;
  
  return {
    enhancedReport: {
      child_name: data.child_name,
      incident_description_enhanced: suggestions.find(s => s.field === 'incident_description')?.suggestion || data.incident_description,
      injury_description_enhanced: suggestions.find(s => s.field === 'injury_description')?.suggestion || data.injury_description,
      action_taken_enhanced: suggestions.find(s => s.field === 'action_taken')?.suggestion || data.action_taken
    },
    suggestions: suggestions,
    parent_narrative: parentNarrative
  };
}

// Function to run all tests
async function runAllTests(useMock = false) {
  console.log('Running all test scenarios...');
  
  const results = [];
  for (let i = 0; i < testScenarios.length; i++) {
    console.log(`\n======= TEST SCENARIO ${i + 1}: ${testScenarios[i].name} =======`);
    const result = await testScenario(i, useMock);
    results.push(result);
  }
  
  console.log('\n✅ All tests completed');
  return results;
}

// Function to print available scenarios
function listScenarios() {
  console.log('Available test scenarios:');
  testScenarios.forEach((scenario, index) => {
    console.log(`${index}: ${scenario.name} - ${scenario.description}`);
  });
}

// Parse command line arguments
const args = process.argv.slice(2);
let useMock = false;
let testIndex = 0;
let runAll = false;
let listOnly = false;

// Parse arguments
args.forEach(arg => {
  if (arg === '--mock' || arg === '-m') {
    useMock = true;
  } else if (arg === 'all') {
    runAll = true;
  } else if (arg === 'list' || arg === '--list' || arg === '-l') {
    listOnly = true;
  } else if (!isNaN(parseInt(arg, 10))) {
    testIndex = parseInt(arg, 10);
  }
});

// Run the tests
if (listOnly) {
  listScenarios();
} else if (runAll) {
  runAllTests(useMock);
} else {
  testScenario(testIndex, useMock);
}

// Export functions for potential use in other scripts
module.exports = {
  testScenario,
  runAllTests,
  listScenarios,
  testScenarios
};
