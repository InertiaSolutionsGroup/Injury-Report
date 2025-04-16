import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInjuryReport } from '../hooks/useInjuryReport';
import MemoHeader from './memo/MemoHeader';
import MemoContainer from './memo/MemoContainer';
import OriginalReportSection from './memo/OriginalReportSection';
import ReviewModal from './memo/ReviewModal';
import DeliverModal from './memo/DeliverModal';

const MemoView: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  
  const {
    report,
    isLoading,
    error,
    memo,
    isGeneratingMemo,
    memoError,
    frontDeskUsers,
    selectedUserId,
    isSubmittingAction,
    actionError,
    showReviewModal,
    showDeliverModal,
    handleRetryMemoGeneration,
    handleUserSelect,
    handleMarkAsReviewed,
    handleMarkAsDelivered,
    setShowReviewModal,
    setShowDeliverModal,
    formatDate,
    getChildName,
    getSubmitterName,
    getReviewerName,
    getDelivererName
  } = useInjuryReport(reportId);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 max-w-lg w-full">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Error Loading Report</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>{error || 'Report not found'}</p>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const formattedDate = formatDate(report.injury_timestamp);
  const isReviewed = !!report.reviewed_timestamp;
  const isDelivered = !!report.delivered_timestamp;
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Header Section */}
      <MemoHeader
        childName={getChildName()}
        formattedDate={formattedDate}
        submitterName={getSubmitterName()}
        reviewerName={getReviewerName()}
        delivererName={getDelivererName()}
        isReviewed={isReviewed}
        isDelivered={isDelivered}
        onShowReviewModal={() => setShowReviewModal(true)}
        onShowDeliverModal={() => setShowDeliverModal(true)}
        onPrint={() => window.print()}
      />
      
      <div className="px-4 py-5 sm:p-6">
        {/* Original Injury Report Section */}
        <OriginalReportSection 
          report={report} 
          formatDate={formatDate} 
        />
        
        {/* Memo Content */}
        <MemoContainer
          isGeneratingMemo={isGeneratingMemo}
          memoError={memoError}
          memo={memo}
          onRetryGeneration={handleRetryMemoGeneration}
        />
      </div>
      
      {/* Modals */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onConfirm={handleMarkAsReviewed}
        isLoading={isSubmittingAction}
        users={frontDeskUsers}
        selectedUserId={selectedUserId}
        onChange={handleUserSelect}
        error={actionError}
      />
      <DeliverModal
        isOpen={showDeliverModal}
        onClose={() => setShowDeliverModal(false)}
        onConfirm={handleMarkAsDelivered}
        isLoading={isSubmittingAction}
        users={frontDeskUsers}
        selectedUserId={selectedUserId}
        onChange={handleUserSelect}
        error={actionError}
      />
    </div>
  );
};

export default MemoView;
