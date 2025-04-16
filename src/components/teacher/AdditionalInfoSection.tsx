import React from 'react';
import { Child } from '../../lib/supabase';
import BiterSelector from './BiterSelector';
import AggressorSelector from './AggressorSelector';

interface AdditionalInfoSectionProps {
  isBite: boolean;
  biterChildId: string;
  isPeerAggression: boolean;
  aggressorChildId: string;
  children: Child[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  isBite,
  biterChildId,
  isPeerAggression,
  aggressorChildId,
  children,
  onChange
}) => {
  return (
    <div className="space-y-6 pt-6 border-t border-gray-200">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Additional Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please provide any additional relevant information about the incident.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Bite Information */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="isBite"
                name="isBite"
                type="checkbox"
                checked={isBite}
                onChange={onChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isBite" className="font-medium text-gray-700">This incident involved a bite</label>
              <p className="text-gray-500">Check this box if a child was bitten during this incident.</p>
            </div>
          </div>
          
          {isBite && (
            <div className="ml-7">
              <BiterSelector
                value={biterChildId}
                onChange={onChange}
                childrenList={children}
                required={isBite}
              />
            </div>
          )}
        </div>
        
        {/* Peer Aggression Information */}
        <div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="isPeerAggression"
                name="isPeerAggression"
                type="checkbox"
                checked={isPeerAggression}
                onChange={onChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isPeerAggression" className="font-medium text-gray-700">This incident involved peer aggression</label>
              <p className="text-gray-500">Check this box if another child was involved in causing this injury.</p>
            </div>
          </div>
          
          {isPeerAggression && (
            <div className="ml-7">
              <AggressorSelector
                value={aggressorChildId}
                onChange={onChange}
                childrenList={children}
                required={isPeerAggression}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoSection;
