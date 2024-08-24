import React, { useState } from 'react'

const Checkbox = ({ label, checked, onChange, className }) => {
  const [isChecked, setIsChecked] = useState(checked)

  const handleCheckboxChange = () => {
    // const isChecked = event.target.checked;
    setIsChecked(!isChecked)
    onChange(!isChecked); 
  };

  return (
    // <div className={`flex items-center mb-4 ${className}`}>
    //   <input
    //     type="checkbox"
    //     checked={checked}
    //     onChange={handleCheckboxChange}
    //     className="mr-2"
    //     id={label}
    //   />
    //   <label htmlFor={label} >{label}</label>
    // </div>

    <label className={`flex items-center cursor-pointer text-dark  ${className}`}>
      <div className='relative'>
        <input
          type='checkbox'
          checked={checked}
          onChange={handleCheckboxChange}
          className='sr-only'
        />
        <div className='box mr-4 flex h-5 w-5 items-center justify-center rounded border-stroke border'>
          <span className={`dot h-[10px] w-[10px] rounded-sm ${isChecked && 'bg-[#14788E]'}`}></span>
        </div>
      </div>
      {label}
    </label>
  );
};

export default Checkbox;
