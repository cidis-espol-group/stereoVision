import React, { useEffect, useRef, useState } from 'react';
import { sendPostRequest, showVisualStore } from "../shared/apiService";
import Button from './utils/Button';
import { leftImgPreview, rightImgPreview } from '../shared/imagesStore';

const LiveContent = ({ module, settings }) => {
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState({
    left: null,
    right: null,
  });

  useEffect(() => {
    const { fps, resolution } = settings;
    const [width, height] = resolution.toString().split('×').map(Number);
    
    const constraints = {
      video: {
        width: { ideal: width * 2 }, // Duplicar el ancho para la cámara estereoscópica
        height: { ideal: height },
        frameRate: { ideal: Number(fps) },
      },
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        leftVideoRef.current.srcObject = stream;
        rightVideoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
      });

    return () => {
      if (leftVideoRef.current && leftVideoRef.current.srcObject) {
        leftVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (rightVideoRef.current && rightVideoRef.current.srcObject) {
        rightVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [settings]);

  const captureImage = () => {
    const leftVideo = leftVideoRef.current;
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    const { videoWidth, videoHeight } = leftVideo;

    // Configura el canvas con las dimensiones del video original (mitad del ancho total)
    leftCanvas.width = videoWidth / 2;
    leftCanvas.height = videoHeight;
    rightCanvas.width = videoWidth / 2;
    rightCanvas.height = videoHeight;

    // Dibuja las partes izquierda y derecha del video en los respectivos canvas
    leftCanvas.getContext('2d').drawImage(leftVideo, 0, 0, leftCanvas.width, leftCanvas.height, 0, 0, leftCanvas.width, leftCanvas.height);
    rightCanvas.getContext('2d').drawImage(leftVideo, leftCanvas.width, 0, rightCanvas.width, rightCanvas.height, 0, 0, rightCanvas.width, rightCanvas.height);

    // Convierte el canvas a una imagen en base64
    const leftImage = leftCanvas.toDataURL('image/png');
    const rightImage = rightCanvas.toDataURL('image/png');

    leftImgPreview.set(leftImage)
    rightImgPreview.set(rightImage)

    // if (typeof window !== 'undefined') {
    //   localStorage.setItem('leftImage', leftImage);
    //   localStorage.setItem('rightImage', rightImage);
    //   localStorage.setItem('updated from', 'LiveContent')
    // }
    
    // Convierte las imágenes base64 a blobs
    const leftBlob = dataURLToBlob(leftImage);
    const rightBlob = dataURLToBlob(rightImage);

    // Crea archivos a partir de los blobs
    const leftFile = new File([leftBlob], 'left_image.png', { type: 'image/png' });
    const rightFile = new File([rightBlob], 'right_image.png', { type: 'image/png' });

    // Almacena las imágenes capturadas en el estado
    setCapturedImages({
      left: leftImage,
      right: rightImage,
    });
    const { profile } = settings;

    showVisualStore.set(true)
    
    // Crear FormData y añadir los archivos
    let formData = new FormData();
    formData.append('img_left', leftFile);
    formData.append('img_right', rightFile);
    formData.append('profile_name', profile);
    formData.append('method', 'SELECTIVE');

    console.log('Sending request data:', Object.fromEntries(formData));
    
    let parameters = {
      useRoi: false,
      useMaxDisp: true,
      normalize: true,
    };

    sendPostRequest(formData, module, parameters);
  };

  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className={"p-8 "}>
      <div className="flex justify-center mb-6">
        <div className="w-1/2 text-center">
          <p className="mb-2 font-bold">LEFT</p>
          <div style={{ width: '50%', overflow: 'hidden', position: 'relative' }}>
            <video ref={leftVideoRef} autoPlay style={{ width: '200%', height: 'auto', objectFit: 'cover', objectPosition: 'left', }}></video>
          </div>
          <canvas ref={leftCanvasRef} className="hidden"></canvas>
        </div>
        <div className="w-1/2 text-center ml-4">
          <p className="mb-2 font-bold">RIGHT</p>
          <div style={{ width: '50%', overflow: 'hidden', position: 'relative' }}>
            <video ref={rightVideoRef} autoPlay style={{ width: '200%', height: 'auto', objectFit: 'cover', objectPosition: 'right', }}></video>
          </div>
          <canvas ref={rightCanvasRef} className="hidden"></canvas>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <Button label={'Capture'} onClick={captureImage}/>
      </div>
    </div>
  );
};

export default LiveContent;
