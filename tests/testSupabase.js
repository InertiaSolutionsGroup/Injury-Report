// Simple utility to test Supabase connection and write operations
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? 'Key exists (not showing for security)' : 'Key missing');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test function to fetch children (read operation)
async function testRead() {
  console.log('\n--- Testing READ operation ---');
  try {
    const { data, error } = await supabase
      .from('Children')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Error reading from Supabase:', error);
      return { success: false, data: null };
    }
    
    console.log('Successfully read from Children table:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception during read test:', err);
    return { success: false, data: null };
  }
}

// Test function to fetch users
async function fetchUsers() {
  console.log('\n--- Fetching Users ---');
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('role', 'Teacher')
      .limit(5);
    
    if (error) {
      console.error('Error reading from Users table:', error);
      return { success: false, data: null };
    }
    
    console.log('Successfully read from Users table:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Exception during users fetch:', err);
    return { success: false, data: null };
  }
}

// Test function to create a test injury report (write operation)
async function testWrite(childId, userId) {
  console.log('\n--- Testing WRITE operation ---');
  console.log(`Using child_id: ${childId} and submitting_user_id: ${userId}`);
  
  // Create a test report with valid IDs
  const testReport = {
    child_id: childId,
    submitting_user_id: userId,
    injury_timestamp: new Date().toISOString(),
    location: 'Test Location',
    incident_description: 'Test incident from test script',
    injury_description: 'Test injury description',
    action_taken: 'Test action taken',
    is_bite: false,
    is_peer_aggression: false,
    is_reviewed: false,
    is_delivered_to_parent: false
  };
  
  try {
    const { data, error } = await supabase
      .from('InjuryReports')
      .insert(testReport)
      .select();
    
    if (error) {
      console.error('Error writing to Supabase:', error);
      return false;
    }
    
    console.log('Successfully wrote to InjuryReports table:', data);
    return true;
  } catch (err) {
    console.error('Exception during write test:', err);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('Starting Supabase connection tests...');
  
  // Test reading from Children table
  const readResult = await testRead();
  console.log('Read test result:', readResult.success ? 'SUCCESS' : 'FAILED');
  
  if (!readResult.success || !readResult.data || readResult.data.length === 0) {
    console.log('Cannot proceed with write test without valid child_id');
    return;
  }
  
  // Get a valid child_id
  const childId = readResult.data[0].id;
  
  // Test reading from Users table
  const usersResult = await fetchUsers();
  console.log('Users fetch result:', usersResult.success ? 'SUCCESS' : 'FAILED');
  
  if (!usersResult.success || !usersResult.data || usersResult.data.length === 0) {
    console.log('Cannot proceed with write test without valid submitting_user_id');
    return;
  }
  
  // Get a valid user_id
  const userId = usersResult.data[0].id;
  
  // Test writing to InjuryReports table
  const writeSuccess = await testWrite(childId, userId);
  console.log('Write test result:', writeSuccess ? 'SUCCESS' : 'FAILED');
  
  console.log('\nTesting complete!');
}

runTests();
