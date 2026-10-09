'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import { AquaCorePlatform } from './AquaCorePlatform';

const CameraRig: React.FC = () => {
  const { params } = useSimulation();
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);

  // Smoothly move camera based on selected active stage
  useEffect(() => {
    if (!controlsRef.current) return;

    let targetCamPos: [number, number, number] = [0, 2.5, 9.5];
    let targetLookAt: [number, number, number] = [0, -0.2, 0];

    switch (params.activeStage) {
      case 'inlet':
        targetCamPos = [-5.2, 1.8, 4.5];
        targetLookAt = [-4.5, 0.2, 0];
        break;
      case 'pretreatment':
        targetCamPos = [-2.8, 1.5, 5.0];
        targetLookAt = [-2.8, 0, 0];
        break;
      case 'fcdi_cell':
        targetCamPos = [0.5, 1.8, 4.5];
        targetLookAt = [0.5, 0.2, 0];
        break;
      case 'monitoring':
        targetCamPos = [-0.5, 2.2, 3.2];
        targetLookAt = [-0.5, 1.4, 0.8];
        break;
      case 'outflow':
        targetCamPos = [4.5, 1.2, 4.8];
        targetLookAt = [4.5, -0.2, 0];
        break;
      case 'all':
      default:
        targetCamPos = [0, 2.5, 9.5];
        targetLookAt = [0, -0.2, 0];
        break;
    }

    if (cameraRef.current) {
      // Lerp camera position
      cameraRef.current.position.set(...targetCamPos);
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(...targetLookAt);
      controlsRef.current.update();
    }
  }, [params.activeStage]);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 2.5, 9.5]}
        fov={45}
        near={0.1}
        far={100}
      />
      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        minDistance={3}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2 + 0.05}
        dampingFactor={0.05}
      />
    </>
  );
};

export const DigitalTwinCanvas: React.FC = () => {
  const { setSelectedSensorId, setSelectedComponentId } = useSimulation();

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
      onClick={() => {
        // Deselect on background click
        setSelectedSensorId(null);
        setSelectedComponentId(null);
      }}
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#050814']} />
        
        {/* Studio Lighting System */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-10, 10, -10]} intensity={0.6} color="#38bdf8" />
        <pointLight position={[0.5, 2, 2]} intensity={2.5} color="#00f2fe" distance={8} />
        <pointLight position={[-2.8, 2, 2]} intensity={2.0} color="#5eead4" distance={8} />

        {/* Camera Rig & Orbit Controls */}
        <CameraRig />

        {/* 3D Platform Skid */}
        <AquaCorePlatform />

        {/* Ground Shadows */}
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.65}
          scale={16}
          blur={2.5}
          far={4}
        />

        {/* Preset Environment Reflection Map */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};
