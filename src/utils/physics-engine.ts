import { PerformanceMetrics, SensorTelemetry, SimulationParams } from '../types/digital-twin';

/**
 * Computes realistic electro-chemical and hydraulic physics for AquaCore Digital Twin
 */
export function calculatePhysicsMetrics(params: SimulationParams): PerformanceMetrics {
  const {
    architecture,
    inletTDS,
    appliedVoltage,
    feedFlowRate,
    slurryFlowRate,
    carbonSlurryConcentration,
    pretreatment,
  } = params;

  const isBio = architecture === 'fish_gill_bioinspired';

  // 1. Pretreatment conditioning factor
  // Biochar + Zeolite + Ceramic reduces turbidity and conditions ionic mobility
  const pretreatmentEfficiency =
    (pretreatment.activatedCarbonBiochar * 0.4 +
      pretreatment.zeoliteRatio * 0.4 +
      pretreatment.porosity * 0.2) / 100;
  
  // Effective TDS entering FCDI after pretreatment binding of divalent organics/clays
  const conditionedInletTDS = inletTDS * (1 - 0.08 * pretreatmentEfficiency);

  // 2. Biomimicry Geometric Multipliers
  // Fish Gill Lamellae: High area-to-volume ratio, thin channels, shorter diffusion distance
  const areaToVolume = isBio ? 38.5 : 8.2; // cm²/cm³
  const diffusionDistance = isBio ? 140 : 620; // µm

  // 3. Electro-migration driving force (Nernst-Planck model approximation)
  // Higher voltage increases ion flux up to mass transfer limit (around 1.6V - 1.8V where water splitting starts)
  const effectiveVoltage = Math.min(appliedVoltage, 1.7);
  const voltageFactor = Math.pow(effectiveVoltage / 1.2, 1.15);

  // Slurry conductivity influence
  const slurryFactor = (carbonSlurryConcentration / 10) * (slurryFlowRate / 80);

  // Kinetic rate constant (Fish gill architecture yields ~2.4x higher ion removal efficiency)
  const kineticRate = isBio ? 0.0082 : 0.0034;
  
  // Calculate salt removal percentage (SRE %)
  // Residence time in cell inversely proportional to feed flow rate
  const residenceTimeFactor = 1.0 / Math.pow(feedFlowRate, 0.45);
  
  let rawRemovalEfficiency = 
    (1 - Math.exp(-kineticRate * areaToVolume * (1000 / diffusionDistance) * voltageFactor * slurryFactor * residenceTimeFactor)) * 100;
  
  // Cap realistic efficiency limits (70% - 94% for brackish water single-pass FCDI)
  const maxCap = isBio ? 94.5 : 74.0;
  const saltRemovalEfficiency = Math.min(Math.max(rawRemovalEfficiency, 15), maxCap);

  // Outlet TDS
  const outletTDS = Math.max(25, Math.round(conditionedInletTDS * (1 - saltRemovalEfficiency / 100)));

  // Salt Removal Rate (SRR) in µmol/(cm²·s)
  const saltRemovedMgL = conditionedInletTDS - outletTDS;
  const molarMassNaCl = 58.44; // g/mol
  const activeMembraneAreaCm2 = isBio ? 1200 : 320;
  const feedFlowLperSec = (feedFlowRate * 0.75) / 60; // 75% water recovery
  
  const saltRemovalRate = 
    ((saltRemovedMgL / 1000) * feedFlowLperSec / molarMassNaCl * 1000000) / activeMembraneAreaCm2;

  // Water Recovery % (typically 70-85% in FCDI)
  const waterRecovery = isBio ? 82.5 : 71.0;
  const productFlowRate = feedFlowRate * (waterRecovery / 100);
  const brineFlowRate = feedFlowRate - productFlowRate;

  // Electrical Current (I = dQ_ion * z * F + I_leak)
  const cellResistance = isBio ? 4.2 : 14.8; // Ohms (lower resistance in thin gill channels)
  const current = appliedVoltage / cellResistance; // Amperes
  const electricalPower = appliedVoltage * current; // Watts

  // Hydraulic Pumping Power (P = deltaP * Q)
  const pressureDropKPa = isBio ? 18.5 : 32.0; // kPa
  const pumpingPower = (pressureDropKPa * 1000 * (feedFlowRate / 60000)) / 0.65; // Watts (65% pump efficiency)

  // Specific Energy Consumption (SEC in kWh/m³)
  const totalPowerKW = (electricalPower + pumpingPower) / 1000;
  const productFlowM3perHr = (productFlowRate * 60) / 1000;
  const specificEnergyConsumption = productFlowM3perHr > 0 ? totalPowerKW / productFlowM3perHr : 0;

  // Fouling Risk Index (% reduction in risk due to pretreatment + slurry turbulence)
  const foulingRiskIndex = Math.max(5, Math.min(95, 85 - pretreatmentEfficiency * 45 - (isBio ? 20 : 0)));

  // Deterministic ESP32 Latency (ms) without Math.random prerender error
  const esp32Latency = Math.floor(14 + ((appliedVoltage * 10) % 5));

  return {
    saltRemovalRate: Number(saltRemovalRate.toFixed(2)),
    saltRemovalEfficiency: Number(saltRemovalEfficiency.toFixed(1)),
    outletTDS,
    productFlowRate: Number(productFlowRate.toFixed(2)),
    brineFlowRate: Number(brineFlowRate.toFixed(2)),
    waterRecovery: Number(waterRecovery.toFixed(1)),
    specificEnergyConsumption: Number(specificEnergyConsumption.toFixed(3)),
    electricalPower: Number(electricalPower.toFixed(2)),
    pumpingPower: Number(pumpingPower.toFixed(2)),
    membraneAreaToVolumeRatio: areaToVolume,
    avgIonTransportDistance: diffusionDistance,
    foulingRiskIndex: Number(foulingRiskIndex.toFixed(0)),
    esp32Latency,
  };
}

/**
 * Generate 5 sensor telemetry readings across the processing skid
 */
export function generateSensorNodes(params: SimulationParams, metrics: PerformanceMetrics): SensorTelemetry[] {
  const { inletTDS, inletPH, inletTemp, feedFlowRate, appliedVoltage } = params;

  return [
    {
      id: 'sensor-1',
      name: 'SN-101: Raw Feed Water Sensor',
      location: 'Pretreatment Inlet Nozzle',
      stage: 'inlet',
      tds: inletTDS,
      conductivity: Math.round(inletTDS * 1.98),
      pH: inletPH,
      temperature: inletTemp,
      flowRate: feedFlowRate,
      pressure: 120.5,
      status: 'optimal',
      position: [-4.2, 0.5, 0],
    },
    {
      id: 'sensor-2',
      name: 'SN-102: Composite Chamber Outlet',
      location: 'Chamber 1 Post-Filtration Line',
      stage: 'pretreatment',
      tds: Math.round(inletTDS * 0.94),
      conductivity: Math.round(inletTDS * 0.94 * 1.95),
      pH: Number((inletPH + 0.2).toFixed(2)),
      temperature: Number((inletTemp + 0.1).toFixed(1)),
      flowRate: Number((feedFlowRate * 0.98).toFixed(2)),
      pressure: 112.0,
      status: 'optimal',
      position: [-1.8, 0.5, 0],
    },
    {
      id: 'sensor-3',
      name: 'SN-201: Bio-Gill FCDI Core Sensor',
      location: 'Central Deionization Channel',
      stage: 'fcdi',
      tds: Math.round((inletTDS + metrics.outletTDS) / 2),
      conductivity: Math.round(((inletTDS + metrics.outletTDS) / 2) * 1.92),
      pH: Number((inletPH + 0.1).toFixed(2)),
      temperature: Number((inletTemp + 0.6).toFixed(1)),
      flowRate: Number((feedFlowRate * 0.85).toFixed(2)),
      pressure: 95.4,
      voltage: appliedVoltage,
      current: Number((metrics.electricalPower / appliedVoltage).toFixed(2)),
      status: appliedVoltage > 1.7 ? 'warning' : 'optimal',
      position: [0.8, 0.8, 0],
    },
    {
      id: 'sensor-4',
      name: 'SN-301: Purified Water Outlet',
      location: 'Permeate Product Line',
      stage: 'product',
      tds: metrics.outletTDS,
      conductivity: Math.round(metrics.outletTDS * 1.90),
      pH: 7.15,
      temperature: Number((inletTemp + 0.3).toFixed(1)),
      flowRate: metrics.productFlowRate,
      pressure: 45.2,
      status: metrics.outletTDS < 500 ? 'optimal' : 'warning',
      position: [3.8, 0.4, 0.8],
    },
    {
      id: 'sensor-5',
      name: 'SN-302: Brine Concentrate Sensor',
      location: 'Concentrate Stream Discharge',
      stage: 'brine',
      tds: Math.round(inletTDS + (inletTDS - metrics.outletTDS) * (metrics.productFlowRate / metrics.brineFlowRate)),
      conductivity: Math.round((inletTDS + (inletTDS - metrics.outletTDS) * 2.5) * 1.95),
      pH: 6.78,
      temperature: Number((inletTemp + 0.9).toFixed(1)),
      flowRate: metrics.brineFlowRate,
      pressure: 38.0,
      status: 'optimal',
      position: [3.8, -0.6, -0.8],
    },
  ];
}
