import React, { useEffect, useRef, useState } from 'react';

const LiveContent = ({ settings }) => {
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
        width: { ideal: width },
        height: { ideal: height },
        frameRate: { ideal: Number(fps) },
      },
    };
    
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length >= 2) {
          leftVideoRef.current.srcObject = new MediaStream([videoTracks[0]]);
          rightVideoRef.current.srcObject = new MediaStream([videoTracks[1]]);
        } else {
          console.error('La cámara estereoscópica no proporciona dos transmisiones de video');
          leftVideoRef.current.srcObject = stream;
          rightVideoRef.current.srcObject = stream;
        }
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
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    const leftVideo = leftVideoRef.current;
    const rightVideo = rightVideoRef.current;

    // Configura el canvas con las dimensiones del video
    leftCanvas.width = leftVideo.videoWidth;
    leftCanvas.height = leftVideo.videoHeight;
    rightCanvas.width = rightVideo.videoWidth;
    rightCanvas.height = rightVideo.videoHeight;

    // Dibuja los fotogramas actuales del video en el canvas
    leftCanvas.getContext('2d').drawImage(leftVideo, 0, 0, leftCanvas.width, leftCanvas.height);
    rightCanvas.getContext('2d').drawImage(rightVideo, 0, 0, rightCanvas.width, rightCanvas.height);

    // Convierte el canvas a una imagen en base64
    const leftImage = leftCanvas.toDataURL('image/png');
    const rightImage = rightCanvas.toDataURL('image/png');

    // Almacena las imágenes capturadas en el estado
    setCapturedImages({
      left: leftImage,
      right: rightImage,
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-center mb-6">
        <div className="w-1/2 text-center">
          <p className="mb-2 font-bold">LEFT</p>
          <video ref={leftVideoRef} autoPlay className="bg-black w-full h-64"></video>
          <canvas ref={leftCanvasRef} className="hidden"></canvas>
        </div>
        <div className="w-1/2 text-center ml-4">
          <p className="mb-2 font-bold">RIGHT</p>
          <video ref={rightVideoRef} autoPlay className="bg-black w-full h-64"></video>
          <canvas ref={rightCanvasRef} className="hidden"></canvas>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <button
          onClick={captureImage}
          className="mt-4 bg-gray-300 text-black w-52 px-4 py-2 rounded-full"
        >
          Capture
        </button>
      </div>

      {capturedImages.left && capturedImages.right && (
        <div className="flex justify-center mt-6">
          <div className="w-1/2 text-center">
            <p className="mb-2 font-bold">Captured LEFT Image</p>
            <img src={capturedImages.left} alt="Captured Left" className="w-full h-auto" />
          </div>
          <div className="w-1/2 text-center ml-4">
            <p className="mb-2 font-bold">Captured RIGHT Image</p>
            <img src={capturedImages.right} alt="Captured Right" className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveContent;
