import { Carrier } from "../../types/carrier";
import { Shipment } from "../../types/shipment";

// ===========================
// CORE INTERFACES & TYPES
// ===========================

export interface ScoringContext {
  carrier: Carrier;
  shipment: Shipment;
  shipmentMetrics: ShipmentMetrics;
  costRanges?: { min: number; max: number }; // Pre-computed cost ranges for efficiency
}

export interface ShipmentMetrics {
  totalWeight: number;
  totalVolume: number;
  maxDimensions: { length: number; width: number; height: number };
}

export interface ScoringStrategy {
  readonly name: string;
  calculate(context: ScoringContext): number;
  getReasons?(context: ScoringContext): string[];
  getPositiveReasons?(context: ScoringContext): string[];
}

export interface RuleEvaluationResult {
  passed: boolean;
  reasons: string[];
}

export type ExplainabilityLevel = 'minimal' | 'positive-only' | 'full';

export interface ScoringConfiguration {
  primaryWeights: Record<string, number>;
  secondaryWeights: Record<string, number>;
  overallWeights: { primary: number; secondary: number };
  eligibilityThreshold: number;
  explainabilityLevel: ExplainabilityLevel;
}
