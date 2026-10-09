'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFlowSystemProps {
  feedFlowRate: number;
  outletTDS: number;
  isSimulationActive: boolean;
  showStreamlines: boolean;
}

export const ParticleFlowSystem: React.FC<ParticleFlowSystemProps> = ({
  feedFlowRate,
  outletTDS,
  isSimulationActive,
  showStreamlines,
}) => {
  const feedParticlesRef = useRef<THREE.Points>(null);
  const productParticlesRef = useRef<THREE.Points>(null);
  const brineParticlesRef = useRef<THREE.Points>(null);

  // 1. Raw Feed Water Stream Particles (Turbid brackish water)
  const feedParticleCount = 180;
  const feedPositions = useMemo(() => {
    const pos = new Float32Array(feedParticleCount * 3);
    for (let i = 0; i < feedParticleCount; i++) {
      const progress = i / feedParticleCount;
      pos[i * 3] = -5.5 + progress * 2.7; // X path from inlet to Chamber 1
      pos[i * 3 + 1] = 1.6 + (Math.random() - 0.5) * 0.15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }
    return pos;
  }, [feedParticleCount]);

  // 2. Product Permeate Water Stream Particles (Clean crystal blue)
  const productParticleCount = 200;
  const productPositions = useMemo(() => {
    const pos = new Float32Array(productParticleCount * 3);
    for (let i = 0; i < productParticleCount; i++) {
      const progress = i / productParticleCount;
      pos[i * 3] = 0.5 + progress * 4.0;
      pos[i * 3 + 1] = 0.4 + Math.sin(progress * Math.PI) * 0.2;
      pos[i * 3 + 2] = 0.8 + (Math.random() - 0.5) * 0.1;
    }
    return pos;
  }, [productParticleCount]);

  // 3. Brine Concentrate Stream Particles (High salinity amber/red)
  const brineParticleCount = 150;
  const brinePositions = useMemo(() => {
    const pos = new Float32Array(brineParticleCount * 3);
    for (let i = 0; i < brineParticleCount; i++) {
      const progress = i / brineParticleCount;
      pos[i * 3] = 0.5 + progress * 4.0;
      pos[i * 3 + 1] = -0.6 + Math.sin(progress * Math.PI) * 0.15;
      pos[i * 3 + 2] = -0.8 + (Math.random() - 0.5) * 0.1;
    }
    return pos;
  }, [brineParticleCount]);

  useFrame(() => {
    if (!isSimulationActive) return;

    const flowSpeed = (feedFlowRate / 2.0) * 0.04;

    // Move Feed Particles
    if (feedParticlesRef.current) {
      const pos = feedParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < feedParticleCount; i++) {
        pos[i * 3] += flowSpeed;
        if (pos[i * 3] > -2.8) {
          pos[i * 3] = -5.5;
        }
      }
      feedParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Move Product Permeate Particles
    if (productParticlesRef.current) {
      const pos = productParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < productParticleCount; i++) {
        pos[i * 3] += flowSpeed * 1.1;
        if (pos[i * 3] > 4.5) {
          pos[i * 3] = 0.5;
        }
      }
      productParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Move Brine Concentrate Particles
    if (brineParticlesRef.current) {
      const pos = brineParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < brineParticleCount; i++) {
        pos[i * 3] += flowSpeed * 0.9;
        if (pos[i * 3] > 4.5) {
          pos[i * 3] = 0.5;
        }
      }
      brineParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Feed Water Stream */}
      <points ref={feedParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[feedPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#38bdf8"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Clean Product Water Stream */}
      <points ref={productParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[productPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#60a5fa"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Brine Concentrate Stream */}
      <points ref={brineParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[brinePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#f59e0b"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};
