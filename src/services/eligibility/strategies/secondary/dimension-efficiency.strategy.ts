import { ScoringStrategy, ScoringContext } from "../../interfaces";
import { CarrierConstraintExtractor } from "../../utils/carrier-constraint-extractor";

export class DimensionEfficiencyStrategy implements ScoringStrategy {
  readonly name = 'dimension-efficiency';

  calculate(context: ScoringContext): number {
    const carrierMax = CarrierConstraintExtractor.getMaxDimensions(context.carrier);
    if (!carrierMax) return 100;

    const { maxDimensions } = context.shipmentMetrics;
    const lengthRatio = maxDimensions.length / carrierMax.length;
    const widthRatio = maxDimensions.width / carrierMax.width;
    const heightRatio = maxDimensions.height / carrierMax.height;

    const maxRatio = Math.max(lengthRatio, widthRatio, heightRatio);

    // Exponential decay for better discrimination
    return Math.max(0, 100 * Math.exp(-2 * (maxRatio - 1)));
  }

  getPositiveReasons(context: ScoringContext): string[] {
    const carrierMax = CarrierConstraintExtractor.getMaxDimensions(context.carrier);
    if (!carrierMax) return [];

    const { maxDimensions } = context.shipmentMetrics;
    const lengthRatio = maxDimensions.length / carrierMax.length;
    const widthRatio = maxDimensions.width / carrierMax.width;
    const heightRatio = maxDimensions.height / carrierMax.height;

    const maxRatio = Math.max(lengthRatio, widthRatio, heightRatio);
    const reasons: string[] = [];

    if (maxRatio <= 1.0) {
      reasons.push(`efficient dimensions: ${(maxRatio * 100).toFixed(1)}% of limits`);
    } else if (maxRatio <= 1.2) {
      reasons.push(`acceptable dimensions: ${(maxRatio * 100).toFixed(1)}% of limits`);
    }

    return reasons;
  }
}
