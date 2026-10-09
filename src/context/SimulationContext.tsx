'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  ArchitectureType,
  ComponentDetail,
  PerformanceMetrics,
  SensorTelemetry,
  SimulationParams,
  TelemetryDataPoint,
} from '../types/digital-twin';
import { calculatePhysicsMetrics, generateSensorNodes } from '../utils/physics-engine';
import { AQUACORE_COMPONENTS } from '../data/component-details';

interface SimulationContextType {
  params: SimulationParams;
  metrics: PerformanceMetrics;
  sensors: SensorTelemetry[];
  telemetryHistory: TelemetryDataPoint[];
  selectedComponent: ComponentDetail | null;
  selectedSensor: SensorTelemetry | null;
  isTourActive: boolean;
  tourStep: number;

  // Actions
  setArchitecture: (arch: ArchitectureType) => void;
  setInletTDS: (tds: number) => void;
  setAppliedVoltage: (voltage: number) => void;
  setFeedFlowRate: (flow: number) => void;
  setSlurryFlowRate: (slurry: number) => void;
  setExplodedView: (exploded: boolean) => void;
  setExplodedFactor: (factor: number) => void;
  setShowCutaway: (cutaway: boolean) => void;
  setShowIonFlow: (ion: boolean) => void;
  setShowStreamlines: (streamlines: boolean) => void;
  setActiveStage: (stage: SimulationParams['activeStage']) => void;
  setSelectedSensorId: (id: string | null) => void;
  setSelectedComponentId: (id: string | null) => void;
  updatePretreatmentBiochar: (val: number) => void;
  updatePretreatmentZeolite: (val: number) => void;
  toggleSimulationPause: () => void;
  startGuidedTour: () => void;
  stopGuidedTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  resetToDefaults: () => void;
}

const defaultParams: SimulationParams = {
  architecture: 'fish_gill_bioinspired',
  inletTDS: 3200, // Brackish water default 3,200 ppm
  inletPH: 7.4,
  inletTemp: 26.5,
  appliedVoltage: 1.2, // 1.2V low potential FCDI
  feedFlowRate: 1.8, // L/min
  slurryFlowRate: 85, // mL/min
  carbonSlurryConcentration: 12, // 12 wt%
  pretreatment: {
    activatedCarbonBiochar: 45,
    zeoliteRatio: 35,
    ceramicSupportThickness: 15,
    porosity: 48,
  },
  explodedView: false,
  explodedFactor: 0,
  isSimulationActive: true,
  selectedSensorId: null,
  activeStage: 'all',
  showIonFlow: true,
  showStreamlines: true,
  showCutaway: false,
  particleDensity: 1.0,
};

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryDataPoint[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  // Compute live physics metrics dynamically based on inputs
  const metrics = useMemo(() => calculatePhysicsMetrics(params), [params]);
  const sensors = useMemo(() => generateSensorNodes(params, metrics), [params, metrics]);

  // Conventional baseline comparison for telemetry delta calculation
  const conventionalMetrics = useMemo(() => {
    return calculatePhysicsMetrics({ ...params, architecture: 'conventional_flat_plate' });
  }, [params]);

  // Selected sensor detail lookup
  const selectedSensor = useMemo(() => {
    if (!params.selectedSensorId) return null;
    return sensors.find((s) => s.id === params.selectedSensorId) || null;
  }, [sensors, params.selectedSensorId]);

  // Selected component detail lookup
  const selectedComponent = useMemo(() => {
    if (!selectedComponentId) return null;
    return AQUACORE_COMPONENTS.find((c) => c.id === selectedComponentId) || null;
  }, [selectedComponentId]);

  // Telemetry loop updating time series data
  useEffect(() => {
    if (!params.isSimulationActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      const bioEfficiency = metrics.saltRemovalEfficiency;
      const convEfficiency = conventionalMetrics.saltRemovalEfficiency;
      const improvementDelta = Number((((bioEfficiency - convEfficiency) / convEfficiency) * 100).toFixed(1));

      // Add noise for real-time sensor fluctuation realism
      const noise = (Math.random() - 0.5) * 4;

      const newPoint: TelemetryDataPoint = {
        timestamp: timeStr,
        inletTDS: Math.round(params.inletTDS + noise * 2),
        outletTDS: Math.max(10, Math.round(metrics.outletTDS + noise)),
        saltRemovalEfficiency: Math.min(99, Number((metrics.saltRemovalEfficiency + noise * 0.1).toFixed(1))),
        voltage: Number((params.appliedVoltage + (Math.random() - 0.5) * 0.01).toFixed(2)),
        current: Number(((metrics.electricalPower / params.appliedVoltage) + (Math.random() - 0.5) * 0.05).toFixed(2)),
        power: Number((metrics.electricalPower + noise * 0.2).toFixed(1)),
        energyConsumption: metrics.specificEnergyConsumption,
        waterRecovery: metrics.waterRecovery,
        bioVsConventionalDelta: Math.max(0, improvementDelta),
      };

      setTelemetryHistory((prev) => {
        const updated = [...prev, newPoint];
        if (updated.length > 25) updated.shift();
        return updated;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [params.isSimulationActive, params.inletTDS, params.appliedVoltage, metrics, conventionalMetrics]);

  // Param update setters
  const setArchitecture = useCallback((architecture: ArchitectureType) => {
    setParams((prev) => ({ ...prev, architecture }));
  }, []);

  const setInletTDS = useCallback((inletTDS: number) => {
    setParams((prev) => ({ ...prev, inletTDS }));
  }, []);

  const setAppliedVoltage = useCallback((appliedVoltage: number) => {
    setParams((prev) => ({ ...prev, appliedVoltage }));
  }, []);

  const setFeedFlowRate = useCallback((feedFlowRate: number) => {
    setParams((prev) => ({ ...prev, feedFlowRate }));
  }, []);

  const setSlurryFlowRate = useCallback((slurryFlowRate: number) => {
    setParams((prev) => ({ ...prev, slurryFlowRate }));
  }, []);

  const setExplodedView = useCallback((explodedView: boolean) => {
    setParams((prev) => ({
      ...prev,
      explodedView,
      explodedFactor: explodedView ? 1 : 0,
    }));
  }, []);

  const setExplodedFactor = useCallback((explodedFactor: number) => {
    setParams((prev) => ({
      ...prev,
      explodedFactor,
      explodedView: explodedFactor > 0.05,
    }));
  }, []);

  const setShowCutaway = useCallback((showCutaway: boolean) => {
    setParams((prev) => ({ ...prev, showCutaway }));
  }, []);

  const setShowIonFlow = useCallback((showIonFlow: boolean) => {
    setParams((prev) => ({ ...prev, showIonFlow }));
  }, []);

  const setShowStreamlines = useCallback((showStreamlines: boolean) => {
    setParams((prev) => ({ ...prev, showStreamlines }));
  }, []);

  const setActiveStage = useCallback((activeStage: SimulationParams['activeStage']) => {
    setParams((prev) => ({ ...prev, activeStage }));
  }, []);

  const setSelectedSensorId = useCallback((selectedSensorId: string | null) => {
    setParams((prev) => ({ ...prev, selectedSensorId }));
  }, []);

  const updatePretreatmentBiochar = useCallback((val: number) => {
    setParams((prev) => ({
      ...prev,
      pretreatment: { ...prev.pretreatment, activatedCarbonBiochar: val },
    }));
  }, []);

  const updatePretreatmentZeolite = useCallback((val: number) => {
    setParams((prev) => ({
      ...prev,
      pretreatment: { ...prev.pretreatment, zeoliteRatio: val },
    }));
  }, []);

  const toggleSimulationPause = useCallback(() => {
    setParams((prev) => ({ ...prev, isSimulationActive: !prev.isSimulationActive }));
  }, []);

  // Guided Tour handlers
  const tourStages: SimulationParams['activeStage'][] = [
    'inlet',
    'pretreatment',
    'fcdi_cell',
    'monitoring',
    'outflow',
  ];

  const startGuidedTour = useCallback(() => {
    setIsTourActive(true);
    setTourStep(0);
    setActiveStage(tourStages[0]);
  }, []);

  const stopGuidedTour = useCallback(() => {
    setIsTourActive(false);
    setActiveStage('all');
  }, []);

  const nextTourStep = useCallback(() => {
    setTourStep((prev) => {
      const next = prev + 1;
      if (next >= tourStages.length) {
        setIsTourActive(false);
        setActiveStage('all');
        return 0;
      }
      setActiveStage(tourStages[next]);
      return next;
    });
  }, []);

  const prevTourStep = useCallback(() => {
    setTourStep((prev) => {
      const prevStep = Math.max(0, prev - 1);
      setActiveStage(tourStages[prevStep]);
      return prevStep;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setParams(defaultParams);
    setSelectedComponentId(null);
    setIsTourActive(false);
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        params,
        metrics,
        sensors,
        telemetryHistory,
        selectedComponent,
        selectedSensor,
        isTourActive,
        tourStep,
        setArchitecture,
        setInletTDS,
        setAppliedVoltage,
        setFeedFlowRate,
        setSlurryFlowRate,
        setExplodedView,
        setExplodedFactor,
        setShowCutaway,
        setShowIonFlow,
        setShowStreamlines,
        setActiveStage,
        setSelectedSensorId,
        setSelectedComponentId,
        updatePretreatmentBiochar,
        updatePretreatmentZeolite,
        toggleSimulationPause,
        startGuidedTour,
        stopGuidedTour,
        nextTourStep,
        prevTourStep,
        resetToDefaults,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
