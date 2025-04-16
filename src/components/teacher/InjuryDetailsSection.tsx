import React from 'react';
import FieldSuggestion from './FieldSuggestion';
import { ValidationResponse } from '../../lib/api';

interface InjuryDetailsSectionProps {
  incidentDescription: string;
  injuryDescription: string;
  actionTaken: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  validationResponse?: ValidationResponse | null;
  acceptedSuggestions: Record<string, boolean>;
  onAcceptSuggestion: (field: string) => void;
}

const InjuryDetailsSection: React.FC<InjuryDetailsSectionProps> = ({
  incidentDescription,
  injuryDescription,
  actionTaken,
  onChange,
  validationResponse,
  acceptedSuggestions,
  onAcceptSuggestion
}) => {
  // Helper function to find suggestion for a specific field
  const getSuggestionForField = (fieldName: string) => {
    if (!validationResponse || !validationResponse.suggestions) return null;
    return validationResponse.suggestions.find(s => s.field === fieldName);
  };

  const incidentSuggestion = getSuggestionForField('incident_description');
  const injurySuggestion = getSuggestionForField('injury_description');
  const actionSuggestion = getSuggestionForField('action_taken');

  return (
    <div className="space-y-6 pt-6 border-t border-gray-200">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Instructions</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please provide brief but specific details in each field. This app will transform your input into a 
          parent-friendly narrative, saving you valuable time while ensuring parents receive clear communication.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Incident Description */}
        <div className="sm:col-span-6">
          <label htmlFor="incidentDescription" className="block text-sm font-medium text-gray-700">
            Incident Description <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Provide a detailed account of <em>how</em> the incident occurred. Include context about what the child was doing.
          </p>
          <div className="mt-1">
            <textarea
              id="incidentDescription"
              name="incidentDescription"
              rows={3}
              value={incidentDescription}
              onChange={onChange}
              placeholder="e.g., 'Emma was running on the playground when she tripped over a tree root and fell onto the mulch'"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-white border-2 border-blue-100"
              required
            />
          </div>
          {incidentSuggestion && (
            <FieldSuggestion
              original={incidentSuggestion.original}
              suggestion={incidentSuggestion.suggestion}
              reason={incidentSuggestion.reason}
              isAccepted={acceptedSuggestions['incident_description'] || false}
              onAccept={() => onAcceptSuggestion('incident_description')}
            />
          )}
        </div>
        
        {/* Injury Description */}
        <div className="sm:col-span-6">
          <label htmlFor="injuryDescription" className="block text-sm font-medium text-gray-700">
            Injury Description <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Specify the <em>type</em> and <em>location</em> of the injury in detail. Include information about 
            size and appearance if possible.
          </p>
          <div className="mt-1">
            <textarea
              id="injuryDescription"
              name="injuryDescription"
              rows={3}
              value={injuryDescription}
              onChange={onChange}
              placeholder="e.g., 'Small scrape approximately 1 inch long on Noah's right forearm with minor redness but no bleeding'"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-white border-2 border-blue-100"
              required
            />
          </div>
          {injurySuggestion && (
            <FieldSuggestion
              original={injurySuggestion.original}
              suggestion={injurySuggestion.suggestion}
              reason={injurySuggestion.reason}
              isAccepted={acceptedSuggestions['injury_description'] || false}
              onAccept={() => onAcceptSuggestion('injury_description')}
            />
          )}
        </div>
        
        {/* Action Taken */}
        <div className="sm:col-span-6">
          <label htmlFor="actionTaken" className="block text-sm font-medium text-gray-700">
            Action Taken <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Describe both the <em>first aid</em> provided AND any <em>soothing/comforting actions</em> taken.
          </p>
          <div className="mt-1">
            <textarea
              id="actionTaken"
              name="actionTaken"
              rows={3}
              value={actionTaken}
              onChange={onChange}
              placeholder="e.g., 'We gently cleaned Sophia's scrape with soap and water, applied a bandage, and comforted her with a hug and a sticker'"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md bg-white border-2 border-blue-100"
              required
            />
          </div>
          {actionSuggestion && (
            <FieldSuggestion
              original={actionSuggestion.original}
              suggestion={actionSuggestion.suggestion}
              reason={actionSuggestion.reason}
              isAccepted={acceptedSuggestions['action_taken'] || false}
              onAccept={() => onAcceptSuggestion('action_taken')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InjuryDetailsSection;
