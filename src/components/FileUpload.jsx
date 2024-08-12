import React, { useState } from 'react';
import Dropdown from './Dropdown.jsx';

const FileUpload = ({ onContinue }) => {
  const [imgLeftPreview, setImgLeftPreview] = useState(null);
  const [imgRightPreview, setImgRightPreview] = useState(null);
  const [imgLeft, setImgLeft] = useState(null)
  const [imgRight, setImgRight] = useState(null)

  const handleFileChange = (event, setPreview, setImage, storageKey) => {
    const file = event.target.files[0];
    if (file) {
      
      setImage(file)
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        
        setPreview(base64String);
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event, setPreview, storageKey) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        setPreview(base64String);
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleContinue = async () => {
    if (!imgLeft || !imgRight) {
      alert('Please upload both left and right images.');
      return;
    }
    const formData = new FormData();
    
    
    formData.append('img_left', imgLeft); // leftImageFile es el archivo
    formData.append('img_right', imgRight); // rightImageFile es el archivo
    formData.append('profile_name', 'MATLAB');
    formData.append('method', 'SELECTIVE');
    // formData.append('use_roi', false);
    

    fetch('https://01q87rn1-8000.use2.devtunnels.ms/generate_point_cloud/dense/', {
      method: 'POST',
      body:formData
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      
      onContinue(data.point_cloud, data.colors);
    })
    .catch(error => console.error('Error fetching point cloud:', error)); 
  };

  return (
    <div className="p-8">
      <div className="mb-4">
        <Dropdown label="Robot:" options={['Waiter', 'Cleaner', 'Guard']} />
      </div>
      <div className="flex justify-center mb-6">
        <div className="w-1/2 text-center">
          <p className="mb-2 font-bold">LEFT</p>
          <div
            className="bg-gray-100 border-dashed border-2 border-gray-400 p-8 rounded-md"
            onDrop={(e) => handleDrop(e, setImgLeftPreview, setImgLeft, 'leftImage')}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setImgLeftPreview, setImgLeft, 'leftImage')}
              className="hidden"
              id="imgLeft"
            />
            <label htmlFor="imgLeft" className="cursor-pointer">
              {imgLeftPreview ? (
                <img src={imgLeftPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div>
                  <p>Drag and drop your files here to upload</p>
                  <p className="mt-2">OR</p>
                  <button
                    type="button"
                    className="mt-4 bg-gray-300 text-black px-4 py-2 rounded"
                    onClick={() => document.getElementById('imgLeft').click()}
                  >
                    Browse Files
                  </button>
                </div>
              )}
            </label>
          </div>
        </div>
        <div className="w-1/2 text-center ml-4">
          <p className="mb-2 font-bold">RIGHT</p>
          <div
            className="bg-gray-100 border-dashed border-2 border-gray-400 p-8 rounded-md"
            onDrop={(e) => handleDrop(e, setImgRightPreview, setImgRight, 'rightImage')}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setImgRightPreview, setImgRight, 'rightImage')}
              className="hidden"
              id="imgRight"
            />
            <label htmlFor="imgRight" className="cursor-pointer">
              {imgRightPreview ? (
                <img src={imgRightPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div>
                  <p>Drag and drop your files here to upload</p>
                  <p className="mt-2">OR</p>
                  <button
                    type="button"
                    className="mt-4 bg-gray-300 text-black px-4 py-2 rounded"
                    onClick={() => document.getElementById('imgRight').click()}
                  >
                    Browse Files
                  </button>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={handleContinue}
          className="mt-4 bg-gray-300 text-black w-52 px-4 py-2 rounded-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
