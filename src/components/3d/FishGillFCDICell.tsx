'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FishGillFCDICellProps {
  position: [number, number, number];
  explodedFactor: number;
  appliedVoltage: number;
  showIonFlow: boolean;
  showCutaway: boolean;
  onSelectComponent: () => void;
}

export const FishGillFCDICell: React.FC<FishGillFCDICellProps> = ({
  position,
  explodedFactor,
  appliedVoltage,
  showIonFlow,
  showCutaway,
  onSelectComponent,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const cationsRef = useRef<THREE.InstancedMesh>(null);
  const anionsRef = useRef<THREE.InstancedMesh>(null);
  const electricFieldRef = useRef<THREE.MeshStandardMaterial>(null);

  // Animate ion electro-migration across the fish gill lamellae
  const ionCount = 60;
  const cationPositions = useMemo(() => {
    const arr: { x: number; y: number; z: number; speed: number; origZ: number }[] = [];
    for (let i = 0; i < ionCount; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.4,
        y: (Math.random() - 0.5) * 1.8,
        z: (Math.random() - 0.5) * 0.2, // Central feed channel
        speed: 0.005 + Math.random() * 0.008,
        origZ: (Math.random() - 0.5) * 0.2,
      });
    }
    return arr;
  }, []);

  const anionPositions = useMemo(() => {
    const arr: { x: number; y: number; z: number; speed: number; origZ: number }[] = [];
    for (let i = 0; i < ionCount; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.4,
        y: (Math.random() - 0.5) * 1.8,
        z: (Math.random() - 0.5) * 0.2,
        speed: 0.005 + Math.random() * 0.008,
        origZ: (Math.random() - 0.5) * 0.2,
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Pulse electric field material based on applied voltage
    if (electricFieldRef.current) {
      electricFieldRef.current.opacity = 0.25 + Math.sin(time * (appliedVoltage * 4)) * 0.15;
    }

    // Animate Cations (Na+) migrating left (-Z) through Cation Exchange Membrane
    if (cationsRef.current && showIonFlow) {
      cationPositions.forEach((ion, i) => {
        // Move downward in flow and migrate left towards Cathode membrane (-Z)
        ion.y -= ion.speed * 1.2;
        ion.z -= ion.speed * (appliedVoltage * 0.8);

        if (ion.y < -0.9 || ion.z < -0.6) {
          ion.y = 0.9;
          ion.z = (Math.random() - 0.5) * 0.1;
        }

        dummy.position.set(ion.x, ion.y, ion.z);
        const scale = 0.04 + Math.sin(time * 5 + i) * 0.008;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        cationsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      cationsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Animate Anions (Cl-) migrating right (+Z) through Anion Exchange Membrane
    if (anionsRef.current && showIonFlow) {
      anionPositions.forEach((ion, i) => {
        ion.y -= ion.speed * 1.2;
        ion.z += ion.speed * (appliedVoltage * 0.8);

        if (ion.y < -0.9 || ion.z > 0.6) {
          ion.y = 0.9;
          ion.z = (Math.random() - 0.5) * 0.1;
        }

        dummy.position.set(ion.x, ion.y, ion.z);
        const scale = 0.04 + Math.sin(time * 5 + i) * 0.008;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        anionsRef.current!.setMatrixAt(i, dummy.matrix);
      });
      anionsRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const explosion = explodedFactor * 0.9;

  // Number of fish-gill lamellae pairs
  const lamellaeCount = 7;

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onSelectComponent();
      }}
    >
      {/* Titanium End Collector Plates & Electrical Terminals */}
      <mesh position={[0, 0, -1.1 - explosion * 1.2]}>
        <boxGeometry args={[1.2, 2.2, 0.15]} />
        <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Negative Terminal Connector (Cathode - Blue LED glow) */}
      <mesh position={[0.4, 1.25, -1.1 - explosion * 1.2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#00f2fe" emissive="#00f2fe" emissiveIntensity={1.5} />
      </mesh>

      <mesh position={[0, 0, 1.1 + explosion * 1.2]}>
        <boxGeometry args={[1.2, 2.2, 0.15]} />
        <meshStandardMaterial color="#334155" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Positive Terminal Connector (Anode - Red/Magenta LED glow) */}
      <mesh position={[0.4, 1.25, 1.1 + explosion * 1.2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.5} />
      </mesh>

      {/* Cathode Flowing Carbon Slurry Channel (Dark fluid with active carbon particles) */}
      <mesh position={[0, 0, -0.7 - explosion * 0.8]}>
        <boxGeometry args={[1.0, 2.0, 0.25]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.2} />
      </mesh>
      {/* Cathode Carbon Slurry Texture Mesh */}
      <mesh position={[0, 0, -0.7 - explosion * 0.8]}>
        <boxGeometry args={[1.01, 2.01, 0.26]} />
        <meshBasicMaterial color="#1e293b" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Cation Exchange Membrane (CEM) - Electric Blue Sheet */}
      <mesh position={[0, 0, -0.45 - explosion * 0.5]}>
        <boxGeometry args={[1.0, 2.0, 0.04]} />
        <meshStandardMaterial
          color="#00f2fe"
          emissive="#00f2fe"
          emissiveIntensity={0.6}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Fish-Gill Lamellae Stacked Channel Array (Center Biomimetic Core) */}
      <group position={[0, 0, 0]}>
        {Array.from({ length: lamellaeCount }).map((_, idx) => {
          const zOffset = (idx - (lamellaeCount - 1) / 2) * (0.08 + explosion * 0.12);
          return (
            <group key={idx} position={[0, 0, zOffset]}>
              {/* Thin Gill Filament Plate */}
              <mesh>
                <boxGeometry args={[0.9, 1.8, 0.02]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  metalness={0.5}
                  roughness={0.2}
                  transparent
                  opacity={0.7}
                />
              </mesh>
              {/* Lamellar micro-grooves mimicking secondary fish gill lamellae */}
              {Array.from({ length: 12 }).map((_, ribIdx) => (
                <mesh key={ribIdx} position={[0, (ribIdx - 5.5) * 0.14, 0.015]}>
                  <boxGeometry args={[0.85, 0.02, 0.015]} />
                  <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.1} />
                </mesh>
              ))}
            </group>
          );
        })}
      </group>

      {/* Anion Exchange Membrane (AEM) - Magenta Sheet */}
      <mesh position={[0, 0, 0.45 + explosion * 0.5]}>
        <boxGeometry args={[1.0, 2.0, 0.04]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={0.6}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Anode Flowing Carbon Slurry Channel */}
      <mesh position={[0, 0, 0.7 + explosion * 0.8]}>
        <boxGeometry args={[1.0, 2.0, 0.25]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} metalness={0.2} />
      </mesh>

      {/* Electric Field Glow Volume (Visible potential field gradient) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.05, 2.05, 1.2]} />
        <meshStandardMaterial
          ref={electricFieldRef}
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={1.2}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Acrylic Chassis Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.25, 2.25, 2.2]} />
        <meshPhysicalMaterial
          color="#e0f2fe"
          transmission={0.85}
          opacity={showCutaway ? 0.3 : 0.75}
          transparent
          roughness={0.1}
          ior={1.49}
          thickness={0.2}
        />
      </mesh>

      {/* Instanced Cation (Na+) Spheres */}
      {showIonFlow && (
        <instancedMesh
          ref={cationsRef}
          args={[undefined, undefined, ionCount]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.8}
          />
        </instancedMesh>
      )}

      {/* Instanced Anion (Cl-) Spheres */}
      {showIonFlow && (
        <instancedMesh
          ref={anionsRef}
          args={[undefined, undefined, ionCount]}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#f43f5e"
            emissive="#e11d48"
            emissiveIntensity={1.8}
          />
        </instancedMesh>
      )}
    </group>
  );
};
