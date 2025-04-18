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
  // Legacy field - will be deprecated
  suggestions?: {
    field: 'incident_description' | 'injury_description' | 'action_taken';
    original: string;
    suggestion: string;
    reason: string;
  }[];
  // New field structure from updated n8n prompt
  fieldEvaluations?: {
    field: 'incident_description' | 'injury_description' | 'action_taken';
    original: string;
    status: 'sufficient' | 'insufficient';
    suggestion: string;
  }[];
  enhancedReport?: EnhancedReport;
  // Legacy field - will be deprecated
  parentNarrative?: string;
  // New field from updated n8n prompt
  parent_narrative?: string | null;
  model_name?: string;
  message?: string;
  // TEST-ONLY FIELD - REMOVE FOR PRODUCTION - Added 2025-04-17 17:51 EDT
  testDetails?: string;
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
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION - Added 2025-04-17 17:05 EDT
    console.log('Attempting to parse JSON string:', jsonString);
    // END TEST-ONLY LOGGING
    
    // First, try to extract JSON from code blocks if present
    // This handles the case where n8n returns JSON wrapped in markdown code blocks
    if (typeof jsonString === 'string') {
      // Check for markdown code blocks with JSON
      const codeBlockMatch = jsonString.match(/```json\n([\s\S]*?)\n```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION - Added 2025-04-17 17:05 EDT
        console.log('Found JSON in code block, extracting:', codeBlockMatch[1]);
        // END TEST-ONLY LOGGING
        jsonString = codeBlockMatch[1];
      }
    }
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parsing failed:', error);
    return null;
  }
};

// Function to validate injury report data with AI and get parent narrative
export const validateInjuryReport = async (reportData: Partial<InjuryReport>): Promise<ValidationResponse> => {
  try {
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION - Added 2025-04-17 16:53 EDT
    console.group('🔄 N8N API REQUEST - TEST MODE');
    console.log('%c📤 PAYLOAD SENT TO N8N:', 'color: #0066cc; font-weight: bold; font-size: 14px');
    console.log(JSON.stringify(reportData, null, 2));
    console.log('%c⚙️ API URL:', 'color: #666; font-style: italic');
    console.log(INJURY_REPORT_IMPROVER_URL);
    console.groupEnd();
    // END TEST-ONLY LOGGING
    
    // Send data directly to webhook
    console.log('Sending data to webhook:', reportData);
    
    const response = await axios.post(INJURY_REPORT_IMPROVER_URL, reportData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 seconds timeout
    });
    
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION - Added 2025-04-17 16:53 EDT
    console.group('🔄 N8N API RESPONSE - TEST MODE');
    console.log('%c📥 RAW RESPONSE FROM N8N:', 'color: #009933; font-weight: bold; font-size: 14px');
    console.log(JSON.stringify(response.data, null, 2));
    console.groupEnd();
    // END TEST-ONLY LOGGING
    
    console.log('Received raw response from webhook:', response.data);
    
    // Handle the expected response format from n8n
    let parsedData = null;
    
    // Check for output in response array or object formats
    if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].output) {
      console.log('Found output property in response array');
      parsedData = parseJSON(response.data[0].output);
    } else if (response.data && typeof response.data === 'object' && response.data.output) {
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION - Added 2025-04-17 17:06 EDT
      console.log('Found output property in response object');
      // END TEST-ONLY LOGGING
      parsedData = parseJSON(response.data.output);
    } else {
      // Try to parse the response directly if no output property is found
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION - Added 2025-04-17 17:06 EDT
      console.log('No output property found, trying to parse response directly');
      // END TEST-ONLY LOGGING
      parsedData = parseJSON(JSON.stringify(response.data));
    }
    
    // If we successfully parsed the data
    if (parsedData) {
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION - Added 2025-04-17 16:53 EDT
      console.group('🔄 N8N PARSED DATA - TEST MODE');
      console.log('%c🔍 PARSED DATA FROM N8N:', 'color: #9900cc; font-weight: bold; font-size: 14px');
      console.log(JSON.stringify(parsedData, null, 2));
      console.groupEnd();
      // END TEST-ONLY LOGGING
      
      console.log('Successfully parsed data:', parsedData);
      
      // Extract enhanced report and parent narrative if available
      const enhancedReport = parsedData.enhancedReport ? (parsedData.enhancedReport as EnhancedReport) : undefined;
      const parentNarrative = parsedData.parent_narrative || parsedData.parentNarrative;

      // Build suggestions array from new or existing formats
      let suggestionsList = [];
      let fieldEvaluations = null;

      if (parsedData.fieldEvaluations && Array.isArray(parsedData.fieldEvaluations)) {
        fieldEvaluations = parsedData.fieldEvaluations;
        
        // For backward compatibility, also convert to suggestions format
        suggestionsList = parsedData.fieldEvaluations.map((fe: any) => ({
          field: fe.field,
          original: fe.original,
          suggestion: fe.suggestion,
          reason: fe.status
        }));
      } else {
        suggestionsList = parsedData.suggestions || [];
      }
      
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION - Added 2025-04-17 16:53 EDT
      console.group('🔄 N8N FINAL PROCESSED RESULT - TEST MODE');
      console.log('%c✅ FINAL RESULT:', 'color: #006600; font-weight: bold; font-size: 14px');
      console.log('Suggestions:', suggestionsList);
      console.log('Field Evaluations:', fieldEvaluations);
      console.log('Enhanced Report:', enhancedReport);
      console.log('Parent Narrative:', parentNarrative);
      console.groupEnd();
      // END TEST-ONLY LOGGING
      
      return {
        status: 'success',
        suggestions: suggestionsList,
        fieldEvaluations,
        enhancedReport,
        parentNarrative,
        parent_narrative: parsedData.parent_narrative,
        model_name: parsedData.model_name
      };
    }
    
    // If parsing failed
    console.error('Failed to parse response data');
    return {
      status: 'error',
      message: 'Failed to parse AI response. Please try again or submit as is.'
    };
  } catch (error) {
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION - Added 2025-04-17 16:53 EDT
    console.group('🔄 N8N API ERROR - TEST MODE');
    console.log('%c❌ ERROR:', 'color: #cc0000; font-weight: bold; font-size: 14px');
    console.error(error);
    console.groupEnd();
    // END TEST-ONLY LOGGING
    
    console.error('Error validating injury report:', error);
    
    // Provide more specific error messages based on the error type
    let errorMessage = 'Failed to connect to the validation service. Please try again or submit as is.';
    // TEST-ONLY VARIABLE - REMOVE FOR PRODUCTION - Added 2025-04-17 17:51 EDT
    let detailedError = '';
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code outside of 2xx
        errorMessage = `Server error: ${error.response.status}. Please try again or submit as is.`;
        
        // TEST-ONLY CODE - REMOVE FOR PRODUCTION - Added 2025-04-17 17:51 EDT
        detailedError = JSON.stringify(error.response.data, null, 2);
        
        // If the server returned a message, use it
        if (error.response.data && typeof error.response.data === 'object' && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from validation service. It may be offline or unavailable. Please try again later or submit as is.';
        // TEST-ONLY CODE - REMOVE FOR PRODUCTION - Added 2025-04-17 17:51 EDT
        detailedError = 'Request was sent but no response was received. The service may be offline.';
      }
    } else if (error instanceof Error) {
      // For other types of errors, include the error message
      // TEST-ONLY CODE - REMOVE FOR PRODUCTION - Added 2025-04-17 17:51 EDT
      detailedError = error.message;
    }
    
    // TEST-ONLY CODE - REMOVE FOR PRODUCTION - Added 2025-04-17 17:51 EDT
    const testModePrefix = '🔄 N8N API ERROR - TEST MODE\n\n';
    
    return {
      status: 'error',
      message: errorMessage,
      // TEST-ONLY FIELD - REMOVE FOR PRODUCTION - Added 2025-04-17 17:51 EDT
      testDetails: testModePrefix + detailedError
    };
  }
};
