import React from 'react';
import { User } from '../../lib/supabase';

interface DeliverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  users: User[];
  selectedUserId: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error: string | null;
}

const DeliverModal: React.FC<DeliverModalProps> = ({ isOpen, onClose, onConfirm, isLoading, users, selectedUserId, onChange, error }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" />
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Mark as Delivered?</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Please select your name to mark this report as delivered to the parent.</p>
                <div className="mt-4">
                  <label htmlFor="delivererUser" className="block text-sm font-medium text-gray-700">Your Name</label>
                  <select
                    id="delivererUser"
                    name="delivererUser"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedUserId}
                    onChange={onChange}
                  >
                    <option value="">Select your name</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 flex justify-center space-x-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              onClick={onConfirm}
              disabled={isLoading || !selectedUserId}
            >
              {isLoading ? 'Processing...' : 'Yes, Mark as Delivered'}
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverModal;
