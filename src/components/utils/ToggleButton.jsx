import React, { useState } from 'react'

const ToggleButton = ({leftLabel, rightLabel, checked, onChange, className}) => {
    const [isChecked, setIsChecked] = useState(checked)

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked)
      onChange(!isChecked)
    }
  
    return (
      <>
        <label className={`themeSwitcherTwo relative inline-flex cursor-pointer items-center ${className}`}>
          <input
            type='checkbox'
            checked={checked}
            onChange={handleCheckboxChange}
            className='sr-only'
          />
          <span className='label flex items-center text-sm text-black'>
            {leftLabel}
          </span>
          <span
            className={`slider mx-4 flex h-6 w-[40px] items-center rounded-full p-1 duration-200 ${
              isChecked ? 'bg-[#14788E]' : 'bg-[#CCCCCE]'
            }`}
          >
            <span
              className={`dot h-4 w-4 rounded-full bg-white duration-200 ${
                isChecked ? 'translate-x-[16px]' : ''
              }`}
            ></span>
          </span>
          <span className='label flex items-center text-sm text-black'>
            {rightLabel}
          </span>
        </label>
      </>
    )
}

export default ToggleButton
