import * as THREE from 'three';
import { useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import React, { useState, useEffect } from 'react';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { loadingStore, showVisualStore } from '../shared/apiService';
import { responseStore } from '../shared/response';

const PointCloud = ({ points, colors, filePath, position = [0, 0, 0], size }) => {
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
      scale={[-1, -1, 1]}
    />
  );
};

function PointCloudViewer({ pointCloud, colors, size = 0.001, filePath }) {
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
      camera={{ position: [0, 0, -2500], near: 0.1, far: 100000 }} 
      className='h-full'
      style={{ height: '100vh'}}
    >
      <PointCloud points={pointCloud} colors={colors} size={size} />
      <OrbitControls 
        enableDamping 
        dampingFactor={0.25} 
      />
    </Canvas>
  );
}

export default PointCloudViewer;
