/**
 * TEST-ONLY COMPONENT - REMOVE FOR PRODUCTION
 * 
 * Purpose: Allows selecting and loading test scenarios into the teacher form
 * 
 * Removal Instructions:
 * 1. Delete this file
 * 2. Remove import and usage in TeacherForm.tsx
 * 
 * Created: 2025-04-17
 * Updated: 2025-04-17 16:30 EDT - Changed to use direct state updates instead of DOM manipulation
 * Updated: 2025-04-17 16:36 EDT - Added essential logging for troubleshooting
 */

import React, { useState, useEffect } from 'react';
import { loadTestScenario, getAvailableTestScenarios } from '../../utils/testUtils';

interface TestDataSelectorProps {
  onSelectTestData: (testData: any) => void;
}

interface TestScenario {
  id: string;
  name: string;
  description: string;
}

const TestDataSelector: React.FC<TestDataSelectorProps> = ({ onSelectTestData }) => {
  const [scenarios, setScenarios] = useState<TestScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  
  // Load available test scenarios on component mount
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
        console.log('Loading test scenarios...');
        // END TEST-ONLY LOGGING
        
        const availableScenarios = await getAvailableTestScenarios();
        
        // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
        console.log('Available scenarios:', availableScenarios);
        // END TEST-ONLY LOGGING
        
        setScenarios(availableScenarios);
      } catch (error) {
        // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
        console.error('Error loading test scenarios:', error);
        // END TEST-ONLY LOGGING
        
        setMessage('Failed to load test scenarios');
      }
    };
    
    loadScenarios();
  }, []);
  
  // Handle selection change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedScenario(e.target.value);
    
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.log('Selected scenario:', e.target.value);
    // END TEST-ONLY LOGGING
  };
  
  // Handle load button click
  const handleLoadClick = async () => {
    if (!selectedScenario) {
      setMessage('Please select a test scenario');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
      console.log('Loading test data for scenario:', selectedScenario);
      // END TEST-ONLY LOGGING
      
      const testData = await loadTestScenario(selectedScenario);
      
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
      console.log('Loaded test data:', testData);
      // END TEST-ONLY LOGGING
      
      // Pass the test data to the parent component
      onSelectTestData(testData);
      
      setMessage('Test data loaded successfully!');
    } catch (error) {
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
      console.error('Error loading test data:', error);
      // END TEST-ONLY LOGGING
      
      setMessage('Failed to load test data');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mb-6 p-4 border-2 border-dashed border-red-500 rounded-md bg-red-50">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-red-700">TEST MODE ONLY</h2>
        <span className="text-xs text-gray-500">Created: 2025-04-17 | Updated: 2025-04-17 16:36 EDT</span>
      </div>
      
      <p className="text-sm text-gray-700 mb-4">
        This component allows loading test scenarios to populate the form. It will not appear in production builds.
      </p>
      
      <div className="flex flex-wrap gap-2">
        <select
          value={selectedScenario}
          onChange={handleSelectChange}
          className="flex-grow p-2 border border-gray-300 rounded-md text-sm"
          disabled={isLoading}
        >
          <option value="">Select a test scenario</option>
          {scenarios.map(scenario => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name} - {scenario.description}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleLoadClick}
          disabled={isLoading || !selectedScenario}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isLoading ? 'Loading...' : 'Load Test Data'}
        </button>
      </div>
      
      {message && (
        <div className={`mt-2 p-2 text-sm rounded-md ${
          message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default TestDataSelector;
