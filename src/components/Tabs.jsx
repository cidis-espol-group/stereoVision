import React, { useState, useEffect  } from 'react';
import LiveSettings from './LiveSettings';
import LiveContent from './LiveContent';
import FileUpload from './FileUpload';
import FileUploadReal from './FileUploadReal';
import { useStore } from '@nanostores/react';
import { activeTabStore, showContentStore } from '../shared/tabStore';
import { responseStore } from '../shared/response';
import { showVisualStore } from '../shared/apiService';

const Tabs = ({ module }) => {
  const tabs = ['LIVE', 'FILE', 'FILE REALSENSE'];

  //TODO: Revisar si la variable settins se usa LiveContent
  const [settings, setSettings] = useState({ fps: '30', resolution: '1920x1080' });

  const activeTab = useStore(activeTabStore);
  const showContent = useStore(showContentStore);
  const showVisualization = useStore(showVisualStore);

  const handleContinue = (selectedSettings) => {
    setSettings(selectedSettings);
  };

  return (
    <div className={`my-10 ${showVisualization && (activeTab === 'FILE' || activeTab === 'FILE REALSENSE') ? 'hidden': 'visible'}`}>
      {showContent ? (
        <div className="flex justify-center mb-4">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`px-10 py-1 font-bold ${activeTab === tab ? 'bg-[#14788E] text-white' : 'bg-gray-300'} 
                ${index === 0 ? 'rounded-l-lg' : ''} 
                ${index === tabs.length - 1 ? 'rounded-r-lg' : ''}`}
              onClick={() => {
                activeTabStore.set(tab)
                responseStore.set(null)
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      ) : null}
      {showContent ? (
        activeTab === 'LIVE' ? (
          <LiveSettings onContinue={handleContinue} />
        ) : activeTab === 'FILE' ? (
          <FileUpload module={module} />
        ) : (
          <FileUploadReal module={module} />
        )
      ) : (
        activeTab === 'LIVE' ? (
          <LiveContent module={module} settings={settings} />
        ) : (
          showVisualization.set(true)
        )
      )}
    </div>
  );
};

export default Tabs;
