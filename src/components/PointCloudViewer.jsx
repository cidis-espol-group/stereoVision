import * as THREE from 'three';
import { useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React, { useState, useEffect } from 'react';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { loadingStore, showVisualStore } from '../shared/apiService';

const createCircularTexture = (color) => {
  const size = 256; // Tamaño de la textura
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  // Dibuja un círculo azul
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  context.fillStyle = `rgb(
    ${Math.floor((Math.random() * 255)-85)},
    ${Math.floor((Math.random() * 255)-200)},
    ${Math.floor((Math.random() * 255)-50)})`;
  context.fill();
  return new THREE.CanvasTexture(canvas);
};

const PointCloud = ({ points, colors, filePath, position = [0, 0, 0], size= 0.001 , shape = 'default', color}) => {
  let geometry = null;

  if (filePath != '' && filePath) {
    geometry = useLoader(PLYLoader, filePath);
  } else {
    geometry = useMemo(() => {
      let positions = points.flat();
      
      // Aplanado y normalización de colores
      let colorsArray = colors.flat().map(c => c / 255);
      

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3)); // Asegúrate de usar 3 componentes

      return geometry;
    }, [points, colors]);
  }

  const circularTexture = useMemo(() => createCircularTexture(color), [color]);
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: size,
      map: shape === 'circle' ? circularTexture : null,
      alphaTest: shape === 'circle' ? 0.5 : 0,
      vertexColors: shape === 'default' && !color? true : false,
    });
  }, [size, shape, color, circularTexture]);

  return (
    <points
      geometry={geometry}
      material={material}
      position={position}
      rotation={[0, 0, 0]}
      scale={[-1, -1, 1]}
    />
  );
};

function PointCloudViewer({ pointCloud, colors, size , filePath , shape, color}) {
  useEffect(()=>{
    if (!pointCloud || pointCloud.length == 0) {
      alert('There are no points to show.');
      showVisualStore.set(false)
      loadingStore.set(false)
      // responseStore.set(null)
      return;
    }
  })

  return (
    <Canvas
      camera={{ position: [0, 0, -100], near: 0.1, far: 100000 }} 
      className='h-full'
      style={{ height: '100vh'}}
    >
      {/* <PointCloud points={pointCloud} colors={colors} size={size} shape={shape} color={color}/> */}
      {pointCloud.map((points, index) => (
        <PointCloud 
          key={index}
          points={points} 
          colors={colors[index]} 
          size={size} 
          shape={shape} 
          color={color}
        />
      ))}
      <OrbitControls 
        enableDamping 
        dampingFactor={0.25} 
      />
    </Canvas>
  );
}

export default PointCloudViewer;
