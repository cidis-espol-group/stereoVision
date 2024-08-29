import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';
import { getProfiles } from '../../shared/apiService';

const Robots = ({ onRobotSelect, className, onChange}) => {
  const [robots, setRobots] = useState([]);

  useEffect(() => {
    getProfiles().then(data => setRobots(data.map(robot => robot.name))) // Extrae solo los nombres
  }, []);

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    onRobotSelect(selectedValue);
    if (onChange) {
      onChange(selectedValue)
    }
  };

  return (
    <Dropdown label='Robot' options={robots} onChange={onChange} className={`${className}`}/>
  );
};

export default Robots;
