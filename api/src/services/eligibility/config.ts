import { ScoringConfiguration } from "./interfaces";

// ===========================
// COMPREHENSIVE CONFIGURATION
// ===========================

export interface StrategyThresholds {
  deliverySpeed: {
    tiers: Array<{ maxDays: number; score: number }>;
  };
  environmentalImpact: {
    tiers: Array<{ maxImpact: number; score: number }>;
  };
  costEfficiency: {
    tiers: Array<{ maxCostPerKg: number; label: string }>;
    fallbackRanges: { min: number; max: number };
  };
  weightEfficiency: {
    optimalRange: { min: number; max: number };
    score: number;
  };
  capacityUtilization: {
    optimalRange: { min: number; max: number };
    score: number;
  };
  serviceQuality: {
    deliveryWeight: number;
    environmentalWeight: number;
  };
}

export interface ComprehensiveScoringConfiguration extends ScoringConfiguration {
  strategyThresholds: StrategyThresholds;
}

export const DEFAULT_STRATEGY_THRESHOLDS: StrategyThresholds = {
  deliverySpeed: {
    tiers: [
      { maxDays: 1, score: 100 },
      { maxDays: 2, score: 80 },
      { maxDays: 3, score: 60 },
      { maxDays: 4, score: 40 },
      { maxDays: Infinity, score: 20 },
    ],
  },
  environmentalImpact: {
    tiers: [
      { maxImpact: 2, score: 100 },
      { maxImpact: 4, score: 80 },
      { maxImpact: 6, score: 60 },
      { maxImpact: 8, score: 40 },
      { maxImpact: Infinity, score: 20 },
    ],
  },
  costEfficiency: {
    tiers: [
      { maxCostPerKg: 15, label: 'competitive' },
      { maxCostPerKg: 25, label: 'moderate' },
      { maxCostPerKg: Infinity, label: 'premium' },
    ],
    fallbackRanges: { min: 10, max: 33 },
  },
  weightEfficiency: {
    optimalRange: { min: 0.2, max: 0.8 },
    score: 100,
  },
  capacityUtilization: {
    optimalRange: { min: 40, max: 70 },
    score: 100,
  },
  serviceQuality: {
    deliveryWeight: 0.7,
    environmentalWeight: 0.3,
  },
} as const;

export const DEFAULT_CONFIG: ComprehensiveScoringConfiguration = {
  primaryWeights: {
    'delivery-speed': 0.35, // Reduced to make room for increased cost efficiency
    'environmental-impact': 0.293, // Reduced to make room for increased cost efficiency
    'cost-efficiency': 0.357, // Increased to 25% of total score (35.7% of primary weights)
  },
  secondaryWeights: {
    'weight-efficiency': 0.4,
    'dimension-efficiency': 0.3,
    'capacity-utilization': 0.3,
  },
  overallWeights: {
    primary: 0.7,
    secondary: 0.3,
  },
  eligibilityThreshold: 65,
  explainabilityLevel: 'positive-only', // Default to current behavior
  strategyThresholds: DEFAULT_STRATEGY_THRESHOLDS,
} as const;
