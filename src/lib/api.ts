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
 * Safely parse JSON string from the n8n webhook response
 * 
 * The n8n webhook returns a nested JSON string with escape characters
 * that standard JSON.parse() often fails to handle correctly. This function
 * provides a robust way to parse this specific response format.
 * 
 * @param jsonString - The JSON string from n8n with escape characters
 * @returns Parsed JSON object or null if parsing fails
 */
const safelyParseJSON = (jsonString: string) => {
  try {
    // First attempt: standard JSON parsing
    return JSON.parse(jsonString);
  } catch (error) {
    console.log('Standard JSON parsing failed, trying alternative approach');
    
    try {
      // Second attempt: Clean the string before parsing
      // n8n responses often contain escaped newlines and quotes that need special handling
      const cleanedString = jsonString
        .replace(/\\n/g, '')  // Remove newline escape sequences
        .replace(/\\\"/g, '"') // Replace escaped quotes with actual quotes
        .replace(/\"{/g, '{')  // Fix malformed JSON object start
        .replace(/}\"/g, '}'); // Fix malformed JSON object end
      
      return JSON.parse(cleanedString);
    } catch (altError) {
      console.log('Second parsing attempt failed, trying with regex extraction');
      
      try {
        // Third attempt: Use regex to extract the JSON content
        // This handles cases where the JSON is embedded in a string with extra characters
        const jsonPattern = /{[\s\S]*}/;
        const match = jsonString.match(jsonPattern);
        
        if (match && match[0]) {
          return JSON.parse(match[0]);
        } else {
          throw new Error('No valid JSON pattern found');
        }
      } catch (regexError) {
        console.error('All JSON parsing attempts failed:', regexError);
        return null;
      }
    }
  }
};

// Function to validate injury report data with AI and get parent narrative
export const validateInjuryReport = async (reportData: Partial<InjuryReport>): Promise<ValidationResponse> => {
  try {
    // Send data directly to webhook without filtering
    console.log('Sending data to webhook:', reportData);
    
    const response = await axios.post(INJURY_REPORT_IMPROVER_URL, reportData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    // Enhanced logging for detailed response examination
    console.log('Received raw response from webhook:', response.data);
    console.log('Response data type:', typeof response.data);
    
    // Log the response as a JSON string
    const responseStr = JSON.stringify(response.data);
    console.log('Response as JSON string:', responseStr);
    
    // Handle different response formats from n8n
    let parsedData = null;
    
    // Case 1: Direct object with output property (most common format)
    if (response.data && typeof response.data === 'object' && response.data.output) {
      console.log('Found output property in response object');
      parsedData = safelyParseJSON(response.data.output);
    } 
    // Case 2: Array with objects containing output property
    else if (response.data && Array.isArray(response.data) && response.data.length > 0 && response.data[0].output) {
      console.log('Found output property in response[0]');
      parsedData = safelyParseJSON(response.data[0].output);
    }
    // Case 3: Direct JSON string
    else if (response.data && typeof response.data === 'string') {
      console.log('Response is a direct string, attempting to parse');
      parsedData = safelyParseJSON(response.data);
    }
    
    // If we successfully parsed the data
    if (parsedData) {
      console.log('Successfully parsed data:', parsedData);
      
      // Extract the enhancedReport object
      const enhancedReport = parsedData.enhancedReport || {};
      
      // Extract or generate parent narrative
      let parentNarrative = parsedData.parent_narrative;
      
      // If parent_narrative isn't available, try to construct it from the enhanced report
      if (!parentNarrative && enhancedReport) {
        try {
          // Check if we have a parentNarrative directly in the parsed data
          if (parsedData.parentNarrative) {
            parentNarrative = parsedData.parentNarrative;
          } 
          // Otherwise, try to extract it from the enhancedReport
          else if (enhancedReport.parent_narrative) {
            parentNarrative = enhancedReport.parent_narrative;
          }
          // As a last resort, construct a simple narrative from enhanced fields
          else if (enhancedReport.incident_description_enhanced && 
                  enhancedReport.injury_description_enhanced && 
                  enhancedReport.action_taken_enhanced) {
            parentNarrative = `Your child ${enhancedReport.incident_description_enhanced} ${enhancedReport.injury_description_enhanced} ${enhancedReport.action_taken_enhanced}`;
          }
        } catch (narrativeError) {
          console.error('Error extracting parent narrative:', narrativeError);
        }
      }
      
      // Extract suggestions if available
      const suggestions = parsedData.suggestions || [];
      
      return {
        status: 'success',
        suggestions,
        enhancedReport: enhancedReport as EnhancedReport,
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
