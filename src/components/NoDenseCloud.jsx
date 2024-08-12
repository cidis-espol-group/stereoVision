import React, { useState, useEffect } from 'react';
import ThreeDViewer from './PointCloudViewer';
import PointCloudViewer from './PointCloudViewer';

const NoDenseCloud = (pointCloud, colors) => {
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const leftImage = localStorage.getItem('leftImage');
      const rightImage = localStorage.getItem('rightImage');

      if (leftImage) {
        setLeftImage(leftImage);
      }

      if (rightImage) {
        setRightImage(rightImage);
      }
    }
  }, []);

  const handleRestart = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('leftImage');
      localStorage.removeItem('rightImage');
      setLeftImage(null);
      setRightImage(null);
      window.location.reload(); // Recargar la página para reflejar los cambios
    }
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-center mb-6">
        <div className="w-1/2 text-center">
          <p className="mb-2 font-bold">LEFT</p>
          {leftImage ? (
            <img src={leftImage} alt="Left" className="w-full h-full object-cover" />
          ) : (
            <div className="bg-gray-100 border-dashed border-2 border-gray-400 p-8 rounded-md">
              <p>No image uploaded</p>
            </div>
          )}
        </div>
        <div className="w-1/2 text-center ml-4">
          <p className="mb-2 font-bold">RIGHT</p>
          {rightImage ? (
            <img src={rightImage} alt="Right" className="w-full h-full object-cover" />
          ) : (
            <div className="bg-gray-100 border-dashed border-2 border-gray-400 p-8 rounded-md">
              <p>No image uploaded</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <button
          onClick={handleRestart}
          className="mt-4 bg-gray-300 text-black w-52 px-4 py-2 rounded-full"
        >
          Restart
        </button>
      </div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">DENSE POINT CLOUD</h2>
        <div className="bg-gray-100 border border-gray-400 py-8 rounded-md px">
          {/* <PointCloudViewer/> */}
          {/* <ThreeDViewer pointCloud={pointCloud} colors={colors}/> */}
          {/* <PointCloudViewer points={pointCloud} colors={colors} size={10} shape='circle' color='blue' /> */}
          {pointCloud && colors ? (
            <PointCloudViewer pointCloud={pointCloud} colors={colors} />
          ) : (
            <p>Loading point cloud...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoDenseCloud;
