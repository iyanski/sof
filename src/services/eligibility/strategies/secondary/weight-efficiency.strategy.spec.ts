import { describe, it, expect } from '@jest/globals';
import { WeightEfficiencyStrategy } from './weight-efficiency.strategy';
import { ScoringContext, ShipmentMetrics } from '../../interfaces';
import { Carrier } from '../../../../types/carrier';
import { Shipment } from '../../../../types/shipment';

describe('WeightEfficiencyStrategy', () => {
  let strategy: WeightEfficiencyStrategy;
  let mockContext: ScoringContext;
  let mockCarrier: Carrier;
  let mockShipment: Shipment;
  let mockShipmentMetrics: ShipmentMetrics;

  beforeEach(() => {
    strategy = new WeightEfficiencyStrategy();

    mockCarrier = {
      id: 'test-carrier',
      name: 'Test Carrier',
      deliveryTime: 3,
      environmentalImpact: 5,
      costPerKg: 15,
      eligibilityRules: [
        {
          name: 'Maximum weight rule', // Added proper name for hard constraint
          weight: { max: 100 }
        }
      ],
      supportedCountries: ['SE', 'NO', 'DK', 'FI']
    };

    mockShipment = {
      originAddress: { country: 'SE' },
      destinationAddress: { country: 'NO' },
      packages: [
        {
          id: 'pkg-1',
          quantity: 1,
          weight: 50,
          dimensions: { length: 20, width: 15, height: 10 }
        }
      ]
    };

    mockShipmentMetrics = {
      totalWeight: 50,
      totalVolume: 3000,
      maxDimensions: { length: 20, width: 15, height: 10 }
    };

    mockContext = {
      carrier: mockCarrier,
      shipment: mockShipment,
      shipmentMetrics: mockShipmentMetrics
    };
  });

  describe('name property', () => {
    it('should have the correct name', () => {
      expect(strategy.name).toBe('weight-efficiency');
    });
  });

  describe('calculate method - no constraints', () => {
    it('should return 100 when carrier has no weight constraints', () => {
      mockContext.carrier.eligibilityRules = [
        {
          name: 'Maximum volume rule',
          volume: { max: 10000 },
          dimensions: { maxLength: 100, maxWidth: 80, maxHeight: 60 }
        }
      ];

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 when carrier has no eligibility rules', () => {
      mockContext.carrier.eligibilityRules = [];

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 when carrier has rules without weight constraints', () => {
      mockContext.carrier.eligibilityRules = [
        {
          name: 'Maximum volume rule',
          volume: { max: 10000 }
        }
      ];

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });
  });

  describe('calculate method - optimal range (20-80% utilization)', () => {
    it('should return 100 for 50% utilization', () => {
      // Weight: 50kg / 100kg = 50% utilization
      mockContext.shipmentMetrics.totalWeight = 50;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 for exactly 20% utilization', () => {
      // Weight: 20kg / 100kg = 20% utilization
      mockContext.shipmentMetrics.totalWeight = 20;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 for exactly 80% utilization', () => {
      // Weight: 80kg / 100kg = 80% utilization
      mockContext.shipmentMetrics.totalWeight = 80;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 for 30% utilization', () => {
      // Weight: 30kg / 100kg = 30% utilization
      mockContext.shipmentMetrics.totalWeight = 30;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 for 70% utilization', () => {
      // Weight: 70kg / 100kg = 70% utilization
      mockContext.shipmentMetrics.totalWeight = 70;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });
  });

  describe('calculate method - low utilization (<20%)', () => {
    it('should return lower score for 10% utilization', () => {
      // Weight: 10kg / 100kg = 10% utilization
      mockContext.shipmentMetrics.totalWeight = 10;

      const result = strategy.calculate(mockContext);
      // Formula: 50 + (0.1 * 250) = 50 + 25 = 75
      expect(result).toBe(75);
    });

    it('should return lower score for 5% utilization', () => {
      // Weight: 5kg / 100kg = 5% utilization
      mockContext.shipmentMetrics.totalWeight = 5;

      const result = strategy.calculate(mockContext);
      // Formula: 50 + (0.05 * 250) = 50 + 12.5 = 62.5
      expect(result).toBe(62.5);
    });

    it('should return 50 for 0% utilization', () => {
      // Weight: 0kg / 100kg = 0% utilization
      mockContext.shipmentMetrics.totalWeight = 0;

      const result = strategy.calculate(mockContext);
      // Formula: 50 + (0 * 250) = 50 + 0 = 50
      expect(result).toBe(50);
    });

    it('should return lower score for 15% utilization', () => {
      // Weight: 15kg / 100kg = 15% utilization
      mockContext.shipmentMetrics.totalWeight = 15;

      const result = strategy.calculate(mockContext);
      // Formula: 50 + (0.15 * 250) = 50 + 37.5 = 87.5
      expect(result).toBe(87.5);
    });
  });

  describe('calculate method - high utilization (>80%)', () => {
    it('should return lower score for 90% utilization', () => {
      // Weight: 90kg / 100kg = 90% utilization
      mockContext.shipmentMetrics.totalWeight = 90;

      const result = strategy.calculate(mockContext);
      // Formula: 100 - ((0.9 - 0.8) * 500) = 100 - (0.1 * 500) = 100 - 50 = 50
      expect(result).toBeCloseTo(50, 10);
    });

    it('should return lower score for 95% utilization', () => {
      // Weight: 95kg / 100kg = 95% utilization
      mockContext.shipmentMetrics.totalWeight = 95;

      const result = strategy.calculate(mockContext);
      // Formula: 100 - ((0.95 - 0.8) * 500) = 100 - (0.15 * 500) = 100 - 75 = 25
      expect(result).toBeCloseTo(25, 10);
    });

    it('should return 0 for 100% utilization', () => {
      // Weight: 100kg / 100kg = 100% utilization
      mockContext.shipmentMetrics.totalWeight = 100;

      const result = strategy.calculate(mockContext);
      // Formula: 100 - ((1.0 - 0.8) * 500) = 100 - (0.2 * 500) = 100 - 100 = 0
      expect(result).toBeCloseTo(0, 10);
    });

    it('should return 0 for 120% utilization', () => {
      // Weight: 120kg / 100kg = 120% utilization
      mockContext.shipmentMetrics.totalWeight = 120;

      const result = strategy.calculate(mockContext);
      // Formula: 100 - ((1.2 - 0.8) * 500) = 100 - (0.4 * 500) = 100 - 200 = -100
      // But clamped to 0 with Math.max(0, ...)
      expect(result).toBe(0);
    });

    it('should never return negative scores for extreme utilization', () => {
      // Weight: 200kg / 100kg = 200% utilization
      mockContext.shipmentMetrics.totalWeight = 200;

      const result = strategy.calculate(mockContext);
      // Formula: 100 - ((2.0 - 0.8) * 500) = 100 - (1.2 * 500) = 100 - 600 = -500
      // But clamped to 0 with Math.max(0, ...)
      expect(result).toBe(0);
    });
  });

  describe('calculate method - scoring formulas', () => {
    it('should use correct formula for low utilization', () => {
      const testCases = [
        { utilization: 0.05, expectedScore: 62.5 }, // 50 + (0.05 * 250)
        { utilization: 0.10, expectedScore: 75 },   // 50 + (0.10 * 250)
        { utilization: 0.15, expectedScore: 87.5 }, // 50 + (0.15 * 250)
        { utilization: 0.19, expectedScore: 97.5 }  // 50 + (0.19 * 250)
      ];

      testCases.forEach(({ utilization, expectedScore }) => {
        mockContext.shipmentMetrics.totalWeight = utilization * 100; // Convert to actual weight

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should use correct formula for high utilization', () => {
      const testCases = [
        { utilization: 0.85, expectedScore: 75 },  // 100 - ((0.85 - 0.8) * 500)
        { utilization: 0.90, expectedScore: 50 },  // 100 - ((0.90 - 0.8) * 500)
        { utilization: 0.95, expectedScore: 25 },  // 100 - ((0.95 - 0.8) * 500)
        { utilization: 1.00, expectedScore: 0 },   // 100 - ((1.00 - 0.8) * 500)
        { utilization: 1.20, expectedScore: 0 }    // 100 - ((1.20 - 0.8) * 500) = -100, clamped to 0
      ];

      testCases.forEach(({ utilization, expectedScore }) => {
        mockContext.shipmentMetrics.totalWeight = utilization * 100; // Convert to actual weight

        const result = strategy.calculate(mockContext);
        if (expectedScore === 0 || expectedScore === 25 || expectedScore === 50 || expectedScore === 75) {
          expect(result).toBeCloseTo(expectedScore, 10);
        } else {
          expect(result).toBe(expectedScore);
        }
      });
    });

    it('should return 100 for optimal range utilization', () => {
      const testCases = [
        { utilization: 0.20, expectedScore: 100 },
        { utilization: 0.30, expectedScore: 100 },
        { utilization: 0.50, expectedScore: 100 },
        { utilization: 0.70, expectedScore: 100 },
        { utilization: 0.80, expectedScore: 100 }
      ];

      testCases.forEach(({ utilization, expectedScore }) => {
        mockContext.shipmentMetrics.totalWeight = utilization * 100; // Convert to actual weight

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });

  describe('calculate method - edge cases', () => {
    it('should handle very small weight values', () => {
      // Weight: 0.1kg / 100kg = 0.1% utilization
      mockContext.shipmentMetrics.totalWeight = 0.1;

      const result = strategy.calculate(mockContext);
      // Formula: 50 + (0.001 * 250) = 50 + 0.25 = 50.25
      expect(result).toBe(50.25);
    });

    it('should handle fractional weight values', () => {
      // Weight: 12.5kg / 100kg = 12.5% utilization
      mockContext.shipmentMetrics.totalWeight = 12.5;

      const result = strategy.calculate(mockContext);
      // Formula: 50 + (0.125 * 250) = 50 + 31.25 = 81.25
      expect(result).toBe(81.25);
    });

    it('should handle carriers with different weight limits', () => {
      // Test with different carrier weight limits
      const testCases = [
        { maxWeight: 50, actualWeight: 25, expectedUtilization: 0.5, expectedScore: 100 },
        { maxWeight: 200, actualWeight: 100, expectedUtilization: 0.5, expectedScore: 100 },
        { maxWeight: 1000, actualWeight: 500, expectedUtilization: 0.5, expectedScore: 100 }
      ];

      testCases.forEach(({ maxWeight, actualWeight, expectedScore }) => {
        mockContext.carrier.eligibilityRules = [
          {
            name: 'Maximum weight rule',
            weight: { max: maxWeight }
          }
        ];
        mockContext.shipmentMetrics.totalWeight = actualWeight;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should work correctly with real-world carrier data', () => {
      // Simulate DHL carrier with specific weight constraints
      const dhlCarrier: Carrier = {
        id: 'dhl-001',
        name: 'DHL Express',
        deliveryTime: 1,
        environmentalImpact: 3,
        costPerKg: 15,
        eligibilityRules: [
          {
            name: 'Maximum weight rule',
            weight: { max: 70 } // DHL weight limit
          }
        ],
        supportedCountries: ['SE', 'NO', 'DK', 'FI', 'DE', 'AT', 'CH']
      };

      const testShipment: Shipment = {
        originAddress: { country: 'SE' },
        destinationAddress: { country: 'NO' },
        packages: [
          {
            id: 'pkg-1',
            quantity: 1,
            weight: 5,
            dimensions: { length: 5, width: 5, height: 5 }
          }
        ]
      };

      const testMetrics: ShipmentMetrics = {
        totalWeight: 5,
        totalVolume: 125,
        maxDimensions: { length: 5, width: 5, height: 5 }
      };

      const testContext: ScoringContext = {
        carrier: dhlCarrier,
        shipment: testShipment,
        shipmentMetrics: testMetrics
      };

      // Test low utilization (5kg / 70kg = 7.14%)
      // Formula: 50 + (0.0714 * 250) = 50 + 17.857 = 67.857
      expect(strategy.calculate(testContext)).toBeCloseTo(67.86, 1);

      // Test optimal utilization (35kg / 70kg = 50%)
      testContext.shipmentMetrics.totalWeight = 35;
      expect(strategy.calculate(testContext)).toBe(100);

      // Test high utilization (63kg / 70kg = 90%)
      testContext.shipmentMetrics.totalWeight = 63;
      // Formula: 100 - ((0.9 - 0.8) * 500) = 100 - 50 = 50
      expect(strategy.calculate(testContext)).toBeCloseTo(50, 10);
    });

    it('should handle carriers with multiple eligibility rules', () => {
      // Carrier with multiple rules, only some with weight constraints
      const complexCarrier: Carrier = {
        id: 'complex-carrier',
        name: 'Complex Carrier',
        deliveryTime: 5,
        environmentalImpact: 7,
        costPerKg: 15,
        eligibilityRules: [
          {
            name: 'Basic rule',
            volume: { max: 10000 },
            dimensions: { maxLength: 100, maxWidth: 100, maxHeight: 100 }
          },
          {
            name: 'Weight rule',
            weight: { max: 200 }
          }
        ],
        supportedCountries: ['SE', 'NO']
      };

      const testContext: ScoringContext = {
        carrier: complexCarrier,
        shipment: mockShipment,
        shipmentMetrics: {
          totalWeight: 100, // 50% of 200kg limit
          totalVolume: 5000,
          maxDimensions: { length: 50, width: 50, height: 50 }
        }
      };

      // Should use the first matching weight rule (200kg)
      // 100kg / 200kg = 50% utilization - optimal range
      expect(strategy.calculate(testContext)).toBe(100);
    });

    it('should maintain consistent scoring across different scenarios', () => {
      const testScenarios = [
        {
          weight: 10,
          weightLimit: 100,
          expectedScore: 75,
          description: 'Low utilization (10%)'
        },
        {
          weight: 50,
          weightLimit: 100,
          expectedScore: 100,
          description: 'Optimal utilization (50%)'
        },
        {
          weight: 90,
          weightLimit: 100,
          expectedScore: 50,
          description: 'High utilization (90%)'
        },
        {
          weight: 100,
          weightLimit: 100,
          expectedScore: 0,
          description: 'Maximum utilization (100%)'
        }
      ];

      testScenarios.forEach(({ weight, weightLimit, expectedScore }) => {
        mockContext.carrier.eligibilityRules = [
          {
            name: 'Maximum weight rule',
            weight: { max: weightLimit }
          }
        ];
        mockContext.shipmentMetrics.totalWeight = weight;

        const result = strategy.calculate(mockContext);
        if (expectedScore === 0 || expectedScore === 50) {
          expect(result).toBeCloseTo(expectedScore, 10);
        } else {
          expect(result).toBe(expectedScore);
        }
      });
    });

    it('should handle edge case with zero weight limit', () => {
      // This is an edge case - carrier with zero weight limit
      mockContext.carrier.eligibilityRules = [
        {
          name: 'Maximum weight rule',
          weight: { max: 0 }
        }
      ];
      mockContext.shipmentMetrics.totalWeight = 1;

      const result = strategy.calculate(mockContext);
      // When maxWeight is 0, the constraint extractor returns 0, which is falsy
      // So the strategy should return 100 (no constraints)
      expect(result).toBe(100);
    });
  });
});
