import React, { useEffect, useRef, useState } from 'react';
import { isRoiStore, loadingStore, sendPostRequest, showVisualStore } from "../shared/apiService";
import Button from './utils/Button';
import { leftImgPreview, rightImgPreview } from '../shared/imagesStore';
import { useStore } from '@nanostores/react';
import { scrollToSection } from '../shared/tabStore';

const DatasetGeneration = ({ module, settings }) => {
  const videoRef = useRef(null);
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);

  const leftMediaRecorder = useRef(null);
  const rightMediaRecorder = useRef(null);
  const [leftVideoChunks, setLeftVideoChunks] = useState([]);
  const [rightVideoChunks, setRightVideoChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  const loading = useStore(loadingStore);

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

    if (parameters.saveImgs) {
      downloadImage(leftImage, 'LEFT', '.png');
      downloadImage(rightImage, 'RIGHT', '.png');
    }

    return leftFile, rightFile;
  };

  const startRecording = () => {
    if (
      leftVideoRef.current &&
      leftVideoRef.current.srcObject &&
      rightVideoRef.current &&
      rightVideoRef.current.srcObject
    ) {
      // Configuración para el video izquierdo
      const leftStream = leftVideoRef.current.srcObject;
      leftMediaRecorder.current = new MediaRecorder(leftStream, { mimeType: 'video/mp4' });
      leftMediaRecorder.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setLeftVideoChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };
      leftMediaRecorder.current.start();

      // Configuración para el video derecho
      const rightStream = rightVideoRef.current.srcObject;
      rightMediaRecorder.current = new MediaRecorder(rightStream, { mimeType: 'video/mp4' });
      rightMediaRecorder.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          setRightVideoChunks((prevChunks) => [...prevChunks, event.data]);
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
      leftMediaRecorder.current.stop();
      leftMediaRecorder.current.onstop = () => {
        const blob = new Blob(leftVideoChunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);

        // Descargar el video grabado
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = str_name('LEFT', '.mp4');
        document.body.appendChild(a);
        a.click();

        // Limpieza
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        setLeftVideoChunks([]);
      };
    }

    // Detener el MediaRecorder derecho
    if (rightMediaRecorder.current && rightMediaRecorder.current.state !== 'inactive') {
      rightMediaRecorder.current.stop();
      rightMediaRecorder.current.onstop = () => {
        const blob = new Blob(rightVideoChunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);

        // Descargar el video grabado
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = str_name('RIGHT', '.mp4');;
        document.body.appendChild(a);
        a.click();

        // Limpieza
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 100);
        setRightVideoChunks([]);
      };
    }

    setIsRecording(false);
  };

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
      ':' +
      currentDate.getMinutes() +
      ':' +
      currentDate.getSeconds();

    return dateString + '_' + hourString + '_' + name + extension
  }

  const downloadImage = (url, name, extension) => {
    const filename = str_name(name, extension)
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
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

  const handleCheckboxChange = (name, isChecked) => {
    setParameters((prevState) => ({
      ...prevState,
      [name]: isChecked
    }));
  };

  return (
    <div className={'pt-8 px-8'}>
      <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
      {/* <div
        className={`flex ${
          module === 'height-estimation-face' ? 'justify-end' : 'justify-between'
        } content-center mb-8`}
      >
        {module === 'height-estimation-face' ? (
          <>
            <Checkbox
              className={``}
              label="Save Images"
              checked={parameters.saveImgs}
              onChange={(isChecked) => handleCheckboxChange('saveImgs', isChecked)}
            />
          </>
        ) : (
          <>
            <Dropdown
              label="Method"
              options={['SGBM', 'WLS-SGBM', 'RAFT', 'SELECTIVE']}
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            />
            <Checkbox
              label="Use max disparity"
              checked={parameters.useMaxDisp}
              onChange={(isChecked) => handleCheckboxChange('useMaxDisp', isChecked)}
            />
            <Checkbox
              label="Normalize"
              checked={parameters.normalize}
              onChange={(isChecked) => handleCheckboxChange('normalize', isChecked)}
            />
            <Checkbox
              label="Save Images"
              checked={parameters.saveImgs}
              onChange={(isChecked) => handleCheckboxChange('saveImgs', isChecked)}
            />
            <ToggleButton
              leftLabel={'Keypoints'}
              rightLabel={'ROI'}
              checked={parameters.useRoi}
              onChange={(isChecked) => handleCheckboxChange('useRoi', isChecked)}
              className={module !== 'no-dense-point-cloud' ? 'hidden' : ''}
            />
          </>
        )}
      </div> */}

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
          disabled={loading}
        />
        <Button label={'Capturar'} onClick={captureImage} disabled={loading} />
      </div>
    </div>
  );
};

export default DatasetGeneration;
