// Moved from src/utils/testFormSubmission.js
// Automated test script for injury report form submission
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Starting form submission test...');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Key exists (not showing for security)' : 'Key missing');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to fetch valid test data
async function fetchTestData() {
  console.log('\nFetching test data...');
  
  try {
    // Fetch a child
    const { data: children, error: childError } = await supabase
      .from('Children')
      .select('*')
      .limit(1);
    
    if (childError) {
      throw new Error(`Error fetching children: ${childError.message}`);
    }
    
    if (!children || children.length === 0) {
      throw new Error('No children found in the database');
    }
    
    // Fetch a teacher
    const { data: teachers, error: teacherError } = await supabase
      .from('Users')
      .select('*')
      .eq('role', 'Teacher')
      .limit(1);
    
    if (teacherError) {
      throw new Error(`Error fetching teachers: ${teacherError.message}`);
    }
    
    if (!teachers || teachers.length === 0) {
      throw new Error('No teachers found in the database');
    }
    
    return {
      child: children[0],
      teacher: teachers[0]
    };
  } catch (error) {
    console.error('Error fetching test data:', error);
    throw error;
  }
}

// Function to simulate AI validation webhook call
async function simulateAIValidation(reportData) {
  console.log('\nSimulating AI validation webhook call...');
  
  try {
    // If mock validation is enabled, return mock suggestions directly
    if (process.env.REACT_APP_MOCK_AI_VALIDATION === 'true') {
      console.log('Using mock AI validation response');
      
      return {
        status: 'success',
        suggestions: [
          {
            field: 'incident_description',
            original: reportData.incident_description,
            suggestion: 'Test Suggestion: Include details about what the child was doing immediately before the incident occurred.',
            reason: 'Test Reason: Provides important context for understanding how the injury happened.'
          },
          {
            field: 'injury_description',
            original: reportData.injury_description,
            suggestion: 'Test Suggestion: Consider adding details about the exact location and appearance of the injury.',
            reason: 'Test Reason: Enhances clarity for parents and staff.'
          },
          {
            field: 'action_taken',
            original: reportData.action_taken,
            suggestion: 'Test Suggestion: Specify the type of first aid administered (e.g., cleaned with antiseptic, applied bandage).',
            reason: 'Test Reason: Provides a clearer record of care.'
          }
        ]
      };
    }
    
    // Otherwise, try to call the actual validation webhook
    const validationWebhookUrl = process.env.REACT_APP_VALIDATION_WEBHOOK_URL;
    
    if (!validationWebhookUrl) {
      throw new Error('Validation webhook URL not configured');
    }
    
    console.log('Calling validation webhook:', validationWebhookUrl);
    const response = await axios.post(validationWebhookUrl, reportData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    
    return response.data;
  } catch (error) {
    console.error('AI validation failed:', error);
    return {
      status: 'error',
      message: `Failed to connect to the validation service: ${error.message}`
    };
  }
}

// Function to simulate form submission with AI validation
async function simulateFormSubmissionWithValidation(testData) {
  console.log('\nSimulating form submission with AI validation...');
  
  try {
    // Create a timestamp for the current time
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`; // HH:MM
    
    // Create test report data
    const reportData = {
      child_id: testData.child.id,
      submitting_user_id: testData.teacher.id,
      injury_timestamp: new Date(`${formattedDate}T${formattedTime}`).toISOString(),
      location: 'Playground',
      incident_description: 'Automated test: Child fell while playing',
      injury_description: 'Automated test: Small scrape on knee',
      action_taken: 'Automated test: Cleaned with antiseptic wipe',
      is_bite: false,
      is_peer_aggression: false,
      is_reviewed: false,
      is_delivered_to_parent: false
    };
    
    console.log('Test report data for validation:', reportData);
    
    // Step 1: Call AI validation
    const validationResponse = await simulateAIValidation(reportData);
    console.log('AI validation response:', validationResponse);
    
    // Step 2: Apply suggestions (simulating user accepting all suggestions)
    let aiValidated = false;
    let aiSuggestionsCount = 0;
    let aiSuggestionsAccepted = 0;
    
    if (validationResponse.status === 'success' && validationResponse.suggestions) {
      aiValidated = true;
      aiSuggestionsCount = validationResponse.suggestions.length;
      aiSuggestionsAccepted = validationResponse.suggestions.length; // Assume all accepted
      
      // Apply suggestions to report data
      validationResponse.suggestions.forEach(suggestion => {
        const fieldMap = {
          'incident_description': 'incident_description',
          'injury_description': 'injury_description',
          'action_taken': 'action_taken'
        };
        
        const field = fieldMap[suggestion.field];
        if (field) {
          reportData[field] = suggestion.suggestion;
        }
      });
      
      console.log('Report data after applying suggestions:', reportData);
    }
    
    // Step 3: Submit to Supabase
    const finalReportData = {
      ...reportData,
      ai_validated: aiValidated,
      ai_suggestions_count: aiSuggestionsCount,
      ai_suggestions_accepted: aiSuggestionsAccepted
    };
    
    console.log('Final report data for submission:', finalReportData);
    
    const { data, error } = await supabase
      .from('InjuryReports')
      .insert(finalReportData)
      .select();
    
    if (error) {
      throw new Error(`Error submitting report: ${error.message}`);
    }
    
    console.log('Form submission successful!');
    console.log('Created report:', data);
    
    return {
      success: true,
      data,
      validationResponse
    };
  } catch (error) {
    console.error('Form submission failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to clean up test data (optional)
async function cleanupTestData(reportId) {
  if (!reportId) return;
  
  console.log(`\nCleaning up test data (report ID: ${reportId})...`);
  
  try {
    const { error } = await supabase
      .from('InjuryReports')
      .delete()
      .eq('id', reportId);
    
    if (error) {
      console.error('Error deleting test report:', error);
      return false;
    }
    
    console.log('Test data cleaned up successfully');
    return true;
  } catch (error) {
    console.error('Error during cleanup:', error);
    return false;
  }
}

// Run the test
async function runTest() {
  console.log('Starting automated form submission test with AI validation...');
  
  try {
    // Step 1: Fetch test data
    const testData = await fetchTestData();
    console.log('Test data fetched successfully:', {
      childName: testData.child.name,
      childId: testData.child.id,
      teacherName: testData.teacher.name,
      teacherId: testData.teacher.id
    });
    
    // Step 2: Simulate form submission with AI validation
    const result = await simulateFormSubmissionWithValidation(testData);
    
    if (result.success) {
      console.log('\n✅ TEST PASSED: Form submission with AI validation successful');
      console.log('Validation status:', result.validationResponse?.status);
      console.log('Number of suggestions:', result.validationResponse?.suggestions?.length || 0);
      
      // Step 3: Clean up (optional - comment out if you want to keep the test data)
      // if (result.data && result.data[0] && result.data[0].id) {
      //   await cleanupTestData(result.data[0].id);
      // }
    } else {
      console.log('\n❌ TEST FAILED: Form submission failed');
    }
  } catch (error) {
    console.error('\n❌ TEST ERROR:', error);
  }
  
  console.log('\nTest completed');
}

// Execute the test
runTest();
