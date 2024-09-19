import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';

const GridCube = ({ size }) => {
    const halfSize = size / 2;
    const divisions = size / (size/10);
  
    // Refs para los planos
    const frontPlane = useRef();
    const backPlane = useRef();
    const leftPlane = useRef();
    const rightPlane = useRef();
    const topPlane = useRef();
    const bottomPlane = useRef();
  
    // En cada frame, verificar la dirección de la cámara y actualizar la visibilidad
    useFrame(({ camera }) => {
      // Normalizamos la dirección de la cámara
      const cameraDirection = camera.getWorldDirection(new THREE.Vector3()).normalize();
  
      // Lógica para determinar qué planos deben ser visibles
      const showFront = cameraDirection.z < 0;  // Mostrar el plano frontal cuando la cámara mira hacia +Z
      const showBack = cameraDirection.z > 0;   // Mostrar el plano posterior cuando la cámara mira hacia -Z
      
      // Mostrar el plano derecho cuando se mira desde la izquierda (x negativo)
      const showRight = cameraDirection.x > 0;
      // Mostrar el plano izquierdo cuando se mira desde la derecha (x positivo)
      const showLeft = cameraDirection.x < 0;
  
      // Mostrar la base si la cámara está mirando hacia abajo (mirando el plano inferior)
      const showBottom = cameraDirection.y > 0;
      // Mostrar el techo si la cámara está mirando hacia arriba
      const showTop = cameraDirection.y < 0;
  
      // Actualizamos la visibilidad de los planos
      if (frontPlane.current) frontPlane.current.visible = showFront;
      if (backPlane.current) backPlane.current.visible = showBack;
      if (leftPlane.current) leftPlane.current.visible = showLeft;
      if (rightPlane.current) rightPlane.current.visible = showRight;
      if (topPlane.current) topPlane.current.visible = showTop;
      if (bottomPlane.current) bottomPlane.current.visible = showBottom;
    });
  
    return (
      <group>
        {/* Plano XY (frontal) - Centrado en el origen */}
        <gridHelper
          ref={frontPlane}
          args={[size, divisions]}
          position={[0, 0, 0]}  
          rotation={[Math.PI / 2, Math.PI / 2, 0]}
        />
  
        {/* Plano XY (posterior) */}
        <gridHelper
          ref={backPlane}
          args={[size, divisions]}
          position={[0, 0, size]}  
          rotation={[Math.PI / 2, Math.PI / 2, 0]}
        />
  
        {/* Plano YZ (lateral derecho) */}
        <gridHelper
          ref={rightPlane}
          args={[size, divisions]}
          position={[halfSize, 0, halfSize]}  
          rotation={[0, 0, Math.PI / 2]}
        />
  
        {/* Plano inverso de YZ (lateral izquierdo) */}
        <gridHelper
          ref={leftPlane}
          args={[size, divisions]}
          position={[-halfSize, 0, halfSize]}  
          rotation={[Math.PI / 2, 0, Math.PI / 2]}
        />
  
        {/* Plano XZ (base) */}
        <gridHelper
          ref={bottomPlane}
          args={[size, divisions]}
          position={[0, halfSize, halfSize]}  
        />
  
        {/* Plano XZ (techo) */}
        <gridHelper
          ref={topPlane}
          args={[size, divisions]}
          position={[0, -halfSize, halfSize]}  
        />
      </group>
    );
  };

export default GridCube;