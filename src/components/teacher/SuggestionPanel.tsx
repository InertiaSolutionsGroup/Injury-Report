import React from 'react';
import { ValidationResponse } from '../../lib/api';
import ParentNarrativeSection from './ParentNarrativeSection';

interface SuggestionPanelProps {
  validationResponse: ValidationResponse;
  acceptedSuggestions: Record<string, boolean>;
  onAcceptSuggestion: (field: string) => void;
  onAcceptAllSuggestions: () => void;
  onSubmit: () => void;
  parentNarrative?: string | null;
}

/**
 * Component to display AI validation results and controls
 * 
 * This component shows:
 * 1. Status message indicating if all fields are sufficient or how many need more information
 * 2. Parent narrative section (when available)
 * 3. Action buttons for accepting enhancements and submitting the report
 * 
 * The "Accept All Enhancements" button only appears when all fields are sufficient.
 * The submit button is disabled when any field is insufficient.
 * 
 * @param validationResponse - The response from the n8n validation API
 * @param acceptedSuggestions - Record of which suggestions have been accepted
 * @param onAcceptSuggestion - Handler for accepting a single suggestion
 * @param onAcceptAllSuggestions - Handler for accepting all suggestions at once
 * @param onSubmit - Handler for submitting the final report
 * @param parentNarrative - Optional parent narrative text that overrides the one in validationResponse
 */
const SuggestionPanel: React.FC<SuggestionPanelProps> = ({
  validationResponse,
  acceptedSuggestions,
  onAcceptSuggestion,
  onAcceptAllSuggestions,
  onSubmit,
  parentNarrative,
}) => {
  if (!validationResponse) return null;

  // Determine if we're using the new fieldEvaluations or legacy suggestions
  const useFieldEvaluations = validationResponse.fieldEvaluations && validationResponse.fieldEvaluations.length > 0;
  
  // Count insufficient fields
  const insufficientCount = useFieldEvaluations
    ? validationResponse.fieldEvaluations!.filter(evaluation => evaluation.status === 'insufficient').length
    : validationResponse.suggestions?.filter(s => s.reason === 'insufficient').length || 0;
  
  // Determine if all fields are sufficient
  const allFieldsSufficient = insufficientCount === 0;

  // Get parent narrative - prefer the passed prop, then the new parent_narrative field, then legacy parentNarrative
  const narrative = parentNarrative !== undefined 
    ? parentNarrative 
    : validationResponse.parent_narrative !== undefined 
      ? validationResponse.parent_narrative 
      : validationResponse.parentNarrative || null;

  // Prepare status message
  let statusMessage = 'All fields have sufficient information. You can now submit the report.';
  if (insufficientCount > 0) {
    statusMessage = `${insufficientCount} field${insufficientCount > 1 ? 's' : ''} need${insufficientCount === 1 ? 's' : ''} more information before submitting.`;
  }

  // Determine if we should show the parent narrative section
  const showParentNarrative = parentNarrative !== undefined || validationResponse.parent_narrative !== undefined || validationResponse.parentNarrative !== undefined;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">AI Validation Results</h2>
      <div className="border-t border-gray-200 mb-4"></div>
      
      {/* Status message - shows green for sufficient, yellow for insufficient */}
      <div className={`p-4 rounded-md mb-4 ${allFieldsSufficient ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            {allFieldsSufficient ? (
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">
              {statusMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Parent Narrative Section - only shown when narrative is available */}
      {showParentNarrative && (
        <ParentNarrativeSection 
          narrative={narrative} 
          allFieldsSufficient={allFieldsSufficient} 
        />
      )}

      {/* Action buttons */}
      <div className="mt-6 flex justify-between">
        {/* Only show "Accept All Enhancements" when all fields are sufficient */}
        {allFieldsSufficient && (
          <button
            type="button"
            onClick={onAcceptAllSuggestions}
            disabled={Object.keys(acceptedSuggestions).length === (useFieldEvaluations ? validationResponse.fieldEvaluations!.length : validationResponse.suggestions?.length || 0)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Accept AI Enhancements
          </button>
        )}
        
        {/* Submit button - disabled when any field is insufficient */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={insufficientCount > 0}
          className="ml-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          Send to Front Desk
        </button>
      </div>
    </div>
  );
};

export default SuggestionPanel;
