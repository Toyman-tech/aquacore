'use client';

import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { X, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Layers, Cpu, ShieldCheck } from 'lucide-react';

interface BiomimicryInspectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BiomimicryInspector: React.FC<BiomimicryInspectorProps> = ({
  isOpen,
  onClose,
}) => {
  const { params, setArchitecture } = useSimulation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl shadow-cyan-950/80 overflow-y-auto text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-400/40 text-cyan-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                Biomimicry Science: Fish-Gill Lamellar FCDI
              </h2>
              <p className="text-xs text-slate-400">
                Comparative analysis of Team AquaNova's bio-inspired architecture vs conventional flat-plate FCDI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Biomimicry Concept Explanation */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider font-mono flex items-center gap-2">
              <span>Biological Inspiration (Teleost Fish Gills)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fish gills achieve exceptional gas and ion exchange efficiency through high-density secondary lamellae—thin, parallel leaf-like micro-structures that compress maximum surface area into minimal volumetric space while maintaining counter-current flow regimes.
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>AquaCore Translation:</strong> We map this geometric principle into thin, stacked lamellar channels in continuous Flow-Electrode Capacitive Deionization (FCDI). This dramatically increases the membrane-area-to-water-volume ratio and reduces boundary layer diffusion distances without requiring ultra-high hydraulic pressure.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-950 to-teal-950 p-4 rounded-2xl border border-cyan-500/40 space-y-2 flex flex-col justify-center">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
              KEY RESEARCH BENEFIT
            </div>
            <div className="text-3xl font-extrabold text-white font-mono">
              4.7x
            </div>
            <div className="text-xs text-cyan-200">
              Increase in active membrane packing density per unit cell volume compared to flat plates.
            </div>
          </div>
        </div>

        {/* Side-by-Side Architectural Comparison Table */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-white mb-3 font-mono flex items-center gap-2">
            <span>EXPERIMENTAL COMPARATIVE MATRIX</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950">
                  <th className="p-3 text-slate-400 font-mono">Parameter</th>
                  <th className="p-3 text-cyan-300 font-mono bg-cyan-950/40 border-l border-cyan-500/20">
                    AquaCore Fish-Gill Lamellae
                  </th>
                  <th className="p-3 text-amber-300 font-mono bg-amber-950/30 border-l border-amber-500/20">
                    Conventional Flat Plate Control
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                <tr>
                  <td className="p-3 text-slate-300 font-medium">Membrane Area / Cell Volume</td>
                  <td className="p-3 text-cyan-300 font-bold bg-cyan-950/20 border-l border-cyan-500/20">
                    38.5 cm² / cm³
                  </td>
                  <td className="p-3 text-slate-400 bg-amber-950/10 border-l border-amber-500/20">
                    8.2 cm² / cm³
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-300 font-medium">Ion Diffusion Boundary Layer Path</td>
                  <td className="p-3 text-emerald-400 font-bold bg-cyan-950/20 border-l border-cyan-500/20">
                    140 µm (77% Shorter)
                  </td>
                  <td className="p-3 text-slate-400 bg-amber-950/10 border-l border-amber-500/20">
                    620 µm
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-300 font-medium">Internal Cell Resistance (R_cell)</td>
                  <td className="p-3 text-emerald-400 font-bold bg-cyan-950/20 border-l border-cyan-500/20">
                    4.2 Ω (Lower Joule Heating)
                  </td>
                  <td className="p-3 text-slate-400 bg-amber-950/10 border-l border-amber-500/20">
                    14.8 Ω
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-300 font-medium">Salt Removal Efficiency (Single-pass)</td>
                  <td className="p-3 text-cyan-300 font-bold bg-cyan-950/20 border-l border-cyan-500/20">
                    88.5% - 94.2%
                  </td>
                  <td className="p-3 text-slate-400 bg-amber-950/10 border-l border-amber-500/20">
                    62.0% - 74.0%
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-300 font-medium">Specific Energy Consumption (SEC)</td>
                  <td className="p-3 text-emerald-400 font-bold bg-cyan-950/20 border-l border-cyan-500/20">
                    0.42 - 0.78 kWh / m³
                  </td>
                  <td className="p-3 text-slate-400 bg-amber-950/10 border-l border-amber-500/20">
                    1.12 - 1.65 kWh / m³
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-300 font-medium">Flow Electrode Slurry Regeneration</td>
                  <td className="p-3 text-cyan-300 font-bold bg-cyan-950/20 border-l border-cyan-500/20">
                    Continuous External Regeneration
                  </td>
                  <td className="p-3 text-slate-400 bg-amber-950/10 border-l border-amber-500/20">
                    Batch / Saturated Fixed Electrodes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              setArchitecture(params.architecture === 'fish_gill_bioinspired' ? 'conventional_flat_plate' : 'fish_gill_bioinspired');
              onClose();
            }}
            className="px-5 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold font-sans text-xs hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2"
          >
            <span>Switch Cell Architecture in 3D Twin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
