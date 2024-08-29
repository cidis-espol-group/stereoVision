import React, { useState } from 'react';
import Dropdown from './utils/Dropdown.jsx';
import Robots from './utils/Robots.jsx';
import Button from './utils/Button.jsx';
import { showContentStore } from '../shared/tabStore.js';
import { getProfile } from '../shared/apiService.js';

const LiveSettings = ({ onContinue }) => {
  const initialProfile = null;
  const initialResolution = null;

  const [profile, setProfile] = useState(initialProfile);
  const [fps, setFps] = useState(null);
  const [resolution, setResolution] = useState(initialResolution);
  const [isResolutionValid, setIsResolutionValid] = useState(true);

  const handleContinue = () => {
    if (!profile || !fps || !resolution || !isResolutionValid) {
      alert('Please select all settings correctly.');
      return;
    } 
    const selectedSettings = { profile, fps, resolution };

    onContinue(selectedSettings);
    showContentStore.set(false);
  };

  const handleResolutionChange = async (value) => {
    if (profile) {
      const res = await getProfile(profile);
      const resolutionString = res.resolution[1] + 'x' + res.resolution[0];

      if (value === resolutionString) {
        setResolution(value);
        setIsResolutionValid(true);
      } else {
        alert(`Unavailable resolution for selected Robot.\nRecommended resolution: ${resolutionString}`);
        setResolution(initialResolution); 
        setIsResolutionValid(false); 
      }
    } else {
      setResolution(value);
      setIsResolutionValid(true);
    }
  };

  const handleRobotChange = async (value) => {
    if (resolution) {
      const res = await getProfile(value);
      const resolutionString = res.resolution[1] + 'x' + res.resolution[0];

      if (resolution === resolutionString) {
        setProfile(value);
        setIsResolutionValid(true);
      } else {
        alert(`Unavailable resolution for selected Robot.\nRecommended resolution: ${resolutionString}`);
        setProfile(initialProfile); 
        setResolution(initialResolution); 
        setIsResolutionValid(false); 
      }
    } else {
      setProfile(value);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-semibold mb-6">Settings</h2>
      <div className="flex flex-col items-center">
        <Robots
          className={'mb-4'}
          value={profile}
          onChange={e => handleRobotChange(e.target.value)}
        />
        <Dropdown
          label="FPS"
          options={["30", "20", "15", "10", "5"]}
          value={fps}
          onChange={e => setFps(e.target.value)}
          className={'mb-4'}
        />
        <Dropdown
          label="Resolution"
          options={["1920x1080", "1280x720", "800x600", "640x480", "320x240"]}
          value={resolution}
          onChange={e => handleResolutionChange(e.target.value)}
          className={'mb-4'}
        />
        <Button 
          label={'Continue'} 
          onClick={handleContinue} 
          disabled={!isResolutionValid || !profile || !fps || !resolution} 
        />
      </div>
    </div>
  );
};

export default LiveSettings;
