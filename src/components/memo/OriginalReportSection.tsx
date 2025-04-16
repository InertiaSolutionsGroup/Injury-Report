import React from 'react';
import { InjuryReport } from '../../lib/supabase';

interface OriginalReportSectionProps {
  report: InjuryReport;
  formatDate: (dateString: string | undefined) => string;
}

const OriginalReportSection: React.FC<OriginalReportSectionProps> = ({
  report,
  formatDate
}) => {
  // Helper function to safely get child name
  const getChildNameById = (childId: string | null | undefined): string => {
    if (!childId) return '';
    // Since we don't have direct access to the child name through the report object,
    // we'll just indicate that a child was involved
    return 'another child';
  };

  return (
    <div className="border-t border-gray-200 bg-white rounded-md shadow-sm mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Original Injury Report</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Submitted by teacher on {formatDate(report.created_at)}
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Date & Time of Injury</dt>
            <dd className="mt-1 text-sm text-gray-900">{formatDate(report.injury_timestamp)}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Location</dt>
            <dd className="mt-1 text-sm text-gray-900">{report.location}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Incident Description</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{report.incident_description}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Injury Description</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{report.injury_description}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Action Taken</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{report.action_taken}</dd>
          </div>
          
          {report.is_bite && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Bite Information</dt>
              <dd className="mt-1 text-sm text-gray-900">
                This was a bite incident
                {report.biter_child_id && ` involving ${getChildNameById(report.biter_child_id)}`}.
              </dd>
            </div>
          )}
          
          {report.is_peer_aggression && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Peer Aggression</dt>
              <dd className="mt-1 text-sm text-gray-900">
                This was a peer aggression incident
                {report.aggressor_child_id && ` involving ${getChildNameById(report.aggressor_child_id)}`}.
              </dd>
            </div>
          )}
          
          {report.ai_validated && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">AI Validation</dt>
              <dd className="mt-1 text-sm text-gray-900">
                Report was validated by AI with {report.ai_suggestions_count || 0} suggestions
                ({report.ai_suggestions_accepted || 0} accepted).
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default OriginalReportSection;
