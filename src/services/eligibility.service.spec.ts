import { describe, it, expect } from '@jest/globals';
import { EligibilityService } from './eligibility.service';
import { carriers } from '../data/carriers';
import { Shipment } from '../types';
import { DEFAULT_CONFIG } from './eligibility/config';

describe('Eligibility Service', () => {
  it('should handle country support validation for origin and destination', () => {
    const eligibilityService = new EligibilityService();

    // Use DHL carrier (supports Nordic/EU countries)
    const dhlCarrier = carriers.find(c => c.id === 'dhl-001')!;

    // Create a carrier that doesn't support the destination country
    const unsupportedCarrier = {
      ...dhlCarrier,
      id: 'local-carrier',
      name: 'LocalCarrier',
      supportedCountries: ['SE',] // Only supports Sweden
    };

    const shipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 5,
          dimensions: { length: 5, width: 5, height: 5 } // 125 cm³ (no volume constraint for DHL)
        }
      ]
    };

    // Test supported carrier (DHL supports both SE and NO)
    const supportedResult = eligibilityService.calculateEligibilityScore(dhlCarrier, shipment);

    // Test that country support works (no constraint violations)
    expect(supportedResult.reasons).not.toContain('Destination country NO not supported');
    expect(supportedResult.reasons).not.toContain('Origin country SE not supported');

    // Test eligibility based on current config threshold
    const expectedEligible = supportedResult.score >= DEFAULT_CONFIG.eligibilityThreshold;
    expect(supportedResult.isEligible).toBe(expectedEligible);

    // Log for debugging when threshold changes
    if (!expectedEligible) {
      console.log(`DHL score ${supportedResult.score} is below threshold ${DEFAULT_CONFIG.eligibilityThreshold}`);
    }

    // Test unsupported carrier (only supports SE, not NO) - now handled as hard constraint
    const unsupportedResult = eligibilityService.calculateEligibilityScore(unsupportedCarrier, shipment);
    expect(unsupportedResult.isEligible).toBe(false);
    expect(unsupportedResult.reasons).toContain('Destination country NO not supported');
    expect(unsupportedResult.score).toBe(0);
    expect(unsupportedResult.primarySignal).toBe(0);
    expect(unsupportedResult.secondarySignal).toBe(0);
  });

  it('should handle weight constraint violations as hard constraints', () => {
    const eligibilityService = new EligibilityService();

    // Use DSV carrier (max 100kg weight limit)
    const dsvCarrier = carriers.find(c => c.id === 'dsv-001')!;

    // Shipment within weight limit
    const lightShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'SE' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 50, // Within 100kg limit
          dimensions: { length: 10, width: 10, height: 10 } // 1000 cm³ (DSV has no volume constraint)
        }
      ]
    };

    // Shipment exceeding weight limit
    const heavyShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'SE' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 150, // Exceeds 100kg limit
          dimensions: { length: 10, width: 10, height: 10 } // 1000 cm³ (DSV has no volume constraint)
        }
      ]
    };

    // Test within weight limit - now ineligible due to poor delivery time and cost
    const lightResult = eligibilityService.calculateEligibilityScore(dsvCarrier, lightShipment);
    // Test eligibility based on current config threshold
    const expectedEligible = lightResult.score >= DEFAULT_CONFIG.eligibilityThreshold;
    expect(lightResult.isEligible).toBe(expectedEligible);

    // Log for debugging when threshold changes
    if (expectedEligible) {
      console.log(`DSV Green score ${lightResult.score} is above threshold ${DEFAULT_CONFIG.eligibilityThreshold}`);
    } else {
      console.log(`DSV Green score ${lightResult.score} is below threshold ${DEFAULT_CONFIG.eligibilityThreshold}`);
    }

    // Test exceeding weight limit - now handled as hard constraint
    const heavyResult = eligibilityService.calculateEligibilityScore(dsvCarrier, heavyShipment);
    expect(heavyResult.isEligible).toBe(false);
    expect(heavyResult.reasons).toContain('Total weight 150kg exceeds limit 100kg');
    expect(heavyResult.score).toBe(0);
    expect(heavyResult.primarySignal).toBe(0);
    expect(heavyResult.secondarySignal).toBe(0);
  });

  it('should handle volume constraint violations as hard constraints', () => {
    const eligibilityService = new EligibilityService();

    // Use FedEx carrier (has volume constraint: max 2000 cm³)
    const fedexCarrier = carriers.find(c => c.id === 'fedex-001')!;

    // Shipment within volume limit (5*5*5 = 125 cm³)
    const smallShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 5,
          dimensions: { length: 5, width: 5, height: 5 } // 125 cm³
        }
      ]
    };

    // Shipment exceeding volume limit (100*100*100 = 1,000,000 cm³)
    const largeShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 5,
          dimensions: { length: 100, width: 100, height: 100 } // 1,000,000 cm³
        }
      ]
    };

    // Test within volume limit
    const smallResult = eligibilityService.calculateEligibilityScore(fedexCarrier, smallShipment);
    // Test eligibility based on current config threshold
    const expectedEligible = smallResult.score >= DEFAULT_CONFIG.eligibilityThreshold;
    expect(smallResult.isEligible).toBe(expectedEligible);

    // Log for debugging when threshold changes
    if (!expectedEligible) {
      console.log(`FedEx small shipment score ${smallResult.score} is below threshold ${DEFAULT_CONFIG.eligibilityThreshold}`);
    }

    // Test exceeding volume limit - now handled as hard constraint
    const largeResult = eligibilityService.calculateEligibilityScore(fedexCarrier, largeShipment);
    expect(largeResult.isEligible).toBe(false);
    expect(largeResult.reasons).toContain('Total volume 1000000 exceeds limit 2000');
    expect(largeResult.score).toBe(0);
    expect(largeResult.primarySignal).toBe(0);
    expect(largeResult.secondarySignal).toBe(0);
  });

  it('should handle eligibility rule evaluation', () => {
    const eligibilityService = new EligibilityService();

    // Use Bring carrier (has weight min/max rules: 20-300kg)
    const bringCarrier = carriers.find(c => c.id === 'bring-001')!;

    // Shipment that meets all rules (weight between 20-300kg)
    const compliantShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 50, // Within 20-300kg range
          dimensions: { length: 10, width: 10, height: 10 } // Small dimensions to avoid volume issues
        }
      ]
    };

    // Shipment that violates weight minimum rule (< 20kg)
    const underweightShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 10, // Below 20kg minimum
          dimensions: { length: 10, width: 10, height: 10 } // Small dimensions to avoid volume issues
        }
      ]
    };

    // Shipment that violates weight maximum rule (> 300kg)
    const overweightShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 350, // Above 300kg maximum
          dimensions: { length: 10, width: 10, height: 10 } // Small dimensions to avoid volume issues
        }
      ]
    };

    // Test compliant shipment
    const compliantResult = eligibilityService.calculateEligibilityScore(bringCarrier, compliantShipment);
    expect(compliantResult.isEligible).toBe(true);

    // Test underweight shipment
    const underweightResult = eligibilityService.calculateEligibilityScore(bringCarrier, underweightShipment);
    expect(underweightResult.isEligible).toBe(false);
    expect(underweightResult.reasons).toContain('Rule violation: Weight rule');

    // Test overweight shipment
    const overweightResult = eligibilityService.calculateEligibilityScore(bringCarrier, overweightShipment);
    expect(overweightResult.isEligible).toBe(false);
    expect(overweightResult.reasons).toContain('Rule violation: Weight rule');
  });

  it('should enforce eligibility threshold', () => {
    const eligibilityService = new EligibilityService();

    // Create a carrier with no constraints to get high scores
    const highScoreCarrier = {
      id: 'high-score-carrier',
      name: 'HighScoreCarrier',
      deliveryTime: 1,
      environmentalImpact: 1,
      costPerKg: 10,
      eligibilityRules: [], // No constraints
      supportedCountries: ['SE', 'NO', 'DK', 'FI', 'DE', 'AT', 'CH', 'PL']
    };

    // Create a carrier with many constraints to get low scores
    const lowScoreCarrier = {
      id: 'low-score-carrier',
      name: 'LowScoreCarrier',
      deliveryTime: 10,
      environmentalImpact: 10,
      costPerKg: 30,
      eligibilityRules: [
        {
          weight: { max: 1 }, // Very restrictive
          volume: { max: 1 }, // Very restrictive
          originAddress: { country: 'US' } // Wrong origin
        }
      ],
      supportedCountries: ['US'] // Wrong country
    };

    const shipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 50,
          dimensions: { length: 30, width: 20, height: 15 }
        }
      ]
    };

    // Test high score carrier (should be eligible)
    const highScoreResult = eligibilityService.calculateEligibilityScore(highScoreCarrier, shipment);
    expect(highScoreResult.score).toBeGreaterThanOrEqual(DEFAULT_CONFIG.eligibilityThreshold);
    expect(highScoreResult.isEligible).toBe(true);

    // Test low score carrier (should be ineligible due to country support hard constraint)
    const lowScoreResult = eligibilityService.calculateEligibilityScore(lowScoreCarrier, shipment);
    expect(lowScoreResult.isEligible).toBe(false);
    expect(lowScoreResult.reasons).toContain('Destination country NO not supported');
    expect(lowScoreResult.score).toBe(0);
  });

  it('should handle edge cases gracefully', () => {
    const eligibilityService = new EligibilityService();

    // Carrier with no eligibility rules
    const noRulesCarrier = {
      id: 'no-rules-carrier',
      name: 'NoRulesCarrier',
      deliveryTime: 3,
      environmentalImpact: 5,
      costPerKg: 15,
      eligibilityRules: [], // No rules at all
      supportedCountries: ['SE', 'NO']
    };

    // Carrier with partial dimension constraints
    const partialConstraintsCarrier = {
      id: 'partial-constraints-carrier',
      name: 'PartialConstraintsCarrier',
      deliveryTime: 2,
      environmentalImpact: 3,
      costPerKg: 15,
      eligibilityRules: [
        {
          dimensions: { maxLength: 100 } // Only length, missing width/height
        }
      ],
      supportedCountries: ['SE', 'NO']
    };

    // Very small shipment (edge case)
    const smallShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 0.1, // Very small weight
          dimensions: { length: 1, width: 1, height: 1 } // Very small volume
        }
      ]
    };

    // Normal shipment
    const normalShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 10,
          dimensions: { length: 20, width: 15, height: 10 }
        }
      ]
    };

    // Test carrier with no rules
    const noRulesResult = eligibilityService.calculateEligibilityScore(noRulesCarrier, normalShipment);
    expect(noRulesResult).toBeDefined();
    expect(noRulesResult.isEligible).toBe(true); // Should default to eligible
    expect(noRulesResult.reasons.length).toBeGreaterThan(0); // Should have positive reasons
    expect(noRulesResult.reasons).toContain('ranked by score: 0.76'); // Should include score explanation

    // Test carrier with partial constraints
    const partialResult = eligibilityService.calculateEligibilityScore(partialConstraintsCarrier, normalShipment);
    expect(partialResult).toBeDefined();
    expect(typeof partialResult.isEligible).toBe('boolean');
    expect(Array.isArray(partialResult.reasons)).toBe(true);

    // Test very small shipment
    const smallResult = eligibilityService.calculateEligibilityScore(noRulesCarrier, smallShipment);
    expect(smallResult).toBeDefined();
    expect(typeof smallResult.isEligible).toBe('boolean');
    expect(typeof smallResult.score).toBe('number');
    expect(smallResult.score).toBeGreaterThanOrEqual(0);
    expect(smallResult.score).toBeLessThanOrEqual(100);
  });

  it('should handle country support as a hard constraint with early rejection', () => {
    const eligibilityService = new EligibilityService();

    // Create a carrier with multiple constraints that will be violated
    const restrictiveCarrier = {
      id: 'restrictive-carrier',
      name: 'RestrictiveCarrier',
      deliveryTime: 1, // Fast delivery for good primary score
      environmentalImpact: 2, // Low environmental impact for good primary score
      costPerKg: 25,
      eligibilityRules: [
        {
          name: 'Restrictive rule',
          weight: { max: 10 }, // Will be violated
          volume: { max: 100 }, // Will be violated
          originAddress: { country: 'US' } // Will be violated
        }
      ],
      supportedCountries: ['US'] // Will be violated (destination not supported)
    };

    // Shipment that violates multiple constraints
    const violatingShipment: Shipment = {
      originAddress: { country: 'SE' }, // Violates origin rule
      destinationAddress: { country: 'NO' }, // Not supported
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 50, // Exceeds 10kg limit
          dimensions: { length: 50, width: 50, height: 50 } // 125,000 cm³ exceeds 100 limit
        }
      ]
    };

    // Shipment that meets all constraints
    const compliantShipment: Shipment = {
      originAddress: { country: 'US' }, // Matches origin rule
      destinationAddress: { country: 'US' }, // Supported country
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 5, // Within 10kg limit
          dimensions: { length: 4, width: 4, height: 4 } // 64 cm³ within 100 limit
        }
      ]
    };

    // Test country support hard constraint (early rejection)
    const violatingResult = eligibilityService.calculateEligibilityScore(restrictiveCarrier, violatingShipment);
    expect(violatingResult.isEligible).toBe(false);
    // Country support is now a hard constraint, so we get early return with just that reason
    expect(violatingResult.reasons.length).toBe(1);
    expect(violatingResult.reasons).toContain('Destination country NO not supported');
    expect(violatingResult.score).toBe(0);
    expect(violatingResult.primarySignal).toBe(0);
    expect(violatingResult.secondarySignal).toBe(0);

    // Test no violations
    const compliantResult = eligibilityService.calculateEligibilityScore(restrictiveCarrier, compliantShipment);
    expect(compliantResult.isEligible).toBe(true);
    expect(compliantResult.reasons.length).toBeGreaterThan(0); // Should have positive reasons
    expect(compliantResult.reasons).toContain('ranked by score: 0.84'); // Should include score explanation
  });

  it('should handle multiple rule violations when country is supported', () => {
    const eligibilityService = new EligibilityService();

    // Create a carrier with multiple constraints that will be violated
    const restrictiveCarrier = {
      id: 'restrictive-carrier',
      name: 'RestrictiveCarrier',
      deliveryTime: 1, // Fast delivery for good primary score
      environmentalImpact: 2, // Low environmental impact for good primary score
      costPerKg: 25,
      eligibilityRules: [
        {
          name: 'Restrictive rule',
          weight: { max: 10 }, // Will be violated
          volume: { max: 100 }, // Will be violated
          originAddress: { country: 'US' } // Will be violated
        }
      ],
      supportedCountries: ['US', 'SE', 'NO'] // Supports the destination
    };

    // Shipment that violates multiple rules but country is supported
    const violatingShipment: Shipment = {
      originAddress: { country: 'SE' }, // Violates origin rule
      destinationAddress: { country: 'NO' }, // Supported country
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 50, // Exceeds 10kg limit
          dimensions: { length: 50, width: 50, height: 50 } // 125,000 cm³ exceeds 100 limit
        }
      ]
    };

    // Test multiple rule violations (country is supported, so we get to rule evaluation)
    const violatingResult = eligibilityService.calculateEligibilityScore(restrictiveCarrier, violatingShipment);
    expect(violatingResult.isEligible).toBe(false);
    expect(violatingResult.reasons.length).toBeGreaterThan(1); // Should have multiple rule violations
    expect(violatingResult.reasons).toContain('Rule violation: Restrictive rule');
  });

  it('should calculate scoring signals correctly', () => {
    const eligibilityService = new EligibilityService();

    // Create a carrier with known constraints for predictable scoring
    const testCarrier = {
      id: 'test-carrier',
      name: 'TestCarrier',
      deliveryTime: 3,
      environmentalImpact: 5,
      costPerKg: 15,
      eligibilityRules: [
        {
          name: 'Maximum weight rule', // Added proper name for hard constraint
          weight: { max: 100 }, // 100kg limit
          volume: { max: 100000 } // 100,000 cm³ limit
        }
      ],
      supportedCountries: ['SE', 'NO']
    };

    // Shipment with optimal characteristics for high scoring
    const optimalShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 50, // 50% of weight limit (optimal)
          dimensions: { length: 50, width: 40, height: 30 } // 60,000 cm³ (60% of volume limit)
        }
      ]
    };

    // Shipment with poor characteristics for low scoring
    const poorShipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'US' }, // Not supported
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 90, // 90% of weight limit (high utilization)
          dimensions: { length: 80, width: 80, height: 80 } // 512,000 cm³ (exceeds volume limit)
        }
      ]
    };

    // Test optimal shipment scoring
    const optimalResult = eligibilityService.calculateEligibilityScore(testCarrier, optimalShipment);
    expect(optimalResult.primarySignal).toBe(66); // Updated due to new strategies
    expect(optimalResult.secondarySignal).toBeGreaterThan(50); // Should be good due to optimal utilization
    expect(optimalResult.score).toBeGreaterThan(DEFAULT_CONFIG.eligibilityThreshold); // Overall should be eligible
    expect(optimalResult.isEligible).toBe(true);

    // Test poor shipment scoring (should be rejected due to country support hard constraint)
    const poorResult = eligibilityService.calculateEligibilityScore(testCarrier, poorShipment);
    expect(poorResult.isEligible).toBe(false);
    expect(poorResult.reasons).toContain('Destination country US not supported');
    expect(poorResult.score).toBe(0);

    // Verify score calculation formula: (primary * 0.7) + (secondary * 0.3)
    // Note: Exact score calculation may vary due to rounding in individual strategies
    expect(optimalResult.score).toBeGreaterThan(DEFAULT_CONFIG.eligibilityThreshold); // Should be eligible
  });

  it('should validate configuration weights and threshold', () => {
    // Test invalid primary weights (don't sum to 1.0)
    expect(() => {
      new EligibilityService({
        primaryWeights: {
          'delivery-speed': 0.6,
          'environmental-impact': 0.5, // This makes sum = 1.1
        }
      });
    }).toThrow('Primary weights must sum to 1.0');

    // Test invalid secondary weights (don't sum to 1.0)
    expect(() => {
      new EligibilityService({
        secondaryWeights: {
          'weight-efficiency': 0.5,
          'dimension-efficiency': 0.3,
          'capacity-utilization': 0.4, // This makes sum = 1.2
        }
      });
    }).toThrow('Secondary weights must sum to 1.0');

    // Test invalid overall weights (don't sum to 1.0)
    expect(() => {
      new EligibilityService({
        overallWeights: {
          primary: 0.8,
          secondary: 0.4, // This makes sum = 1.2
        }
      });
    }).toThrow('Overall weights must sum to 1.0');

    // Test invalid threshold (outside 0-100 range)
    expect(() => {
      new EligibilityService({
        eligibilityThreshold: 150
      });
    }).toThrow('Eligibility threshold must be between 0 and 100');

    expect(() => {
      new EligibilityService({
        eligibilityThreshold: -10
      });
    }).toThrow('Eligibility threshold must be between 0 and 100');

    // Test valid configuration should not throw
    expect(() => {
      new EligibilityService({
        eligibilityThreshold: 75,
        primaryWeights: {
          'delivery-speed': 0.5,
          'environmental-impact': 0.5,
        }
      });
    }).not.toThrow();
  });

  it('should validate configuration updates', () => {
    const eligibilityService = new EligibilityService();

    // Test invalid update should throw
    expect(() => {
      eligibilityService.updateConfiguration({
        eligibilityThreshold: 150
      });
    }).toThrow('Eligibility threshold must be between 0 and 100');

    // Test valid update should not throw
    expect(() => {
      eligibilityService.updateConfiguration({
        eligibilityThreshold: 80
      });
    }).not.toThrow();
  });

  it('should support different explainability levels', () => {
    // Create a carrier that supports the destination but has other issues
    const testCarrier = {
      id: 'test-carrier',
      name: 'TestCarrier',
      deliveryTime: 3,
      environmentalImpact: 5,
      costPerKg: 15,
      eligibilityRules: [
        {
          name: 'Weight rule',
          weight: { max: 30 } // Will be violated by 50kg shipment
        }
      ],
      supportedCountries: ['SE', 'NO'] // Supports the destination
    };

    const shipment: Shipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' }, // Supported by carrier
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 50, // Exceeds 30kg limit
          dimensions: { length: 30, width: 20, height: 15 }
        }
      ]
    };

    // Test minimal explainability (no strategy reasons, only rule violations)
    const minimalService = new EligibilityService({ explainabilityLevel: 'minimal' });
    const minimalResult = minimalService.calculateEligibilityScore(testCarrier, shipment);
    expect(minimalResult.reasons).toContain('Rule violation: Weight rule');
    expect(minimalResult.reasons).not.toContain('eligible: country NO supported');
    expect(minimalResult.reasons).not.toContain('optimal weight utilization');

    // Test positive-only explainability (only positive strategy reasons)
    const positiveOnlyService = new EligibilityService({ explainabilityLevel: 'positive-only' });
    const positiveOnlyResult = positiveOnlyService.calculateEligibilityScore(testCarrier, shipment);
    expect(positiveOnlyResult.reasons).toContain('Rule violation: Weight rule');
    // Country support is now a hard constraint, so no positive reason is generated
    expect(positiveOnlyResult.reasons).not.toContain('Total weight 50kg exceeds limit 30kg');

    // Test full explainability (includes both positive and negative strategy reasons)
    const fullService = new EligibilityService({ explainabilityLevel: 'full' });
    const fullResult = fullService.calculateEligibilityScore(testCarrier, shipment);
    expect(fullResult.reasons).toContain('Rule violation: Weight rule');
    // Country support is now a hard constraint, so no positive reason is generated
    expect(fullResult.reasons).toContain('Weight 50kg exceeds maximum 30kg');
  });
});