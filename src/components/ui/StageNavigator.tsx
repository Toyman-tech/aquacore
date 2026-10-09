'use client';

import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { SimulationParams } from '../../types/digital-twin';
import { ShieldCheck, Flame, Zap, Cpu, Droplets, Grid } from 'lucide-react';

export const StageNavigator: React.FC = () => {
  const { params, setActiveStage } = useSimulation();

  const stages: { id: SimulationParams['activeStage']; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Overview Skid', icon: <Grid className="w-3.5 h-3.5" /> },
    { id: 'inlet', label: '1. Feed Inlet', icon: <Droplets className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'pretreatment', label: '2. Chamber 1 Media', icon: <Flame className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'fcdi_cell', label: '3. Gill FCDI Cell', icon: <Zap className="w-3.5 h-3.5 text-teal-400" /> },
    { id: 'monitoring', label: '4. ESP32 Sensing', icon: <Cpu className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'outflow', label: '5. Product & Brine', icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto max-w-full px-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 rounded-full p-1.5 shadow-2xl shadow-cyan-950/60 flex items-center gap-1 overflow-x-auto">
        {stages.map((stage) => {
          const isActive = params.activeStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold font-sans whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {stage.icon}
              <span>{stage.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
