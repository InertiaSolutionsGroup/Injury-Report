import { useState, useEffect } from 'react';
import { format } from 'date-fns';
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
        injury_timestamp: injuryTimestamp,
        location: formData.location,
        submitting_user_id: formData.submittingUserId,
        incident_description: formData.incidentDescription,
        injury_description: formData.injuryDescription,
        action_taken: formData.actionTaken,
        is_bite: formData.isBite,
        biter_child_id: formData.isBite && formData.biterChildId ? formData.biterChildId : undefined,
        is_peer_aggression: formData.isPeerAggression,
        aggressor_child_id: formData.isPeerAggression && formData.aggressorChildId ? formData.aggressorChildId : undefined,
      };
      
      console.log('Submitting form data for validation:', reportData);
      const response = await validateInjuryReport(reportData);
      console.log('Received validation response in hook:', response);
      
      if (response.status === 'success') {
        console.log('Validation successful, setting response state');
        setValidationResponse(response);
        setShowSuggestions(true);
        setAcceptedSuggestions({});
        
        // Set parent narrative if available
        if (response.parentNarrative) {
          console.log('Parent narrative received:', response.parentNarrative);
          setParentNarrative(response.parentNarrative);
        } else {
          console.log('No parent narrative in the response');
        }
      } else {
        console.error('Validation response indicates error:', response.message);
        throw new Error(response.message || 'Validation failed');
      }
    } catch (error) {
      console.error('Error validating report:', error);
      setValidationError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle accepting a suggestion
  const handleAcceptSuggestion = (field: string) => {
    if (!validationResponse || !validationResponse.suggestions) return;
    
    const suggestion = validationResponse.suggestions.find(s => s.field === field);
    if (!suggestion) return;
    
    // Map API field names to form field names
    const fieldMap: Record<string, keyof InjuryFormData> = {
      'incident_description': 'incidentDescription',
      'injury_description': 'injuryDescription',
      'action_taken': 'actionTaken'
    };
    
    const formField = fieldMap[field];
    if (!formField) return;
    
    setFormData(prev => ({
      ...prev,
      [formField]: suggestion.suggestion
    }));
    
    setAcceptedSuggestions(prev => ({
      ...prev,
      [field]: true
    }));
  };
  
  // Handle accepting all suggestions
  const handleAcceptAllSuggestions = () => {
    if (!validationResponse || !validationResponse.suggestions) return;
    
    const newFormData = { ...formData };
    const newAcceptedSuggestions: Record<string, boolean> = {};
    
    // Map API field names to form field names
    const fieldMap: Record<string, keyof InjuryFormData> = {
      'incident_description': 'incidentDescription',
      'injury_description': 'injuryDescription',
      'action_taken': 'actionTaken'
    };
    
    for (const suggestion of validationResponse.suggestions) {
      const apiField = suggestion.field;
      const formField = fieldMap[apiField];
      
      if (formField) {
        (newFormData as any)[formField] = suggestion.suggestion;
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
      const injuryTimestamp = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      // Log the form data for debugging
      console.log('Submitting form data:', formData);
      
      const reportData = {
        child_id: formData.childId,
        injury_timestamp: injuryTimestamp,
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
        ai_suggestions_count: validationResponse ? Object.keys(validationResponse.suggestions || {}).length : 0,
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
      alert('Injury report submitted successfully!');
      
      // Reset form after successful submission
      resetForm();
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
    resetForm
  };
};