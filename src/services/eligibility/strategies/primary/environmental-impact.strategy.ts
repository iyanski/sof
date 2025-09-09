import { ScoringStrategy, ScoringContext } from "../../interfaces";
import { DEFAULT_STRATEGY_THRESHOLDS } from "../../config";

export class EnvironmentalImpactStrategy implements ScoringStrategy {
  readonly name = 'environmental-impact';

  calculate(context: ScoringContext): number {
    const environmentalImpact = context.carrier.environmentalImpact;
    const thresholds = DEFAULT_STRATEGY_THRESHOLDS.environmentalImpact;

    // Find the appropriate tier for the environmental impact
    for (const tier of thresholds.tiers) {
      if (environmentalImpact <= tier.maxImpact) {
        return tier.score;
      }
    }

    // Fallback to lowest score if no tier matches
    return thresholds.tiers[thresholds.tiers.length - 1].score;
  }

  getReasons(context: ScoringContext): string[] {
    const environmentalImpact = context.carrier.environmentalImpact;
    const reasons: string[] = [];

    if (environmentalImpact > 6) {
      reasons.push(`Environmental impact ${environmentalImpact} is higher than optimal`);
    }

    return reasons;
  }

  getPositiveReasons(context: ScoringContext): string[] {
    const environmentalImpact = context.carrier.environmentalImpact;
    const reasons: string[] = [];

    if (environmentalImpact <= 2) {
      reasons.push(`low environmental impact: ${environmentalImpact}`);
    } else if (environmentalImpact <= 4) {
      reasons.push(`good environmental impact: ${environmentalImpact}`);
    } else if (environmentalImpact <= 6) {
      reasons.push(`acceptable environmental impact: ${environmentalImpact}`);
    }

    return reasons;
  }
}
