// shared/api.js
import { atom } from "nanostores";
import { responseStore } from "./response";
import { showContentStore } from "./tabStore";

const apiKey = import.meta.env.API_KEY;
export const loadingStore = atom(false)
export const showVisualStore = atom(false)


const getURL = (module, parameters) => {
    const base = 'http://127.0.0.1:8000/';
    let generatedUrl = '';
    switch (module) {
      case 'dense-point-cloud':
        generatedUrl = `${base}generate_point_cloud/dense/?use_max_disparity=${parameters.useMaxDisp}&normalize=${parameters.normalize}`;
        break;
      case 'height-estimation':
        generatedUrl = base;
        break;
      case 'no-dense-point-cloud':
        generatedUrl = `${base}generate_point_cloud/nodense/complete/?use_roi=${parameters.useRoi}&use_max_disparity=${parameters.useMaxDisp}&normalize=${parameters.normalize}`;
        break;
      case 'feature-extraction':
        generatedUrl = base;
        break;
      default:
        generatedUrl = '';
        break;
    }
    return generatedUrl;
};

export const sendPostRequest = async (data, module, parameters) => {
    const url = getURL(module, parameters);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'ngrok-skip-browser-warning': 'any'
        }
      });
  
      if (response.ok) {
        const jsonResponse = await response.json();
        
        responseStore.set(jsonResponse);
        // showContentStore.set(true); 
        loadingStore.set(false)
        
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in fetch:', error);
    }  
};
