import React, { useState, useEffect  } from 'react';
import SettingsContent from './SettingsContent';
import LiveContent from './LiveContent';
import DenseCloud from './DenseCloud';
import FileUpload from './FileUpload';
import NoDenseCloud from './NoDenseCloud';

const Tabs = ({ module }) => {
  const tabs = ['LIVE', 'FILE'];
  const [activeTab, setActiveTab] = useState('LIVE');
  const [showContent, setShowContent] = useState(true);
  const [settings, setSettings] = useState({ fps: '30', resolution: '1920×1080' });
  const [pointCloud, setPointCloud] = useState(null);
  const [colors, setColors] = useState(null);
  const [url, setUrl] = useState(null);

  

  const handleContinue = (selectedSettings) => {
    setSettings(selectedSettings);
    setShowContent(false);
  };

  const handleUploadContinue = (generatedPointCloud, generatedColors) => {
    setPointCloud(generatedPointCloud);
    setColors(generatedColors);
    
    setShowContent(false);
  };

  const renderModuleContent = () => {
    switch (module) {
      case 'dense-point-cloud':
        return <DenseCloud pointCloud={pointCloud} colors={colors}/>;
      case 'height-estimation':
        return <HeightEstimation />;
      case 'no-dense-point-cloud':
        return <NoDenseCloud pointCloud={pointCloud} colors={colors}/>
      case 'feature-extraction':
        return <HeightEstimation />;
      default:
        return null;
    }
  };

  return (
    <div className='my-10'>
      {showContent ? (
        <div className="flex justify-center mb-4">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={`px-10 py-1 font-bold ${activeTab === tab ? 'bg-[#14788E] text-white' : 'bg-gray-300'} 
                ${index === 0 ? 'rounded-l-lg' : ''} 
                ${index === tabs.length - 1 ? 'rounded-r-lg' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      ) : null}
      {showContent ? (
        activeTab === 'LIVE' ? (
          <SettingsContent onContinue={handleContinue} />
        ) : (
          <FileUpload module={module} onContinue={handleUploadContinue} />
        )
      ) : (
        activeTab === 'LIVE' ? (
          <LiveContent settings={settings} />
        ) : (
          renderModuleContent()
        )
      )}
    </div>
  );
};

export default Tabs;
