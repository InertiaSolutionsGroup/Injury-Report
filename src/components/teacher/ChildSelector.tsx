import React from 'react';

interface Child {
  id: string;
  name: string;
}

interface ChildSelectorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  childrenList: Child[];
  required?: boolean;
  label?: string;
  id?: string;
  name?: string;
}

const ChildSelector: React.FC<ChildSelectorProps> = ({
  value,
  onChange,
  childrenList,
  required = false,
  label = 'Child',
  id = 'childId',
  name = 'childId',
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} {required && '*'}
    </label>
    <div className="mt-1">
      <select
        id={id}
        name={name}
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

export default ChildSelector;
