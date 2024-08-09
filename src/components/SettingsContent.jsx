import React, { useState } from 'react';
import Dropdown from './Dropdown.jsx';

const SettingsContent = ({ onContinue }) => {
  const [robot, setRobot] = useState('Waiter');
  const [fps, setFps] = useState('30');
  const [resolution, setResolution] = useState('1920×1080');

  const handleContinue = () => {
    const selectedSettings = { fps, resolution };
    onContinue(selectedSettings);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-semibold mb-6">Settings</h2>
      <div className="flex flex-col items-center">
        <Dropdown label="Robot:" options={['Waiter', 'Cleaner', 'Guard']} value={robot} onChange={setRobot} />
        <Dropdown label="FPS:" options={['30', '60', '120']} value={fps} onChange={setFps} />
        <Dropdown label="Resolution:" options={['1920×1080', '1280×720', '640×480']} value={resolution} onChange={setResolution} />
        <button onClick={handleContinue} className="mt-4 w-52 bg-gray-300 text-black px-4 py-2 rounded-full">
          Continue
        </button>
      </div>
    </div>
  );
};

export default SettingsContent;
