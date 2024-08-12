import * as THREE from 'three';
import { useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React, { useState, useEffect } from 'react';

import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { Points } from '@react-three/drei';

const PointCloud = ({ points, colors, filePath, position = [0, 0, 0], size = 1 }) => {
  let geometry = null;

  if (filePath) {
    geometry = useLoader(PLYLoader, filePath);
    console.log(geometry);
  } else {
    geometry = useMemo(() => {
      let positions = points.flat();
      console.log(positions);
      
      // Aplanado y normalización de colores
      let colorsArray = colors.flat().map(c => c / 255);
      

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsArray, 3)); // Asegúrate de usar 3 componentes

      return geometry;
    }, [points, colors]);
  }

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: size,
      vertexColors: true, // Asegúrate de que vertexColors esté habilitado
      // color: 'red', // Descomenta esto para probar con un color sólido
    });
  }, [size]);

  return (
    <points
      geometry={geometry}
      material={material}
      position={position}
      rotation={[0, 0, 0]}
      scale={[1, 1, -1]}
    />
  );
};

function PointCloudViewer({ pointCloud, colors }) {
  const [cloudData, setCloudData] = useState({ pointCloud: null, colors: null });

  useEffect(() => {
    if (pointCloud && colors) {
      setCloudData({ pointCloud, colors });
    }
  }, [pointCloud, colors]);

  
  let points_res = pointCloud['pointCloud'];
  let color_res = pointCloud['colors'];

  return (
    <Canvas
      camera={{ position: [0, 0, -2500], near: 0.1, far: 100000 }} // Rotación 180 grados en Z
      style={{ height: '100vh' }}
    >
      <PointCloud points={points_res} colors={color_res} size={0.001} />
      <OrbitControls 
        enableDamping 
        dampingFactor={0.25} 
      />
    </Canvas>
  );
}

export default PointCloudViewer;
