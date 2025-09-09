import { ScoringStrategy, ScoringContext } from "../../interfaces";
import { DEFAULT_STRATEGY_THRESHOLDS } from "../../config";

export class CostEfficiencyStrategy implements ScoringStrategy {
  readonly name = 'cost-efficiency';

  calculate(context: ScoringContext): number {
    const carrier = context.carrier;
    const costPerKg = carrier.costPerKg;

    // Lower cost per kg = higher score
    // Use dynamic cost ranges based on available carriers
    const costRanges = this.getCostRanges(context);
    const normalizedCost = (costRanges.max - costPerKg) / (costRanges.max - costRanges.min);

    return Math.round(normalizedCost * 100);
  }

  private getCostRanges(context: ScoringContext): { min: number; max: number } {
    // Use pre-computed cost ranges if available, otherwise fall back to configured ranges
    if (context.costRanges) {
      return context.costRanges;
    }

    // Fallback to configured default ranges
    return DEFAULT_STRATEGY_THRESHOLDS.costEfficiency.fallbackRanges;
  }

  getReasons(context: ScoringContext): string[] {
    const carrier = context.carrier;
    const reasons: string[] = [];
    const thresholds = DEFAULT_STRATEGY_THRESHOLDS.costEfficiency;

    const costPerKg = carrier.costPerKg;
    const pricingLabel = this.getPricingLabel(costPerKg, thresholds);

    reasons.push(`${pricingLabel} pricing: ${costPerKg} SEK/kg`);

    return reasons;
  }

  getPositiveReasons(context: ScoringContext): string[] {
    const carrier = context.carrier;
    const reasons: string[] = [];
    const thresholds = DEFAULT_STRATEGY_THRESHOLDS.costEfficiency;

    const costPerKg = carrier.costPerKg;
    const pricingLabel = this.getPricingLabel(costPerKg, thresholds);

    if (pricingLabel === 'competitive') {
      reasons.push(`${pricingLabel} pricing: ${costPerKg} SEK/kg`);
    }

    return reasons;
  }

  private getPricingLabel(costPerKg: number, thresholds: typeof DEFAULT_STRATEGY_THRESHOLDS.costEfficiency): string {
    for (const tier of thresholds.tiers) {
      if (costPerKg <= tier.maxCostPerKg) {
        return tier.label;
      }
    }
    return 'premium'; // Fallback
  }
}
