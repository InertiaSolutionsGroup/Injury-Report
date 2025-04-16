import axios from 'axios';
import { InjuryReport } from './supabase';

// These URLs should be replaced with actual n8n webhook URLs
const INJURY_REPORT_IMPROVER_WEBHOOK_URL = process.env.REACT_APP_INJURY_REPORT_IMPROVER_WEBHOOK_URL || 'https://rmkernanai.app.n8n.cloud/webhook-test/e94ea41a-13e5-4bc8-aab4-539f4d4eb3bd';
const MEMO_GENERATION_WEBHOOK_URL = process.env.REACT_APP_MEMO_GENERATION_WEBHOOK_URL || 'https://n8n-instance.example.com/webhook/memo-generation';

// Types for API responses
export type ValidationResponse = {
  status: 'success' | 'error';
  suggestions?: {
    field: 'incident_description' | 'injury_description' | 'action_taken';
    original: string;
    suggestion: string;
    reason: string;
  }[];
  message?: string;
};

export type MemoGenerationResponse = {
  status: 'success' | 'error';
  memo_content?: string;
  message?: string;
};

// Function to filter sensitive information before sending to AI
const filterSensitiveData = (reportData: Partial<InjuryReport>): Partial<InjuryReport> => {
  // Create a copy of the report data
  const filteredData = { ...reportData };
  
  // Remove aggressor and biter names to prevent AI from mentioning them
  delete filteredData.biter_child_name;
  delete filteredData.aggressor_child_name;
  
  // Replace is_bite and is_peer_aggression with more generic descriptions
  // that don't identify specific children
  if (filteredData.is_bite) {
    filteredData.incident_description = filteredData.incident_description + 
      ' (Note: This incident involved a bite, but please do not mention the other child by name in any communications.)';
  }
  
  if (filteredData.is_peer_aggression) {
    filteredData.incident_description = filteredData.incident_description + 
      ' (Note: This incident involved another child, but please do not mention the other child by name in any communications.)';
  }
  
  return filteredData;
};

// Function to validate injury report data with AI
export const validateInjuryReport = async (reportData: Partial<InjuryReport>): Promise<ValidationResponse> => {
  // --- START MOCKING LOGIC ---
  if (process.env.REACT_APP_MOCK_AI_VALIDATION === 'true') {
    console.warn('*** AI Validation Mock Active *** Returning mock suggestions.');
    // Simulate a short delay like a real API call
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // Get child's first name for personalization
    const childName = reportData.child_name || 'the child';
    const childFirstName = childName.split(' ')[0];
    
    return {
      status: 'success',
      suggestions: [
        {
          field: 'incident_description',
          original: reportData.incident_description || 'Original incident description not provided',
          suggestion: `Mock Suggestion: ${childFirstName} was playing on the playground equipment when they fell. Include details about what ${childFirstName} was doing immediately before the incident occurred.`,
          reason: `Mock Reason: Provides important context for understanding how ${childFirstName}'s injury happened.`
        },
        {
          field: 'injury_description',
          original: reportData.injury_description || 'Original injury description not provided',
          suggestion: `Mock Suggestion: Consider adding details about the exact location and appearance of ${childFirstName}'s injury.`,
          reason: 'Mock Reason: Enhances clarity for parents and staff.'
        },
        {
          field: 'action_taken',
          original: reportData.action_taken || 'Original action taken not provided',
          suggestion: `Mock Suggestion: Specify the type of first aid administered to ${childFirstName} (e.g., cleaned with antiseptic, applied bandage).`,
          reason: `Mock Reason: Provides a clearer record of care given to ${childFirstName}.`
        }
      ]
    };
  }
  // --- END MOCKING LOGIC ---

  try {
    // Filter out sensitive data before sending to the AI service
    const filteredData = filterSensitiveData(reportData);
    
    console.log('Sending filtered data to AI service:', filteredData);
    
    const response = await axios.post(INJURY_REPORT_IMPROVER_WEBHOOK_URL, filteredData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    return response.data;
  } catch (error) {
    console.error('Error validating injury report:', error);
    return {
      status: 'error',
      message: 'Failed to connect to the validation service. Please try again or submit as is.',
    };
  }
};

// Function to generate memo for an injury report
export const generateMemo = async (reportData: InjuryReport): Promise<MemoGenerationResponse> => {
  try {
    // Filter out sensitive data before sending to the AI service
    const filteredData = filterSensitiveData(reportData);
    
    console.log('Sending filtered data to memo generation service:', filteredData);
    
    const response = await axios.post(MEMO_GENERATION_WEBHOOK_URL, filteredData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating memo:', error);
    return {
      status: 'error',
      message: 'Failed to connect to the memo generation service. Please try again later.',
    };
  }
};
