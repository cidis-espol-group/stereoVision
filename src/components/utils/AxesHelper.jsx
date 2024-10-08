import React, { useRef, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';


const AxesHelper = ({max_x, max_y, max_z, separation, fontSize}) => {
    // Refs para las etiquetas
  const xRightLabel = useRef();
  const yRightLabel = useRef();
  const zRightLabel = useRef();
  const xLeftLabel = useRef();
  const yLeftLabel = useRef();
  const zLeftLabel = useRef();

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
    if (xLeftLabel.current) xLeftLabel.current.lookAt(camera.position);

    if (yRightLabel.current) yRightLabel.current.lookAt(camera.position);
    if (yLeftLabel.current) yLeftLabel.current.lookAt(camera.position);

    if (zRightLabel.current) zRightLabel.current.lookAt(camera.position);
    if (zLeftLabel.current) zLeftLabel.current.lookAt(camera.position);
  });

  return (
    <group>
      <Text ref={xLeftLabel} position={[max_x / 2 + separation, max_y / 2, max_z / 2]} fontSize={fontSize} color="red">
        X
      </Text> 


    </group>
    
  )
};

export default AxesHelper;