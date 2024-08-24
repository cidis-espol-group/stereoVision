import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';

const Robots = ({ onRobotSelect, className }) => {
  const [robots, setRobots] = useState([]);
  const apiKey = import.meta.env.API_KEY;

  //TODO: Cambiar función de fetch a shared/api
  useEffect(() => {
    fetch('http://127.0.0.1:8000/get_profiles/',{
      headers: {
        'Authorization':`Bearer ${apiKey}`,
        'ngrok-skip-browser-warning': 'any'
      }
    }
    )
      .then(response => response.json())
      .then(data => setRobots(data.map(robot => robot.name))) // Extrae solo los nombres
      .catch(error => console.error('Error fetching profiles:', error));
  }, []);

  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    onRobotSelect(selectedValue); // Pasa el valor seleccionado al componente padre
  };

  return (
    <Dropdown label='Robot' options={robots} onChange={handleDropdownChange} className={`${className}`}/>
  );
};

export default Robots;
