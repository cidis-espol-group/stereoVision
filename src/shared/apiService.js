// shared/api.js
import { atom } from "nanostores";
import { downloadResponseStore, responseStore } from "./response";
import { showContentStore } from "./tabStore";

const apiKey = import.meta.env.API_KEY;
export const loadingStore = atom(false)
export const showVisualStore = atom(false)
export const isRoiStore = atom(true)

const base = 'http://http://192.168.1.8:8000/';


const getURL = (module, parameters) => {
    let generatedUrl = '';
    switch (module) {
      case 'dense-point-cloud':
        generatedUrl = `${base}generate_point_cloud/dense/?use_max_disparity=${parameters.useMaxDisp}&normalize=${parameters.normalize}`;
        break;
      case 'height-estimation':
        generatedUrl =`${base}generate_point_cloud/nodense/height_estimation/?use_max_disparity=${parameters.useMaxDisp}&normalize=${parameters.normalize}`;
        break;
      case 'height-estimation-face':
        // generatedUrl =`${base}face/height_estimation/`;
        generatedUrl =`${base}face/height_estimation/`;

        break;
      case 'no-dense-point-cloud':
        generatedUrl = `${base}generate_point_cloud/nodense/individual/?use_roi=${parameters.useRoi}&use_max_disparity=${parameters.useMaxDisp}&normalize=${parameters.normalize}`;
        break;
      case 'feature-extraction':
        generatedUrl = `${base}generate_point_cloud/nodense/features/`;
        break;
      default:
        generatedUrl = '';
        break;
    }
    console.log(module, generatedUrl);
    
    return generatedUrl;
};

const getDownloadURL = (module, format) => {
  let generatedUrl = `${base}download_point_cloud/`;
  
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
            errorMessage = `500 Internal Server Error.`;
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
            errorMessage = `Error HTTP: ${response.status}, ${response.statusText}. ${response.detail}`;
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
export const getProfiles = async () => {
  const url = `${base}get_profiles/`
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'ngrok-skip-browser-warning': 'any'
      },
    });

    if (!response.ok) {
      throwError(response)
    } 

    const jsonResponse = await response.json();
    return jsonResponse
    
  } catch (error) {
    console.error('Error in fetch:', error);
    loadingStore.set(false);
    showVisualStore.set(false)
  } 
}


export const getProfile = async (profile) => {
  const url = `${base}get_profile/${profile}`
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'ngrok-skip-browser-warning': 'any'
      },
    });

    if (!response.ok) {
      throwError(response)
    } 

    const jsonResponse = await response.json();
    return jsonResponse
    
  } catch (error) {
    console.error('Error in fetch:', error);
    loadingStore.set(false);
    showVisualStore.set(false)
  } 
}

export const send_video_images =  async (data) => {
  const url = base + "upload-frame/";

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
    
    // responseStore.set(jsonResponse);
    // showContentStore.set(true); 
    // loadingStore.set(false)
    
  } catch (error) {
    console.error('Error in fetch:', error);
    // loadingStore.set(false);
    // showVisualStore.set(false)
  }  
};

export const process_video_from_images =  async (data) => {
  const url = base + "process-video/";

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

// export const convert_video_formart =  async (data) => {
//   const url = base + "convert-video/";

//   try {
//     const response = await fetch(url, {
//       method: 'POST',
//       body: data,
//       headers: {
//         'Authorization': `Bearer ${apiKey}`,
//         'ngrok-skip-browser-warning': 'any'
//       },
//     });

//     if (!response.ok) {
//       throwError(response)
//     } 

//     const jsonResponse = await response.json();
//     console.log(jsonResponse);
    
//     responseStore.set(jsonResponse);
//     // showContentStore.set(true); 
//     loadingStore.set(false)
    
//   } catch (error) {
//     console.error('Error in fetch:', error);
//     loadingStore.set(false);
//     showVisualStore.set(false)
//   }  
// };

export const convert_video_formart = async (data) => {
  const url = base + "convert-video/";
  
    fetch(url, {
      method: 'POST',
      body: data,
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
      let filename = 'video.avi';

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