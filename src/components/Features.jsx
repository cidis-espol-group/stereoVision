import React, {useRef} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Line } from '@react-three/drei';
import { data } from "../shared/json";

function generateRandomColor() {
  const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
  return `#${randomColor.getHexString()}`;
}

function renderPoints(points) {
  return points.map((point, index) => (
    <mesh key={index} position={point}>
      <sphereGeometry args={[2, 16, 16]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  ));
}

function renderCentroid(centroid, color) {
  return (
    <mesh position={centroid}>
      <sphereGeometry args={[3, 16, 16]} />
      <meshStandardMaterial color={color}/>
    </mesh>
  );
}

function connectPoints(points, color, sort) {
  const sortedPoints = sort ? points.sort((a, b) => b[0] - a[0]): points;
  return (
    <Line
      points={sortedPoints}
      color={'blue'}
      lineWidth={2}
    />
  );
}

class Person {
  constructor(personData, color) {
    this.points = personData.points;
    this.centroid = personData.centroid;
    this.pointsTronco = personData.points_tronco;
    this.centroidToNose = personData.is_centroid_to_nariz
    this.pointsHead = personData.points_head;
    this.troncoNormal = personData.tronco_normal;
    this.headNormal = personData.head_normal;
    this.color = color;
  }

  renderPlaneFromPoints(points, fillColor) {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(points.flat());

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex([0, 2, 3, 1, 0, 3]); 

    return (
      <group>
        {/* Relleno del plano */}
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

  renderArrowFromNormal(startPoint, normal) {
    const direction = new THREE.Vector3(...normal).normalize();
    const length = 60;
    const color = 'red';

    return (
      <primitive
        object={new THREE.ArrowHelper(direction, new THREE.Vector3(...startPoint), length, color)}
      />
    );
  }

  headCentroid(centroid, nose){
    return [centroid[0], nose[1], centroid[2]]
  }

  render() {
    return (
      <>
      {/* {this.renderFacePlane(this.centroid, this.headNormal)} */}
        {/* {this.renderFacePlane(this.headCentroid(this.centroid, this.pointsHead[0]), this.headNormal)} */}
        {/* {this.renderLine(this.centroid, this.troncoNormal, 10)} */}
        {/* {this.renderArrow(this.headCentroid(this.centroid, this.pointsHead[0]), this.headNormal)} */}
        {/* {renderCentroid(this.headCentroid(this.centroid, this.pointsHead[0]))} */}
        {/* {this.renderLine(this.pointsHead[0], this.headNormal, 3)} */}

        {renderPoints(this.points)} {/* Renderiza los keypoints */}
        {renderCentroid(this.centroid, 'red')} {/* Renderiza el centroide de la persona */}
        {this.renderPlaneFromPoints(this.pointsTronco, this.color)}  {/* Renderiza el plano del tronco */}        
        {this.renderArrowFromNormal(this.centroid, this.troncoNormal)} {/* Renderiza la flecha del tronco */}
        {this.centroidToNose /* Renderiza la el centroide de la cabeza */
          ? (
            <>
              {renderCentroid(this.headCentroid(this.centroid, this.pointsHead[0]), 'red')} {/* Sube el centroide de la persona a la nariz */}
              {this.renderArrowFromNormal(this.headCentroid(this.centroid, this.pointsHead[0]), this.headNormal)} 
            </>
          )
          : (
            <>
              {renderCentroid(this.pointsHead[0], 'red')} {/* Pone el centroide en la nariz */}
              {this.renderArrowFromNormal(this.pointsHead[0], this.headNormal)}
            </>
          )
        }
      </>
    );
  }
}

class Feature {
  constructor(data) {
    this.persons = Object.values(data.persons).map(
      (personData) => new Person(personData, generateRandomColor()) 
    );
    this.centroids = this.persons.map((person) => person.centroid)
  }

  render() {
    return (
      <>
        {this.persons.map((person, index) => <group key={index}>{person.render()}</group>)} {/* Renderiza las personas */}
        {renderCentroid(data.centroid, 'blue')} {/* Renderiza el centroide del grupo */}
        {connectPoints(this.centroids, 'blue', true)} {/* Renderiza la linea de la forma del grupo */}
      </>
    )

  }
}

export default function App() {
  const feature = new Feature(data);

  return (
    <Canvas 
      camera={{ position: [0, 0, 2500], near: 0.1, far: 100000, fov: 75 }}
      className='h-full w-full '
      style={{ height: '100vh'}}
    >
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <group scale={[-1, -1, 1]}>
        {feature.render()}
      </group>

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