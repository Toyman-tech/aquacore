'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SensorTelemetry } from '../../types/digital-twin';
import { Activity, Droplets, Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SensorMarker3DProps {
  sensor: SensorTelemetry;
  isSelected: boolean;
  onSelect: () => void;
}

export const SensorMarker3D: React.FC<SensorMarker3DProps> = ({
  sensor,
  isSelected,
  onSelect,
}) => {
  const beaconRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.25);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = 0.8 - Math.sin(time * 4) * 0.3;
    }
    if (beaconRef.current) {
      beaconRef.current.position.y = sensor.position[1] + Math.sin(time * 2 + sensor.position[0]) * 0.05;
    }
  });

  const getStatusColor = () => {
    if (sensor.status === 'critical') return '#ef4444';
    if (sensor.status === 'warning') return '#f59e0b';
    return '#10b981';
  };

  const statusColor = getStatusColor();

  return (
    <group
      ref={beaconRef}
      position={[sensor.position[0], sensor.position[1], sensor.position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Pulsing Outer Indicator Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.5, 0]}>
        <ringGeometry args={[0.18, 0.24, 32]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Sensor Pin Sphere */}
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={isSelected ? 2.0 : 1.2}
          roughness={0.2}
        />
      </mesh>

      {/* Vertical Beacon Stalk */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 12]} />
        <meshBasicMaterial color={statusColor} transparent opacity={0.7} />
      </mesh>

      {/* HTML Floating Badge Overlay */}
      <Html
        position={[0, 0.85, 0]}
        center
        distanceFactor={10}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={`px-3 py-1.5 rounded-xl backdrop-blur-md transition-all duration-300 cursor-pointer select-none flex items-center gap-2 whitespace-nowrap border shadow-xl ${
            isSelected
              ? 'bg-cyan-950/90 border-cyan-400 text-white scale-110 ring-2 ring-cyan-400/50 shadow-cyan-500/30'
              : hovered
              ? 'bg-slate-900/90 border-cyan-500/50 text-cyan-200 scale-105'
              : 'bg-slate-900/75 border-slate-700/60 text-slate-200'
          }`}
        >
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
            style={{ backgroundColor: statusColor }}
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
              {sensor.id.toUpperCase()}
            </span>
            <span className="text-xs font-bold font-sans text-cyan-100 flex items-center gap-1">
              {sensor.tds} <span className="text-[10px] font-normal text-cyan-300">mg/L TDS</span>
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
};
