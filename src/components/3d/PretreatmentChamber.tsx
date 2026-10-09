'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PretreatmentChamberProps {
  position: [number, number, number];
  explodedFactor: number;
  showCutaway: boolean;
  onSelectComponent: () => void;
}

export const PretreatmentChamber: React.FC<PretreatmentChamberProps> = ({
  position,
  explodedFactor,
  showCutaway,
  onSelectComponent,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Animate suspended particles inside the media bed
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const time = clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        // Slow downward drift inside filtration bed
        positions[i + 1] -= 0.008;
        // Jitter for turbulent Brownian movement inside pore matrix
        positions[i] += Math.sin(time * 3 + i) * 0.002;
        
        // Reset top if reached bottom of bed
        if (positions[i + 1] < -1.1) {
          positions[i + 1] = 1.1;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Generate 120 trapped particulate matter particles
  const particleCount = 120;
  const particlePositions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = Math.random() * 0.55;
      const theta = Math.random() * Math.PI * 2;
      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
      pos[i * 3 + 2] = r * Math.sin(theta);
    }
    return pos;
  }, []);

  const explosionOffset = explodedFactor * 0.8;

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectComponent();
      }}
    >
      {/* Structural Support Base & Mounting Skid */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.75, 0.85, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Layer 3: Porous Clay / Ceramic Support Grid (Bottom) */}
      <group position={[0, -1.0 - explosionOffset * 0.3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.62, 0.62, 0.3, 32, 1, false, 0, showCutaway ? Math.PI * 1.5 : Math.PI * 2]} />
          <meshStandardMaterial
            color="#d97706"
            roughness={0.85}
            metalness={0.1}
            wireframe={false}
          />
        </mesh>
        {/* Perforations */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.63, 0.63, 0.31, 16]} />
          <meshBasicMaterial color="#78350f" wireframe={true} transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Layer 2: Natural Zeolite Mineral Bed (Middle Layer) */}
      <group position={[0, -0.2 - explosionOffset * 0.6, 0]}>
        <mesh>
          <cylinderGeometry args={[0.62, 0.62, 0.8, 32, 1, false, 0, showCutaway ? Math.PI * 1.5 : Math.PI * 2]} />
          <meshStandardMaterial
            color="#5eead4"
            roughness={0.6}
            metalness={0.2}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Micro-crystalline texture overlay */}
        <mesh>
          <cylinderGeometry args={[0.625, 0.625, 0.805, 24]} />
          <meshStandardMaterial color="#0f766e" wireframe transparent opacity={0.3} />
        </mesh>
      </group>

      {/* Layer 1: Activated Carbon / Biochar Bed (Top Layer) */}
      <group position={[0, 0.75 + explosionOffset * 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.62, 0.62, 1.0, 32, 1, false, 0, showCutaway ? Math.PI * 1.5 : Math.PI * 2]} />
          <meshStandardMaterial
            color="#18181b"
            roughness={0.9}
            metalness={0.4}
          />
        </mesh>
        {/* High surface area granular speckles */}
        <mesh>
          <cylinderGeometry args={[0.625, 0.625, 1.01, 20]} />
          <meshStandardMaterial color="#3f3f46" wireframe transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Suspended Solids Particle Entrapment Visualizer */}
      <points ref={particlesRef} position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.045}
          color="#f59e0b"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Outer Acrylic Pressure Vessel Cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.68, 0.68, 2.7, 32, 1, false, 0, showCutaway ? Math.PI * 1.4 : Math.PI * 2]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.9}
          opacity={1}
          transparent
          roughness={0.05}
          ior={1.49}
          thickness={0.1}
          specularIntensity={0.8}
        />
      </mesh>

      {/* Steel Flange Rings */}
      <mesh position={[0, 1.35, 0]}>
        <torusGeometry args={[0.68, 0.05, 16, 32]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.35, 0]}>
        <torusGeometry args={[0.68, 0.05, 16, 32]} />
        <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Feed Inlet Top Nozzle */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Effluent Outlet Bottom Nozzle */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};
