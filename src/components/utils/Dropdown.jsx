import React from 'react';

const Dropdown = ({ label, options, onChange, className }) => {
  return (
    <div className={`flex items-center cursor-pointer ${className}`}>
      <label htmlFor={label} className="mr-2">{label}:</label>
      <select id={label} className="border rounded px-2 py-1" onChange={onChange}>
        <option value="">Select {label}</option> {/* Opción por defecto */}
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
