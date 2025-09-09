// Main service
export { EligibilityService } from './eligibility.service';

// Interfaces and types
export * from './interfaces';

// Configuration
export { DEFAULT_CONFIG } from './config';

// Utilities
export { ShipmentAnalyzer } from './utils/shipment-analyzer';
export { CarrierConstraintExtractor } from './utils/carrier-constraint-extractor';

// Strategies (removed orphaned strategies)
export { DeliverySpeedStrategy } from './strategies/primary/delivery-speed.strategy';
export { EnvironmentalImpactStrategy } from './strategies/primary/environmental-impact.strategy';
export { WeightEfficiencyStrategy } from './strategies/secondary/weight-efficiency.strategy';
export { DimensionEfficiencyStrategy } from './strategies/secondary/dimension-efficiency.strategy';
export { CapacityUtilizationStrategy } from './strategies/secondary/capacity-utilization.strategy';

// Core components
export { ScoringStrategyManager } from './strategy-manager';
export { EligibilityRuleEngine } from './rule-engine';
