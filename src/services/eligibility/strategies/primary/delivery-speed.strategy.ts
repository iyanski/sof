import { ScoringStrategy, ScoringContext } from "../../interfaces";
import { DEFAULT_STRATEGY_THRESHOLDS } from "../../config";

export class DeliverySpeedStrategy implements ScoringStrategy {
  readonly name = 'delivery-speed';

  calculate(context: ScoringContext): number {
    const deliveryTime = context.carrier.deliveryTime;
    const thresholds = DEFAULT_STRATEGY_THRESHOLDS.deliverySpeed;

    // Find the appropriate tier for the delivery time
    for (const tier of thresholds.tiers) {
      if (deliveryTime <= tier.maxDays) {
        return tier.score;
      }
    }

    // Fallback to lowest score if no tier matches
    return thresholds.tiers[thresholds.tiers.length - 1].score;
  }

  getReasons(context: ScoringContext): string[] {
    const deliveryTime = context.carrier.deliveryTime;
    const reasons: string[] = [];

    if (deliveryTime > 3) {
      reasons.push(`Delivery time ${deliveryTime} days is slower than optimal`);
    }

    return reasons;
  }

  getPositiveReasons(context: ScoringContext): string[] {
    const deliveryTime = context.carrier.deliveryTime;
    const reasons: string[] = [];

    if (deliveryTime <= 1) {
      reasons.push(`high delivery speed: ${deliveryTime} day`);
    } else if (deliveryTime <= 2) {
      reasons.push(`good delivery speed: ${deliveryTime} days`);
    } else if (deliveryTime <= 3) {
      reasons.push(`acceptable delivery speed: ${deliveryTime} days`);
    }

    return reasons;
  }
}
