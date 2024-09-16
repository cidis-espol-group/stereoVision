import React, { useState, useEffect } from 'react';
import Dropdown from './utils/Dropdown.jsx';
import Robots from './utils/Robots.jsx';
import Checkbox from './utils/Checkbox.jsx';
import Button from './utils/Button.jsx';
import { sendPostRequest, loadingStore, showVisualStore, isRoiStore } from "../shared/apiService.js";
import { leftImgPreview, rightImgPreview } from '../shared/imagesStore.js';
import { useStore } from '@nanostores/react';
import ToggleButton from './utils/ToggleButton.jsx';
import { scrollToSection } from '../shared/tabStore.js';

const FileUpload = ({module }) => {

  const leftPreview = useStore(leftImgPreview)
  const rightPreview = useStore(rightImgPreview) 

  const [imgLeft, setImgLeft] = useState(null)
  const [imgRight, setImgRight] = useState(null)
  const [profile, setProfile] = useState(null)
  const [method, setMethod] = useState(null)

  const [checkboxes, setCheckboxes] = useState({
    useRoi: true,
    useMaxDisp: true,
    normalize: true,
  });


  const handleFileChange = (event,  setImage, store, file) => {
    const file_changed  = file ? file : event.target.files[0];
    if (file_changed) {
      setImage(file_changed)
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        store.set(base64String)
      };
      reader.readAsDataURL(file_changed);
    }
  };

  const handleDrop = (event, setImage, store) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileChange(event, setImage, store, file)
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDropdownChange = (profile) => {
    setProfile(profile);
  };

  const handleCheckboxChange = (name, isChecked) => {
    setCheckboxes(prevState => ({
      ...prevState,
      [name]: isChecked,
    }));
  };

  const handleContinue = async () => {
    if (!imgLeft || !imgRight) {
      alert('Please upload both left and right images.');
      return;
    } else if (!profile) {
      alert('Please select a robot profile.');
      return;
    } else if (!method) {
      alert('Please select a generation method.');
      return;
    }
    
    loadingStore.set(true)
    showVisualStore.set(true)
    isRoiStore.set(checkboxes.useRoi)
    
    let formData = new FormData();
    formData.append('img_left', imgLeft); // leftImageFile es el archivo
    formData.append('img_right', imgRight); // rightImageFile es el archivo
    formData.append('profile_name', profile);
    formData.append('method', method);
    
    sendPostRequest(formData, module, checkboxes)
    setTimeout(() => {
      scrollToSection.set('visualization')
    }, 100);
  };

  

  return (
    <div className={`p-8`}>
      <div className={`flex justify-between content-center mb-8 `}>
        <Robots onChange={e => setProfile(e.target.value)}/>
        <Dropdown label="Method" options={['SGBM','WLS-SGBM', 'RAFT', 'SELECTIVE']} value={method} onChange={e => setMethod(e.target.value)} />
        <Checkbox label="Use max disparity" checked={checkboxes.useMaxDisp} onChange={(isChecked) => handleCheckboxChange('useMaxDisp', isChecked)}/>
        <Checkbox label="Normalize" checked={checkboxes.normalize} onChange={(isChecked) => handleCheckboxChange('normalize', isChecked)}/>
        <ToggleButton leftLabel={'Keypoints'} rightLabel={'ROI'} checked={checkboxes.useRoi} onChange={(isChecked) => handleCheckboxChange('useRoi', isChecked)} className={module != 'no-dense-point-cloud' ? 'hidden': ''}/>
      </div>
      <div className={`flex justify-center mb-6`}>
        <div className="w-1/2 text-center">
          <p className="mb-2 font-bold">LEFT</p>
          <div
            className="bg-gray-100 border-dashed border-2 border-gray-400 p-8 rounded-md"
            onDrop={(e) => handleDrop(e, setImgLeft, leftImgPreview)}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setImgLeft, leftImgPreview)}
              className="hidden"
              id="imgLeft"
            />
            <label htmlFor="imgLeft" className="cursor-pointer">
              {leftPreview ? (
                <img src={leftPreview} alt="Preview" className="w-full h-full object-cover" />
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
            onDrop={(e) => handleDrop(e, setImgRight, rightImgPreview)}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setImgRight, rightImgPreview)}
              className="hidden"
              id="imgRight"
            />
            <label htmlFor="imgRight" className="cursor-pointer">
              {rightPreview ? (
                <img src={rightPreview} alt="Preview" className="w-full h-full object-cover" />
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
      <div className={`flex justify-center`}>
        <Button label={'Continue'} onClick={handleContinue}/>
      </div>
    </div>
  );
};

export default FileUpload;
