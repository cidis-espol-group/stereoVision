// shared/api.js
import { atom } from "nanostores";
import { downloadResponseStore, responseStore } from "./response";
import { showContentStore } from "./tabStore";

const apiKey = import.meta.env.API_KEY;
export const loadingStore = atom(false)
export const showVisualStore = atom(false)
export const isRoiStore = atom(true)

const base = 'http://127.0.0.1:8000/';


const getURL = (module, parameters) => {
    let generatedUrl = '';
    switch (module) {
      case 'dense-point-cloud':
        generatedUrl = `${base}generate_point_cloud/dense/?use_max_disparity=${parameters.useMaxDisp}&normalize=${parameters.normalize}`;
        break;
      case 'height-estimation':
        generatedUrl =`${base}generate_point_cloud/nodense/height_estimation/?use_max_disparity=${parameters.useMaxDisp}&normalize=${parameters.normalize}`;
        break;
      case 'no-dense-point-cloud':
        generatedUrl = `${base}generate_point_cloud/nodense/individual/?use_roi=${parameters.useRoi}&use_max_disparity=${parameters.useMaxDisp}&normalize=${parameters.normalize}`;
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

const getDownloadURL = (module, format) => {
  let generatedUrl = `${base}download_point_cloud/`;
  console.log('dentro de switch',module);
  
  switch (module) {
    case 'dense-point-cloud':
      generatedUrl += `dense/?format=${format}`;
      break;
    case 'no-dense-point-cloud':
      generatedUrl += `nodense/?format=${format}`;
      break;
    default:
      generatedUrl = '';
      break;
  }
  return generatedUrl;
};

const throwError = (response) => {
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
      throwError(response)
    } 

    const jsonResponse = await response.json();
    console.log(jsonResponse);
    
    responseStore.set(jsonResponse);
    // showContentStore.set(true); 
    loadingStore.set(false)
    
  } catch (error) {
    console.error('Error in fetch:', error);
    loadingStore.set(false);
    showVisualStore.set(false)
  }  
};


export const downloadFile = async (module, extension) => {
  const downloadURL = getDownloadURL(module, extension)
  console.log('module',module);
  console.log('extension',extension);
  console.log('url',downloadURL);
  
  
    fetch(downloadURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      
      // Guarda el response en una variable para poder usarlo después
      const contentDisposition = response.headers.get('Content-Disposition');
  
      return response.blob().then(blob => {
        return { blob, contentDisposition }; // Retorna un objeto con el blob y el encabezado
      });
    })
    .then(({ blob, contentDisposition }) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
  
      // Nombre por defecto si no se proporciona en el encabezado
      let filename = `pointCloud.${extension}`;

      if (!isRoiStore.get()) {
        filename = `pointCloud`;
      }
  
      // Extraer el nombre del archivo del encabezado 'Content-Disposition' si está disponible
      if (contentDisposition) {
        const matches = /filename="(.+)"/.exec(contentDisposition);
        if (matches != null && matches[1]) filename = matches[1];
      }
  
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch(error => {
      console.error('There was an error downloading the file:', error);
    });
};
