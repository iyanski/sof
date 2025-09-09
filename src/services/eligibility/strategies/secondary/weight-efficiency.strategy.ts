import { ScoringStrategy, ScoringContext } from "../../interfaces";
import { CarrierConstraintExtractor } from "../../utils/carrier-constraint-extractor";
import { DEFAULT_STRATEGY_THRESHOLDS } from "../../config";

export class WeightEfficiencyStrategy implements ScoringStrategy {
  readonly name = 'weight-efficiency';

  calculate(context: ScoringContext): number {
    const maxWeight = CarrierConstraintExtractor.getMaxWeight(context.carrier);
    if (!maxWeight) return 100;

    const utilization = context.shipmentMetrics.totalWeight / maxWeight;
    const thresholds = DEFAULT_STRATEGY_THRESHOLDS.weightEfficiency;

    // Check if within optimal range
    if (utilization >= thresholds.optimalRange.min && utilization <= thresholds.optimalRange.max) {
      return thresholds.score;
    }

    if (utilization < thresholds.optimalRange.min) return 50 + (utilization * 250);
    if (utilization > thresholds.optimalRange.max) return Math.max(0, 100 - ((utilization - thresholds.optimalRange.max) * 500));

    return Math.max(0, 100 - (utilization * 100));
  }

  getPositiveReasons(context: ScoringContext): string[] {
    const maxWeight = CarrierConstraintExtractor.getMaxWeight(context.carrier);
    if (!maxWeight) return [];

    const utilization = context.shipmentMetrics.totalWeight / maxWeight;
    const reasons: string[] = [];

    if (utilization >= 0.2 && utilization <= 0.8) {
      reasons.push(`optimal weight utilization: ${(utilization * 100).toFixed(1)}%`);
    } else if (utilization < 0.2) {
      reasons.push(`low weight utilization: ${(utilization * 100).toFixed(1)}%`);
    } else if (utilization > 0.8) {
      reasons.push(`high weight utilization: ${(utilization * 100).toFixed(1)}%`);
    }

    return reasons;
  }
}
