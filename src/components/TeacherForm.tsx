import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Child, User, fetchChildren, fetchUsers, createInjuryReport } from '../lib/supabase';
import { validateInjuryReport, ValidationResponse } from '../lib/api';

const TeacherForm: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState({
    childId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    location: '',
    submittingUserId: '',
    incidentDescription: '',
    injuryDescription: '',
    actionTaken: '',
    isBite: false,
    biterChildId: '',
    isPeerAggression: false,
    aggressorChildId: '',
  });
  
  // Data for dropdowns
  const [children, setChildren] = useState<Child[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  
  // Validation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResponse, setValidationResponse] = useState<ValidationResponse | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Record<string, boolean>>({});
  
  // Load data for dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        const [childrenData, teachersData] = await Promise.all([
          fetchChildren(),
          fetchUsers('Teacher')
        ]);
        
        setChildren(childrenData);
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // Reset related fields when unchecking
        ...(name === 'isBite' && !checked ? { biterChildId: '' } : {}),
        ...(name === 'isPeerAggression' && !checked ? { aggressorChildId: '' } : {})
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear validation when form is edited
    if (showSuggestions) {
      setShowSuggestions(false);
    }
  };
  
  // Validate form before submission
  const validateForm = (): boolean => {
    // Required fields
    const requiredFields = [
      'childId', 'date', 'time', 'location', 'submittingUserId',
      'incidentDescription', 'injuryDescription', 'actionTaken'
    ];
    
    // Additional conditional required fields
    if (formData.isBite && !formData.biterChildId) {
      alert('Please select the child who bit');
      return false;
    }
    
    if (formData.isPeerAggression && !formData.aggressorChildId) {
      alert('Please select the other child involved in peer aggression');
      return false;
    }
    
    // Check all required fields
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        alert(`Please fill in all required fields`);
        return false;
      }
    }
    
    return true;
  };
  
  // Handle form submission for AI validation
  const handleSubmitForValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setValidationError(null);
    
    try {
      // Prepare data for validation
      const injuryTimestamp = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      const reportData = {
        child_id: formData.childId,
        submitting_user_id: formData.submittingUserId,
        injury_timestamp: injuryTimestamp,
        location: formData.location,
        incident_description: formData.incidentDescription,
        injury_description: formData.injuryDescription,
        action_taken: formData.actionTaken,
        is_bite: formData.isBite,
        biter_child_id: formData.isBite ? formData.biterChildId : undefined,
        is_peer_aggression: formData.isPeerAggression,
        aggressor_child_id: formData.isPeerAggression ? formData.aggressorChildId : undefined
      };
      
      // Call AI validation service
      const response = await validateInjuryReport(reportData);
      setValidationResponse(response);
      
      if (response.status === 'success') {
        if (response.suggestions && response.suggestions.length > 0) {
          setShowSuggestions(true);
        } else {
          // No suggestions, proceed to final submission
          handleFinalSubmit();
        }
      } else {
        setValidationError(response.message || 'Unknown error occurred during validation');
      }
    } catch (error) {
      console.error('Error during validation:', error);
      setValidationError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle accepting a suggestion
  const handleAcceptSuggestion = (field: string) => {
    if (!validationResponse?.suggestions) return;
    
    const suggestion = validationResponse.suggestions.find(s => s.field === field);
    if (!suggestion) return;
    
    // Update form data with the suggestion
    setFormData(prev => ({
      ...prev,
      [`${field}`]: suggestion.suggestion
    }));
    
    // Mark suggestion as accepted
    setAcceptedSuggestions(prev => ({
      ...prev,
      [field]: true
    }));
  };
  
  // Handle accepting all suggestions
  const handleAcceptAllSuggestions = () => {
    if (!validationResponse?.suggestions) return;
    
    const newFormData = { ...formData };
    const newAcceptedSuggestions: Record<string, boolean> = {};
    
    validationResponse.suggestions.forEach(suggestion => {
      const field = suggestion.field;
      if (field === 'incident_description') {
        newFormData.incidentDescription = suggestion.suggestion;
      } else if (field === 'injury_description') {
        newFormData.injuryDescription = suggestion.suggestion;
      } else if (field === 'action_taken') {
        newFormData.actionTaken = suggestion.suggestion;
      }
      newAcceptedSuggestions[field] = true;
    });
    
    setFormData(newFormData);
    setAcceptedSuggestions(newAcceptedSuggestions);
  };
  
  // Handle final form submission to database
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const injuryTimestamp = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      const reportData = {
        child_id: formData.childId,
        submitting_user_id: formData.submittingUserId,
        injury_timestamp: injuryTimestamp,
        location: formData.location,
        incident_description: formData.incidentDescription,
        injury_description: formData.injuryDescription,
        action_taken: formData.actionTaken,
        is_bite: formData.isBite,
        biter_child_id: formData.isBite ? formData.biterChildId : undefined,
        is_peer_aggression: formData.isPeerAggression,
        aggressor_child_id: formData.isPeerAggression ? formData.aggressorChildId : undefined,
        is_reviewed: false,
        is_delivered_to_parent: false
      };
      
      // Submit to database
      await createInjuryReport(reportData);
      
      // Reset form and show success message
      alert('Injury report submitted successfully!');
      
      // Reset form
      setFormData({
        childId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm'),
        location: '',
        submittingUserId: '',
        incidentDescription: '',
        injuryDescription: '',
        actionTaken: '',
        isBite: false,
        biterChildId: '',
        isPeerAggression: false,
        aggressorChildId: '',
      });
      
      // Clear validation state
      setValidationResponse(null);
      setShowSuggestions(false);
      setAcceptedSuggestions({});
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render suggestion component for a field
  const renderSuggestion = (field: string, label: string) => {
    if (!validationResponse?.suggestions) return null;
    
    const suggestion = validationResponse.suggestions.find(s => s.field === field);
    if (!suggestion) return null;
    
    const isAccepted = acceptedSuggestions[field];
    
    return (
      <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h4 className="font-medium text-yellow-800">Suggestion for {label}</h4>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-gray-500">Original</h5>
            <p className="mt-1 text-sm text-gray-800">{suggestion.original}</p>
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-500">Suggested</h5>
            <p className="mt-1 text-sm text-gray-800">{suggestion.suggestion}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          <strong>Reason:</strong> {suggestion.reason}
        </p>
        {!isAccepted && (
          <button
            type="button"
            onClick={() => handleAcceptSuggestion(field)}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Accept Suggestion
          </button>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">New Injury Report</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Please fill out all required fields to document a child injury.
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmitForValidation}>
          {/* Child and Date/Time Information */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="childId" className="block text-sm font-medium text-gray-700">
                Child's Name *
              </label>
              <div className="mt-1">
                <select
                  id="childId"
                  name="childId"
                  value={formData.childId}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select a child</option>
                  {children.map(child => (
                    <option key={child.id} value={child.id}>{child.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date of Injury *
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                Time of Injury *
              </label>
              <div className="mt-1">
                <input
                  type="time"
                  name="time"
                  id="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location where the injury occurred *
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Suite 100 or 350 Playground"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="submittingUserId" className="block text-sm font-medium text-gray-700">
                Teacher Documenting the Injury *
              </label>
              <div className="mt-1">
                <select
                  id="submittingUserId"
                  name="submittingUserId"
                  value={formData.submittingUserId}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select your name</option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Injury Details */}
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="incidentDescription" className="block text-sm font-medium text-gray-700">
                Incident Description *
              </label>
              <div className="mt-1">
                <textarea
                  id="incidentDescription"
                  name="incidentDescription"
                  rows={4}
                  value={formData.incidentDescription}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Explain in reasonable detail HOW the child was injured"
                  required
                />
              </div>
              {renderSuggestion('incident_description', 'Incident Description')}
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="injuryDescription" className="block text-sm font-medium text-gray-700">
                Injury Description *
              </label>
              <div className="mt-1">
                <textarea
                  id="injuryDescription"
                  name="injuryDescription"
                  rows={4}
                  value={formData.injuryDescription}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe the actual injury, its location on the body,
                  and some details as to its severity and the child's reaction.
                  (e.g. Scrape on forehead, no blood, just a few tears). "
                  required
                />
              </div>
              {renderSuggestion('injury_description', 'Injury Description')}
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="actionTaken" className="block text-sm font-medium text-gray-700">
                Action Taken *
              </label>
              <div className="mt-1">
                <textarea
                  id="actionTaken"
                  name="actionTaken"
                  rows={3}
                  value={formData.actionTaken}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe the action taken to tend to the injury and also to comfort the child. 
                  (e.g. Put on a Cookie Monster band-aid and gave him an ice-sponge - LOTS of hugs!)"
                  required
                />
              </div>
              {renderSuggestion('action_taken', 'Action Taken')}
            </div>
          </div>
          
          {/* Conditional Fields */}
          <div className="mt-6 space-y-6">
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isBite"
                  name="isBite"
                  type="checkbox"
                  checked={formData.isBite}
                  onChange={handleInputChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isBite" className="font-medium text-gray-700">Bite?</label>
                <p className="text-gray-500">Check if the injury was caused by a bite</p>
              </div>
            </div>
            
            {formData.isBite && (
              <div className="ml-7">
                <label htmlFor="biterChildId" className="block text-sm font-medium text-gray-700">
                  Name of Child Who Bit *
                </label>
                <div className="mt-1">
                  <select
                    id="biterChildId"
                    name="biterChildId"
                    value={formData.biterChildId}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required={formData.isBite}
                  >
                    <option value="">Select a child</option>
                    {children.map(child => (
                      <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            
            <div className="relative flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="isPeerAggression"
                  name="isPeerAggression"
                  type="checkbox"
                  checked={formData.isPeerAggression}
                  onChange={handleInputChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="isPeerAggression" className="font-medium text-gray-700">Other injury caused by a "friend"?</label>
                <p className="text-gray-500">Check if the injury was caused by peer aggression</p>
              </div>
            </div>
            
            {formData.isPeerAggression && (
              <div className="ml-7">
                <label htmlFor="aggressorChildId" className="block text-sm font-medium text-gray-700">
                  Name of Other Child Involved *
                </label>
                <div className="mt-1">
                  <select
                    id="aggressorChildId"
                    name="aggressorChildId"
                    value={formData.aggressorChildId}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required={formData.isPeerAggression}
                  >
                    <option value="">Select a child</option>
                    {children.map(child => (
                      <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          
          {/* Validation Error */}
          {validationError && (
            <div className="mt-6 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error connecting to AI validation service</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{validationError}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={handleSubmitForValidation}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Retry
                      </button>
                      <button
                        type="button"
                        onClick={handleFinalSubmit}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Submit as is
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Suggestions Summary */}
          {showSuggestions && validationResponse?.suggestions && validationResponse.suggestions.length > 0 && (
            <div className="mt-6 rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
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
                        onClick={handleAcceptAllSuggestions}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Accept All Suggestions
                      </button>
                      <button
                        type="button"
                        onClick={handleFinalSubmit}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Submit as is
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Form Actions */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  childId: '',
                  date: format(new Date(), 'yyyy-MM-dd'),
                  time: format(new Date(), 'HH:mm'),
                  location: '',
                  submittingUserId: '',
                  incidentDescription: '',
                  injuryDescription: '',
                  actionTaken: '',
                  isBite: false,
                  biterChildId: '',
                  isPeerAggression: false,
                  aggressorChildId: '',
                });
                setValidationResponse(null);
                setShowSuggestions(false);
                setAcceptedSuggestions({});
              }}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-gold shadow-sm text-sm font-medium rounded-md text-dark bg-gold hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors duration-150 font-bold uppercase"
            >
              CLEAR FORM
            </button>
            
            {!showSuggestions && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors duration-150 uppercase"
              >
                {isSubmitting ? 'PROCESSING...' : 'SUBMIT FOR REVIEW'}
              </button>
            )}
            
            {showSuggestions && (
              <button
                type="button"
                onClick={handleSubmitForValidation}
                disabled={isSubmitting}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors duration-150 uppercase"
              >
                {isSubmitting ? 'PROCESSING...' : 'RE-EVALUATE WITH AI'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;
