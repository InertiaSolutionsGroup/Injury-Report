import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  User, 
  InjuryReport, 
  fetchUsers, 
  fetchInjuryReportById, 
  markReportAsReviewed, 
  markReportAsDelivered 
} from '../lib/supabase';
import { generateMemo, MemoGenerationResponse } from '../lib/api';

interface UseInjuryReportReturn {
  report: InjuryReport | null;
  isLoading: boolean;
  error: string | null;
  memo: string | null;
  isGeneratingMemo: boolean;
  memoError: string | null;
  frontDeskUsers: User[];
  selectedUserId: string;
  isSubmittingAction: boolean;
  actionError: string | null;
  showReviewModal: boolean;
  showDeliverModal: boolean;
  handleRetryMemoGeneration: () => void;
  handleUserSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleMarkAsReviewed: () => Promise<void>;
  handleMarkAsDelivered: () => Promise<void>;
  setShowReviewModal: (show: boolean) => void;
  setShowDeliverModal: (show: boolean) => void;
  formatDate: (dateString: string | undefined) => string;
  getChildName: () => string;
  getSubmitterName: () => string;
  getReviewerName: () => string;
  getDelivererName: () => string;
}

export const useInjuryReport = (reportId: string | undefined): UseInjuryReportReturn => {
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
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Unknown date';
    
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  // Extract names from report data
  const getChildName = (): string => {
    return report?.child?.name || 'Name not retrieved';
  };
  
  const getSubmitterName = (): string => {
    return report?.submitting_user?.name || 'Name not retrieved';
  };
  
  const getReviewerName = (): string => {
    return report?.reviewed_by?.name || 'Not yet reviewed';
  };
  
  const getDelivererName = (): string => {
    return report?.delivered_by?.name || 'Not yet delivered';
  };
  
  return {
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
  };
};
