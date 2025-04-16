import React from 'react';
import { Child, User } from '../../lib/supabase';
import ChildSelector from './ChildSelector';

interface BasicInfoSectionProps {
  childId: string;
  date: string;
  time: string;
  location: string;
  submittingUserId: string;
  children: Child[];
  teachers: User[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  childId,
  date,
  time,
  location,
  submittingUserId,
  children,
  teachers,
  onChange
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
        <p className="mt-1 text-sm text-gray-500">
          Please provide the basic details of the incident.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Child Selector */}
        <div className="sm:col-span-3">
          <ChildSelector 
            value={childId} 
            onChange={onChange} 
            childrenList={children} 
            required={true} 
          />
        </div>
        
        {/* Date */}
        <div className="sm:col-span-3">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={onChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        {/* Time */}
        <div className="sm:col-span-3">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Time <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="time"
              name="time"
              id="time"
              value={time}
              onChange={onChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        {/* Location */}
        <div className="sm:col-span-3">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="location"
              id="location"
              value={location}
              onChange={onChange}
              placeholder="e.g., Playground, Classroom"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        {/* Submitting Teacher */}
        <div className="sm:col-span-6">
          <label htmlFor="submittingUserId" className="block text-sm font-medium text-gray-700">
            Submitting Teacher <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <select
              id="submittingUserId"
              name="submittingUserId"
              value={submittingUserId}
              onChange={onChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
