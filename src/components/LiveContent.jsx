import React, { useEffect, useRef } from 'react';

const LiveContent = ({ settings }) => {
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);

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
    console.log(constraints);
    
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

  return (
    <div className="p-8">
      <div className="flex justify-center mb-6">
        <div className="w-1/2 text-center">
          <p className="mb-2 font-bold">LEFT</p>
          <video ref={leftVideoRef} autoPlay className="bg-black w-full h-64"></video>
        </div>
        <div className="w-1/2 text-center ml-4">
          <p className="mb-2 font-bold">RIGHT</p>
          <video ref={rightVideoRef} autoPlay className="bg-black w-full h-64"></video>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <button className="mt-4 bg-gray-300 text-black w-52 px-4 py-2 rounded-full">
          Capture
        </button>
      </div>
    </div>
  );
};

export default LiveContent;


/* import React, { useEffect, useRef } from 'react';

const LiveContent = () => {
  const leftVideoRef = useRef(null);
  const rightVideoRef = useRef(null);

  useEffect(() => {
    const constraints = {
      video: {
        deviceId: { ideal: '0' }, // Debes reemplazar 'stereo-camera-id' con el ID real de tu cámara
        width: { ideal: 1280 },
        height: { ideal: 720 },
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
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-center mb-6">
        <div className="w-1/2 text-center">
          <p className="mb-2 font-bold">LEFT</p>
          <video ref={leftVideoRef} autoPlay className="bg-black w-full h-64"></video>
        </div>
        <div className="w-1/2 text-center ml-4">
          <p className="mb-2 font-bold">RIGHT</p>
          <video ref={rightVideoRef} autoPlay className="bg-black w-full h-64"></video>
        </div>
      </div>
      <div className="flex justify-center mb-6">
        <button className="mt-4 bg-gray-300 text-black w-52 px-4 py-2 rounded-full">
          Capture
        </button>
      </div>
    </div>
  );
};

export default LiveContent; */

