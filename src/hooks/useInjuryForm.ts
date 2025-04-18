import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Child, User, fetchChildren, fetchUsers, createInjuryReport } from '../lib/supabase';
import { validateInjuryReport, ValidationResponse } from '../lib/api';

// Import Supabase configuration
import { supabase } from '../lib/supabase';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

interface InjuryFormData {
  childId: string;
  date: string;
  time: string;
  location: string;
  submittingUserId: string;
  incidentDescription: string;
  injuryDescription: string;
  actionTaken: string;
  isBite: boolean;
  biterChildId: string;
  isPeerAggression: boolean;
  aggressorChildId: string;
  originalIncidentDescription: string | null;
  originalInjuryDescription: string | null;
  originalActionTaken: string | null;
}

interface UseInjuryFormReturn {
  formData: InjuryFormData;
  children: Child[];
  teachers: User[];
  isSubmitting: boolean;
  validationResponse: ValidationResponse | null;
  validationError: string | null;
  showSuggestions: boolean;
  acceptedSuggestions: Record<string, boolean>;
  parentNarrative: string | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  validateForm: () => boolean;
  handleSubmitForValidation: (e: React.FormEvent) => Promise<void>;
  handleAcceptSuggestion: (field: string) => void;
  handleAcceptAllSuggestions: () => void;
  handleFinalSubmit: () => Promise<void>;
  resetForm: () => void;
  // TEST-ONLY - REMOVE FOR PRODUCTION - Added 2025-04-17 16:30 EDT
  // Exposing setFormData to allow direct state updates for testing
  setFormData: React.Dispatch<React.SetStateAction<InjuryFormData>>;
  // END TEST-ONLY
}

const initialFormData: InjuryFormData = {
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
  originalIncidentDescription: null,
  originalInjuryDescription: null,
  originalActionTaken: null,
};

export const useInjuryForm = (): UseInjuryFormReturn => {
  // Form state
  const [formData, setFormData] = useState<InjuryFormData>(initialFormData);
  
  // Data for dropdowns
  const [children, setChildren] = useState<Child[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  
  // Validation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResponse, setValidationResponse] = useState<ValidationResponse | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Record<string, boolean>>({});
  const [parentNarrative, setParentNarrative] = useState<string | null>(null);
  
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
      { field: 'childId', label: 'Child' },
      { field: 'date', label: 'Date' },
      { field: 'time', label: 'Time' },
      { field: 'location', label: 'Location' },
      { field: 'submittingUserId', label: 'Submitting Teacher' },
      { field: 'incidentDescription', label: 'Incident Description' },
      { field: 'injuryDescription', label: 'Injury Description' },
      { field: 'actionTaken', label: 'Action Taken' },
    ];
    
    // Check each required field
    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof InjuryFormData]) {
        alert(`Please fill in the ${label} field.`);
        return false;
      }
    }
    
    // Check conditional required fields
    if (formData.isBite && !formData.biterChildId) {
      alert('Please select the biter child.');
      return false;
    }
    
    if (formData.isPeerAggression && !formData.aggressorChildId) {
      alert('Please select the aggressor child.');
      return false;
    }
    
    return true;
  };
  
  /**
   * Process validation response from n8n
   * 
   * This function handles the AI validation response and updates the form accordingly:
   * - For sufficient fields: Shows the AI's enhanced text in the form fields
   * - For insufficient fields: Clears the field and stores the original value
   * - Sets up the parent narrative when all fields are sufficient
   * 
   * @param response - The validation response from n8n
   */
  const processValidationResponse = (response: ValidationResponse) => {
    setValidationResponse(response);
    setShowSuggestions(true);
    setParentNarrative(response.parent_narrative !== undefined ? response.parent_narrative : null);
    
    // Store original values before making any changes
    const originalValues = {
      incidentDescription: formData.incidentDescription,
      injuryDescription: formData.injuryDescription,
      actionTaken: formData.actionTaken
    };
    
    // Process suggestions if available - using new fieldEvaluations format
    if (response.fieldEvaluations && response.fieldEvaluations.length > 0) {
      // Process each field evaluation
      const updatedFormData = { ...formData };
      let fieldsUpdated = false;
      
      // Map API field names to form field names
      const fieldMapping: Record<string, keyof InjuryFormData> = {
        'incident_description': 'incidentDescription',
        'injury_description': 'injuryDescription',
        'action_taken': 'actionTaken',
      };
      
      // Map API field names to original field names for storing pre-AI values
      const originalFieldMapping: Record<string, keyof InjuryFormData> = {
        'incident_description': 'originalIncidentDescription',
        'injury_description': 'originalInjuryDescription',
        'action_taken': 'originalActionTaken',
      };
      
      // Process each field evaluation from the AI
      response.fieldEvaluations.forEach(evaluation => {
        const formField = fieldMapping[evaluation.field];
        const originalField = originalFieldMapping[evaluation.field];
        
        if (formField) {
          if (evaluation.status === 'insufficient') {
            // For insufficient fields:
            // 1. Clear the field to prompt teacher to provide better input
            // 2. Store original value for reference
            // 3. The placeholder text will show the AI's guidance on what information is needed
            if (originalField) {
              (updatedFormData[originalField] as string) = updatedFormData[formField] as string;
            }
            (updatedFormData[formField] as string) = '';
            fieldsUpdated = true;
          } else if (evaluation.status === 'sufficient') {
            // For sufficient fields:
            // 1. Store original value for reference
            // 2. Replace with AI's improved version of the text
            // 3. The UI will show positive feedback and an "Accept Enhancement" button
            if (originalField) {
              (updatedFormData[originalField] as string) = updatedFormData[formField] as string;
            }
            // The suggestion field contains the AI's improved version of the text
            (updatedFormData[formField] as string) = evaluation.suggestion;
            fieldsUpdated = true;
          }
        }
      });
      
      // Update form data with the processed fields
      if (fieldsUpdated) {
        // Update immediately to show enhanced text in the form fields
        setFormData(updatedFormData);
      }
    } else if (response.suggestions && response.suggestions.length > 0) {
      // Legacy support for old API format (pre-April 2025)
      // Process each suggestion using the older format
      const updatedFormData = { ...formData };
      let fieldsUpdated = false;
      
      // Map API field names to form field names
      const fieldMapping: Record<string, keyof InjuryFormData> = {
        'incident_description': 'incidentDescription',
        'injury_description': 'injuryDescription',
        'action_taken': 'actionTaken',
      };
      
      // Map API field names to original field names
      const originalFieldMapping: Record<string, keyof InjuryFormData> = {
        'incident_description': 'originalIncidentDescription',
        'injury_description': 'originalInjuryDescription',
        'action_taken': 'originalActionTaken',
      };
      
      // Process each suggestion from the legacy API format
      response.suggestions.forEach(suggestion => {
        const formField = fieldMapping[suggestion.field];
        const originalField = originalFieldMapping[suggestion.field];
        
        if (formField) {
          if (suggestion.reason === 'insufficient') {
            // For insufficient fields - same logic as above
            if (originalField) {
              (updatedFormData[originalField] as string) = updatedFormData[formField] as string;
            }
            (updatedFormData[formField] as string) = '';
            fieldsUpdated = true;
          } else if (suggestion.reason === 'sufficient') {
            // For sufficient fields - same logic as above
            if (originalField) {
              (updatedFormData[originalField] as string) = updatedFormData[formField] as string;
            }
            (updatedFormData[formField] as string) = suggestion.suggestion;
            fieldsUpdated = true;
          }
        }
      });
      
      // Update form data with the processed fields
      if (fieldsUpdated) {
        setFormData(updatedFormData);
      }
    }
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
      // Format the timestamp in Eastern Time for display
      const injuryDate = new Date(`${formData.date}T${formData.time}`);
      const formattedEasternTime = formatInTimeZone(
        injuryDate,
        'America/New_York',
        'yyyy-MM-dd h:mm a zzz' // Format: 2025-04-17 11:30 AM EDT
      );
      
      // Find the selected child to get their name
      const selectedChild = children.find(child => child.id === formData.childId);
      const childName = selectedChild ? selectedChild.name : '';
      
      // Prepare focused data payload (6 fields only) to conserve tokens
      const validationData = {
        child_name: childName,                       // Added for context
        injury_time_eastern: formattedEasternTime,   // Added for context
        location: formData.location,                 // Added for context
        incident_description: formData.incidentDescription,
        injury_description: formData.injuryDescription,
        action_taken: formData.actionTaken,
      };
      
      // Call validation API
      const response = await validateInjuryReport(validationData);
      
      // Process validation response
      processValidationResponse(response);
    } catch (error) {
      console.error('Error validating report:', error);
      
      // Set validation error
      let errorMessage = 'Failed to validate report';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setValidationError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle accepting a suggestion
  const handleAcceptSuggestion = (field: string) => {
    if (!validationResponse || !validationResponse.fieldEvaluations) {
      return;
    }
    
    // Find the suggestion for this field
    const evaluation = validationResponse.fieldEvaluations.find(e => e.field === field);
    
    if (!evaluation) {
      return;
    }
    
    // Map API field names to form field names
    const fieldMapping: Record<string, keyof InjuryFormData> = {
      'incident_description': 'incidentDescription',
      'injury_description': 'injuryDescription',
      'action_taken': 'actionTaken',
    };
    
    const formField = fieldMapping[field];
    
    // Update form data with suggestion
    if (formField) {
      setFormData(prev => ({ ...prev, [formField]: evaluation.suggestion }));
      setAcceptedSuggestions(prev => ({ ...prev, [field]: true }));
    }
  };
  
  // Handle accepting all suggestions
  const handleAcceptAllSuggestions = () => {
    if (!validationResponse || !validationResponse.fieldEvaluations) {
      return;
    }
    
    // Map API field names to form field names
    const fieldMapping: Record<string, keyof InjuryFormData> = {
      'incident_description': 'incidentDescription',
      'injury_description': 'injuryDescription',
      'action_taken': 'actionTaken',
    };
    
    // Create new form data with all suggestions applied
    const newFormData = { ...formData };
    const newAcceptedSuggestions: Record<string, boolean> = { ...acceptedSuggestions };
    
    // Apply each suggestion
    for (const evaluation of validationResponse.fieldEvaluations) {
      const apiField = evaluation.field;
      const formField = fieldMapping[apiField];
      
      if (formField) {
        (newFormData as any)[formField] = evaluation.suggestion;
        newAcceptedSuggestions[apiField] = true;
      }
    }
    
    setFormData(newFormData);
    setAcceptedSuggestions(newAcceptedSuggestions);
  };
  
  // Handle final form submission to database
  const handleFinalSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for submission
      const injuryDate = new Date(`${formData.date}T${formData.time}`);
      const injuryTimestamp = injuryDate.toISOString(); // Keep for database storage
      
      // Format the timestamp in Eastern Time for display
      const formattedEasternTime = formatInTimeZone(
        injuryDate,
        'America/New_York',
        'yyyy-MM-dd h:mm a zzz' // Format: 2025-04-17 11:30 AM EDT
      );
      
      // Find the selected child to get their name
      const selectedChild = children.find(child => child.id === formData.childId);
      const childName = selectedChild ? selectedChild.name : '';
      
      // Log the form data for debugging
      console.log('Submitting form data:', formData);
      
      const reportData = {
        child_id: formData.childId,
        // child_name is removed as it's not in the database schema
        // We only use it for the n8n validation but don't store it
        injury_timestamp: injuryTimestamp, // Keep for database storage
        injury_time_eastern: formattedEasternTime, // Eastern Time formatted timestamp
        location: formData.location,
        submitting_user_id: formData.submittingUserId,
        incident_description: formData.incidentDescription,
        injury_description: formData.injuryDescription,
        action_taken: formData.actionTaken,
        is_bite: formData.isBite,
        biter_child_id: formData.isBite && formData.biterChildId ? formData.biterChildId : undefined,
        is_peer_aggression: formData.isPeerAggression,
        aggressor_child_id: formData.isPeerAggression && formData.aggressorChildId ? formData.aggressorChildId : undefined,
        // Include AI validation info
        ai_validated: validationResponse !== null,
        ai_suggestions_count: validationResponse ? Object.keys(validationResponse.fieldEvaluations || {}).length : 0,
        ai_suggestions_accepted: Object.keys(acceptedSuggestions).length,
        // Include parent narrative if available
        parent_narrative: parentNarrative || undefined,
        // Required fields for InjuryReport
        is_reviewed: false,
        is_delivered_to_parent: false
      };
      
      // Log the prepared report data for debugging
      console.log('Prepared report data for Supabase:', reportData);
      
      // Submit to Supabase
      const result = await createInjuryReport(reportData);
      console.log('Supabase response:', result);
      console.log('Report submitted successfully:', result);
      
      // Reset the form after successful submission
      resetForm();
      
      // Scroll back to the top of the page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Remove success alert popup
      // alert('Injury report submitted successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      
      // Provide more detailed error message
      let errorMessage = 'An unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract more information from the error object
        errorMessage = JSON.stringify(error);
      }
      
      alert(`Error submitting report: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form to initial state
  const resetForm = () => {
    setFormData(initialFormData);
    setValidationResponse(null);
    setShowSuggestions(false);
    setAcceptedSuggestions({});
    setParentNarrative(null);
  };
  
  return {
    formData,
    children,
    teachers,
    isSubmitting,
    validationResponse,
    validationError,
    showSuggestions,
    acceptedSuggestions,
    parentNarrative,
    handleInputChange,
    validateForm,
    handleSubmitForValidation,
    handleAcceptSuggestion,
    handleAcceptAllSuggestions,
    handleFinalSubmit,
    resetForm,
    // TEST-ONLY - REMOVE FOR PRODUCTION - Added 2025-04-17 16:30 EDT
    // Exposing setFormData to allow direct state updates for testing
    setFormData
    // END TEST-ONLY
  };
};