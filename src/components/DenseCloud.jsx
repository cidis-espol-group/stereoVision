import React, { useState, useEffect } from 'react';
import PointCloudViewer from './PointCloudViewer';

const DenseCloud = () => {
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
        <div className="bg-gray-100 border border-gray-400 p-8 rounded-md">
          <PointCloudViewer/>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold mb-4">Extra settings</h3>
        <div className="flex justify-center mb-4">
          <label className="mr-2">Mode:</label>
          <select className="border rounded px-2 py-1">
            <option>Standard SGBM</option>
            <option>Another Mode</option>
          </select>
        </div>
        <div className="flex justify-center mb-4">
          <label className="mr-2">Filter:</label>
          <input type="checkbox" className="mr-2" /> WLS
        </div>
        <button className="bg-gray-300 text-black px-4 py-2 rounded">Download</button>
      </div>
    </div>
  );
};

export default DenseCloud;
