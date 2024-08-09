import * as THREE from 'three';
import { useMemo } from 'react';
import { Canvas, useLoader} from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React, { useState, useEffect } from 'react';

import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { Points } from '@react-three/drei';



const createCircularTexture = (color) => {
  const size = 256; // Tamaño de la textura
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');

  // Dibuja un círculo azul
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();

  return new THREE.CanvasTexture(canvas);
};

const PointCloud = ({points, colors, filePath, position = [0, 0, 0], size = 1, shape = 'default', color }) => {
  let geometry =null
  if (filePath) {
      geometry = useLoader(PLYLoader, filePath);
  } else {
    geometry = useMemo(() => {
      const pointCount = points.length;

      const positions = new Float32Array(points.pointCloud);
      
      const colorsArray = new Float32Array(points.colors.length === pointCount * 3 ? points.colors : pointCount * 3);
  
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3));
  
      return geometry;
    }, [points, colors]);
  }
  console.log(geometry);
  

  const circularTexture = useMemo(() => createCircularTexture(color), [color]);
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: size,
      map: shape === 'circle' ? circularTexture : null,
      alphaTest: shape === 'circle' ? 0.5 : 0,
      vertexColors: shape === 'default' && !color ? true : false,
      color: shape === 'default' && color ? color : 'white',
    });
  }, [size, shape, color, circularTexture]);

  return (
    <points 
      geometry={geometry} 
      material={material} 
      position={position} 
      rotation={[Math.PI, Math.PI, 0]} // Rotación de 180 grados alrededor del eje X
    >
      <bufferGeometry attach="geometry" {...geometry} />
    </points>
  );
};

function PointCloudViewer({ pointCloud, colors }) {


  const [cloudData, setCloudData] = useState({ pointCloud: null, colors: null });

  useEffect(() => {
    if (pointCloud && colors) {
      setCloudData({ pointCloud, colors });
    }
  }, [pointCloud, colors]);

  return (
    <Canvas 
      camera={{ position: [0, 0, -1000], near: 0.1, far: 100000 }} // Ajusta la posición inicial y los planos de recorte de la cámara
      style={{  height: '100vh' }}
    >
      
      {/* <PointCloud filePath='densaDEMO.ply' /> */}
      <PointCloud filePath='NOdensaDEMO.ply' size={20} shape='circle' color='green'/>
      {/* <PointCloudViewer points={pointCloud} size={10} shape='circle' color='blue' /> */}
      <PointCloud points={pointCloud} colors={colors} size={20} shape='circle'/>
      <OrbitControls enableDamping dampingFactor={0.25} />
    </Canvas>
  );
}

export default PointCloudViewer;