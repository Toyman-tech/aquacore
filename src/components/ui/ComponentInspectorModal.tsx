'use client';

import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { X, Cpu, Sparkles, Layers, ShieldCheck, Activity, Info, CheckCircle2, ChevronRight } from 'lucide-react';

export const ComponentInspectorModal: React.FC = () => {
  const { selectedComponent, selectedSensor, setSelectedComponentId, setSelectedSensorId } = useSimulation();

  if (!selectedComponent && !selectedSensor) return null;

  const onClose = () => {
    setSelectedComponentId(null);
    setSelectedSensorId(null);
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto w-full max-w-lg px-4 animate-in slide-in-from-top-4 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-5 shadow-2xl shadow-cyan-950/80 text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-400/40 text-cyan-300">
              {selectedSensor ? <Activity className="w-5 h-5 animate-pulse" /> : <Info className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                {selectedSensor ? 'ESP32 TELEMETRY PROBE' : 'COMPONENT INSPECTOR'}
              </span>
              <h3 className="text-base font-bold text-white font-sans">
                {selectedSensor ? selectedSensor.name : selectedComponent?.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content for Sensor Node */}
        {selectedSensor && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px] block">LOCATION</span>
                <span className="font-bold text-slate-200">{selectedSensor.location}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px] block">CURRENT TDS</span>
                <span className="font-bold text-cyan-300 font-mono">{selectedSensor.tds} ppm</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px] block">CONDUCTIVITY</span>
                <span className="font-bold text-teal-300 font-mono">{selectedSensor.conductivity} µS/cm</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 font-mono text-[10px] block">FLOW RATE</span>
                <span className="font-bold text-blue-300 font-mono">{selectedSensor.flowRate} L/min</span>
              </div>
            </div>

            {selectedSensor.voltage && (
              <div className="bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-300 font-bold">CORE POTENTIAL & CURRENT:</span>
                <span className="text-white font-bold">{selectedSensor.voltage}V @ {selectedSensor.current}A</span>
              </div>
            )}
          </div>
        )}

        {/* Content for Component Detail */}
        {selectedComponent && (
          <div className="mt-4 space-y-3 text-xs">
            <p className="text-slate-300 leading-relaxed">
              {selectedComponent.description}
            </p>

            {/* Scientific Principle */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                SCIENTIFIC OPERATING PRINCIPLE
              </span>
              <p className="text-slate-300 leading-snug">
                {selectedComponent.scientificPrinciple}
              </p>
            </div>

            {/* Bioinspired Note */}
            {selectedComponent.bioinspiredNotes && (
              <div className="bg-gradient-to-r from-cyan-950 to-teal-950 p-3 rounded-2xl border border-cyan-500/30 space-y-1">
                <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> BIOMIMETIC ARCHITECTURE NOTE
                </span>
                <p className="text-cyan-100 text-[11px] leading-snug">
                  {selectedComponent.bioinspiredNotes}
                </p>
              </div>
            )}

            {/* Specs Grid */}
            <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">
                KEY SPECIFICATIONS
              </span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {Object.entries(selectedComponent.keySpecs).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center border-b border-slate-850 py-0.5">
                    <span className="text-slate-400 text-[11px]">{key}:</span>
                    <span className="text-cyan-300 font-mono font-bold text-[11px]">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
