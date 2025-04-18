import React from 'react';
import { InjuryReport } from '../../lib/supabase';
import { format, parseISO } from 'date-fns';

interface BooBooReportProps {
  report: InjuryReport | null;
  isLoading: boolean;
  memo: string | null;
  isGeneratingMemo: boolean;
  memoError: string | null;
  onRetryGeneration: () => void;
  childName: string;
  formattedDate: string;
}

const BooBooReport: React.FC<BooBooReportProps> = ({
  report,
  isLoading,
  memo,
  isGeneratingMemo,
  memoError,
  onRetryGeneration,
  childName,
  formattedDate
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Report not found</p>
      </div>
    );
  }

  return (
    <div className="boo-boo-report bg-white rounded-lg shadow-lg max-w-4xl mx-auto print:shadow-none">
      {/* Notepad styling with lines */}
      <div className="relative overflow-hidden">
        {/* Paper clip decoration */}
        <div className="absolute top-0 right-8 w-8 h-16 transform -rotate-12">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88584 21.3658 3.76 20.24C2.63416 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63416 12.8758 3.76 11.75L12.33 3.17997C13.0806 2.42808 14.0991 1.99881 15.16 1.99881C16.2209 1.99881 17.2394 2.42808 17.99 3.17997C18.7414 3.93059 19.1704 4.94861 19.1704 6.00997C19.1704 7.07134 18.7414 8.08936 17.99 8.83997L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99389 16.5257 5.99389 15.995C5.99389 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.09997" 
                  stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* Report header with notepad styling */}
        <div className="pt-8 pb-4 px-8 bg-blue-50 border-b-2 border-blue-100">
          <h1 className="text-3xl font-bold text-center text-blue-700 font-handwriting mb-4">Boo-Boo Report</h1>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg"><span className="font-semibold">Child:</span> {childName}</p>
              <p className="text-lg"><span className="font-semibold">Date:</span> {formattedDate}</p>
            </div>
            <div className="h-16 w-16">
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 336c17.67 0 32-14.33 32-32c0-17.67-14.33-32-32-32c-17.67 0-32 14.33-32 32C224 321.7 238.3 336 256 336zM296 192h-80C202.8 192 192 202.8 192 216S202.8 240 216 240h16v96h-16C202.8 336 192 346.8 192 360S202.8 384 216 384h80c13.25 0 24-10.75 24-24s-10.75-24-24-24h-16V216C280 202.8 269.3 192 256 192S232 202.8 232 216v24h16C261.3 240 272 229.3 272 216S261.3 192 248 192z" 
                      fill="#f87171"/>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Main content with lined paper background */}
        <div className="p-8 bg-white bg-lined-paper">
          {/* What Happened Section */}
          <div className="mb-6">
            <h2 className="text-xl font-handwriting text-blue-700 border-b border-blue-200 pb-1 mb-2">What Happened</h2>
            <p className="text-gray-800 pl-2">{report.incident_description || 'No description provided'}</p>
          </div>
          
          {/* Boo-Boo Details Section */}
          <div className="mb-6">
            <h2 className="text-xl font-handwriting text-blue-700 border-b border-blue-200 pb-1 mb-2">Boo-Boo Details</h2>
            <p className="text-gray-800 pl-2">{report.injury_description || 'No description provided'}</p>
            
            {/* Special indicators for bites or peer aggression */}
            {(report.is_bite || report.is_peer_aggression) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {report.is_bite && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Bite Incident
                  </span>
                )}
                {report.is_peer_aggression && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Peer Aggression
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* How We Helped Section */}
          <div className="mb-6">
            <h2 className="text-xl font-handwriting text-blue-700 border-b border-blue-200 pb-1 mb-2">How We Helped</h2>
            <p className="text-gray-800 pl-2">{report.action_taken || 'No description provided'}</p>
          </div>
          
          {/* Where Section */}
          <div className="mb-6">
            <h2 className="text-xl font-handwriting text-blue-700 border-b border-blue-200 pb-1 mb-2">Where</h2>
            <p className="text-gray-800 pl-2">{report.location || 'Location not specified'}</p>
          </div>
        </div>
        
        {/* Note for Parents Section */}
        <div className="p-8 bg-yellow-50 border-t-2 border-dashed border-yellow-200">
          <h2 className="text-xl font-handwriting text-blue-700 border-b border-blue-200 pb-1 mb-4">Note for Parents</h2>
          
          {isGeneratingMemo ? (
            <div className="text-center py-4">
              <div className="animate-spin inline-block h-8 w-8 border-t-2 border-blue-500 rounded-full"></div>
              <p className="mt-2 text-gray-500">Creating note for parents...</p>
            </div>
          ) : memoError ? (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-700">{memoError}</p>
              <button 
                onClick={onRetryGeneration}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          ) : memo ? (
            <div className="prose prose-blue max-w-none">
              <p className="text-gray-800 pl-2 font-parent-note">{memo}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No parent note available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BooBooReport;
