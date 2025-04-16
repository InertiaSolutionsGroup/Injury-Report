import React from 'react';
import { useInjuryForm } from '../hooks/useInjuryForm';
import BasicInfoSection from './teacher/BasicInfoSection';
import InjuryDetailsSection from './teacher/InjuryDetailsSection';
import AdditionalInfoSection from './teacher/AdditionalInfoSection';
import SuggestionPanel from './teacher/SuggestionPanel';
import ValidationError from './teacher/ValidationError';
import FormActions from './teacher/FormActions';

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
    handleInputChange,
    handleSubmitForValidation,
    handleAcceptSuggestion,
    handleAcceptAllSuggestions,
    handleFinalSubmit,
    resetForm
  } = useInjuryForm();
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
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
