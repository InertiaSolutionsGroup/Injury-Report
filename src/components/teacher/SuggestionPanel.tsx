import React from 'react';
import { ValidationResponse } from '../../lib/api';

interface SuggestionPanelProps {
  validationResponse: ValidationResponse;
  acceptedSuggestions: Record<string, boolean>;
  onAcceptSuggestion: (field: string) => void;
  onAcceptAllSuggestions: () => void;
  onFinalSubmit: () => void;
  isSubmitting: boolean;
}

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({
  validationResponse,
  acceptedSuggestions,
  onAcceptSuggestion,
  onAcceptAllSuggestions,
  onFinalSubmit,
  isSubmitting,
}) => {
  if (!validationResponse) return null;

  console.log('SuggestionPanel received validationResponse:', validationResponse);
  console.log('SuggestionPanel received acceptedSuggestions:', acceptedSuggestions);

  // Check if there are any suggestions
  const hasSuggestions = validationResponse.suggestions && validationResponse.suggestions.length > 0;
  console.log('Has suggestions:', hasSuggestions);
  
  // Check if there is a parent narrative
  const hasParentNarrative = !!validationResponse.parentNarrative;
  console.log('Has parent narrative:', hasParentNarrative, validationResponse.parentNarrative);

  return (
    <div className="space-y-6 mt-6">
      {/* AI Suggestions Section */}
      {hasSuggestions && (
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 002 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">AI has suggested improvements to your report</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please review the suggestions for each field and accept them if appropriate.</p>
              </div>
              <div className="mt-4">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={onAcceptAllSuggestions}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
                  >
                    Accept All Suggestions
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parent Narrative Section */}
      {hasParentNarrative && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Parent-Friendly Narrative Generated</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>The following narrative has been generated for parent communication:</p>
                <div className="mt-2 p-3 bg-white rounded border border-green-200">
                  <p className="whitespace-pre-wrap">{validationResponse.parentNarrative}</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                <p>This narrative will be saved with the injury report and can be used for parent communications.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onFinalSubmit}
          className="inline-flex items-center px-4 py-2 border border-gold shadow-sm text-sm font-medium rounded-md text-dark bg-gold hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
};

export default SuggestionPanel;
