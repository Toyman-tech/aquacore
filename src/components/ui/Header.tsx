'use client';

import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Activity, Play, Pause, RotateCcw, Compass, BookOpen, Sparkles, Layers, Sliders } from 'lucide-react';

interface HeaderProps {
  onOpenProjectInfo: () => void;
  onOpenBiomimicryInspector: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProjectInfo,
  onOpenBiomimicryInspector,
}) => {
  const {
    params,
    setArchitecture,
    toggleSimulationPause,
    isTourActive,
    startGuidedTour,
    stopGuidedTour,
    resetToDefaults,
  } = useSimulation();

  const isBio = params.architecture === 'fish_gill_bioinspired';

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-4 pointer-events-none flex items-center justify-between gap-4">
      {/* Title & Organization Branding */}
      <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-3 px-4 shadow-2xl shadow-cyan-950/40 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Activity className="w-6 h-6 text-slate-950 animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold font-sans tracking-tight text-white flex items-center gap-2">
              AQUA<span className="text-cyan-400">CORE</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 border border-cyan-400/40 text-cyan-300">
              DIGITAL TWIN v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans flex items-center gap-1.5">
            <span>Team AquaNova</span> • <span className="text-teal-400">University of Ilorin</span>
          </p>
        </div>
      </div>

      {/* Architecture Toggle & Biomimicry Callout */}
      <div className="pointer-events-auto hidden md:flex items-center gap-2 bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-1.5 px-2.5 shadow-xl">
        <span className="text-xs font-mono font-semibold text-slate-400 px-2">CELL GEOMETRY:</span>
        <button
          onClick={() => setArchitecture('fish_gill_bioinspired')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
            isBio
              ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Fish-Gill Bio-Inspired
        </button>
        <button
          onClick={() => setArchitecture('conventional_flat_plate')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
            !isBio
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Conventional Flat Control
        </button>

        <button
          onClick={onOpenBiomimicryInspector}
          className="ml-1 p-1.5 rounded-xl bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-900/80 transition-all text-xs font-semibold px-2.5 flex items-center gap-1"
        >
          <span>Compare Science</span>
        </button>
      </div>

      {/* Quick Tools & Telemetry Controls */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* ESP32 Online Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/85 backdrop-blur-xl border border-emerald-500/30 rounded-2xl px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono text-emerald-300 font-medium">ESP32 SENSORS ONLINE</span>
        </div>

        {/* Play / Pause Telemetry */}
        <button
          onClick={toggleSimulationPause}
          className="p-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 text-slate-200 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
          title={params.isSimulationActive ? 'Pause Telemetry' : 'Resume Telemetry'}
        >
          {params.isSimulationActive ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
        </button>

        {/* Guided 3D Tour */}
        <button
          onClick={isTourActive ? stopGuidedTour : startGuidedTour}
          className={`px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 backdrop-blur-xl transition-all border ${
            isTourActive
              ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse'
              : 'bg-slate-900/85 text-cyan-300 border-slate-700/60 hover:border-cyan-400/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{isTourActive ? 'Exit Tour' : '3D System Tour'}</span>
        </button>

        {/* Research Document Info Modal */}
        <button
          onClick={onOpenProjectInfo}
          className="px-3 py-2 rounded-2xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-cyan-600/25 hover:from-blue-500 hover:to-cyan-500 transition-all flex items-center gap-1.5"
        >
          <BookOpen className="w-4 h-4" />
          <span>Research Dossier</span>
        </button>

        {/* Reset Camera */}
        <button
          onClick={resetToDefaults}
          className="p-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-slate-700/60 text-slate-400 hover:text-white transition-all"
          title="Reset Parameters & Camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
