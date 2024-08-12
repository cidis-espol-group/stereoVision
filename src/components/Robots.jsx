import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';

const Robots = ({ onRobotSelect }) => {
  const [robots, setRobots] = useState([]);

  useEffect(() => {
    fetch('https://01q87rn1-8000.use2.devtunnels.ms/get_profiles/')
      .then(response => response.json())
      .then(data => setRobots(data.map(robot => robot.name))) // Extrae solo los nombres
      .catch(error => console.error('Error fetching profiles:', error));
  }, []);

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    onRobotSelect(selectedValue); // Pasa el valor seleccionado al componente padre
  };

  return (
    <Dropdown label='Robot' options={robots} onChange={handleDropdownChange} />
  );
};

export default Robots;
