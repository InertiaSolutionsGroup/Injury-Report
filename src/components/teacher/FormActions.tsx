import React from 'react';

interface FormActionsProps {
  onClear: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onReevaluate?: (e: React.FormEvent) => void;
  showSuggestions: boolean;
  isSubmitting: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onClear,
  onSubmit,
  onReevaluate,
  showSuggestions,
  isSubmitting,
}) => (
  <div className="mt-6 flex justify-end space-x-3">
    <button
      type="button"
      onClick={onClear}
      className="ml-3 inline-flex justify-center py-2 px-4 border border-gold shadow-sm text-sm font-medium rounded-md text-dark bg-gold hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors duration-150 font-bold uppercase"
    >
      CLEAR FORM
    </button>
    {!showSuggestions && (
      <button
        type="submit"
        disabled={isSubmitting}
        onClick={(e) => onSubmit(e)}
        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors duration-150 uppercase"
      >
        {isSubmitting ? 'PROCESSING...' : 'SUBMIT TO AI'}
      </button>
    )}
    {showSuggestions && onReevaluate && (
      <button
        type="button"
        onClick={(e) => onReevaluate?.(e)}
        disabled={isSubmitting}
        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors duration-150 uppercase"
      >
        {isSubmitting ? 'PROCESSING...' : 'RESUBMIT TO AI'}
      </button>
    )}
  </div>
);

export default FormActions;
