'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import { PretreatmentChamber } from './PretreatmentChamber';
import { FishGillFCDICell } from './FishGillFCDICell';
import { ConventionalFCDICell } from './ConventionalFCDICell';
import { SensorMarker3D } from './SensorMarker3D';
import { ParticleFlowSystem } from './ParticleFlowSystem';

export const AquaCorePlatform: React.FC = () => {
  const {
    params,
    sensors,
    setSelectedSensorId,
    setSelectedComponentId,
  } = useSimulation();

  const slurryPumpRef = useRef<THREE.Group>(null);

  // Rotate carbon slurry pump rollers when simulation is active
  useFrame(({ clock }) => {
    if (slurryPumpRef.current && params.isSimulationActive) {
      slurryPumpRef.current.rotation.z = clock.getElapsedTime() * (params.slurryFlowRate / 15);
    }
  });

  const isBio = params.architecture === 'fish_gill_bioinspired';
  const explodedFactor = params.explodedFactor;

  return (
    <group position={[0, -0.5, 0]}>
      {/* Heavy Structural Aluminum Skid Frame Base */}
      <group position={[0, -2.1, 0]}>
        {/* Main Skid Deck */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[11.5, 0.2, 4.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* High-tech Grid Floor Glow Lines */}
        <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[11.4, 4.1]} />
          <meshBasicMaterial color="#0284c7" wireframe transparent opacity={0.15} />
        </mesh>

        {/* 6 Rubber Dampening Feet */}
        {[-5.2, 0, 5.2].map((x, i) =>
          [-1.8, 1.8].map((z, j) => (
            <mesh key={`${i}-${j}`} position={[x, -0.2, z]}>
              <cylinderGeometry args={[0.3, 0.35, 0.2, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>

      {/* Raw Water Inlet Filter Skid (Left extreme) */}
      <group position={[-5.2, -0.4, 0]} onClick={(e) => { e.stopPropagation(); setSelectedComponentId('comp-pretreatment'); }}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 1.8, 24]} />
          <meshPhysicalMaterial color="#38bdf8" transmission={0.9} transparent opacity={0.6} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.2, 24]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Chamber 1: Natural Composite Pretreatment Chamber */}
      <PretreatmentChamber
        position={[-2.8, 0, 0]}
        explodedFactor={explodedFactor}
        showCutaway={params.showCutaway}
        onSelectComponent={() => setSelectedComponentId('comp-pretreatment')}
      />

      {/* Chamber 2: Fish-Gill FCDI Cell OR Conventional Flat-Plate Control */}
      {isBio ? (
        <FishGillFCDICell
          position={[0.5, 0, 0]}
          explodedFactor={explodedFactor}
          appliedVoltage={params.appliedVoltage}
          showIonFlow={params.showIonFlow}
          showCutaway={params.showCutaway}
          onSelectComponent={() => setSelectedComponentId('comp-fcdi-bio')}
        />
      ) : (
        <ConventionalFCDICell
          position={[0.5, 0, 0]}
          explodedFactor={explodedFactor}
          appliedVoltage={params.appliedVoltage}
          showCutaway={params.showCutaway}
          onSelectComponent={() => setSelectedComponentId('comp-fcdi-bio')}
        />
      )}

      {/* Carbon Slurry Recirculation & Pump Skid (Foreground) */}
      <group
        position={[0.5, -1.2, 1.3]}
        onClick={(e) => { e.stopPropagation(); setSelectedComponentId('comp-slurry-pumps'); }}
      >
        {/* Slurry Pump Housing */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.4, 0.7, 0.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Rotating Peristaltic Pump Head */}
        <group ref={slurryPumpRef} position={[-0.3, 0, 0.42]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.1, 24]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Pump Rollers */}
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, k) => (
            <mesh
              key={k}
              position={[Math.cos(angle) * 0.14, Math.sin(angle) * 0.14, 0.05]}
            >
              <cylinderGeometry args={[0.04, 0.04, 0.12, 12]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.7} />
            </mesh>
          ))}
        </group>
        {/* Twin Slurry Storage Reservoirs */}
        <mesh position={[0.45, 0.4, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.9, 20]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
      </group>

      {/* ESP32 Microcontroller Unit & Sensor Junction Box */}
      <group
        position={[-0.5, 1.6, 0.8]}
        onClick={(e) => { e.stopPropagation(); setSelectedComponentId('comp-esp32-monitoring'); }}
      >
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.35]} />
          <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* ESP32 PCB Screen / OLED Telemetry display */}
        <mesh position={[0, 0, 0.18]}>
          <planeGeometry args={[0.8, 0.45]} />
          <meshBasicMaterial color="#090d16" />
        </mesh>
        {/* Status Blinkers */}
        <mesh position={[-0.3, 0.15, 0.19]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[-0.2, 0.15, 0.19]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Product Water Storage Vessel (Right Back) */}
      <group position={[4.5, -0.4, 0.8]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.65, 0.65, 2.2, 32]} />
          <meshPhysicalMaterial
            color="#38bdf8"
            transmission={0.92}
            transparent
            opacity={0.85}
            roughness={0.05}
            ior={1.33}
          />
        </mesh>
        {/* Stored Pure Water Level */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 1.4, 32]} />
          <meshStandardMaterial color="#60a5fa" transparent opacity={0.65} />
        </mesh>
      </group>

      {/* Brine Concentrate Collection Tank (Right Front) */}
      <group position={[4.5, -0.7, -0.8]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 1.6, 32]} />
          <meshPhysicalMaterial
            color="#f59e0b"
            transmission={0.88}
            transparent
            opacity={0.85}
            roughness={0.1}
          />
        </mesh>
        {/* Stored Brine Level */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.52, 0.52, 1.1, 32]} />
          <meshStandardMaterial color="#d97706" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Interconnecting Hydraulic Piping Runs */}
      {/* Pipe 1: Filter to Pretreatment Chamber */}
      <mesh position={[-4.0, 1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 2.4, 16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Pipe 2: Pretreatment Outlet to FCDI Cell Inlet */}
      <mesh position={[-1.1, -1.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 3.4, 16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Pipe 3: FCDI Permeate to Product Tank */}
      <mesh position={[2.5, 0.4, 0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 4.0, 16]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Pipe 4: FCDI Slurry to Brine Tank */}
      <mesh position={[2.5, -0.6, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 4.0, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 5 IoT Sensor Nodes */}
      {sensors.map((sensor) => (
        <SensorMarker3D
          key={sensor.id}
          sensor={sensor}
          isSelected={params.selectedSensorId === sensor.id}
          onSelect={() => setSelectedSensorId(sensor.id)}
        />
      ))}

      {/* 3D Flowing Particle System */}
      <ParticleFlowSystem
        feedFlowRate={params.feedFlowRate}
        outletTDS={params.inletTDS}
        isSimulationActive={params.isSimulationActive}
        showStreamlines={params.showStreamlines}
      />
    </group>
  );
};
