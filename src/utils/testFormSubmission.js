// Automated test script for injury report form submission
const { createClient } = require('@supabase/supabase-js');
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

// Function to simulate form submission
async function simulateFormSubmission(testData) {
  console.log('\nSimulating form submission...');
  
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
      action_taken: 'Automated test: Cleaned with antiseptic wipe and applied bandage',
      is_bite: false,
      is_peer_aggression: false,
      is_reviewed: false,
      is_delivered_to_parent: false,
      // Include AI validation fields
      ai_validated: false,
      ai_suggestions_count: 0,
      ai_suggestions_accepted: 0
    };
    
    console.log('Test report data:', reportData);
    
    // Submit to Supabase
    const { data, error } = await supabase
      .from('InjuryReports')
      .insert(reportData)
      .select();
    
    if (error) {
      throw new Error(`Error submitting report: ${error.message}`);
    }
    
    console.log('Form submission successful!');
    console.log('Created report:', data);
    
    return {
      success: true,
      data
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
  console.log('Starting automated form submission test...');
  
  try {
    // Step 1: Fetch test data
    const testData = await fetchTestData();
    console.log('Test data fetched successfully:', {
      childName: testData.child.name,
      childId: testData.child.id,
      teacherName: testData.teacher.name,
      teacherId: testData.teacher.id
    });
    
    // Step 2: Simulate form submission
    const result = await simulateFormSubmission(testData);
    
    if (result.success) {
      console.log('\n✅ TEST PASSED: Form submission successful');
      
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
