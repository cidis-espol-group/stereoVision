import React, { useEffect, useRef, useState } from 'react';
import { loadingStore, sendPostRequest, showVisualStore } from "../shared/apiService";
import Button from './utils/Button';
import { leftImgPreview, rightImgPreview } from '../shared/imagesStore';

const LiveContent = ({ module, settings }) => {
  const videoRef = useRef(null);
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const [width, setWidth] = useState(null)
  const [height, setHeight] = useState(null)

  const initializeStream = (videoElement, canvas, outputVideo, isLeft) => {
    if (!canvas || !outputVideo) return;
    
    const drawVideoOnCanvas = () => {
      if (canvas && videoElement) {
        const { videoWidth, videoHeight } = videoElement;
        canvas.width = videoWidth / 2;
        canvas.height = videoHeight;

        const ctx = canvas.getContext('2d');
        
        // Dibuja solo la mitad izquierda del video
        // if (isLeft) {
        //   ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);          
        // } else {
        //   ctx.drawImage(videoElement, canvas.width, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
        // }
        if (!isLeft) {
          // Invertir el eje Y
          ctx.translate(canvas.width, canvas.height);
          ctx.scale(-1, -1);
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
          ctx.setTransform(1, 0, 0, 1, 0, 0);          
        } else {
          ctx.translate(canvas.width, canvas.height);
          ctx.scale(-1, -1);
          ctx.drawImage(videoElement, canvas.width, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        requestAnimationFrame(drawVideoOnCanvas);
      }
    };

    drawVideoOnCanvas();

    // Captura el nuevo stream desde el canvas
    const newStream = canvas.captureStream();

    outputVideo.srcObject = newStream;
    outputVideo.play();
  };

  useEffect(() => {
    const { fps, resolution } = settings;
    const [width, height] = resolution.toString().split('×').map(Number);
    setWidth(width);
    setHeight(height)
    
    const constraints = {
      video: {
        width: { ideal: width * 2 }, // Duplicar el ancho para la cámara estereoscópica
        height: { ideal: height },
        frameRate: { ideal: Number(fps) },
      },
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        // leftVideoRef.current.srcObject = stream;
        // rightVideoRef.current.srcObject = stream;
        videoRef.current.srcObject = stream;
        if (leftCanvasRef.current && rightCanvasRef.current && videoRef.current) {
          initializeStream(videoRef.current, leftCanvasRef.current, leftVideoRef.current, true);
          initializeStream(videoRef.current, rightCanvasRef.current, rightVideoRef.current, false);
        }
      })
      // .catch((error) => {
      //   console.error('Error al acceder a la cámara:', error);
      // });


    return () => {
      if (leftVideoRef.current && leftVideoRef.current.srcObject) {
        leftVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (rightVideoRef.current && rightVideoRef.current.srcObject) {
        rightVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [settings]);

  const captureImage = () => {
    const leftVideo = leftVideoRef.current;
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;

    // Convierte el canvas a una imagen en base64
    const leftImage = leftCanvas.toDataURL('image/png');
    const rightImage = rightCanvas.toDataURL('image/png');

    leftImgPreview.set(leftImage)
    rightImgPreview.set(rightImage)

    // Convierte las imágenes base64 a blobs
    const leftBlob = dataURLToBlob(leftImage);
    const rightBlob = dataURLToBlob(rightImage);

    // Crea archivos a partir de los blobs
    const leftFile = new File([leftBlob], 'left_image.png', { type: 'image/png' });
    const rightFile = new File([rightBlob], 'right_image.png', { type: 'image/png' });


    const { profile } = settings;
    
    loadingStore.set(true)
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
      <video ref={videoRef} autoPlay style={{display:'none'}}></video>

      <div className="flex justify-center mb-6">
        <div className="w-1/2 text-center">
          <p className="mb-2 font-bold">LEFT</p>
          <video ref={leftVideoRef} autoPlay className='h-full w-full' width={width} height={height}></video>
          <canvas ref={leftCanvasRef} className="hidden"></canvas>
        </div>
        <div className="w-1/2 text-center ml-4">
          <p className="mb-2 font-bold">RIGHT</p>
          <video ref={rightVideoRef} autoPlay className='h-full w-full'></video>
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
