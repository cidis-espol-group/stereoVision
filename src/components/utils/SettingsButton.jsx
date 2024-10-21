import React, { useState, useEffect } from 'react';
import Button from './Button';
import { addProfile, deleteProfile, fetchProfiles, getProfiles } from '../../shared/apiService';
import { profilesStore } from '../../shared/response';
import { useStore } from '@nanostores/react';


const SettingsButton = () => {
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileFile, setNewProfileFile] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteButtons, setShowDeleteButtons] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});

  const profilesResponse = useStore(profilesStore)

  const apiKey = import.meta.env.API_KEY;

  //TODO: Cambiar función de fetch a shared/api
  useEffect(() => {
    fetchProfiles()
      .then(data => {
        setProfiles(data);
        const initialFiles = data.reduce((acc, profile) => {  
          acc[profile.name] = profile.path;
          return acc;
        }, {});
        setSelectedFiles(initialFiles);
      })
      .catch(error => console.error('Error fetching profiles:', error));
    
  }, []);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    setShowAddForm(false);
    setShowDeleteButtons(false)
  };

  const handleFileChange = (event, profileName) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
      setSelectedFiles(prevState => ({
        ...prevState,
        [profileName]: URL.createObjectURL(file)
      }));
    } else {
      alert('Please select a valid JSON file.');
    }
  };

  const toggleDeleteButtons = () => {
    setShowDeleteButtons(prevState => !prevState);
  };

  const handleDeleteProfile = async (profileName) => {
    try {
      const success = await deleteProfile(profileName);
      if (success) {
        setProfiles(profiles.filter(profile => profile.name !== profileName));
      } else {
        console.error('Error deleting profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };
  
  const toggleAddForm = () => {
    setShowAddForm(prevState => !prevState);
  };
  
  const handleAddProfile = async () => {
    if (newProfileName && newProfileFile) {
      const formData = new FormData();
      formData.append('file', newProfileFile);
      formData.append('profile_name', newProfileName);

      try {
        await addProfile(formData);
        // Actualiza la lista de perfiles después de agregar
        const updatedProfiles = await fetchProfiles();
        setProfiles(updatedProfiles);
        const updatedSelectedFiles = updatedProfiles.reduce((acc, profile) => {
          acc[profile.name] = profile.path;
          return acc; 
        }, {});
        setSelectedFiles(updatedSelectedFiles);
        // Resetear el formulario
        setNewProfileName('');
        setNewProfileFile(null);
        setShowAddForm(false);
        setShowDeleteButtons(false);
      } catch (error) {
        console.error('Error adding profile:', error);
      }
    } else {
      alert('Please provide both a profile name and a JSON file.');
    }
  };
  

  const handleToggleActions = () => {
    toggleAddForm();
    toggleDeleteButtons();
  };

  return (
    <div className="relative">
      <div className="flex justify-end">
        <button onClick={togglePopup} className="m-4 hover:animate-spin">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-settings"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative">
            <button onClick={togglePopup} className="absolute top-0 right-0 m-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-x"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4">Calibration settings</h2>
            <p className="mb-2 font-semibold">Robot profiles</p>
            {profiles.map((profile) => (
              <div key={profile.name} className="flex items-center mb-4">
                <div className="flex items-center flex-grow">
                  <span className="mr-2 min-w-[4rem] truncate">{profile.name}</span>
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={selectedFiles[profile.name]}
                      readOnly
                      className="border rounded px-2 py-1 pr-10 w-full"
                    />
                    <label
                      htmlFor={`file-input-${profile.name}`}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-folder"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                      </svg>
                    </label>
                  </div>
                  <input
                    type="file"
                    accept="application/json"
                    onChange={(e) => handleFileChange(e, profile.name)}
                    className="hidden"
                    id={`file-input-${profile.name}`}
                  />
                </div>
                {showDeleteButtons && (
                  <button
                    onClick={() => handleDeleteProfile(profile.name)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                  </button>
                )}
              </div>
            ))}

            {!showAddForm && (
              <div className="flex justify-center mt-4">
                <button onClick={handleToggleActions} className="bg-gray-300 text-black px-4 py-2 rounded flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              </div>
            )}

            {showAddForm && (
              <div className="mt-4">
                <div className="flex items-center mb-2 mr-5">
                <input
                    type="text"
                    placeholder="Name"
                    className="border rounded px-2 py-1 mr-2 w-[4rem] flex-shrink-0"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                  />
                  <input
                    type="file"
                    accept="application/json"
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => setNewProfileFile(e.target.files[0])}
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex-grow border rounded mr-3 px-2 py-1 bg-gray-100 text-gray-500 flex items-center cursor-pointer"
                  >
                    <span className="flex-grow font-normal">{newProfileFile ? newProfileFile.name : "File path"}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-folder"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                    </svg>
                  </label>
                </div>
                <div className="flex justify-center mt-4">
                  
                  <Button label={'Add Profile'} onClick={handleAddProfile}/>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsButton;