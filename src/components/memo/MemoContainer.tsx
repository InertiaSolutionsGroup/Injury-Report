import React from 'react';
import MemoContent from './MemoContent';

interface MemoContainerProps {
  isGeneratingMemo: boolean;
  memoError: string | null;
  memo: string | null;
  onRetryGeneration: () => void;
}

const MemoContainer: React.FC<MemoContainerProps> = ({
  isGeneratingMemo,
  memoError,
  memo,
  onRetryGeneration
}) => {
  return (
    <div className="border-t border-gold bg-light rounded-b-xl">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Parent-Friendly Memo</h3>
        {isGeneratingMemo ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-500">Generating memo...</p>
          </div>
        ) : memoError ? (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error generating memo</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{memoError}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={onRetryGeneration}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : memo ? (
          <MemoContent content={memo} />
        ) : (
          <p className="text-gray-500 italic">No memo content available.</p>
        )}
      </div>
    </div>
  );
};

export default MemoContainer;
