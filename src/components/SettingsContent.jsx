import React, { useState } from 'react';
import Dropdown from './Dropdown.jsx';
import Robots from './Robots.jsx';

const SettingsContent = ({ onContinue }) => {
  const [profile, setProfile] = useState(null)
  const [fps, setFps] = useState(null);
  const [resolution, setResolution] = useState(null);

  const handleContinue = () => {
    if (!profile || !fps || !resolution) {
      alert('Please select all settings.');
      return;
    } 
    const selectedSettings = { profile, fps, resolution };

    console.log(selectedSettings);
    
    
    onContinue(selectedSettings);
  };

  const handleDropdownChange = (value, setValue) => {
    setValue(value)
    console.log(`Selected ${value}:`, value);
  };


  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-semibold mb-6">Settings</h2>
      <div className="flex flex-col items-center">
        <Robots onRobotSelect={setProfile}/>
        {/* <Dropdown label="Robot" options={['Waiter', 'Cleaner', 'Guard']} value={robot} onChange={setRobot} /> */}
        <Dropdown label="FPS" options={["5", "10", "15", "20", "30"]} value={fps} onChange={e => setFps(e.target.value)} />
        <Dropdown label="Resolution" options={["1920x1080", "1280x720", "800x600", "640x480", "320x240"]} value={resolution} onChange={e => setResolution(e.target.value)} />
        <button onClick={handleContinue} className="mt-4 w-52 bg-gray-300 text-black px-4 py-2 rounded-full">
          Continue
        </button>
      </div>
    </div>
  );
};

export default SettingsContent;
