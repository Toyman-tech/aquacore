'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';

interface ConventionalFCDICellProps {
  position: [number, number, number];
  explodedFactor: number;
  appliedVoltage: number;
  showCutaway: boolean;
  onSelectComponent: () => void;
}

export const ConventionalFCDICell: React.FC<ConventionalFCDICellProps> = ({
  position,
  explodedFactor,
  showCutaway,
  onSelectComponent,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const explosion = explodedFactor * 0.9;

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectComponent();
      }}
    >
      {/* Heavy Steel End Plates */}
      <mesh position={[0, 0, -1.3 - explosion * 1.2]}>
        <boxGeometry args={[1.5, 2.2, 0.2]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 1.3 + explosion * 1.2]}>
        <boxGeometry args={[1.5, 2.2, 0.2]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Flat Cathode Slurry Channel */}
      <mesh position={[0, 0, -0.8 - explosion * 0.8]}>
        <boxGeometry args={[1.2, 1.9, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Flat Cation Exchange Membrane */}
      <mesh position={[0, 0, -0.45 - explosion * 0.4]}>
        <boxGeometry args={[1.2, 1.9, 0.05]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.7} />
      </mesh>

      {/* Wide Central Water Channel (Thick 650µm diffusion gap) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 1.9, 0.8]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.85}
          transparent
          opacity={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Flat Anion Exchange Membrane */}
      <mesh position={[0, 0, 0.45 + explosion * 0.4]}>
        <boxGeometry args={[1.2, 1.9, 0.05]} />
        <meshStandardMaterial color="#be185d" transparent opacity={0.7} />
      </mesh>

      {/* Flat Anode Slurry Channel */}
      <mesh position={[0, 0, 0.8 + explosion * 0.8]}>
        <boxGeometry args={[1.2, 1.9, 0.4]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Outer Casing */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.55, 2.25, 2.6]} />
        <meshPhysicalMaterial
          color="#cbd5e1"
          transmission={0.8}
          opacity={showCutaway ? 0.25 : 0.6}
          transparent
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};
