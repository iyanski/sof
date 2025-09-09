import { Carrier } from "../../../types/carrier";

// ===========================
// UTILITY SERVICES
// ===========================

export class CarrierConstraintExtractor {
  /**
   * Extract hard weight constraints (immediate rejection if violated)
   * These are constraints that should cause immediate ineligibility
   * Only rules with explicit "Maximum" in the name are treated as hard constraints
   */
  static getMaxWeight(carrier: Carrier): number | undefined {
    // Look for weight constraints that are clearly hard limits
    // Only rules with "Maximum" in the name are treated as hard constraints
    const weightRule = carrier.eligibilityRules.find(rule =>
      rule.weight?.max &&
      rule.name?.toLowerCase().includes('maximum') && // Only "Maximum" rules are hard constraints
      !rule.originAddress && // Not a business rule
      !rule.destinationAddress // Not a business rule
    );
    return weightRule?.weight?.max;
  }

  /**
   * Extract hard volume constraints (immediate rejection if violated)
   * These are constraints that should cause immediate ineligibility
   * Only rules with explicit "Maximum" in the name are treated as hard constraints
   */
  static getMaxVolume(carrier: Carrier): number | undefined {
    // Look for volume constraints that are clearly hard limits
    // Only rules with "Maximum" in the name are treated as hard constraints
    const volumeRule = carrier.eligibilityRules.find(rule =>
      rule.volume?.max &&
      rule.name?.toLowerCase().includes('maximum') && // Only "Maximum" rules are hard constraints
      !rule.originAddress && // Not a business rule
      !rule.destinationAddress // Not a business rule
    );
    return volumeRule?.volume?.max;
  }

  /**
   * Extract hard dimension constraints (immediate rejection if violated)
   * These are constraints that should cause immediate ineligibility
   * Only rules with explicit "Maximum" in the name are treated as hard constraints
   */
  static getMaxDimensions(carrier: Carrier): { length: number; width: number; height: number } | undefined {
    // Look for dimension constraints that are clearly hard limits
    // Only rules with "Maximum" in the name are treated as hard constraints
    const dimensionRule = carrier.eligibilityRules.find(rule =>
      rule.dimensions &&
      rule.name?.toLowerCase().includes('maximum') && // Only "Maximum" rules are hard constraints
      !rule.originAddress && // Not a business rule
      !rule.destinationAddress // Not a business rule
    );

    if (!dimensionRule?.dimensions) return undefined;

    return {
      length: dimensionRule.dimensions.maxLength || 0,
      width: dimensionRule.dimensions.maxWidth || 0,
      height: dimensionRule.dimensions.maxHeight || 0,
    };
  }

  /**
   * Extract business rules (evaluated by rule engine)
   * These are rules that can have complex logic and multiple conditions
   */
  static getBusinessRules(carrier: Carrier) {
    return carrier.eligibilityRules.filter(rule =>
      rule.originAddress || // Has origin address constraint
      rule.destinationAddress || // Has destination address constraint
      rule.weight?.min || // Has minimum weight (business rule, not hard limit)
      (rule.weight?.max && !rule.name?.toLowerCase().includes('maximum')) || // Weight max without "Maximum" in name
      (rule.volume?.max && !rule.name?.toLowerCase().includes('maximum')) || // Volume max without "Maximum" in name
      (rule.dimensions && !rule.name?.toLowerCase().includes('maximum')) // Dimensions without "Maximum" in name
    );
  }

  /**
   * Extract hard constraint rules (evaluated as hard constraints)
   * These are simple limits that cause immediate rejection
   */
  static getHardConstraintRules(carrier: Carrier) {
    return carrier.eligibilityRules.filter(rule =>
      (rule.weight?.max && rule.name?.toLowerCase().includes('maximum') && !rule.originAddress && !rule.destinationAddress) ||
      (rule.volume?.max && rule.name?.toLowerCase().includes('maximum') && !rule.originAddress && !rule.destinationAddress) ||
      (rule.dimensions && rule.name?.toLowerCase().includes('maximum') && !rule.originAddress && !rule.destinationAddress)
    );
  }
}
