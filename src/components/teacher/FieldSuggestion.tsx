import React from 'react';

interface FieldSuggestionProps {
  original: string;
  suggestion: string;
  reason: string;
  isAccepted: boolean;
  onAccept: () => void;
}

const FieldSuggestion: React.FC<FieldSuggestionProps> = ({
  original,
  suggestion,
  reason,
  isAccepted,
  onAccept
}) => {
  return (
    <div className="mt-2 p-3 border rounded-md bg-yellow-50 border-yellow-200">
      <div className="flex justify-between items-start">
        <div className="text-sm text-yellow-800 font-medium">AI Suggestion</div>
        {!isAccepted && (
          <button
            type="button"
            onClick={onAccept}
            className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-1 px-2 rounded"
          >
            Accept
          </button>
        )}
        {isAccepted && (
          <span className="text-xs bg-green-100 text-green-800 font-medium py-1 px-2 rounded">
            Accepted
          </span>
        )}
      </div>
      
      <div className="mt-2 text-sm">
        <div className="text-gray-500">
          <span className="font-medium">Original:</span> {original}
        </div>
        <div className="text-green-700 mt-1">
          <span className="font-medium">Suggestion:</span> {suggestion}
        </div>
        <div className="text-gray-600 mt-1 italic">
          <span className="font-medium">Reason:</span> {reason}
        </div>
      </div>
    </div>
  );
};

export default FieldSuggestion;
