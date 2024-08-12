import React, { useState } from 'react';
import Dropdown from './Dropdown.jsx';
import Robots from './Robots.jsx';

const FileUpload = ({url, onContinue }) => {
  const [imgLeftPreview, setImgLeftPreview] = useState(null);
  const [imgRightPreview, setImgRightPreview] = useState(null);
  const [imgLeft, setImgLeft] = useState(null)
  const [imgRight, setImgRight] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

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
    } else if (!profile) {
      alert('Please select a robot profile.');
      return;
    }
    console.log(url);
    
    let formData = new FormData();
    
    setLoading(true)
    formData.append('img_left', imgLeft); // leftImageFile es el archivo
    formData.append('img_right', imgRight); // rightImageFile es el archivo
    formData.append('profile_name', profile);
    formData.append('method', 'SELECTIVE');
    
    console.log('Sending request data:',Object.fromEntries(formData))

    fetch(url, {
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

  const handleDropdownChange = (profile) => {
    setProfile(profile);
    console.log('Selected Robot:', profile);
  };

  return (
    <div className="p-8">

      <div className={`flex flex-col h-screen justify-center items-center ${loading ? 'visible' : 'hidden'}`}>
          <div className="flex-row ">
            <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.25"/>
              <path fill="#14788E" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
              </path>
            </svg>
          </div>
          
          <div className="flex-row">
            <span className='text-xl'>Loading point cloud...</span>
          </div>
        
      </div>

      <div className={`mb-4 ${!loading ? 'visible' : 'hidden'}`}>
        <Robots onRobotSelect={handleDropdownChange}/>
      </div>
      <div className={`flex justify-center mb-6 ${!loading ? 'visible' : 'hidden'}`}>
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
      <div className={`flex justify-center ${!loading ? 'visible' : 'hidden'}`}>
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
