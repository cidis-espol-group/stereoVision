import React, { useRef, forwardRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const CustomGridHelper = forwardRef(({ sizeX, sizeY, divisionsX, divisionsY, color, position, rotation }, ref) => {
  // Crear la geometría de la cuadrícula manualmente
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  // Crear las líneas en el eje X (paralelas a Y)
  for (let i = 0; i <= divisionsY; i++) {
    const y = (i / divisionsY) * sizeY - sizeY / 2;
    vertices.push(-sizeX / 2, y, 0, sizeX / 2, y, 0);
  }

  // Crear las líneas en el eje Y (paralelas a X)
  for (let i = 0; i <= divisionsX; i++) {
    const x = (i / divisionsX) * sizeX - sizeX / 2;
    vertices.push(x, -sizeY / 2, 0, x, sizeY / 2, 0);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  return (
    <lineSegments ref={ref} geometry={geometry} position={position} rotation={rotation}>
      <lineBasicMaterial color={color} />
    </lineSegments>
  );
});

const GridCube = ({ limits }) => {
  console.log(limits);
  
  const separation = 20
  const max_x = limits[0]*2+separation
  const max_y = limits[1]*2+separation
  const max_z = limits[2]+separation
  const divisions = 10;
  const gridColor = '#cccccc'; // Definir un color gris claro
  const fontSize = 20

  // Refs para los planos
  const frontPlane = useRef();
  const backPlane = useRef();
  const leftPlane = useRef();
  const rightPlane = useRef();
  const topPlane = useRef();
  const bottomPlane = useRef();

  // Refs para las etiquetas
  const xRightLabel = useRef();
  const yRightLabel = useRef();
  const zRightLabel = useRef();
  const xLeftLabel = useRef();
  const yLeftLabel = useRef();
  const zLeftLabel = useRef();

  // En cada frame, verifica la dirección de la cámara y actualiza la visibilidad
  useFrame(({ camera }) => {
    const cameraDirection = camera.getWorldDirection(new THREE.Vector3()).normalize();

    const showFront = cameraDirection.z < 0;  // Muestra el plano frontal cuando la cámara mira hacia -Z
    const showBack = cameraDirection.z > 0;   // Muestra el plano posterior cuando la cámara mira hacia +Z
    
    const showRight = cameraDirection.x > 0; // Muestra el plano derecho cuando se mira desde la izquierda (x positivo)
    const showLeft = cameraDirection.x < 0; // Muestra el plano izquierdo cuando se mira desde la derecha (x negativo)

    const showBottom = cameraDirection.y < 0; // Muestra la base si la cámara está mirando hacia abajo (mirando el plano inferior)
    const showTop = cameraDirection.y > 0; // Muestra el techo si la cámara está mirando hacia arriba

    if (frontPlane.current) frontPlane.current.visible = showFront;
    if (backPlane.current) backPlane.current.visible = showBack;
    if (leftPlane.current) leftPlane.current.visible = showLeft;
    if (rightPlane.current) rightPlane.current.visible = showRight;
    if (topPlane.current) topPlane.current.visible = showTop;
    if (bottomPlane.current) bottomPlane.current.visible = showBottom;

    if (xRightLabel.current) xRightLabel.current.lookAt(camera.position);
    if (yRightLabel.current) yRightLabel.current.lookAt(camera.position);
    if (zRightLabel.current) zRightLabel.current.lookAt(camera.position);
    if (xLeftLabel.current) xLeftLabel.current.lookAt(camera.position);
    if (yLeftLabel.current) yLeftLabel.current.lookAt(camera.position);
    if (zLeftLabel.current) zLeftLabel.current.lookAt(camera.position);
  });

  return (
    <group>
      {/* Plano XY (frontal) - Centrado en el origen */}
      <CustomGridHelper
        ref={frontPlane}
        sizeX={max_x}
        sizeY={max_y}
        divisionsX={divisions}
        divisionsY={divisions}
        color={gridColor}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      />

      {/* Plano XY (posterior) */}
      <CustomGridHelper
        ref={backPlane}
        sizeX={max_x}
        sizeY={max_y}
        divisionsX={divisions}
        divisionsY={divisions}
        color={gridColor}
        position={[0, 0, max_z]}
        rotation={[0, 0 / 2, 0]}
      />

      {/* Plano YZ (lateral derecho) */}
      <CustomGridHelper
        ref={rightPlane}
        sizeX={max_z}
        sizeY={max_y}
        divisionsX={divisions}
        divisionsY={divisions}
        color={gridColor}
        position={[max_x / 2, 0, max_z / 2]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Plano YZ (lateral izquierdo) */}
      <CustomGridHelper
        ref={leftPlane}
        sizeX={max_z}
        sizeY={max_y}
        divisionsX={divisions}
        divisionsY={divisions}
        color={gridColor}
        position={[-max_x / 2, 0, max_z / 2]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Plano XZ (base) */}
      <CustomGridHelper
        ref={bottomPlane}
        sizeX={max_x}
        sizeY={max_z}
        divisionsX={divisions}
        divisionsY={divisions}
        color={gridColor}
        position={[0, -max_y / 2, max_z / 2]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Plano XZ (techo) */}
      <CustomGridHelper
        ref={topPlane}
        sizeX={max_x}
        sizeY={max_z}
        divisionsX={divisions}
        divisionsY={divisions}
        color={gridColor}
        position={[0, max_y / 2, max_z / 2]}
        rotation={[Math.PI / 2, 0, 0]}
      />

      {/* Etiqueta para el eje X (Izquierda)*/}
      {/* <Text ref={xLeftLabel} position={[max_x / 2 + separation, max_y / 2, max_z / 2]} fontSize={fontSize} color="red">
        X
      </Text>  */}

      {/* Etiqueta para el eje X (Derecha)*/}
      <Text ref={xRightLabel} position={[0, max_y / 2 + separation, max_z ]} fontSize={fontSize} color="red">
        X
      </Text> 

      {/* Etiqueta para el eje Y */}
      <Text ref={yRightLabel} position={[- max_x / 2 - separation, 0, max_z]} fontSize={fontSize} color="green">
        Y
      </Text> 

      {/* Etiqueta para el eje Z */}
      {/* <Text ref={zRightLabel} position={[max_x / 2 + separation, -max_y / 2, max_z / 2]} fontSize={fontSize} color="blue">
        Z
      </Text>  */}

      <Text ref={zRightLabel} position={[-max_x / 2 - separation, -max_y / 2, max_z / 2]} fontSize={fontSize} color="blue">
        Z
      </Text> 
    </group>
  );
};

export default GridCube;
