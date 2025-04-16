import React from 'react';

interface SuggestionPanelProps {
  validationResponse: any;
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
  return (
    <div className="rounded-md bg-yellow-50 p-4 mt-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-7-4a1 1 0 10-2 0v4a1 1 0 002 0V6zm-1 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">AI has suggested improvements to your report</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Please review the suggestions above for each field and accept them if appropriate.</p>
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
              <button
                type="button"
                onClick={onFinalSubmit}
                className="inline-flex items-center px-3 py-2 border border-gold shadow-sm text-sm leading-4 font-medium rounded-md text-dark bg-gold hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
                disabled={isSubmitting}
              >
                Submit as is
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionPanel;
