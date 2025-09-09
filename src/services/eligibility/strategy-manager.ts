import { ScoringStrategy, ScoringContext, ExplainabilityLevel } from "./interfaces";
import { DeliverySpeedStrategy } from "./strategies/primary/delivery-speed.strategy";
import { EnvironmentalImpactStrategy } from "./strategies/primary/environmental-impact.strategy";
import { CostEfficiencyStrategy } from "./strategies/primary/cost-efficiency.strategy";
import { WeightEfficiencyStrategy } from "./strategies/secondary/weight-efficiency.strategy";
import { DimensionEfficiencyStrategy } from "./strategies/secondary/dimension-efficiency.strategy";
import { CapacityUtilizationStrategy } from "./strategies/secondary/capacity-utilization.strategy";

// ===========================
// STRATEGY MANAGER
// ===========================

export class ScoringStrategyManager {
  private primaryStrategies = new Map<string, ScoringStrategy>();
  private secondaryStrategies = new Map<string, ScoringStrategy>();

  constructor() {
    // Register primary strategies
    this.registerPrimaryStrategy(new DeliverySpeedStrategy());
    this.registerPrimaryStrategy(new EnvironmentalImpactStrategy());
    this.registerPrimaryStrategy(new CostEfficiencyStrategy());

    // Register secondary strategies
    this.registerSecondaryStrategy(new WeightEfficiencyStrategy());
    this.registerSecondaryStrategy(new DimensionEfficiencyStrategy());
    this.registerSecondaryStrategy(new CapacityUtilizationStrategy());
  }

  registerPrimaryStrategy(strategy: ScoringStrategy): void {
    this.primaryStrategies.set(strategy.name, strategy);
  }

  registerSecondaryStrategy(strategy: ScoringStrategy): void {
    this.secondaryStrategies.set(strategy.name, strategy);
  }

  calculatePrimaryScore(context: ScoringContext, weights: Record<string, number>): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const [strategyName, weight] of Object.entries(weights)) {
      const strategy = this.primaryStrategies.get(strategyName);
      if (strategy) {
        totalScore += strategy.calculate(context) * weight;
        totalWeight += weight;
      }
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  calculatePrimaryScores(context: ScoringContext): Record<string, number> {
    const scores: Record<string, number> = {};

    for (const [strategyName, strategy] of this.primaryStrategies) {
      scores[strategyName] = strategy.calculate(context);
    }

    return scores;
  }

  calculateSecondaryScore(context: ScoringContext, weights: Record<string, number>): number {
    let totalScore = 0;
    let totalWeight = 0;

    for (const [strategyName, weight] of Object.entries(weights)) {
      const strategy = this.secondaryStrategies.get(strategyName);
      if (strategy) {
        totalScore += strategy.calculate(context) * weight;
        totalWeight += weight;
      }
    }

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  calculateSecondaryScores(context: ScoringContext): Record<string, number> {
    const scores: Record<string, number> = {};

    for (const [strategyName, strategy] of this.secondaryStrategies) {
      scores[strategyName] = strategy.calculate(context);
    }

    return scores;
  }

  collectReasons(context: ScoringContext, explainabilityLevel: ExplainabilityLevel): string[] {
    const reasons: string[] = [];

    switch (explainabilityLevel) {
    case 'minimal':
      // Only return empty array - no strategy reasons
      break;

    case 'positive-only':
      // Current behavior - only positive reasons
      reasons.push(...this.collectPositiveReasons(context));
      break;

    case 'full':
      // Include both positive and negative reasons
      reasons.push(...this.collectAllReasons(context));
      break;
    }

    return reasons;
  }

  private collectAllReasons(context: ScoringContext): string[] {
    const reasons: string[] = [];

    // Collect all reasons from primary strategies
    for (const strategy of this.primaryStrategies.values()) {
      if (strategy.getReasons) {
        reasons.push(...strategy.getReasons(context));
      }
    }

    // Collect all reasons from secondary strategies
    for (const strategy of this.secondaryStrategies.values()) {
      if (strategy.getReasons) {
        reasons.push(...strategy.getReasons(context));
      }
    }

    return reasons;
  }

  // Keep existing method for backward compatibility
  collectPositiveReasons(context: ScoringContext): string[] {
    const reasons: string[] = [];

    // Collect positive reasons from primary strategies
    for (const strategy of this.primaryStrategies.values()) {
      if (strategy.getPositiveReasons) {
        reasons.push(...strategy.getPositiveReasons(context));
      }
    }

    // Collect positive reasons from secondary strategies
    for (const strategy of this.secondaryStrategies.values()) {
      if (strategy.getPositiveReasons) {
        reasons.push(...strategy.getPositiveReasons(context));
      }
    }

    return reasons;
  }
}
