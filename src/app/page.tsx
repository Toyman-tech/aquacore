'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { SimulationProvider } from '../context/SimulationContext';
import { Header } from '../components/ui/Header';
import { ControlPanel } from '../components/ui/ControlPanel';
import { TelemetryDashboard } from '../components/ui/TelemetryDashboard';
import { StageNavigator } from '../components/ui/StageNavigator';
import { ComponentInspectorModal } from '../components/ui/ComponentInspectorModal';
import { BiomimicryInspector } from '../components/ui/BiomimicryInspector';
import { ProjectInfoModal } from '../components/ui/ProjectInfoModal';

// Dynamically import Three.js Canvas to prevent SSR window/WebGL hydration mismatch
const DigitalTwinCanvas = dynamic(
  () => import('../components/3d/DigitalTwinCanvas').then((mod) => mod.DigitalTwinCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-cyan-400 font-sans space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin-reverse" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold tracking-wider text-white">INITIALIZING AQUACORE 3D DIGITAL TWIN</h2>
          <p className="text-xs font-mono text-slate-400">Loading WebGL Shaders & Fish-Gill Lamellar Geometry...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  const [isProjectInfoOpen, setIsProjectInfoOpen] = useState(false);
  const [isBiomimicryOpen, setIsBiomimicryOpen] = useState(false);

  return (
    <SimulationProvider>
      <main className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
        {/* Fullscreen 3D WebGL Digital Twin Canvas */}
        <div className="absolute inset-0 z-0">
          <DigitalTwinCanvas />
        </div>

        {/* UI Overlay Systems */}
        <Header
          onOpenProjectInfo={() => setIsProjectInfoOpen(true)}
          onOpenBiomimicryInspector={() => setIsBiomimicryOpen(true)}
        />

        <ControlPanel />
        <TelemetryDashboard />
        <StageNavigator />
        <ComponentInspectorModal />

        {/* Modals */}
        <BiomimicryInspector
          isOpen={isBiomimicryOpen}
          onClose={() => setIsBiomimicryOpen(false)}
        />
        <ProjectInfoModal
          isOpen={isProjectInfoOpen}
          onClose={() => setIsProjectInfoOpen(false)}
        />
      </main>
    </SimulationProvider>
  );
}
