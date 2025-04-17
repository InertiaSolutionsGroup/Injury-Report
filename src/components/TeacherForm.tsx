import React from 'react';
import { useInjuryForm } from '../hooks/useInjuryForm';
import BasicInfoSection from './teacher/BasicInfoSection';
import InjuryDetailsSection from './teacher/InjuryDetailsSection';
import AdditionalInfoSection from './teacher/AdditionalInfoSection';
import SuggestionPanel from './teacher/SuggestionPanel';
import ValidationError from './teacher/ValidationError';
import FormActions from './teacher/FormActions';

// TEST-ONLY - REMOVE FOR PRODUCTION
import TestDataSelector from './test/TestDataSelector';
// Removed populateFormFields import as we'll use direct state updates
// END TEST-ONLY

const TeacherForm: React.FC = () => {
  const {
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
    handleSubmitForValidation,
    handleAcceptSuggestion,
    handleAcceptAllSuggestions,
    handleFinalSubmit,
    resetForm,
    // TEST-ONLY - REMOVE FOR PRODUCTION
    // Added 2025-04-17 16:30 EDT: Exposing setFormData for test functionality
    setFormData
    // END TEST-ONLY
  } = useInjuryForm();
  
  // TEST-ONLY - REMOVE FOR PRODUCTION
  // Updated 2025-04-17 16:30 EDT: Changed to use direct state updates instead of DOM manipulation
  // Updated 2025-04-17 16:36 EDT: Added essential logging for troubleshooting
  // Updated 2025-04-17 16:44 EDT: Added form reset before loading new test data
  const handleSelectTestData = (testData: any) => {
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.log('TeacherForm received test data:', testData);
    console.log('Current form data before update:', formData);
    // END TEST-ONLY LOGGING
    
    // First reset the form to clear any existing data
    resetForm();
    
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    console.log('Form reset. Now loading new test data.');
    // END TEST-ONLY LOGGING
    
    // Directly update the form state with the test data
    setFormData(prevData => {
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
      console.log('Updating form data with:', testData);
      // END TEST-ONLY LOGGING
      
      const newData = {
        ...prevData,
        ...testData
      };
      
      // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
      console.log('New form data after update:', newData);
      // END TEST-ONLY LOGGING
      
      return newData;
    });
    
    // TEST-ONLY LOGGING - REMOVE FOR PRODUCTION
    // Log after state update is scheduled (note: may not reflect actual state yet due to React's async updates)
    setTimeout(() => {
      console.log('Form data after state update:', formData);
    }, 0);
    // END TEST-ONLY LOGGING
  };
  // END TEST-ONLY
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        {/* TEST-ONLY - REMOVE FOR PRODUCTION */}
        {process.env.NODE_ENV !== 'production' && (
          <TestDataSelector onSelectTestData={handleSelectTestData} />
        )}
        {/* END TEST-ONLY */}
        
        <form className="space-y-8 divide-y divide-gray-200">
          {/* Basic Information Section */}
          <BasicInfoSection
            childId={formData.childId}
            date={formData.date}
            time={formData.time}
            location={formData.location}
            submittingUserId={formData.submittingUserId}
            children={children}
            teachers={teachers}
            onChange={handleInputChange}
          />
          
          {/* Injury Details Section */}
          <InjuryDetailsSection
            incidentDescription={formData.incidentDescription}
            injuryDescription={formData.injuryDescription}
            actionTaken={formData.actionTaken}
            onChange={handleInputChange}
            validationResponse={validationResponse}
            acceptedSuggestions={acceptedSuggestions}
            onAcceptSuggestion={handleAcceptSuggestion}
            showSuggestions={showSuggestions}
          />
          
          {/* Additional Information Section */}
          <AdditionalInfoSection
            isBite={formData.isBite}
            biterChildId={formData.biterChildId}
            isPeerAggression={formData.isPeerAggression}
            aggressorChildId={formData.aggressorChildId}
            children={children}
            onChange={handleInputChange}
          />
          
          {/* Suggestion Panel */}
          {showSuggestions && validationResponse && (
            <SuggestionPanel
              validationResponse={validationResponse}
              acceptedSuggestions={acceptedSuggestions}
              onAcceptSuggestion={handleAcceptSuggestion}
              onAcceptAllSuggestions={handleAcceptAllSuggestions}
              onFinalSubmit={handleFinalSubmit}
              isSubmitting={isSubmitting}
            />
          )}
          
          {/* Validation Error */}
          {validationError && (
            <ValidationError
              errorMessage={validationError}
              onRetry={handleSubmitForValidation}
              onSubmitAsIs={handleFinalSubmit}
            />
          )}
          
          {/* Form Actions */}
          <FormActions
            onClear={resetForm}
            onSubmit={handleSubmitForValidation}
            onReevaluate={handleSubmitForValidation}
            showSuggestions={showSuggestions}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;
