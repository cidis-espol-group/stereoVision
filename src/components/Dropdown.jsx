import React from 'react';

const Dropdown = ({ label, options, onChange }) => {
  return (
    <div className="flex items-center mb-4">
      <label className="mr-2">{label}:</label>
      <select className="border rounded px-2 py-1" onChange={onChange}>
        <option value="">Select {label}</option> {/* Opción por defecto */}
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
