import { Carrier, EligibilityRule } from "../../types";
import { ScoringContext, RuleEvaluationResult } from "./interfaces";

// ===========================
// RULE ENGINE
// ===========================

export class EligibilityRuleEngine {
  evaluateRule(rule: EligibilityRule, context: ScoringContext): RuleEvaluationResult {
    const conditions: boolean[] = [];
    const reasons: string[] = [];

    // Weight validation
    if (rule.weight) {
      const { totalWeight } = context.shipmentMetrics;
      if (rule.weight.min !== undefined && totalWeight < rule.weight.min) {
        conditions.push(false);
        reasons.push(`Weight ${totalWeight}kg below minimum ${rule.weight.min}kg`);
      } else if (rule.weight.max !== undefined && totalWeight > rule.weight.max) {
        conditions.push(false);
        reasons.push(`Weight ${totalWeight}kg exceeds maximum ${rule.weight.max}kg`);
      } else {
        conditions.push(true);
      }
    }

    // Volume validation
    if (rule.volume) {
      const { totalVolume } = context.shipmentMetrics;
      if (rule.volume.min !== undefined && totalVolume < rule.volume.min) {
        conditions.push(false);
        reasons.push(`Volume ${totalVolume} below minimum ${rule.volume.min}`);
      } else if (rule.volume.max !== undefined && totalVolume > rule.volume.max) {
        conditions.push(false);
        reasons.push(`Volume ${totalVolume} exceeds maximum ${rule.volume.max}`);
      } else {
        conditions.push(true);
      }
    }

    // Address validation
    if (rule.originAddress) {
      const matches = context.shipment.originAddress.country === rule.originAddress.country;
      conditions.push(matches);
      if (!matches) {
        reasons.push(`Origin country ${context.shipment.originAddress.country} doesn't match required ${rule.originAddress.country}`);
      }
    }

    if (rule.destinationAddress) {
      const matches = context.shipment.destinationAddress.country === rule.destinationAddress.country;
      conditions.push(matches);
      if (!matches) {
        reasons.push(`Destination country ${context.shipment.destinationAddress.country} doesn't match required ${rule.destinationAddress.country}`);
      }
    }

    const passed = conditions.length === 0 || conditions.every(condition => condition);

    return {
      passed,
      reasons: passed ? [] : [`Rule violation: ${rule.name}`, ...reasons],
    };
  }

  evaluateAllRules(carrier: Carrier, context: ScoringContext): RuleEvaluationResult[] {
    return carrier.eligibilityRules.map(rule => this.evaluateRule(rule, context));
  }
}
