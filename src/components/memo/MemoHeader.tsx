import React from 'react';

interface MemoHeaderProps {
  childName: string;
  formattedDate: string;
  submitterName: string;
  reviewerName: string;
  delivererName: string;
  isReviewed: boolean;
  isDelivered: boolean;
  onShowReviewModal: () => void;
  onShowDeliverModal: () => void;
  onPrint: () => void;
}

const MemoHeader: React.FC<MemoHeaderProps> = ({
  childName,
  formattedDate,
  submitterName,
  reviewerName,
  delivererName,
  isReviewed,
  isDelivered,
  onShowReviewModal,
  onShowDeliverModal,
  onPrint
}) => {
  return (
    <div className="px-4 py-5 sm:px-6 bg-primary text-white rounded-t-xl">
      <div className="flex flex-col sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium">
            Boo-Boo Report for {childName}
          </h3>
          <p className="mt-1 max-w-2xl text-sm">
            {formattedDate}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2">
            Submitted by: {submitterName}
          </span>
          {isReviewed ? (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-2">
              Reviewed by: {reviewerName}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 mr-2">
              Not Reviewed
            </span>
          )}
          {isDelivered ? (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Delivered by: {delivererName}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              Not Delivered
            </span>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {!isReviewed && (
          <button
            type="button"
            onClick={onShowReviewModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Mark as Reviewed
          </button>
        )}
        
        {isReviewed && !isDelivered && (
          <button
            type="button"
            onClick={onShowDeliverModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Mark as Delivered
          </button>
        )}
        
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Print Report
        </button>
      </div>
    </div>
  );
};

export default MemoHeader;
