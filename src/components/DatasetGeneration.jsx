import React, { useEffect, useRef, useState } from 'react';
import Button from './utils/Button';
import { leftImgPreview, rightImgPreview } from '../shared/imagesStore';
import { process_video_from_images, send_video_images } from '../shared/apiService';

const DatasetGeneration = ({ settings }) => {
  const videoRef = useRef(null);
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);

  const leftMediaRecorder = useRef(null);
  const rightMediaRecorder = useRef(null);
  const leftVideoChunks = useRef([]);
  const rightVideoChunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [finalFrame, setFinalFrame] = useState(null)

  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const saveImgs = true;

  const initializeStream = (videoElement, canvas, outputVideo, isLeft) => {
    if (!canvas || !outputVideo) return;

    const drawVideoOnCanvas = () => {
      if (canvas && videoElement) {
        const { videoWidth, videoHeight } = videoElement;
        canvas.width = videoWidth / 2;
        canvas.height = videoHeight;

        const ctx = canvas.getContext('2d');

        if (!isLeft) {
          ctx.translate(canvas.width, canvas.height);
          ctx.scale(-1, -1);
          ctx.drawImage(
            videoElement,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        } else {
          ctx.translate(canvas.width, canvas.height);
          ctx.scale(-1, -1);
          ctx.drawImage(
            videoElement,
            canvas.width,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }

        requestAnimationFrame(drawVideoOnCanvas);
      }
    };

    drawVideoOnCanvas();

    const newStream = canvas.captureStream();

    outputVideo.srcObject = newStream;
    outputVideo.play();
  };

  useEffect(() => {
    const { fps, resolution } = settings;
    const [width, height] = resolution
      .toString()
      .split('x')
      .map(Number);
    setWidth(width);
    setHeight(height);

    const constraints = {
      video: {
        width: { ideal: width * 2 },
        height: { ideal: height },
        frameRate: { ideal: Number(fps) }
      }
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;

        if (leftCanvasRef.current && rightCanvasRef.current && videoRef.current) {
          initializeStream(videoRef.current, leftCanvasRef.current, leftVideoRef.current, true);
          initializeStream(videoRef.current, rightCanvasRef.current, rightVideoRef.current, false);
        }
      })
      .catch((error) => {
        console.error('Error al acceder a la cámara:', error);
      });

    return () => {
      if (leftVideoRef.current && leftVideoRef.current.srcObject) {
        leftVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (rightVideoRef.current && rightVideoRef.current.srcObject) {
        rightVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (leftMediaRecorder.current && leftMediaRecorder.current.state !== 'inactive') {
        leftMediaRecorder.current.stop();
      }
      if (rightMediaRecorder.current && rightMediaRecorder.current.state !== 'inactive') {
        rightMediaRecorder.current.stop();
      }
    };
  }, [settings]);

  const captureImage = () => {
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;

    const leftImage = leftCanvas.toDataURL('image/png');
    const rightImage = rightCanvas.toDataURL('image/png');

    leftImgPreview.set(leftImage);
    rightImgPreview.set(rightImage);

    const leftBlob = dataURLToBlob(leftImage);
    const rightBlob = dataURLToBlob(rightImage);

    const leftFile = new File([leftBlob], 'left_image.png', { type: 'image/png' });
    const rightFile = new File([rightBlob], 'right_image.png', { type: 'image/png' });

    // if (saveImgs) {
    //   downloadFile(leftImage, 'LEFT', '.png');
    //   downloadFile(rightImage, 'RIGHT', '.png');
    // }

    return [leftFile, rightFile];
  };

  const startRecording = async () => {
    if (
      leftVideoRef.current &&
      leftVideoRef.current.srcObject &&
      rightVideoRef.current &&
      rightVideoRef.current.srcObject
    ) {
      // Configuración para el video izquierdo
      const leftStream = leftVideoRef.current.srcObject;
      leftMediaRecorder.current = new MediaRecorder(leftStream, { mimeType: 'video/webm;codecs=vp9' });
      leftMediaRecorder.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          leftVideoChunks.current.push(event.data);
        }
      };
      leftMediaRecorder.current.start();

      // Configuración para el video derecho
      const rightStream = rightVideoRef.current.srcObject;
      rightMediaRecorder.current = new MediaRecorder(rightStream, { mimeType: 'video/webm;codecs=vp9' });
      rightMediaRecorder.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          rightVideoChunks.current.push(event.data);
        }
      };
      rightMediaRecorder.current.start();

      setIsRecording(true);
    } else {
      console.error('Los videos no están listos para grabar');
    }
  };

  const stopRecording = () => {
    // Detener el MediaRecorder izquierdo
    if (leftMediaRecorder.current && leftMediaRecorder.current.state !== 'inactive') {
      
      leftMediaRecorder.current.onstop = () => {
        const blob = new Blob(leftVideoChunks.current, { 
          type: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 5_000_000
        });
      
        const url = URL.createObjectURL(blob);
        downloadFile(url, "LEFT", ".webm")
      
        // Limpieza
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        leftVideoChunks.current = []; // Clear chunks
      };

      leftMediaRecorder.current.stop();

      // Detener el MediaRecorder derecho
      rightMediaRecorder.current.onstop = () => {
        const blob = new Blob(rightVideoChunks.current, { 
          type: 'video/webm;codecs=vp9',
          videoBitsPerSecond: 5_000_000
        });
      
        const url = URL.createObjectURL(blob);

        downloadFile(url, "RIGHT", ".webm")
      
        // Limpieza
        
        rightVideoChunks.current = []; // Clear chunks
      };

      rightMediaRecorder.current.stop();
    }

    setIsRecording(false);
  };

  const send_images = async () => {
    console.log("send_images",isRecording);
    const [leftImage, rightImage] = captureImage();
    
    const leftFormData = new FormData();
    leftFormData.append("file", leftImage, str_name("LEFT", ".png"))
    send_video_images(leftFormData)

    const rightFormData = new FormData();
    rightFormData.append("file", rightImage, str_name("RIGHT", ".png"))
    send_video_images(rightFormData)
  };

  const process_video = () => {
    const leftFormData = new FormData();
    leftFormData.append('output_filename', str_name('LEFT', ".avi"));
    leftFormData.append('search_pattern', "LEFT");
    leftFormData.append('fps', Number(settings.fps))

    process_video_from_images(leftFormData)
    console.log("entra aqui");
    
  }

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      clearInterval(intervalId);
      process_video()
    } else {
      setIsRecording(true)
      const id = setInterval(send_images, (1000/30));
      setIntervalId(id);
    }
  }

  const str_name = (name, extension) => {
    const currentDate = new Date();
    const dateString =
      currentDate.getDate() +
      '_' +
      (currentDate.getMonth() + 1) +
      '_' +
      currentDate.getFullYear();
    const hourString =
      currentDate.getHours() +
      '_' +
      currentDate.getMinutes() +
      '_' +
      currentDate.getSeconds();

    return dateString + '_' + hourString + '_' + name + extension
  }

  const downloadFile = (url, name, extension) => {
    const filename = str_name(name, extension);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {    
      a.remove();
      window.URL.revokeObjectURL(url);
    }, 100);
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
    <div className={'pt-8 px-8'}>
      <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
      <div className="flex justify-center mb-6">
        <div className="w-1/2 text-center">
          <p className="mb-2 font-bold">LEFT</p>
          <video
            ref={leftVideoRef}
            autoPlay
            className="h-full w-full"
            width={width}
            height={height}
          ></video>
          <canvas ref={leftCanvasRef} className="hidden"></canvas>
        </div>
        <div className="w-1/2 text-center ml-4">
          <p className="mb-2 font-bold">RIGHT</p>
          <video
            ref={rightVideoRef}
            autoPlay
            className="h-full w-full"
            width={width}
            height={height}
          ></video>
          <canvas ref={rightCanvasRef} className="hidden"></canvas>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <Button
          label={isRecording ? 'Detener grabación' : 'Iniciar grabación'}
          onClick={isRecording ? stopRecording : startRecording}
          // onClick={toggleRecording}
        />

        <span>{isRecording ? "Grabando" : "No se graba"}</span>
        <Button label={'Capturar'} onClick={captureImage} />
      </div>
    </div>
  );
};

export default DatasetGeneration;
