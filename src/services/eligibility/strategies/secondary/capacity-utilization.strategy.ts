import { ScoringStrategy, ScoringContext } from "../../interfaces";
import { CarrierConstraintExtractor } from "../../utils/carrier-constraint-extractor";
import { DEFAULT_STRATEGY_THRESHOLDS } from "../../config";

export class CapacityUtilizationStrategy implements ScoringStrategy {
  readonly name = 'capacity-utilization';

  calculate(context: ScoringContext): number {
    const maxWeight = CarrierConstraintExtractor.getMaxWeight(context.carrier);
    const maxVolume = CarrierConstraintExtractor.getMaxVolume(context.carrier);

    // If no constraints, return high score (like other strategies)
    if (!maxWeight && !maxVolume) return 100;

    const weightUtil = maxWeight ? (context.shipmentMetrics.totalWeight / maxWeight) * 100 : 0;
    const volumeUtil = maxVolume ? (context.shipmentMetrics.totalVolume / maxVolume) * 100 : 0;

    // Use the higher utilization (bottleneck)
    const utilization = Math.max(weightUtil, volumeUtil);
    const thresholds = DEFAULT_STRATEGY_THRESHOLDS.capacityUtilization;

    // Check if within optimal range
    if (utilization >= thresholds.optimalRange.min && utilization <= thresholds.optimalRange.max) {
      return thresholds.score;
    }

    if (utilization < thresholds.optimalRange.min) return utilization * 2.5;
    return Math.max(0, 100 - ((utilization - thresholds.optimalRange.max) * 2));
  }

  getPositiveReasons(context: ScoringContext): string[] {
    const maxWeight = CarrierConstraintExtractor.getMaxWeight(context.carrier);
    const maxVolume = CarrierConstraintExtractor.getMaxVolume(context.carrier);

    const weightUtil = maxWeight ? (context.shipmentMetrics.totalWeight / maxWeight) * 100 : 0;
    const volumeUtil = maxVolume ? (context.shipmentMetrics.totalVolume / maxVolume) * 100 : 0;

    const utilization = Math.max(weightUtil, volumeUtil);
    const reasons: string[] = [];

    if (utilization >= 40 && utilization <= 70) {
      reasons.push(`optimal capacity utilization: ${utilization.toFixed(1)}%`);
    } else if (utilization < 40) {
      reasons.push(`low capacity utilization: ${utilization.toFixed(1)}%`);
    } else if (utilization > 70) {
      reasons.push(`high capacity utilization: ${utilization.toFixed(1)}%`);
    }

    return reasons;
  }
}
