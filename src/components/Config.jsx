import React, { useState, useEffect } from 'react';
import Tabs from './Tabs.jsx';
import SettingsContent from './SettingsContent.jsx';
import FileUploadContent from './FileUploadContent.jsx';

const Config = () => {
  const tabs = ['LIVE', 'FILE'];
  const [activeTab, setActiveTab] = useState('LIVE');
  const [robot, setRobot] = useState('Waiter');
  const [module, setModule] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const moduleParam = queryParams.get('module');
    setModule(moduleParam);
    if (moduleParam) {
      console.log("Module parameter:", moduleParam);
    } else {
      console.error("Module parameter is null or undefined");
    }
  }, []);

  const handleContinue = () => {
    if (module === 'dense-point-cloud') {
      window.location.href = '/densePointCloud';
    }
    // Agrega otras redirecciones de módulo aquí
  };

  return (
    <main className="p-8">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'LIVE' ? (
        <SettingsContent onContinue={handleContinue} />
      ) : (
        <FileUploadContent onContinue={handleContinue} robot={robot} setRobot={setRobot} />
      )}
    </main>
  );
};

export default Config;
