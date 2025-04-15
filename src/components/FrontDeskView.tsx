import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { User, InjuryReport, fetchUsers, fetchInjuryReports } from '../lib/supabase';

const FrontDeskView: React.FC = () => {
  // State for user selection
  const [frontDeskUsers, setFrontDeskUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isUserSelected, setIsUserSelected] = useState(false);
  
  // State for reports
  const [reports, setReports] = useState<InjuryReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [showOnlyUnreviewed, setShowOnlyUnreviewed] = useState(false);
  
  // Load front desk users
  useEffect(() => {
    const loadFrontDeskUsers = async () => {
      try {
        const users = await fetchUsers('Front Desk');
        setFrontDeskUsers(users);
      } catch (error) {
        console.error('Error loading front desk users:', error);
        setError('Failed to load front desk users. Please refresh the page.');
      }
    };
    
    loadFrontDeskUsers();
  }, []);
  
  // Load reports when user is selected
  useEffect(() => {
    if (!selectedUserId) return;
    
    const loadReports = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedReports = await fetchInjuryReports({
          onlyUnreviewed: showOnlyUnreviewed
        });
        setReports(fetchedReports);
      } catch (error) {
        console.error('Error loading reports:', error);
        setError('Failed to load injury reports. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReports();
  }, [selectedUserId, showOnlyUnreviewed]);
  
  // Handle user selection
  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    setIsUserSelected(!!userId);
  };
  
  // Handle filter toggle
  const handleFilterToggle = () => {
    setShowOnlyUnreviewed(!showOnlyUnreviewed);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="bg-light shadow-lg rounded-xl border border-gold">
      <div className="px-4 py-5 sm:px-6 bg-primary rounded-t-xl">
        <h2 className="text-lg leading-6 font-heading font-bold uppercase text-gold">Front Desk - Injury Reports</h2>
        <p className="mt-1 max-w-2xl text-sm text-gold font-body">View and manage submitted injury reports.</p>
      </div>
      
      <div className="border-t border-gold px-4 py-5 sm:p-6 bg-light rounded-b-xl">
        {/* User Selection */}
        {!isUserSelected && (
          <div className="max-w-md mx-auto">
            <label htmlFor="frontDeskUser" className="block text-sm font-medium text-gray-700">
              Please select your name to continue
            </label>
            <select
              id="frontDeskUser"
              name="frontDeskUser"
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
        )}
        
        {/* Reports List */}
        {isUserSelected && (
          <>
            {/* Filter Controls */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="showOnlyUnreviewed"
                  name="showOnlyUnreviewed"
                  type="checkbox"
                  checked={showOnlyUnreviewed}
                  onChange={handleFilterToggle}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="showOnlyUnreviewed" className="ml-2 block text-sm text-gray-900">
                  Show only unreviewed reports
                </label>
              </div>
              
              <div className="text-sm text-gray-500">
                {reports.length} report{reports.length !== 1 ? 's' : ''} found
              </div>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-4">
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
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading Indicator */}
            {isLoading && (
              <div className="text-center py-4">
                <svg className="animate-spin h-5 w-5 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-sm text-gray-500">Loading reports...</p>
              </div>
            )}
            
            {/* Reports Table */}
            {!isLoading && reports.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No reports found.</p>
              </div>
            ) : (
              <div className="mt-4 flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Child
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date/Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Submitted By
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reports.map((report) => {
                            // Extract child name from joined data
                            const childName = report.child ? (report.child as any).name : 'Unknown Child';
                            const submitterName = report.submitting_user ? (report.submitting_user as any).name : 'Unknown';
                            
                            return (
                              <tr key={report.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{childName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{formatDate(report.injury_timestamp)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{submitterName}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex flex-col space-y-1">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.is_reviewed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                      {report.is_reviewed ? 'Reviewed' : 'Needs Review'}
                                    </span>
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${report.is_delivered_to_parent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                      {report.is_delivered_to_parent ? 'Delivered' : 'Not Delivered'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <Link
                                    to={`/memo/${report.id}`}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    View Report
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FrontDeskView;
