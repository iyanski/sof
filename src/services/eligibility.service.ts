import { Carrier, EligibilityRule, EligibilityResult,Shipment } from "../types";

const SCORING_WEIGHTS = {
  PRIMARY: {
    COUNTRY_SUPPORT: 0.6,
    CRITICAL_CONSTRAINTS: 0.4,
  },
  SECONDARY: {
    WEIGHT_EFFICIENCY: 0.4,
    DIMENSION_EFFICIENCY: 0.3,
    CAPACITY_UTILIZATION: 0.3,
  }
} as const;

export class EligibilityService {
  constructor() {}

  public calculateEligibilityScore(
    carrier: Carrier,
    shipment: Shipment,
  ): EligibilityResult {
    const primarySignal = this.calculatePrimaryEligibility(carrier, shipment);
    const secondarySignal = this.calculateSecondaryEligibility(carrier, shipment);
    const overallScore = (primarySignal * 0.7) + (secondarySignal * 0.3);
    const reasons = this.getEligibilityReasons(carrier, shipment);

    // Check if there are any rule violations
    const hasRuleViolations = reasons.some(reason => reason.includes('Rule violation:'));

    return {
      isEligible: primarySignal >= 70 && !hasRuleViolations,
      score: Math.round(overallScore),
      primarySignal: Math.round(primarySignal),
      secondarySignal: Math.round(secondarySignal),
      reasons: reasons
    };
  }

  private calculatePrimaryEligibility(carrier: Carrier, shipment: Shipment): number {
    const signals = [
      {
        name: 'countrySupport',
        weight: SCORING_WEIGHTS.PRIMARY.COUNTRY_SUPPORT,
        value: carrier.supportedCountries.includes(shipment.destinationAddress.country) ? 100 : 0
      },
      {
        name: 'criticalConstraints',
        weight: SCORING_WEIGHTS.PRIMARY.CRITICAL_CONSTRAINTS,
        value: this.calculateCriticalConstraints(carrier, shipment)
      }
    ];

    return signals.reduce((score, signal) => score + (signal.value * signal.weight), 0);
  }

  private calculateSecondaryEligibility(carrier: Carrier, shipment: Shipment): number {
    const signals = [
      {
        name: 'weightEfficiency',
        weight: SCORING_WEIGHTS.SECONDARY.WEIGHT_EFFICIENCY,
        value: this.calculateWeightEfficiency(carrier, shipment)
      },
      {
        name: 'dimensionEfficiency',
        weight: SCORING_WEIGHTS.SECONDARY.DIMENSION_EFFICIENCY,
        value: this.calculateDimensionEfficiency(carrier, shipment)
      },
      {
        name: 'capacityUtilization',
        weight: SCORING_WEIGHTS.SECONDARY.CAPACITY_UTILIZATION,
        value: this.calculateCapacityUtilization(carrier, shipment)
      }
    ];

    return signals.reduce((score, signal) => score + (signal.value * signal.weight), 0);
  }

  private getEligibilityReasons(carrier: Carrier, shipment: Shipment): string[] {
    const reasons: string[] = [];

    if (!carrier.supportedCountries.includes(shipment.destinationAddress.country)) {
      reasons.push(`Destination country ${shipment.destinationAddress.country} not supported`);
    }

    const totalWeight = shipment.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const maxWeight = this.getMaxWeightFromRules(carrier);
    if (maxWeight && totalWeight > maxWeight) {
      reasons.push(`Total weight ${totalWeight}kg exceeds limit ${maxWeight}kg`);
    }

    const totalVolume = shipment.packages.reduce((sum, pkg) => {
      return sum + (pkg.dimensions.length * pkg.dimensions.width * pkg.dimensions.height);
    }, 0);
    const maxVolume = this.getMaxVolumeFromRules(carrier);
    if (maxVolume && totalVolume > maxVolume) {
      reasons.push(`Total volume ${totalVolume} exceeds limit ${maxVolume}`);
    }

    const nonCompliantRules = carrier.eligibilityRules.filter(rule =>
      !this.evaluateEligibilityRule(rule, shipment)
    );

    nonCompliantRules.forEach(rule => {
      reasons.push(`Rule violation: ${rule.name}`);
    });

    return reasons;
  }

  private calculateWeightEfficiency(carrier: Carrier, shipment: Shipment): number {
    const totalWeight = shipment.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const maxWeight = this.getMaxWeightFromRules(carrier);

    if (!maxWeight) return 100; // No weight limit = perfect fit

    const utilization = totalWeight / maxWeight;

    // Optimal range: 20-80% utilization
    if (utilization >= 0.2 && utilization <= 0.8) return 100;
    if (utilization < 0.2) return 50 + (utilization * 250); // Under-utilized
    if (utilization > 0.8) return 100 - ((utilization - 0.8) * 500); // Over-utilized

    return Math.max(0, 100 - (utilization * 100));
  }

  private calculateDimensionEfficiency(carrier: Carrier, shipment: Shipment): number {
    const maxDimension = this.getMaxDimension(shipment);
    const carrierMax = this.getMaxDimensionsFromRules(carrier);

    if (!carrierMax) return 100;

    const lengthRatio = maxDimension.length / carrierMax.length;
    const widthRatio = maxDimension.width / carrierMax.width;
    const heightRatio = maxDimension.height / carrierMax.height;

    const maxRatio = Math.max(lengthRatio, widthRatio, heightRatio);

    // Exponential decay for better discrimination
    return Math.max(0, 100 * Math.exp(-2 * (maxRatio - 1)));
  }

  private calculateCapacityUtilization(carrier: Carrier, shipment: Shipment): number {
    const totalWeight = shipment.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const totalVolume = shipment.packages.reduce((sum, pkg) => {
      return sum + (pkg.dimensions.length * pkg.dimensions.width * pkg.dimensions.height);
    }, 0);

    const maxWeight = this.getMaxWeightFromRules(carrier);
    const maxVolume = this.getMaxVolumeFromRules(carrier);

    const weightUtil = maxWeight ? (totalWeight / maxWeight) * 100 : 0;
    const volumeUtil = maxVolume ? (totalVolume / maxVolume) * 100 : 0;

    // Use the higher utilization (bottleneck)
    const utilization = Math.max(weightUtil, volumeUtil);

    // Sweet spot: 40-70% utilization
    if (utilization >= 40 && utilization <= 70) return 100;
    if (utilization < 40) return utilization * 2.5; // Under-utilized
    return Math.max(0, 100 - ((utilization - 70) * 2)); // Over-utilized
  }

  private calculateCriticalConstraints(carrier: Carrier, shipment: Shipment): number {
    const totalWeight = shipment.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const maxWeight = this.getMaxWeightFromRules(carrier);
    const maxVolume = this.getMaxVolumeFromRules(carrier);

    let score = 100;

    // Weight constraint
    if (maxWeight && totalWeight > maxWeight) {
      score -= 50; // Major penalty for exceeding weight
    }

    // Volume constraint
    if (maxVolume) {
      const totalVolume = shipment.packages.reduce((sum, pkg) => {
        return sum + (pkg.dimensions.length * pkg.dimensions.width * pkg.dimensions.height);
      }, 0);

      if (totalVolume > maxVolume) {
        score -= 50; // Major penalty for exceeding volume
      }
    }

    return Math.max(0, score);
  }

  private evaluateEligibilityRule(rule: EligibilityRule, shipment: Shipment): boolean {
    const conditions: boolean[] = [];

    // Weight check
    if (rule.weight) {
      const totalWeight = shipment.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
      if (rule.weight.min !== undefined && totalWeight < rule.weight.min) {
        conditions.push(false);
      } else if (rule.weight.max !== undefined && totalWeight > rule.weight.max) {
        conditions.push(false);
      } else {
        conditions.push(true);
      }
    }

    // Volume check
    if (rule.volume) {
      const totalVolume = shipment.packages.reduce((sum, pkg) => {
        return sum + (pkg.dimensions.length * pkg.dimensions.width * pkg.dimensions.height);
      }, 0);

      if (rule.volume.min !== undefined && totalVolume < rule.volume.min) {
        conditions.push(false);
      } else if (rule.volume.max !== undefined && totalVolume > rule.volume.max) {
        conditions.push(false);
      } else {
        conditions.push(true);
      }
    }

    // Origin address check
    if (rule.originAddress) {
      conditions.push(shipment.originAddress.country === rule.originAddress.country);
    }

    // Destination address check
    if (rule.destinationAddress) {
      conditions.push(shipment.destinationAddress.country === rule.destinationAddress.country);
    }

    // All conditions must pass (simplified approach)
    return conditions.length === 0 || conditions.every(condition => condition);
  }

  // Helper methods

  private getMaxWeightFromRules(carrier: Carrier): number | undefined {
    const weightRule = carrier.eligibilityRules.find(rule => rule.weight?.max);
    return weightRule?.weight?.max;
  }

  private getMaxVolumeFromRules(carrier: Carrier): number | undefined {
    const volumeRule = carrier.eligibilityRules.find(rule => rule.volume?.max);
    return volumeRule?.volume?.max;
  }

  private getMaxDimensionsFromRules(carrier: Carrier): {
		length: number;
		width: number;
		height: number;
	} | undefined {
    const dimensionRule = carrier.eligibilityRules.find(rule => rule.dimensions);
    if (!dimensionRule?.dimensions) return undefined;

    return {
      length: dimensionRule.dimensions.maxLength || 0,
      width: dimensionRule.dimensions.maxWidth || 0,
      height: dimensionRule.dimensions.maxHeight || 0
    };
  }

  private getMaxDimension(shipment: Shipment): { length: number; width: number; height: number } {
    let maxLength = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    for (const pkg of shipment.packages) {
      maxLength = Math.max(maxLength, pkg.dimensions.length);
      maxWidth = Math.max(maxWidth, pkg.dimensions.width);
      maxHeight = Math.max(maxHeight, pkg.dimensions.height);
    }

    return { length: maxLength, width: maxWidth, height: maxHeight };
  }

}