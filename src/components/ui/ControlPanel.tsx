'use client';

import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Sliders, Zap, Droplets, Flame, Eye, EyeOff, Layers, Sparkles, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';

export const ControlPanel: React.FC = () => {
  const {
    params,
    setArchitecture,
    setInletTDS,
    setAppliedVoltage,
    setFeedFlowRate,
    setSlurryFlowRate,
    setExplodedFactor,
    setShowCutaway,
    setShowIonFlow,
    setShowStreamlines,
    updatePretreatmentBiochar,
    updatePretreatmentZeolite,
    resetToDefaults,
  } = useSimulation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'electro' | 'pretreatment' | 'view'>('electro');

  const isBio = params.architecture === 'fish_gill_bioinspired';

  return (
    <div
      className={`absolute top-20 left-4 z-20 transition-all duration-300 pointer-events-auto ${
        isCollapsed ? 'w-12' : 'w-80 md:w-96'
      }`}
    >
      <div className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/25 rounded-3xl p-4 shadow-2xl shadow-cyan-950/50 text-slate-200">
        {/* Panel Collapse Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold font-sans tracking-wide text-white">
                SIMULATION CONTROLS
              </h2>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all ml-auto"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="mt-3 space-y-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('electro')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'electro'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Desalination</span>
              </button>
              <button
                onClick={() => setActiveTab('pretreatment')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'pretreatment'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Pretreatment</span>
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'view'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>3D View</span>
              </button>
            </div>

            {/* TAB 1: Desalination Controls */}
            {activeTab === 'electro' && (
              <div className="space-y-4">
                {/* Applied Voltage Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> APPLIED POTENTIAL (V)
                    </span>
                    <span className="text-cyan-300 font-bold">{params.appliedVoltage} V</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="1.8"
                    step="0.05"
                    value={params.appliedVoltage}
                    onChange={(e) => setAppliedVoltage(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                    <span>0.4V (Low)</span>
                    <span>1.2V (Optimal FCDI)</span>
                    <span>1.8V (High)</span>
                  </div>
                </div>

                {/* Inlet Feed Salinity / TDS Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3.5 h-3.5 text-cyan-400" /> INLET FEED TDS (mg/L)
                    </span>
                    <span className="text-cyan-300 font-bold">{params.inletTDS} ppm</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={params.inletTDS}
                    onChange={(e) => setInletTDS(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                    <span>500 (Fresh)</span>
                    <span>3200 (Brackish)</span>
                    <span>10000 (High)</span>
                  </div>
                </div>

                {/* Feed Flow Rate Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">FEED FLOW RATE</span>
                    <span className="text-cyan-300 font-bold">{params.feedFlowRate} L/min</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={params.feedFlowRate}
                    onChange={(e) => setFeedFlowRate(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Carbon Slurry Flow Rate Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">CARBON SLURRY FLOW</span>
                    <span className="text-cyan-300 font-bold">{params.slurryFlowRate} mL/min</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="180"
                    step="5"
                    value={params.slurryFlowRate}
                    onChange={(e) => setSlurryFlowRate(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Pretreatment Chamber Composition */}
            {activeTab === 'pretreatment' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Chamber 1 uses biomass-derived activated carbon/biochar and natural zeolite in a porous ceramic support grid to condition the feed water prior to desalination.
                </p>

                {/* Biochar Media Ratio */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">BIOCHAR / ACTIVATED CARBON</span>
                    <span className="text-amber-400 font-bold">
                      {params.pretreatment.activatedCarbonBiochar}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={params.pretreatment.activatedCarbonBiochar}
                    onChange={(e) => updatePretreatmentBiochar(parseInt(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Zeolite Media Ratio */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300">NATURAL ZEOLITE BED</span>
                    <span className="text-teal-400 font-bold">
                      {params.pretreatment.zeoliteRatio}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={params.pretreatment.zeoliteRatio}
                    onChange={(e) => updatePretreatmentZeolite(parseInt(e.target.value))}
                    className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: 3D Visualization Modes */}
            {activeTab === 'view' && (
              <div className="space-y-4">
                {/* Exploded View Factor Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-300 font-bold">EXPLODED CUTAWAY VIEW</span>
                    <span className="text-cyan-300 font-bold">
                      {Math.round(params.explodedFactor * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={params.explodedFactor}
                    onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Feature Toggles */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-slate-300">Show Ion Electro-Migration</span>
                    <input
                      type="checkbox"
                      checked={params.showIonFlow}
                      onChange={(e) => setShowIonFlow(e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-slate-300">Show Fluid Particle Streamlines</span>
                    <input
                      type="checkbox"
                      checked={params.showStreamlines}
                      onChange={(e) => setShowStreamlines(e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span className="text-slate-300">Translucent Shell Cutaway</span>
                    <input
                      type="checkbox"
                      checked={params.showCutaway}
                      onChange={(e) => setShowCutaway(e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 rounded"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
