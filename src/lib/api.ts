import axios from 'axios';
import { InjuryReport } from './supabase';

// URL for the combined Injury Report Improver workflow
const INJURY_REPORT_IMPROVER_URL = process.env.REACT_APP_INJURY_REPORT_IMPROVER_URL || 'https://n8n-instance.example.com/webhook/injury-report-improver';

// Enhanced types for API responses
export type EnhancedReport = {
  child_name: string;
  incident_description_enhanced: string;
  injury_description_enhanced: string;
  action_taken_enhanced: string;
  child_id: string;
  injury_timestamp: string;
  location: string;
  submitting_user_id: string;
  incident_description: string;
  injury_description: string;
  action_taken: string;
  is_bite: boolean;
  is_peer_aggression: boolean;
};

export type ValidationResponse = {
  status: 'success' | 'error';
  suggestions?: {
    field: 'incident_description' | 'injury_description' | 'action_taken';
    original: string;
    suggestion: string;
    reason: string;
  }[];
  enhancedReport?: EnhancedReport;
  parentNarrative?: string;
  message?: string;
};

/**
 * Parse JSON string from the n8n webhook response
 * 
 * The n8n webhook returns a JSON string that needs to be parsed.
 * This function handles the expected format with proper error handling.
 * 
 * @param jsonString - The JSON string from n8n
 * @returns Parsed JSON object or null if parsing fails
 */
const parseJSON = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parsing failed:', error);
    return null;
  }
};

// Function to validate injury report data with AI and get parent narrative
export const validateInjuryReport = async (reportData: Partial<InjuryReport>): Promise<ValidationResponse> => {
  try {
    // Send data directly to webhook
    console.log('Sending data to webhook:', reportData);
    
    const response = await axios.post(INJURY_REPORT_IMPROVER_URL, reportData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 seconds timeout
    });
    
    console.log('Received raw response from webhook:', response.data);
    
    // Handle the expected response format from n8n
    let parsedData = null;
    
    // Check for output in response array or object formats
    if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].output) {
      console.log('Found output property in response array');
      parsedData = parseJSON(response.data[0].output);
    } else if (response.data && typeof response.data === 'object' && response.data.output) {
      console.log('Found output property in response object');
      parsedData = parseJSON(response.data.output);
    } else {
      console.error('Unexpected response format from n8n webhook:', response.data);
      return {
        status: 'error',
        message: 'Received unexpected response format from validation service. Please try again or submit as is.'
      };
    }
    
    // If we successfully parsed the data
    if (parsedData) {
      console.log('Successfully parsed data:', parsedData);
      
      // Build suggestions array from new or existing formats
      let suggestionsList = [];
      if (parsedData.fieldEvaluations && Array.isArray(parsedData.fieldEvaluations)) {
        suggestionsList = parsedData.fieldEvaluations.map((fe: any) => ({
          field: fe.field,
          original: fe.original,
          suggestion: fe.suggestion,
          reason: fe.status
        }));
      } else {
        suggestionsList = parsedData.suggestions || [];
      }
      
      // Extract enhanced report and parent narrative if available
      const enhancedReport = parsedData.enhancedReport ? (parsedData.enhancedReport as EnhancedReport) : undefined;
      const parentNarrative = parsedData.parent_narrative || parsedData.parentNarrative;
      
      return {
        status: 'success',
        suggestions: suggestionsList,
        enhancedReport,
        parentNarrative
      };
    }
    
    // If parsing failed
    console.error('Failed to parse response data');
    return {
      status: 'error',
      message: 'Failed to parse AI response. Please try again or submit as is.'
    };
  } catch (error) {
    console.error('Error validating injury report:', error);
    return {
      status: 'error',
      message: 'Failed to connect to the validation service. Please try again or submit as is.',
    };
  }
};
