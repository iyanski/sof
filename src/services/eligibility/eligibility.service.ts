import { Carrier, Shipment, EligibilityResult } from "../../types";
import { ScoringContext, RuleEvaluationResult, ShipmentMetrics } from "./interfaces";
import { DEFAULT_CONFIG, ComprehensiveScoringConfiguration } from "./config";
import { ShipmentAnalyzer } from "./utils/shipment-analyzer";
import { ScoringStrategyManager } from "./strategy-manager";
import { EligibilityRuleEngine } from "./rule-engine";
import { ScoringStrategy } from "./interfaces";
import { CarrierConstraintExtractor } from "./utils/carrier-constraint-extractor";

export class EligibilityService {
  private readonly strategyManager: ScoringStrategyManager;
  private readonly ruleEngine: EligibilityRuleEngine;
  private config: ComprehensiveScoringConfiguration; // Make config mutable for updates

  constructor(config: Partial<ComprehensiveScoringConfiguration> = {}) {
    this.strategyManager = new ScoringStrategyManager();
    this.ruleEngine = new EligibilityRuleEngine();
    this.config = this.validateAndMergeConfig(config);
  }

  public calculateEligibilityScore(carrier: Carrier, shipment: Shipment, costRanges?: { min: number; max: number }): EligibilityResult {
    // Analyze shipment metrics once
    const shipmentMetrics = ShipmentAnalyzer.analyze(shipment);
    const context: ScoringContext = { carrier, shipment, shipmentMetrics, costRanges };

    // Check hard constraints first
    const hardConstraintViolation = this.checkHardConstraints(carrier, shipment, shipmentMetrics);
    if (hardConstraintViolation) {
      return {
        isEligible: false,
        score: 0,
        primarySignal: 0,
        secondarySignal: 0,
        reasons: [hardConstraintViolation],
        strategyScores: {
          'delivery-speed': 0,
          'environmental-impact': 0,
          'cost-efficiency': 0,
          'weight-efficiency': 0,
          'dimension-efficiency': 0,
          'capacity-utilization': 0,
        },
      };
    }

    // Calculate scores using strategies
    const primarySignal = this.strategyManager.calculatePrimaryScore(context, this.config.primaryWeights);
    const secondarySignal = this.strategyManager.calculateSecondaryScore(context, this.config.secondaryWeights);

    // Get individual strategy scores
    const primaryScores = this.strategyManager.calculatePrimaryScores(context);
    const secondaryScores = this.strategyManager.calculateSecondaryScores(context);

    // Calculate overall score
    const overallScore =
      (primarySignal * this.config.overallWeights.primary) +
      (secondarySignal * this.config.overallWeights.secondary);

    // Evaluate rules
    const ruleResults = this.ruleEngine.evaluateAllRules(carrier, context);
    const hasRuleViolations = ruleResults.some(result => !result.passed);

    // Determine eligibility
    const isEligible = overallScore >= this.config.eligibilityThreshold && !hasRuleViolations;

    // Collect reasons based on explainability level
    const reasons = this.collectReasons(context, ruleResults, overallScore, isEligible);

    return {
      isEligible,
      score: Math.round(overallScore),
      primarySignal: Math.round(primarySignal),
      secondarySignal: Math.round(secondarySignal),
      reasons,
      strategyScores: {
        'delivery-speed': Math.round(primaryScores['delivery-speed'] || 0),
        'environmental-impact': Math.round(primaryScores['environmental-impact'] || 0),
        'cost-efficiency': Math.round(primaryScores['cost-efficiency'] || 0),
        'weight-efficiency': Math.round(secondaryScores['weight-efficiency'] || 0),
        'dimension-efficiency': Math.round(secondaryScores['dimension-efficiency'] || 0),
        'capacity-utilization': Math.round(secondaryScores['capacity-utilization'] || 0),
      },
    };
  }

  // Configuration methods
  public updateConfiguration(config: Partial<ComprehensiveScoringConfiguration>): void {
    this.config = this.validateAndMergeConfig(config);
  }

  public registerPrimaryStrategy(strategy: ScoringStrategy): void {
    this.strategyManager.registerPrimaryStrategy(strategy);
  }

  public registerSecondaryStrategy(strategy: ScoringStrategy): void {
    this.strategyManager.registerSecondaryStrategy(strategy);
  }

  private collectReasons(
    context: ScoringContext,
    ruleResults: RuleEvaluationResult[],
    overallScore: number,
    isEligible: boolean
  ): string[] {
    const reasons: string[] = [];

    // Collect strategy reasons based on explainability level
    const strategyReasons = this.strategyManager.collectReasons(context, this.config.explainabilityLevel);
    reasons.push(...strategyReasons);

    // Always include rule violations (critical information)
    const ruleViolationReasons = ruleResults.flatMap(result => result.reasons);
    reasons.push(...ruleViolationReasons);

    // Add overall score explanation for eligible carriers
    if (isEligible) {
      reasons.push(`ranked by score: ${(overallScore / 100).toFixed(2)}`);
    }

    return reasons.filter(reason => reason.length > 0);
  }

  // Private validation methods
  private validateAndMergeConfig(config: Partial<ComprehensiveScoringConfiguration>): ComprehensiveScoringConfiguration {
    const mergedConfig = { ...DEFAULT_CONFIG, ...config };

    // Validate weight sums
    this.validateWeightSums(mergedConfig);

    // Validate threshold range
    this.validateThreshold(mergedConfig.eligibilityThreshold);

    return mergedConfig;
  }

  private validateWeightSums(config: ComprehensiveScoringConfiguration): void {
    const primarySum = Object.values(config.primaryWeights).reduce((sum, weight) => sum + weight, 0);
    const secondarySum = Object.values(config.secondaryWeights).reduce((sum, weight) => sum + weight, 0);
    const overallSum = config.overallWeights.primary + config.overallWeights.secondary;

    if (Math.abs(primarySum - 1.0) > 0.01) {
      throw new Error(`Primary weights must sum to 1.0, got ${primarySum.toFixed(3)}`);
    }

    if (Math.abs(secondarySum - 1.0) > 0.01) {
      throw new Error(`Secondary weights must sum to 1.0, got ${secondarySum.toFixed(3)}`);
    }

    if (Math.abs(overallSum - 1.0) > 0.01) {
      throw new Error(`Overall weights must sum to 1.0, got ${overallSum.toFixed(3)}`);
    }
  }

  private validateThreshold(threshold: number): void {
    if (threshold < 0 || threshold > 100) {
      throw new Error(`Eligibility threshold must be between 0 and 100, got ${threshold}`);
    }
  }

  private checkHardConstraints(carrier: Carrier, shipment: Shipment, shipmentMetrics: ShipmentMetrics): string | null {
    // Check destination country support
    if (!carrier.supportedCountries.includes(shipment.destinationAddress.country)) {
      return `Destination country ${shipment.destinationAddress.country} not supported`;
    }

    // Check origin country support
    if (!carrier.supportedCountries.includes(shipment.originAddress.country)) {
      return `Origin country ${shipment.originAddress.country} not supported`;
    }

    // Check weight constraints
    const maxWeight = CarrierConstraintExtractor.getMaxWeight(carrier);
    if (maxWeight && shipmentMetrics.totalWeight > maxWeight) {
      return `Total weight ${shipmentMetrics.totalWeight}kg exceeds limit ${maxWeight}kg`;
    }

    // Check volume constraints
    const maxVolume = CarrierConstraintExtractor.getMaxVolume(carrier);
    if (maxVolume && shipmentMetrics.totalVolume > maxVolume) {
      return `Total volume ${shipmentMetrics.totalVolume} exceeds limit ${maxVolume}`;
    }

    return null;
  }
}
