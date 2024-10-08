import React, {useRef} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Line, Text } from '@react-three/drei';
import { visualizationConfigStore } from '../shared/imagesStore';
import { useStore } from '@nanostores/react';
import GridCube from './utils/GridCube';
import { get_color } from "../shared/utils";
// import { data, visualizationConfig } from "../shared/json";



function renderPoints(points, color, size=2) {
  return points.map((point, index) => (
    <mesh key={index} position={point}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  ));
}

function renderCentroid(centroid, color, size=3) {
  return (
    <mesh position={centroid}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color}/>
    </mesh>
  );
}

function connectPoints(points, color, sort=false, lineWidth=2) {
  const sortedPoints = sort ? points.sort((a, b) => b[0] - a[0]): points;
  return (
    <Line
      points={sortedPoints}
      color={color}
      lineWidth={lineWidth}
    />
  );
}


function renderArrowFromNormal(startPoint, normal, color) {
  const direction = new THREE.Vector3(...normal).normalize();
  const length = 60;

  return (
    <primitive
      object={new THREE.ArrowHelper(direction, new THREE.Vector3(...startPoint), length, color)}
    />
  );
}

class Person {
  constructor(personData, color, visualizationConfig) {
    this.points = personData.points;
    this.centroid = personData.centroid;
    this.pointsTronco = personData.points_tronco;
    this.centroidToNose = personData.is_centroid_to_nariz
    this.pointsHead = personData.points_head;
    this.troncoNormal = personData.tronco_normal;
    this.headNormal = personData.head_normal;
    this.color = color;
    this.config = visualizationConfig;
  }
  
  renderPlaneFromPoints(points, fillColor) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(points.flat());

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex([0, 2, 3, 1, 0, 3]); 

    return (
      <group>
        <mesh geometry={geometry}>
          <meshBasicMaterial color={fillColor} side={THREE.DoubleSide} transparent opacity={0.5} />
          <lineSegments>
          <edgesGeometry attach="geometry" args={[geometry]} />
          <lineBasicMaterial color={this.color} />
        </lineSegments>
        </mesh>
      </group>
    );
  }

  renderPlaneFromCentroid(centerPoint, normal, h=45, w=30) {
    const planeGeometry = new THREE.PlaneGeometry(w, h);

    const normalVector = new THREE.Vector3(...normal);
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normalVector.normalize());

    return (
      <mesh geometry={planeGeometry} position={centerPoint} quaternion={quaternion}>
        <meshBasicMaterial color={this.color} side={THREE.DoubleSide} transparent opacity={0.5} />
        <lineSegments>
          <edgesGeometry attach="geometry" args={[planeGeometry]} />
          <lineBasicMaterial color={this.color} />
        </lineSegments>
      </mesh>
    );
  }

  renderArrowFromTwoPoints(startPoint, finishPoint) {
    const direction = new THREE.Vector3(
      finishPoint[0] - startPoint[0],
      finishPoint[1] - startPoint[1],
      finishPoint[2] - startPoint[2]
    ).normalize();
    const origin = new THREE.Vector3(...startPoint);
    const length = new THREE.Vector3(
      finishPoint[0] - startPoint[0],
      finishPoint[1] - startPoint[1],
      finishPoint[2] - startPoint[2]
    ).length();
  
    return (
      <>
        <Line
          points={[startPoint, finishPoint]}
          color={'red'}
          lineWidth={2}
        />
        <primitive
          object={new THREE.ArrowHelper(direction, origin, length, 'blue')}
        />
      </>
    );
  }

  headCentroid(centroid, nose){
    return [centroid[0], nose[1], centroid[2]]
  }

  render() {
    return (
      <>
        {this.config.showKeypoints &&
          renderPoints(this.points, this.color)} {/* Renderiza los keypoints si showKeypoints es true */}
    
        {this.config.showPersonCentroid &&
          renderCentroid(this.centroid, this.color)} {/* Renderiza el centroide si showPersonCentroid es true */}
    
        {this.config.showChestPlane &&
          this.renderPlaneFromPoints(this.pointsTronco, this.color)} {/* Renderiza el plano del tronco si showChestPlane es true */}
    
        {this.config.showNormalVector &&
          renderArrowFromNormal(this.centroid, this.troncoNormal, this.color)} {/* Renderiza la normal del tronco si showNormalVector es true */}
    
        {this.centroidToNose
          ? (
            <>
              {this.config.ShowHeadCentroid &&
                renderCentroid(
                  this.headCentroid(this.centroid, this.pointsHead[0]),
                  this.color
                )} {/* Sube el centroide de la persona a la nariz */}
    
              {this.config.ShowHeadPlane &&
                this.renderPlaneFromCentroid(
                  this.headCentroid(this.centroid, this.pointsHead[0]),
                  this.headNormal,
                  25,
                  30
                )} {/* Renderiza un plano en la cabeza de la persona */}
    
              {this.config.ShowHeadNormalVector &&
                renderArrowFromNormal(
                  this.headCentroid(this.centroid, this.pointsHead[0]),
                  this.headNormal,
                  this.color
                )} {/* Renderiza la normal desde el centroide elegido */}
            </>
          )
          : (
            <>
              {this.config.ShowHeadCentroid &&
                renderCentroid(this.pointsHead[0], this.color)} {/* Pone el centroide en la nariz */}
    
              {this.config.ShowHeadPlane &&
                this.renderPlaneFromCentroid(
                  this.pointsHead[0],
                  this.headNormal,
                  25,
                  30
                )} {/* Renderiza un plano en la cabeza de la persona */}
    
              {this.config.ShowHeadNormalVector &&
                renderArrowFromNormal(this.pointsHead[0], this.headNormal, this.color)} {/* Renderiza la normal desde el centroide elegido */}
            </>
          )
        }
      </>
    )
    
  }
}

class Feature {
  constructor(data, visualizationConfig) {
    this.persons = Object.values(data.persons).map(
      (personData, index) => new Person(personData, get_color(index), visualizationConfig) 
    );
    this.data = data
    this.centroids = this.persons.map((person) => person.centroid)
    this.bodyColor = 'blue'
    this.lineColor = 'red'
    this.faceColor = 'green'
    this.config = visualizationConfig
  }

  

  render() {
    return (
      <>
        {this.persons.map((person, index) => <group key={index}>{person.render()}</group>)} {/* Renderiza las personas */}
        {this.config.ShowGroupCentroid && renderCentroid(this.data.centroid, this.bodyColor, 5)} {/* Renderiza el centroide del grupo */}
        {this.config.ShowGroupNormalVector && renderArrowFromNormal(this.data.centroid, this.data.avg_normal, this.bodyColor)} {/* Renderiza la normal del grupo */}
        
        {this.config.ShowGroupLine && connectPoints(this.centroids, this.lineColor, true, 3)} {/* Renderiza la linea de la forma del grupo */}
        
        {this.config.ShowGroupHeadCentroid && renderCentroid(this.data.centroid_head, this.faceColor, 5)} {/* Renderiza el centroide de la cabezas del grupo */}
        {this.config.ShowGroupHeadNormalVector && renderArrowFromNormal(this.data.centroid_head, this.data.avg_normal_head, this.faceColor)} {/* Renderiza la normal de las cabezas del grupo */}
      </>
    )

  }
}


const AxesHelperWithLabels = ({ size }) => {
  const halfSize = size / 2;
  
  // Refs para las etiquetas
  const xLabelRef = useRef();
  const yLabelRef = useRef();
  const zLabelRef = useRef();

  // En cada frame, orienta las etiquetas hacia la cámara
  useFrame(({ camera }) => {
    if (xLabelRef.current) {
      xLabelRef.current.lookAt(camera.position);
    }
    if (yLabelRef.current) {
      yLabelRef.current.lookAt(camera.position);
    }
    if (zLabelRef.current) {
      zLabelRef.current.lookAt(camera.position);
    }
  });

  return (
    <group>
      {/* AxesHelper estándar */}
      <axesHelper args={[size]} />

      {/* Etiquetas para cada eje que siempre se orientan hacia la cámara */}
      <Text ref={xLabelRef} position={[size + 2, 0, 0]} fontSize={4} color="red">
        X
      </Text> {/* Etiqueta para el eje X */}

      <Text ref={yLabelRef} position={[0, size + 2, 0]} fontSize={4} color="green">
        Y
      </Text> {/* Etiqueta para el eje Y */}

      <Text ref={zLabelRef} position={[0, 0, size + 2 ]} fontSize={4} color="blue">
        Z
      </Text> {/* Etiqueta para el eje Z */}
    </group>
  );
};

const Features = ({features, max_coords}) => {
  const visualizationConfig = useStore(visualizationConfigStore);
  const feature = new Feature(features, visualizationConfig);

  return (
    <Canvas 
      camera={{ position: [0, 0, -100], near: 0.1, far: 100000, fov: 75 }}
      className='h-full w-full '
      style={{ height: '100vh'}}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <group scale={[-1, -1, 1]}>
        {feature.render()}
      </group>

      {/* <axesHelper args={[25]} /> */}
      {/* <AxesHelperWithLabels size={25} /> */}
      <GridCube limits={max_coords}/>

      <OrbitControls 
        enableDamping 
        dampingFactor={0.25} 
        rotateSpeed={0.5}
        enablePan={true}
        enableZoom={true}
      />

    </Canvas>
  );
}

export default Features;