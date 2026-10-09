export type ArchitectureType = 'fish_gill_bioinspired' | 'conventional_flat_plate';

export type PretreatmentMedia = {
  activatedCarbonBiochar: number; // percentage 0-100
  zeoliteRatio: number; // percentage 0-100
  ceramicSupportThickness: number; // mm
  porosity: number; // percentage 30-70
};

export type SimulationParams = {
  architecture: ArchitectureType;
  inletTDS: number; // mg/L or ppm (e.g. 1000 - 10000)
  inletPH: number; // 6.5 - 8.5
  inletTemp: number; // °C
  appliedVoltage: number; // Volts (0.4 - 1.8V)
  feedFlowRate: number; // L/min (0.2 - 5.0)
  slurryFlowRate: number; // mL/min (10 - 200)
  carbonSlurryConcentration: number; // wt% (5 - 20)
  pretreatment: PretreatmentMedia;
  explodedView: boolean;
  explodedFactor: number; // 0 (assembled) to 1 (fully exploded)
  particleDensity: number; // particle multiplier
  isSimulationActive: boolean;
  selectedSensorId: string | null;
  activeStage: 'all' | 'inlet' | 'pretreatment' | 'fcdi_cell' | 'monitoring' | 'outflow';
  showIonFlow: boolean;
  showStreamlines: boolean;
  showCutaway: boolean;
};

export type SensorTelemetry = {
  id: string;
  name: string;
  location: string;
  stage: 'inlet' | 'pretreatment' | 'fcdi' | 'product' | 'brine';
  tds: number; // mg/L
  conductivity: number; // µS/cm
  pH: number;
  temperature: number; // °C
  flowRate: number; // L/min
  pressure: number; // kPa / bar
  voltage?: number; // V (for FCDI core)
  current?: number; // A (for FCDI core)
  status: 'optimal' | 'warning' | 'critical';
  position: [number, number, number];
};

export type PerformanceMetrics = {
  saltRemovalRate: number; // µmol/(cm²·s)
  saltRemovalEfficiency: number; // %
  outletTDS: number; // mg/L
  productFlowRate: number; // L/min
  brineFlowRate: number; // L/min
  waterRecovery: number; // %
  specificEnergyConsumption: number; // kWh/m³
  electricalPower: number; // Watts
  pumpingPower: number; // Watts
  membraneAreaToVolumeRatio: number; // cm²/cm³
  avgIonTransportDistance: number; // µm
  foulingRiskIndex: number; // % 0-100
  esp32Latency: number; // ms
};

export type TelemetryDataPoint = {
  timestamp: string;
  inletTDS: number;
  outletTDS: number;
  saltRemovalEfficiency: number;
  voltage: number;
  current: number;
  power: number;
  energyConsumption: number;
  waterRecovery: number;
  bioVsConventionalDelta: number; // % improvement of bio-inspired over flat plate
};

export type ComponentDetail = {
  id: string;
  name: string;
  category: 'pretreatment' | 'desalination' | 'membrane' | 'monitoring' | 'hydraulics';
  description: string;
  scientificPrinciple: string;
  materialsUsed: string[];
  keySpecs: Record<string, string>;
  bioinspiredNotes?: string;
  position: [number, number, number];
};
