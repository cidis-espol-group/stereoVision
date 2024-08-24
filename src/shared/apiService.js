// shared/api.js
import { atom } from "nanostores";
import { downloadResponseStore, responseStore } from "./response";
import { showContentStore } from "./tabStore";

const apiKey = import.meta.env.API_KEY;
export const loadingStore = atom(false)
export const showVisualStore = atom(false)
const base = 'http://127.0.0.1:8000/';


const getURL = (module, parameters) => {
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

const getDownloadURL = (module) => {
  let generatedUrl = '';
  switch (module) {
    case 'dense-point-cloud':
      generatedUrl = `${base}generate_point_cloud/dense/`;
      break;
    case 'no-dense-point-cloud':
      generatedUrl = `${base}generate_point_cloud/nodense/`;
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
      },
    });

    if (!response.ok) {
      let errorMessage;
        switch(response.status) {
          case 500:
            errorMessage = 'No se detectaron personas. Intente otra vez.';
            break;
          case 404:
            errorMessage = 'No Encontrado: 404';
            break;
          case 401:
            errorMessage = 'No Autorizado: 401';
            break;
          case 400:
            errorMessage = 'Solicitud Incorrecta: 400';
            break;
          default:
            errorMessage = `Error HTTP: ${response.status}, ${response.statusText}`;
        }
      alert(errorMessage); // Muestra una alerta en pantalla
      throw new Error(errorMessage);
    } 

    const jsonResponse = await response.json();
    responseStore.set(jsonResponse);
    // showContentStore.set(true); 
    loadingStore.set(false)
    
  } catch (error) {
    

    console.error('Error in fetch:', error);

    loadingStore.set(false);
    showVisualStore.set(false)
  }  
};


export const downloadPointcloud = async (data, module, parameters) => {
  const url = getDownloadURL(module);

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
      downloadResponseStore.set(jsonResponse);
      // loadingStore.set(false)
      
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error in fetch:', error);
  }  
};