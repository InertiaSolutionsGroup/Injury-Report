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
  originalValues?: {
    incidentDescription: string;
    injuryDescription: string;
    actionTaken: string;
  };
}

const InjuryDetailsSection: React.FC<InjuryDetailsSectionProps> = ({
  incidentDescription,
  injuryDescription,
  actionTaken,
  onChange,
  validationResponse,
  acceptedSuggestions = {},
  onAcceptSuggestion,
  showSuggestions = false,
  originalValues = {
    incidentDescription: '',
    injuryDescription: '',
    actionTaken: '',
  },
}) => {
  // Helper function to get suggestion for a field
  const getSuggestion = (field: string) => {
    if (!validationResponse || !validationResponse.suggestions || !showSuggestions) return null;
    return validationResponse.suggestions.find(s => s.field === field);
  };

  // Helper function to check if a suggestion is insufficient
  const isSuggestionInsufficient = (suggestion: any) => {
    return suggestion && suggestion.reason === 'insufficient';
  };

  // Handler for clearing a field to see the placeholder text
  const handleClearField = (field: string) => {
    if (!onChange) return;
    
    // Create a synthetic event to clear the field
    const syntheticEvent = {
      target: {
        name: field,
        value: '',
        type: 'textarea'
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;
    
    onChange(syntheticEvent);
  };

  // Get suggestions for each field
  const incidentSuggestion = getSuggestion('incident_description');
  const injurySuggestion = getSuggestion('injury_description');
  const actionSuggestion = getSuggestion('action_taken');

  // Helper function to get icon and message based on field
  const getFieldInfo = (field: string) => {
    switch(field) {
      case 'incident_description':
        return {
          icon: '📝',
          title: 'We need a bit more detail',
          message: 'Could you share how this happened? This helps parents understand the situation better.',
          color: 'orange'
        };
      case 'injury_description':
        return {
          icon: '🩹',
          title: 'A few more specifics would help',
          message: 'What type of injury was it, and where on the body? These details help parents know what to look for at home.',
          color: 'blue'
        };
      case 'action_taken':
        return {
          icon: '❤️',
          title: 'Parents love knowing how you helped',
          message: 'How did you care for the child? Parents appreciate knowing both the first aid provided and the comfort measures you offered.',
          color: 'purple'
        };
      default:
        return {
          icon: '📝',
          title: 'More information needed',
          message: 'Please provide more details to help us generate a parent-friendly report.',
          color: 'gray'
        };
    }
  };

  // Helper function to get positive feedback for sufficient responses
  const getSufficientFeedback = (field: string) => {
    switch(field) {
      case 'incident_description':
        return {
          icon: '✅',
          title: 'Thanks for your input - looks good!',
          message: 'We\'ve enhanced your description to be even more clear for parents.',
          color: 'green'
        };
      case 'injury_description':
        return {
          icon: '✅',
          title: 'Thanks for your input - looks good!',
          message: 'We\'ve enhanced your injury details to be more descriptive for parents.',
          color: 'green'
        };
      case 'action_taken':
        return {
          icon: '✅',
          title: 'Thanks for your input - looks good!',
          message: 'We\'ve enhanced your care description to reassure parents.',
          color: 'green'
        };
      default:
        return {
          icon: '✅',
          title: 'Thanks for your input - looks good!',
          message: 'We\'ve suggested some enhancements to make your report even better.',
          color: 'green'
        };
    }
  };

  // Helper function to get color classes based on field and status
  const getColorClasses = (field: string, isSufficient: boolean = false) => {
    if (isSufficient) {
      return {
        bg: 'bg-green-50',
        border: 'border-green-300',
        text: 'text-green-800',
        highlight: 'text-green-600',
        button: 'bg-green-100 hover:bg-green-200 text-green-700 focus:ring-green-500'
      };
    }
    
    const info = getFieldInfo(field);
    
    switch(info.color) {
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-300',
          text: 'text-orange-800',
          highlight: 'text-orange-600',
          button: 'bg-orange-100 hover:bg-orange-200 text-orange-700 focus:ring-orange-500'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          text: 'text-blue-800',
          highlight: 'text-blue-600',
          button: 'bg-blue-100 hover:bg-blue-200 text-blue-700 focus:ring-blue-500'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-300',
          text: 'text-purple-800',
          highlight: 'text-purple-600',
          button: 'bg-purple-100 hover:bg-purple-200 text-purple-700 focus:ring-purple-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          text: 'text-gray-800',
          highlight: 'text-gray-600',
          button: 'bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-500'
        };
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-gray-200">
      <div>
        <h3 className="text-xl font-medium leading-6 text-gray-900">Instructions</h3>
        <p className="mt-1 text-sm text-gray-500">
          This app will save you time by transforming your brief inputs into parent-friendly narratives.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Incident Description */}
        <div className="sm:col-span-6">
          <label htmlFor="incidentDescription" className="flex items-center text-base font-medium text-gray-700">
            <span className="mr-2 text-xl">{getFieldInfo('incident_description').icon}</span>
            Incident Description <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="mt-1 mb-2 text-sm text-gray-600 pl-7">
            Describe HOW the incident happened. Include where the child was, what they were doing, and any relevant context.
          </p>
          <div className="mt-1">
            <textarea
              id="incidentDescription"
              name="incidentDescription"
              rows={3}
              value={incidentDescription}
              onChange={onChange}
              placeholder={incidentSuggestion ? incidentSuggestion.suggestion : "Describe HOW the incident occurred with relevant context..."}
              className={`shadow-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-2 ${
                incidentSuggestion && !acceptedSuggestions['incident_description'] ? 'border-orange-400' : 'border-gray-300'
              } rounded-md p-3`}
              required
            />
          </div>
          
          {/* Suggestion for Incident Description */}
          {incidentSuggestion && showSuggestions && !acceptedSuggestions['incident_description'] && (
            <div className={`mt-3 p-4 ${getColorClasses('incident_description', !isSuggestionInsufficient(incidentSuggestion)).bg} ${getColorClasses('incident_description', !isSuggestionInsufficient(incidentSuggestion)).border} border rounded-md`}>
              <div className="flex">
                <div className="flex-shrink-0 text-2xl mr-3">
                  {isSuggestionInsufficient(incidentSuggestion) 
                    ? getFieldInfo('incident_description').icon 
                    : getSufficientFeedback('incident_description').icon}
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${getColorClasses('incident_description', !isSuggestionInsufficient(incidentSuggestion)).highlight}`}>
                    {isSuggestionInsufficient(incidentSuggestion) 
                      ? getFieldInfo('incident_description').title 
                      : getSufficientFeedback('incident_description').title}
                  </h3>
                  <div className={`mt-2 text-sm ${getColorClasses('incident_description', !isSuggestionInsufficient(incidentSuggestion)).text}`}>
                    <p className="mb-2">You entered: <em>"{originalValues.incidentDescription || incidentDescription}"</em></p>
                    <p>{isSuggestionInsufficient(incidentSuggestion) 
                      ? getFieldInfo('incident_description').message 
                      : getSufficientFeedback('incident_description').message}</p>
                  </div>
                  {!isSuggestionInsufficient(incidentSuggestion) && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => onAcceptSuggestion && onAcceptSuggestion('incident_description')}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${getColorClasses('incident_description', !isSuggestionInsufficient(incidentSuggestion)).button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      >
                        Keep Suggestion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Injury Description */}
        <div className="sm:col-span-6">
          <label htmlFor="injuryDescription" className="flex items-center text-base font-medium text-gray-700">
            <span className="mr-2 text-xl">{getFieldInfo('injury_description').icon}</span>
            Injury Description <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="mt-1 mb-2 text-sm text-gray-600 pl-7">
            Specify the TYPE of injury (cut, bruise, etc.) and WHERE on the body it occurred. Include size and appearance details when visible.
          </p>
          <div className="mt-1">
            <textarea
              id="injuryDescription"
              name="injuryDescription"
              rows={3}
              value={injuryDescription}
              onChange={onChange}
              placeholder={injurySuggestion ? injurySuggestion.suggestion : "Specify TYPE and LOCATION with size and appearance details..."}
              className={`shadow-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-2 ${
                injurySuggestion && !acceptedSuggestions['injury_description'] ? 'border-blue-400' : 'border-gray-300'
              } rounded-md p-3`}
              required
            />
          </div>
          
          {/* Suggestion for Injury Description */}
          {injurySuggestion && showSuggestions && !acceptedSuggestions['injury_description'] && (
            <div className={`mt-3 p-4 ${getColorClasses('injury_description', !isSuggestionInsufficient(injurySuggestion)).bg} ${getColorClasses('injury_description', !isSuggestionInsufficient(injurySuggestion)).border} border rounded-md`}>
              <div className="flex">
                <div className="flex-shrink-0 text-2xl mr-3">
                  {isSuggestionInsufficient(injurySuggestion) 
                    ? getFieldInfo('injury_description').icon 
                    : getSufficientFeedback('injury_description').icon}
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${getColorClasses('injury_description', !isSuggestionInsufficient(injurySuggestion)).highlight}`}>
                    {isSuggestionInsufficient(injurySuggestion) 
                      ? getFieldInfo('injury_description').title 
                      : getSufficientFeedback('injury_description').title}
                  </h3>
                  <div className={`mt-2 text-sm ${getColorClasses('injury_description', !isSuggestionInsufficient(injurySuggestion)).text}`}>
                    <p className="mb-2">You entered: <em>"{originalValues.injuryDescription || injuryDescription}"</em></p>
                    <p>{isSuggestionInsufficient(injurySuggestion) 
                      ? getFieldInfo('injury_description').message 
                      : getSufficientFeedback('injury_description').message}</p>
                  </div>
                  {!isSuggestionInsufficient(injurySuggestion) && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => onAcceptSuggestion && onAcceptSuggestion('injury_description')}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${getColorClasses('injury_description', !isSuggestionInsufficient(injurySuggestion)).button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      >
                        Keep Suggestion
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Taken */}
        <div className="sm:col-span-6">
          <label htmlFor="actionTaken" className="flex items-center text-base font-medium text-gray-700">
            <span className="mr-2 text-xl">{getFieldInfo('action_taken').icon}</span>
            Action Taken <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="mt-1 mb-2 text-sm text-gray-600 pl-7">
            Describe both the FIRST AID provided (if any) and how you COMFORTED the child emotionally after the incident.
          </p>
          <div className="mt-1">
            <textarea
              id="actionTaken"
              name="actionTaken"
              rows={3}
              value={actionTaken}
              onChange={onChange}
              placeholder={actionSuggestion ? actionSuggestion.suggestion : "Include both FIRST AID and EMOTIONAL SUPPORT provided..."}
              className={`shadow-md focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-2 ${
                actionSuggestion && !acceptedSuggestions['action_taken'] ? 'border-purple-400' : 'border-gray-300'
              } rounded-md p-3`}
              required
            />
          </div>
          
          {/* Suggestion for Action Taken */}
          {actionSuggestion && showSuggestions && !acceptedSuggestions['action_taken'] && (
            <div className={`mt-3 p-4 ${getColorClasses('action_taken', !isSuggestionInsufficient(actionSuggestion)).bg} ${getColorClasses('action_taken', !isSuggestionInsufficient(actionSuggestion)).border} border rounded-md`}>
              <div className="flex">
                <div className="flex-shrink-0 text-2xl mr-3">
                  {isSuggestionInsufficient(actionSuggestion) 
                    ? getFieldInfo('action_taken').icon 
                    : getSufficientFeedback('action_taken').icon}
                </div>
                <div>
                  <h3 className={`text-sm font-medium ${getColorClasses('action_taken', !isSuggestionInsufficient(actionSuggestion)).highlight}`}>
                    {isSuggestionInsufficient(actionSuggestion) 
                      ? getFieldInfo('action_taken').title 
                      : getSufficientFeedback('action_taken').title}
                  </h3>
                  <div className={`mt-2 text-sm ${getColorClasses('action_taken', !isSuggestionInsufficient(actionSuggestion)).text}`}>
                    <p className="mb-2">You entered: <em>"{originalValues.actionTaken || actionTaken}"</em></p>
                    <p>{isSuggestionInsufficient(actionSuggestion) 
                      ? getFieldInfo('action_taken').message 
                      : getSufficientFeedback('action_taken').message}</p>
                  </div>
                  {!isSuggestionInsufficient(actionSuggestion) && (
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => onAcceptSuggestion && onAcceptSuggestion('action_taken')}
                        className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md ${getColorClasses('action_taken', !isSuggestionInsufficient(actionSuggestion)).button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
                      >
                        Keep Suggestion
                      </button>
                    </div>
                  )}
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
