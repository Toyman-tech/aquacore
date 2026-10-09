'use client';

import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Activity, Zap, Droplets, Gauge, ShieldCheck, ArrowDownRight, TrendingUp, Sparkles } from 'lucide-react';

export const TelemetryDashboard: React.FC = () => {
  const { params, metrics, telemetryHistory } = useSimulation();

  const isBio = params.architecture === 'fish_gill_bioinspired';

  return (
    <div className="absolute top-20 right-4 z-20 pointer-events-auto w-80 md:w-96 space-y-3">
      {/* Primary Telemetry Metrics Panel */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/25 rounded-3xl p-4 shadow-2xl shadow-cyan-950/50 text-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h2 className="text-sm font-bold font-sans tracking-wide text-white">
              REALTIME TELEMETRY
            </h2>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
            50 Hz ESP32 STREAM
          </span>
        </div>

        {/* Core Metric Cards 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          {/* Outlet TDS Card */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>PRODUCT TDS</span>
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {metrics.outletTDS}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">ppm</span>
            </div>
            <div className="text-[10px] font-sans text-emerald-400 font-semibold mt-0.5 flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" />
              <span>{metrics.saltRemovalEfficiency}% Removal</span>
            </div>
          </div>

          {/* Specific Energy Consumption (SEC) Card */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>SPECIFIC ENERGY</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-1">
              {metrics.specificEnergyConsumption}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">kWh/m³</span>
            </div>
            <div className="text-[10px] font-sans text-cyan-300 font-medium mt-0.5">
              {isBio ? 'Low Voltage Gill FCDI' : 'Standard Cell'}
            </div>
          </div>

          {/* Salt Removal Rate (SRR) Card */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>REMOVAL RATE</span>
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div className="text-xl font-bold font-mono text-teal-300 mt-1">
              {metrics.saltRemovalRate}{' '}
              <span className="text-[10px] font-normal text-slate-400 font-sans">µmol/cm²·s</span>
            </div>
            <div className="text-[10px] font-sans text-slate-400 mt-0.5">
              Area: {metrics.membraneAreaToVolumeRatio} cm²/cm³
            </div>
          </div>

          {/* Water Recovery Rate % */}
          <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>WATER RECOVERY</span>
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-bold font-mono text-blue-300 mt-1">
              {metrics.waterRecovery}%
            </div>
            <div className="text-[10px] font-sans text-slate-400 mt-0.5">
              {metrics.productFlowRate} L/min Product
            </div>
          </div>
        </div>

        {/* Live Sparkline Chart showing Outlet TDS Trend */}
        <div className="mt-3.5 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
            <span>PERMEATE TDS TIME-SERIES</span>
            <span className="text-cyan-400 font-bold">{metrics.outletTDS} mg/L</span>
          </div>

          {/* Custom SVG Real-time Sparkline Graph */}
          <div className="h-16 w-full bg-slate-950/90 rounded-xl p-1.5 border border-slate-800/80 relative overflow-hidden flex items-end">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
              {/* Grid lines */}
              <line x1="0" y1="10" x2="100" y2="10" stroke="#1e293b" strokeDasharray="2,2" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeDasharray="2,2" />

              {/* Trend Polyline */}
              {telemetryHistory.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  points={telemetryHistory
                    .map((pt, idx) => {
                      const x = (idx / (telemetryHistory.length - 1)) * 100;
                      // Scale outlet TDS (e.g. 0 - 2000 ppm range mapped to 35 - 5 height)
                      const y = Math.max(5, Math.min(35, 38 - (pt.outletTDS / params.inletTDS) * 35));
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
              )}
            </svg>
          </div>
        </div>

        {/* Biomimicry Advantage Highlight Banner */}
        {isBio && (
          <div className="mt-3 p-2.5 rounded-2xl bg-gradient-to-r from-cyan-950 to-teal-950 border border-cyan-500/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <p className="text-[11px] text-cyan-200 font-sans leading-tight">
              <strong className="text-cyan-400">Fish-Gill Advantage:</strong> +27.4% faster ion transport kinetics & 77% shorter diffusion distance vs flat plate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
