import React from 'react';
import { ValidationResponse } from '../../lib/api';

interface InjuryDetailsSectionProps {
  incidentDescription: string;
  injuryDescription: string;
  actionTaken: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  validationResponse?: ValidationResponse | null;
  acceptedSuggestions?: Record<string, boolean>;
  onAcceptSuggestion?: (field: string) => void;
  showSuggestions?: boolean;
}

const InjuryDetailsSection: React.FC<InjuryDetailsSectionProps> = ({
  incidentDescription,
  injuryDescription,
  actionTaken,
  onChange,
  validationResponse,
  acceptedSuggestions = {},
  onAcceptSuggestion,
  showSuggestions = false
}) => {
  // Helper function to get suggestion for a field
  const getSuggestion = (field: string) => {
    if (!validationResponse || !validationResponse.suggestions || !showSuggestions) return null;
    return validationResponse.suggestions.find(s => s.field === field);
  };

  // Get suggestions for each field
  const incidentSuggestion = getSuggestion('incident_description');
  const injurySuggestion = getSuggestion('injury_description');
  const actionSuggestion = getSuggestion('action_taken');

  return (
    <div className="space-y-6 pt-6 border-t border-gray-200">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Instructions</h3>
        <p className="mt-1 text-sm text-gray-500">
          This app will save you time by transforming your brief inputs into parent-friendly narratives.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Incident Description */}
        <div className="sm:col-span-6">
          <label htmlFor="incidentDescription" className="block text-sm font-medium text-gray-700">
            Incident Description <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="incidentDescription"
              name="incidentDescription"
              rows={3}
              value={incidentDescription}
              onChange={onChange}
              placeholder="Describe HOW the incident occurred with relevant context..."
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                incidentSuggestion && !acceptedSuggestions['incident_description'] ? 'border-yellow-400' : ''
              }`}
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Focus on HOW the incident occurred with relevant context
          </p>
          
          {/* Suggestion for Incident Description */}
          {incidentSuggestion && showSuggestions && !acceptedSuggestions['incident_description'] && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Suggested improvement:</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>{incidentSuggestion.suggestion}</p>
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => onAcceptSuggestion && onAcceptSuggestion('incident_description')}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Accept suggestion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Injury Description */}
        <div className="sm:col-span-6">
          <label htmlFor="injuryDescription" className="block text-sm font-medium text-gray-700">
            Injury Description <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="injuryDescription"
              name="injuryDescription"
              rows={3}
              value={injuryDescription}
              onChange={onChange}
              placeholder="Specify TYPE and LOCATION with size and appearance details..."
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                injurySuggestion && !acceptedSuggestions['injury_description'] ? 'border-yellow-400' : ''
              }`}
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Include TYPE and LOCATION of injury with details on size and appearance
          </p>
          
          {/* Suggestion for Injury Description */}
          {injurySuggestion && showSuggestions && !acceptedSuggestions['injury_description'] && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Suggested improvement:</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>{injurySuggestion.suggestion}</p>
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => onAcceptSuggestion && onAcceptSuggestion('injury_description')}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Accept suggestion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Taken */}
        <div className="sm:col-span-6">
          <label htmlFor="actionTaken" className="block text-sm font-medium text-gray-700">
            Action Taken <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="actionTaken"
              name="actionTaken"
              rows={3}
              value={actionTaken}
              onChange={onChange}
              placeholder="Include both FIRST AID and EMOTIONAL SUPPORT provided..."
              className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                actionSuggestion && !acceptedSuggestions['action_taken'] ? 'border-yellow-400' : ''
              }`}
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Describe both FIRST AID and EMOTIONAL SUPPORT provided
          </p>
          
          {/* Suggestion for Action Taken */}
          {actionSuggestion && showSuggestions && !acceptedSuggestions['action_taken'] && (
            <div className="mt-2 p-3 bg-yellow-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Suggested improvement:</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>{actionSuggestion.suggestion}</p>
                  </div>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => onAcceptSuggestion && onAcceptSuggestion('action_taken')}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Accept suggestion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InjuryDetailsSection;
