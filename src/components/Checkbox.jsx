import React from 'react';

const Checkbox = ({ label, checked, onChange,className }) => {
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    onChange(isChecked); 
  };

  return (
    <div className={`flex items-center mb-4 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className="mr-2"
      />
      <label>{label}</label>
    </div>
  );
};

export default Checkbox;
