import React from 'react';

interface Child {
  id: string;
  name: string;
}

interface BiterSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  childrenList: Child[];
  required?: boolean;
}

const BiterSelector: React.FC<BiterSelectorProps> = ({ value, onChange, childrenList, required = false }) => (
  <div>
    <label htmlFor="biterChildId" className="block text-sm font-medium text-gray-700">
      Name of Biter {required && '*'}
    </label>
    <div className="mt-1">
      <select
        id="biterChildId"
        name="biterChildId"
        value={value}
        onChange={onChange}
        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
        required={required}
      >
        <option value="">Select a child</option>
        {childrenList.map(child => (
          <option key={child.id} value={child.id}>{child.name}</option>
        ))}
      </select>
    </div>
  </div>
);

export default BiterSelector;
