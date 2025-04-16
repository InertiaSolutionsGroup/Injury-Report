import React from 'react';

interface InjuryDetailsSectionProps {
  incidentDescription: string;
  injuryDescription: string;
  actionTaken: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const InjuryDetailsSection: React.FC<InjuryDetailsSectionProps> = ({
  incidentDescription,
  injuryDescription,
  actionTaken,
  onChange
}) => {
  return (
    <div className="space-y-6 pt-6 border-t border-gray-200">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Injury Details</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please provide detailed information about the incident and injury.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Incident Description */}
        <div className="sm:col-span-6">
          <label htmlFor="incidentDescription" className="block text-sm font-medium text-gray-700">
            Incident Description <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="incidentDescription"
              name="incidentDescription"
              rows={3}
              value={incidentDescription}
              onChange={onChange}
              placeholder="Describe what happened in detail..."
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Provide a detailed description of how the incident occurred.
          </p>
        </div>
        
        {/* Injury Description */}
        <div className="sm:col-span-6">
          <label htmlFor="injuryDescription" className="block text-sm font-medium text-gray-700">
            Injury Description <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="injuryDescription"
              name="injuryDescription"
              rows={3}
              value={injuryDescription}
              onChange={onChange}
              placeholder="Describe the injury in detail..."
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Describe the nature and location of the injury.
          </p>
        </div>
        
        {/* Action Taken */}
        <div className="sm:col-span-6">
          <label htmlFor="actionTaken" className="block text-sm font-medium text-gray-700">
            Action Taken <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="actionTaken"
              name="actionTaken"
              rows={3}
              value={actionTaken}
              onChange={onChange}
              placeholder="Describe what was done to address the injury..."
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Describe what first aid or other actions were taken to address the injury.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InjuryDetailsSection;
