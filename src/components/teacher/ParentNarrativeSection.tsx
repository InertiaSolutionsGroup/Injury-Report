import React from 'react';

interface ParentNarrativeSectionProps {
  narrative: string | null;
  allFieldsSufficient: boolean;
}

/**
 * Component to display the AI-generated parent narrative
 * Only shown when all three fields (incident_description, injury_description, action_taken) are sufficient
 */
const ParentNarrativeSection: React.FC<ParentNarrativeSectionProps> = ({ 
  narrative, 
  allFieldsSufficient 
}) => {
  if (!allFieldsSufficient) {
    return (
      <div className="rounded-md bg-gray-50 p-4 my-6 border border-dashed border-gray-300">
        <div className="flex items-center mb-2">
          <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-600">
            Parent Communication Preview
          </h3>
        </div>
        <div className="border-t border-gray-200 mb-3"></div>
        <p className="text-gray-500 italic">
          A parent-friendly narrative will be generated once all fields have sufficient information.
        </p>
      </div>
    );
  }

  if (!narrative) {
    return null;
  }

  return (
    <div className="rounded-md bg-blue-50 p-4 my-6 border border-blue-200">
      <div className="flex items-center mb-2">
        <svg className="h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <h3 className="text-lg font-medium text-blue-700">
          Parent Communication Preview
        </h3>
      </div>
      <div className="border-t border-blue-200 mb-3"></div>
      <p className="text-blue-800 leading-relaxed">
        {narrative}
      </p>
    </div>
  );
};

export default ParentNarrativeSection;
