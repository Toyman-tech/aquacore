'use client';

import React from 'react';
import { X, BookOpen, ShieldCheck, HeartHandshake, DollarSign, Award, MapPin, GraduationCap, Download } from 'lucide-react';

interface ProjectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectInfoModal: React.FC<ProjectInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 pointer-events-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl shadow-cyan-950/80 overflow-y-auto text-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-sans flex items-center gap-2">
                AquaCore Technical Proposal & Research Dossier
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="flex items-center gap-1 text-cyan-300">
                  <GraduationCap className="w-3.5 h-3.5" /> Team AquaNova
                </span>
                •
                <span className="flex items-center gap-1 text-teal-300">
                  <MapPin className="w-3.5 h-3.5" /> University of Ilorin
                </span>
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

        {/* Executive Summary */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            EXECUTIVE SUMMARY
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            AquaCore is a compact, modular water-treatment platform designed for decentralized brackish-water treatment in water-stressed communities, schools, health facilities, and small institutions. It combines a natural-composite pretreatment stage (activated carbon/biochar, zeolite, porous ceramic) with a low-voltage fish-gill-inspired Flow-Electrode Capacitive Deionization (FCDI) stage and an ESP32 real-time IoT monitoring system.
          </p>
        </div>

        {/* 3. Proposed Solution */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 font-mono text-xs flex items-center justify-center border border-cyan-500/30">3</span>
            Proposed Solution & Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 font-mono">Stage 1: Natural-Composite Pretreatment</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Raw water passes through a pre-filter to remove non-dissolved impurities, then to a natural-composite chamber containing biomass-derived activated carbon/biochar, zeolite, and a porous ceramic support. This reduces suspended matter and organic contaminants to condition feed water before desalination.
              </p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-teal-300 font-mono">Stage 2: Fish-Gill Bio-Inspired FCDI Cell</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Uses thin parallel/stacked lamellar channels mimicking secondary fish gill lamellae. Positively and negatively charged ions migrate through cation- and anion-exchange membranes into circulating carbon-slurry electrode channels under low electrical potential (0.8 - 1.5V) for continuous external regeneration.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Expected Impact */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 font-mono text-xs flex items-center justify-center border border-cyan-500/30">4</span>
            Expected Environmental, Social & Economic Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono">
                <ShieldCheck className="w-4 h-4" /> Environmental
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Low-pressure route for brackish water desalination; utilizes natural/waste-derived biochar materials; real-time salt mass-balance monitoring enables responsible brine concentrate management.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono">
                <HeartHandshake className="w-4 h-4" /> Social
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Provides decentralized water treatment in areas where large centralized infrastructure is inaccessible. Compact and adaptable for households, schools, and health facilities.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
                <DollarSign className="w-4 h-4" /> Economic
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Uses locally obtainable pretreatment media and locally fabricated structural components to reduce dependence on expensive imported treatment units.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Implementation Roadmap */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 font-mono text-xs flex items-center justify-center border border-cyan-500/30">5</span>
            Implementation Stages (Team AquaNova)
          </h3>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-[10px]">Phase 1</span>
              <p>Characterize representative feed water and test natural-composite pretreatment formulations (Biochar, Zeolite, Porous Ceramic) for flow and turbidity removal.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-[10px]">Phase 2</span>
              <p>Fabricate baseline ion exchange cell and fish-gill-inspired cell. Test both configurations under comparable voltage, electrode composition, flow rate, and membrane area.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold text-[10px]">Phase 3</span>
              <p>Integrate complete prototype (Chamber 1 + FCDI Module + Slurry Circulation + ESP32 IoT Monitoring) for consistency, fouling, and scale-up evaluation.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            University of Ilorin • Interdisciplinary Engineering Team AquaNova
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
