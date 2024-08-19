import React, { useState, useEffect } from 'react';
import Dropdown from './utils/Dropdown.jsx';
import Robots from './utils/Robots.jsx';
import Button from './utils/Button.jsx';
import { showContentStore } from '../shared/tabStore.js';

const LiveSettings = ({ onContinue }) => {
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
    showContentStore.set(false)
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-semibold mb-6">Settings</h2>
      <div className="flex flex-col items-center">
        <Robots onRobotSelect={setProfile}/>
        <Dropdown label="FPS" options={["30", "20", "15", "10", "5"]} value={fps} onChange={e => setFps(e.target.value)} />
        <Dropdown label="Resolution" options={["1920x1080", "1280x720", "800x600", "640x480", "320x240"]} value={resolution} onChange={e => setResolution(e.target.value)} />
        <Button label={'Continue'} onClick={handleContinue}/>
      </div>
    </div>
  );
};

export default LiveSettings;
