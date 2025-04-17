/**
 * TEST UTILITIES - REMOVE FOR PRODUCTION
 * 
 * Purpose: Utility functions for test data loading and form population
 * 
 * Removal Instructions:
 * 1. Delete this file
 * 2. No other changes needed (this file is only imported by test components)
 * 
 * Created: 2025-04-17
 * Updated: 2025-04-17 16:36 EDT - Added essential logging for troubleshooting
 * Updated: 2025-04-17 16:42 EDT - Added snake_case to camelCase conversion
 */

/**
 * Converts a snake_case string to camelCase
 * @param str The snake_case string to convert
 * @returns The camelCase version of the string
 */
const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

/**
 * Converts an object with snake_case keys to camelCase keys
 * @param obj The object with snake_case keys
 * @returns A new object with camelCase keys
 */
const convertKeysToCamelCase = (obj: Record<string, any>): Record<string, any> => {
  // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
  console.log('Converting keys from snake_case to camelCase:', Object.keys(obj));
  // END TEST-ONLY LOGGING
  
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.log(`Converting key: ${key} -> ${camelKey}`);
    // END TEST-ONLY LOGGING
    
    // Handle nested objects and arrays
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        result[camelKey] = value.map(item => 
          typeof item === 'object' && item !== null ? convertKeysToCamelCase(item) : item
        );
      } else {
        result[camelKey] = convertKeysToCamelCase(value);
      }
    } else {
      result[camelKey] = value;
    }
  }
  
  return result;
};

/**
 * Loads a test scenario from the test-scenarios directory
 * @param scenarioId The ID of the scenario to load (filename without extension)
 * @returns The test scenario data
 */
export const loadTestScenario = async (scenarioId: string) => {
  try {
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.log(`Attempting to fetch test scenario: ${scenarioId}`);
    const url = `/tests/test-scenarios/${scenarioId}.json`;
    console.log(`Fetch URL: ${url}`);
    // END TEST-ONLY LOGGING
    
    // In a production environment, this would use a real API call
    // For development, we're using a simple fetch to the static files
    const response = await fetch(`/tests/test-scenarios/${scenarioId}.json`);
    
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.log(`Fetch response status: ${response.status} ${response.statusText}`);
    // END TEST-ONLY LOGGING
    
    if (!response.ok) {
      throw new Error(`Failed to load test scenario: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.log(`Parsed JSON data:`, data);
    // END TEST-ONLY LOGGING
    
    // Get the form data from the response
    let formData = data.formData || data;
    
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.log('Original form data:', formData);
    // END TEST-ONLY LOGGING
    
    // Convert snake_case keys to camelCase
    formData = convertKeysToCamelCase(formData);
    
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.log('Converted form data:', formData);
    // END TEST-ONLY LOGGING
    
    return formData;
  } catch (error) {
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.error('Error loading test scenario:', error);
    // END TEST-ONLY LOGGING
    throw error;
  }
};

/**
 * Gets a list of available test scenarios
 * @returns Array of test scenario metadata
 */
export const getAvailableTestScenarios = async () => {
  // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
  console.log('Getting available test scenarios');
  // END TEST-ONLY LOGGING
  
  // In a real implementation, this would fetch from an API that reads the directory
  // For now, we'll hardcode the scenarios we created
  return [
    { 
      id: 'adequate-descriptions', 
      name: 'Adequate Descriptions', 
      description: 'Realistic entries with sufficient detail from a busy teacher' 
    },
    { 
      id: 'inadequate-descriptions', 
      name: 'Inadequate Descriptions', 
      description: 'Very brief entries from an extremely busy teacher' 
    },
    { 
      id: 'mixed-quality-descriptions', 
      name: 'Mixed Quality Descriptions', 
      description: 'Some detailed entries, some minimal from a teacher in a hurry' 
    },
    { 
      id: 'minimal-payload-test', 
      name: 'Minimal Payload Test', 
      description: 'Minimal test with "1" for all description fields' 
    }
  ];
};

/**
 * Populates form fields with test data by dispatching input events
 * @param formData The test data to populate
 */
export const populateFormFields = (formData: any) => {
  // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
  console.log('populateFormFields called with data:', formData);
  // END TEST-ONLY LOGGING
  
  // Map of our formData properties to actual form field names
  // This is needed because some field names might differ from our JSON property names
  const fieldMappings: Record<string, string> = {
    childId: 'childId',
    date: 'date',
    time: 'time',
    location: 'location',
    submittingUserId: 'submittingUserId',
    incidentDescription: 'incidentDescription',
    injuryDescription: 'injuryDescription',
    actionTaken: 'actionTaken',
    isBite: 'isBite',
    biterChildId: 'biterChildId',
    isPeerAggression: 'isPeerAggression',
    aggressorChildId: 'aggressorChildId'
  };

  // For each field in the form data, find the corresponding input and update it
  Object.entries(formData).forEach(([key, value]) => {
    const fieldName = fieldMappings[key] || key;
    
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.log(`Processing field: ${key} -> ${fieldName} = ${value}`);
    // END TEST-ONLY LOGGING
    
    // Try different query selectors to find the element
    // Some frameworks use different attribute patterns
    const selectors = [
      `[name="${fieldName}"]`,
      `#${fieldName}`,
      `[id="${fieldName}"]`,
      `[data-field="${fieldName}"]`
    ];
    
    // Try each selector until we find the element
    let element = null;
    for (const selector of selectors) {
      const found = document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (found) {
        element = found;
        
        // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
        console.log(`Found element with selector: ${selector}`);
        // END TEST-ONLY LOGGING
        
        break;
      }
    }
    
    if (element) {
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
      console.log(`Setting value for ${fieldName}: ${value}`);
      // END TEST-ONLY LOGGING
      
      // Handle different input types
      if (element.type === 'checkbox') {
        // For checkboxes, set the checked property
        (element as HTMLInputElement).checked = Boolean(value);
        
        // Dispatch change event
        const event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
      } else if (element.tagName.toLowerCase() === 'select') {
        // For select elements, set the value and dispatch change event
        element.value = String(value);
        
        const event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
      } else {
        // For text inputs and textareas
        element.value = String(value);
        
        // Dispatch both input and change events to ensure React state updates
        const inputEvent = new Event('input', { bubbles: true });
        element.dispatchEvent(inputEvent);
        
        const changeEvent = new Event('change', { bubbles: true });
        element.dispatchEvent(changeEvent);
      }
    } else {
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
      console.warn(`No element found for field: ${fieldName}`);
      // END TEST-ONLY LOGGING
    }
  });
};
