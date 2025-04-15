import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { 
  User, 
  InjuryReport, 
  fetchUsers, 
  fetchInjuryReportById, 
  markReportAsReviewed, 
  markReportAsDelivered 
} from '../lib/supabase';
import { generateMemo, MemoGenerationResponse } from '../lib/api';

const MemoView: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  
  // State for report data
  const [report, setReport] = useState<InjuryReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for memo generation
  const [memo, setMemo] = useState<string | null>(null);
  const [isGeneratingMemo, setIsGeneratingMemo] = useState(false);
  const [memoError, setMemoError] = useState<string | null>(null);
  
  // State for front desk actions
  const [frontDeskUsers, setFrontDeskUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  
  // Load report data and front desk users
  useEffect(() => {
    if (!reportId) return;
    
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [reportData, usersData] = await Promise.all([
          fetchInjuryReportById(reportId),
          fetchUsers('Front Desk')
        ]);
        
        if (!reportData) {
          throw new Error('Report not found');
        }
        
        setReport(reportData);
        setFrontDeskUsers(usersData);
        
        // If memo content already exists, use it
        if (reportData.memo_content) {
          setMemo(reportData.memo_content);
        } else {
          // Otherwise, generate a new memo
          generateMemoContent(reportData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load report data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [reportId]);
  
  // Generate memo content
  const generateMemoContent = async (reportData: InjuryReport) => {
    setIsGeneratingMemo(true);
    setMemoError(null);
    
    try {
      const response: MemoGenerationResponse = await generateMemo(reportData);
      
      if (response.status === 'success' && response.memo_content) {
        setMemo(response.memo_content);
      } else {
        throw new Error(response.message || 'Failed to generate Boo Boo Report for Parent');
      }
    } catch (error) {
      console.error('Error generating memo:', error);
      setMemoError('Failed to generate the memo. Please try again.');
    } finally {
      setIsGeneratingMemo(false);
    }
  };
  
  // Handle retry memo generation
  const handleRetryMemoGeneration = () => {
    if (!report) return;
    generateMemoContent(report);
  };
  
  // Handle user selection for actions
  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedUserId(e.target.value);
  };
  
  // Handle marking report as reviewed
  const handleMarkAsReviewed = async () => {
    if (!reportId || !selectedUserId) return;
    
    setIsSubmittingAction(true);
    setActionError(null);
    
    try {
      const updatedReport = await markReportAsReviewed(reportId, selectedUserId);
      setReport(updatedReport);
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error marking report as reviewed:', error);
      setActionError('Failed to mark report as reviewed. Please try again.');
    } finally {
      setIsSubmittingAction(false);
    }
  };
  
  // Handle marking report as delivered
  const handleMarkAsDelivered = async () => {
    if (!reportId || !selectedUserId) return;
    
    setIsSubmittingAction(true);
    setActionError(null);
    
    try {
      const updatedReport = await markReportAsDelivered(reportId, selectedUserId);
      setReport(updatedReport);
      setShowDeliverModal(false);
    } catch (error) {
      console.error('Error marking report as delivered:', error);
      setActionError('Failed to mark report as delivered. Please try again.');
    } finally {
      setIsSubmittingAction(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Extract names from report data
  const getChildName = () => {
    if (!report) return 'name not retrieved';
    const name = report.child && typeof report.child === 'object' && 'name' in report.child ? (report.child as any).name : null;
    return name || 'name not retrieved';
  };

  const getSubmitterName = () => {
    if (!report) return 'name not retrieved';
    const name = report.submitting_user && typeof report.submitting_user === 'object' && 'name' in report.submitting_user ? (report.submitting_user as any).name : null;
    return name || 'name not retrieved';
  };

  const getReviewerName = () => {
    if (!report || !report.reviewed_by_user_id) return 'N/A';
    const name = report.reviewed_by && typeof report.reviewed_by === 'object' && 'name' in report.reviewed_by ? (report.reviewed_by as any).name : null;
    return name || 'name not retrieved';
  };

  const getDelivererName = () => {
    if (!report || !report.delivered_by_user_id) return 'N/A';
    const name = report.delivered_by && typeof report.delivered_by === 'object' && 'name' in report.delivered_by ? (report.delivered_by as any).name : null;
    return name || 'name not retrieved';
  };
  
  // Render action modals
  const renderReviewModal = () => {
    if (!showReviewModal) return null;
    
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Mark as Reviewed</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please select your name to mark this report as reviewed.
                    </p>
                    
                    <div className="mt-4">
                      <label htmlFor="reviewerUser" className="block text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <select
                        id="reviewerUser"
                        name="reviewerUser"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={selectedUserId}
                        onChange={handleUserSelect}
                      >
                        <option value="">Select your name</option>
                        {frontDeskUsers.map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {actionError && (
                      <div className="mt-2 text-sm text-red-600">
                        {actionError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleMarkAsReviewed}
                disabled={!selectedUserId || isSubmittingAction}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isSubmittingAction ? 'Processing...' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderDeliverModal = () => {
    if (!showDeliverModal) return null;
    
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Mark as Delivered to Parent</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please select your name to mark this report as delivered to the parent.
                    </p>
                    
                    <div className="mt-4">
                      <label htmlFor="delivererUser" className="block text-sm font-medium text-gray-700">
                        Your Name
                      </label>
                      <select
                        id="delivererUser"
                        name="delivererUser"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={selectedUserId}
                        onChange={handleUserSelect}
                      >
                        <option value="">Select your name</option>
                        {frontDeskUsers.map(user => (
                          <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {actionError && (
                      <div className="mt-2 text-sm text-red-600">
                        {actionError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleMarkAsDelivered}
                disabled={!selectedUserId || isSubmittingAction}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isSubmittingAction ? 'Processing...' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => setShowDeliverModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-4 text-gray-500">Loading report data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/front-desk')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back to Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-lg rounded-xl border border-gold">
      <div className="px-4 py-5 sm:px-6 bg-primary rounded-t-xl">
        <h2 className="text-lg leading-6 font-heading font-bold uppercase text-gold">Boo Boo Report</h2>
        <p className="mt-1 max-w-2xl text-sm text-gold font-body">Injury report for {getChildName()}</p>
      </div>
      
      {/* Report Status */}
      <div className="border-t border-gold px-4 py-5 sm:px-6 bg-light rounded-b-xl">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Report Status</dt>
            <dd className="mt-1 flex items-center">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report?.is_reviewed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {report?.is_reviewed ? 'Reviewed' : 'Needs Review'}
              </span>
              {report?.is_reviewed && (
                <span className="ml-2 text-sm text-gray-500">
                  by {getReviewerName()} on {formatDate(report?.reviewed_timestamp)}
                </span>
              )}
            </dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Delivery Status</dt>
            <dd className="mt-1 flex items-center">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report?.is_delivered_to_parent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {report?.is_delivered_to_parent ? 'Delivered to Parent' : 'Not Delivered'}
              </span>
              {report?.is_delivered_to_parent && (
                <span className="ml-2 text-sm text-gray-500">
                  by {getDelivererName()} on {formatDate(report?.delivered_timestamp)}
                </span>
              )}
            </dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Child</dt>
            <dd className="mt-1 text-sm text-gray-900">{getChildName()}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Submitted By</dt>
            <dd className="mt-1 text-sm text-gray-900">{getSubmitterName()}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Injury Date/Time</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(report?.injury_timestamp)}</dd>
          </div>
          
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Location</dt>
            <dd className="mt-1 text-sm text-gray-900">{report?.location}</dd>
          </div>
        </dl>
      </div>
      
      {/* Action Buttons */}
      <div className="border-t border-gold px-4 py-5 sm:px-6 bg-light rounded-b-xl">
        <div className="flex space-x-3">
          {!report?.is_reviewed && (
            <button
              type="button"
              onClick={() => setShowReviewModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Mark as Reviewed
            </button>
          )}
          
          {report?.is_reviewed && !report?.is_delivered_to_parent && (
            <button
              type="button"
              onClick={() => setShowDeliverModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Mark as Delivered
            </button>
          )}
          
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Print Report
          </button>
        </div>
      </div>
      
      {/* Memo Content */}
      <div className="border-t border-gold bg-light rounded-b-xl">
        <div className="px-4 py-5 sm:p-6">
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
                      onClick={handleRetryMemoGeneration}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : memo ? (
            <div className="prose max-w-none">
              <ReactMarkdown>{memo}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-gray-500 italic">No memo content available.</p>
          )}
        </div>
      </div>
      
      {/* Modals */}
      {renderReviewModal()}
      {renderDeliverModal()}
    </div>
  );
};

export default MemoView;
