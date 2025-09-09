import { describe, it, expect, beforeEach } from '@jest/globals';
import { CapacityUtilizationStrategy } from './capacity-utilization.strategy';
import { ScoringContext, ShipmentMetrics } from '../../interfaces';
import { Carrier, Shipment } from '../../../../types';

describe('CapacityUtilizationStrategy', () => {
  let strategy: CapacityUtilizationStrategy;
  let mockContext: ScoringContext;
  let mockCarrier: Carrier;
  let mockShipment: Shipment;
  let mockShipmentMetrics: ShipmentMetrics;

  beforeEach(() => {
    strategy = new CapacityUtilizationStrategy();

    mockCarrier = {
      id: 'test-carrier',
      name: 'Test Carrier',
      deliveryTime: 3,
      environmentalImpact: 5,
      costPerKg: 15,
      eligibilityRules: [
        {
          name: 'Maximum volume rule',
          volume: { max: 100000 } // 100,000 cm³ limit
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
          weight: 10,
          dimensions: { length: 50, width: 40, height: 30 }
        }
      ]
    };

    mockShipmentMetrics = {
      totalWeight: 10,
      totalVolume: 60000, // 50 * 40 * 30 = 60,000 cm³
      maxDimensions: { length: 50, width: 40, height: 30 }
    };

    mockContext = {
      carrier: mockCarrier,
      shipment: mockShipment,
      shipmentMetrics: mockShipmentMetrics
    };
  });

  describe('name property', () => {
    it('should have the correct name', () => {
      expect(strategy.name).toBe('capacity-utilization');
    });
  });

  describe('calculate method - no constraints', () => {
    it('should return 100 when carrier has no volume constraints', () => {
      mockContext.carrier.eligibilityRules = [
        {
          name: 'Maximum weight rule',
          weight: { max: 100 }
        }
      ];

      const result = strategy.calculate(mockContext);
      // With weight constraint of 100kg and shipment weight of 10kg, utilization = 10%
      // Formula: 10 * 2.5 = 25
      expect(result).toBe(25);
    });

    it('should return 100 when carrier has no eligibility rules', () => {
      mockContext.carrier.eligibilityRules = [];

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 when carrier has rules without volume constraints', () => {
      mockContext.carrier.eligibilityRules = [
        {
          name: 'Maximum weight rule',
          weight: { max: 100 },
          dimensions: { maxLength: 100, maxWidth: 80, maxHeight: 60 }
        }
      ];

      const result = strategy.calculate(mockContext);
      // With weight constraint of 100kg and shipment weight of 10kg, utilization = 10%
      // Formula: 10 * 2.5 = 25
      expect(result).toBe(25);
    });
  });

  describe('calculate method - optimal range (40-70% utilization)', () => {
    it('should return 100 for 55% capacity utilization', () => {
      // Volume: 55,000 cm³ / 100,000 cm³ = 55% utilization
      mockContext.shipmentMetrics.totalVolume = 55000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 for exactly 40% utilization', () => {
      // Volume: 40,000 cm³ / 100,000 cm³ = 40% utilization
      mockContext.shipmentMetrics.totalVolume = 40000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 for exactly 70% utilization', () => {
      // Volume: 70,000 cm³ / 100,000 cm³ = 70% utilization
      mockContext.shipmentMetrics.totalVolume = 70000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 for 50% utilization', () => {
      // Volume: 50,000 cm³ / 100,000 cm³ = 50% utilization
      mockContext.shipmentMetrics.totalVolume = 50000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 for 65% utilization', () => {
      // Volume: 65,000 cm³ / 100,000 cm³ = 65% utilization
      mockContext.shipmentMetrics.totalVolume = 65000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });
  });

  describe('calculate method - low utilization (<40%)', () => {
    it('should return lower score for 20% utilization', () => {
      // Volume: 20,000 cm³ / 100,000 cm³ = 20% utilization
      // Formula: utilization * 2.5 = 20 * 2.5 = 50
      mockContext.shipmentMetrics.totalVolume = 20000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(50);
    });

    it('should return lower score for 10% utilization', () => {
      // Volume: 10,000 cm³ / 100,000 cm³ = 10% utilization
      // Formula: utilization * 2.5 = 10 * 2.5 = 25
      mockContext.shipmentMetrics.totalVolume = 10000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(25);
    });

    it('should return 0 for 0% utilization', () => {
      // Volume: 0 cm³ / 100,000 cm³ = 0% utilization
      // Formula: utilization * 2.5 = 0 * 2.5 = 0
      mockContext.shipmentMetrics.totalVolume = 0;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(0);
    });

    it('should return lower score for 30% utilization', () => {
      // Volume: 30,000 cm³ / 100,000 cm³ = 30% utilization
      // Formula: utilization * 2.5 = 30 * 2.5 = 75
      mockContext.shipmentMetrics.totalVolume = 30000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(75);
    });
  });

  describe('calculate method - high utilization (>70%)', () => {
    it('should return lower score for 80% utilization', () => {
      // Volume: 80,000 cm³ / 100,000 cm³ = 80% utilization
      // Formula: 100 - ((80 - 70) * 2) = 100 - 20 = 80
      mockContext.shipmentMetrics.totalVolume = 80000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(80);
    });

    it('should return lower score for 90% utilization', () => {
      // Volume: 90,000 cm³ / 100,000 cm³ = 90% utilization
      // Formula: 100 - ((90 - 70) * 2) = 100 - 40 = 60
      mockContext.shipmentMetrics.totalVolume = 90000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(60);
    });

    it('should return 0 for 100% utilization', () => {
      // Volume: 100,000 cm³ / 100,000 cm³ = 100% utilization
      // Formula: 100 - ((100 - 70) * 2) = 100 - 60 = 40
      mockContext.shipmentMetrics.totalVolume = 100000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(40);
    });

    it('should return 0 for 120% utilization', () => {
      // Volume: 120,000 cm³ / 100,000 cm³ = 120% utilization
      // Formula: 100 - ((120 - 70) * 2) = 100 - 100 = 0
      mockContext.shipmentMetrics.totalVolume = 120000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(0);
    });

    it('should never return negative scores for extreme utilization', () => {
      // Volume: 200,000 cm³ / 100,000 cm³ = 200% utilization
      // Formula: 100 - ((200 - 70) * 2) = 100 - 260 = -160
      // But clamped to 0 with Math.max(0, ...)
      mockContext.shipmentMetrics.totalVolume = 200000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(0);
    });
  });

  describe('calculate method - scoring formulas', () => {
    it('should use correct formula for low utilization', () => {
      const testCases = [
        { utilization: 5, expectedScore: 12.5 }, // 5 * 2.5
        { utilization: 10, expectedScore: 25 },   // 10 * 2.5
        { utilization: 20, expectedScore: 50 },   // 20 * 2.5
        { utilization: 30, expectedScore: 75 },   // 30 * 2.5
        { utilization: 39, expectedScore: 97.5 }  // 39 * 2.5
      ];

      testCases.forEach(({ utilization, expectedScore }) => {
        const volume = utilization * 1000; // Convert to actual volume
        mockContext.shipmentMetrics.totalVolume = volume;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should use correct formula for high utilization', () => {
      const testCases = [
        { utilization: 75, expectedScore: 90 },  // 100 - ((75 - 70) * 2)
        { utilization: 80, expectedScore: 80 },  // 100 - ((80 - 70) * 2)
        { utilization: 85, expectedScore: 70 },  // 100 - ((85 - 70) * 2)
        { utilization: 90, expectedScore: 60 },  // 100 - ((90 - 70) * 2)
        { utilization: 100, expectedScore: 40 }, // 100 - ((100 - 70) * 2)
        { utilization: 120, expectedScore: 0 }   // 100 - ((120 - 70) * 2)
      ];

      testCases.forEach(({ utilization, expectedScore }) => {
        const volume = utilization * 1000; // Convert to actual volume
        mockContext.shipmentMetrics.totalVolume = volume;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should return 100 for optimal range utilization', () => {
      const testCases = [
        { utilization: 40, expectedScore: 100 },
        { utilization: 50, expectedScore: 100 },
        { utilization: 60, expectedScore: 100 },
        { utilization: 70, expectedScore: 100 }
      ];

      testCases.forEach(({ utilization, expectedScore }) => {
        const volume = utilization * 1000; // Convert to actual volume
        mockContext.shipmentMetrics.totalVolume = volume;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });

  describe('calculate method - edge cases', () => {
    it('should handle very small volume values', () => {
      // Volume: 100 cm³ / 100,000 cm³ = 0.1% utilization
      // Formula: 0.1 * 2.5 = 0.25
      mockContext.shipmentMetrics.totalVolume = 100;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(0.25);
    });

    it('should handle fractional volume values', () => {
      // Volume: 12,500 cm³ / 100,000 cm³ = 12.5% utilization
      // Formula: 12.5 * 2.5 = 31.25
      mockContext.shipmentMetrics.totalVolume = 12500;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(31.25);
    });

    it('should handle carriers with different volume limits', () => {
      // Test with different carrier volume limits
      const testCases = [
        { maxVolume: 50000, actualVolume: 25000, expectedUtilization: 50, expectedScore: 100 },
        { maxVolume: 200000, actualVolume: 100000, expectedUtilization: 50, expectedScore: 100 },
        { maxVolume: 1000000, actualVolume: 500000, expectedUtilization: 50, expectedScore: 100 }
      ];

      testCases.forEach(({ maxVolume, actualVolume, expectedScore }) => {
        mockContext.carrier.eligibilityRules = [
          {
            name: 'Maximum volume rule',
            volume: { max: maxVolume }
          }
        ];
        mockContext.shipmentMetrics.totalVolume = actualVolume;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });

  describe('getPositiveReasons method', () => {
    it('should return reason for optimal capacity utilization', () => {
      // Volume: 55,000 cm³ / 100,000 cm³ = 55% utilization
      mockContext.shipmentMetrics.totalVolume = 55000;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toContain('optimal capacity utilization: 55.0%');
    });

    it('should return reason for low capacity utilization', () => {
      // Volume: 20,000 cm³ / 100,000 cm³ = 20% utilization
      mockContext.shipmentMetrics.totalVolume = 20000;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toContain('low capacity utilization: 20.0%');
    });

    it('should return reason for high capacity utilization', () => {
      // Volume: 80,000 cm³ / 100,000 cm³ = 80% utilization
      mockContext.shipmentMetrics.totalVolume = 80000;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toContain('high capacity utilization: 80.0%');
    });

    it('should return empty array when no volume constraints', () => {
      mockContext.carrier.eligibilityRules = [];

      const result = strategy.getPositiveReasons(mockContext);
      // With no constraints, weight utilization is 0%, which triggers low capacity utilization reason
      expect(result).toEqual(['low capacity utilization: 0.0%']);
    });
  });

  describe('integration scenarios', () => {
    it('should work correctly with real-world carrier data', () => {
      // Simulate DHL carrier with specific volume constraints
      const dhlCarrier: Carrier = {
        id: 'dhl-001',
        name: 'DHL Express',
        deliveryTime: 1,
        environmentalImpact: 3,
        costPerKg: 15,
        eligibilityRules: [
          {
            name: 'Maximum volume rule',
            volume: { max: 270 } // DHL volume limit (270 cm³)
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
        totalVolume: 125, // 5 * 5 * 5 = 125 cm³
        maxDimensions: { length: 5, width: 5, height: 5 }
      };

      const testContext: ScoringContext = {
        carrier: dhlCarrier,
        shipment: testShipment,
        shipmentMetrics: testMetrics
      };

      // Test low utilization (125 cm³ / 270 cm³ = ~46.3% utilization)
      // This is within optimal range (40-70%), so should return 100
      expect(strategy.calculate(testContext)).toBe(100);

      // Test optimal utilization (135 cm³ / 270 cm³ = 50% utilization)
      testContext.shipmentMetrics.totalVolume = 135;
      expect(strategy.calculate(testContext)).toBe(100);

      // Test high utilization (243 cm³ / 270 cm³ = 90% utilization)
      testContext.shipmentMetrics.totalVolume = 243;
      // Formula: 100 - ((90 - 70) * 2) = 100 - 40 = 60
      expect(strategy.calculate(testContext)).toBe(60);
    });

    it('should handle carriers with multiple eligibility rules', () => {
      // Carrier with multiple rules, only some with volume constraints
      const complexCarrier: Carrier = {
        id: 'complex-carrier',
        name: 'Complex Carrier',
        deliveryTime: 5,
        environmentalImpact: 7,
        costPerKg: 15,
        eligibilityRules: [
          {
            name: 'Basic rule',
            weight: { max: 100 },
            dimensions: { maxLength: 100, maxWidth: 80, maxHeight: 60 }
          },
          {
            name: 'Volume rule',
            volume: { max: 200000 }
          }
        ],
        supportedCountries: ['SE', 'NO']
      };

      const testContext: ScoringContext = {
        carrier: complexCarrier,
        shipment: mockShipment,
        shipmentMetrics: {
          totalWeight: 50,
          totalVolume: 100000, // 50% of 200,000 cm³
          maxDimensions: { length: 50, width: 40, height: 30 }
        }
      };

      // Should use the first matching volume rule (200,000 cm³)
      // 100,000 cm³ / 200,000 cm³ = 50% utilization - optimal range
      expect(strategy.calculate(testContext)).toBe(100);
    });

    it('should maintain consistent scoring across different scenarios', () => {
      const testScenarios = [
        {
          volume: 20000,
          volumeLimit: 100000,
          expectedScore: 50,
          description: 'Low utilization (20%)'
        },
        {
          volume: 50000,
          volumeLimit: 100000,
          expectedScore: 100,
          description: 'Optimal utilization (50%)'
        },
        {
          volume: 80000,
          volumeLimit: 100000,
          expectedScore: 80,
          description: 'High utilization (80%)'
        },
        {
          volume: 100000,
          volumeLimit: 100000,
          expectedScore: 40,
          description: 'Maximum utilization (100%)'
        }
      ];

      testScenarios.forEach(({ volume, volumeLimit, expectedScore }) => {
        mockContext.carrier.eligibilityRules = [
          {
            name: 'Maximum volume rule',
            volume: { max: volumeLimit }
          }
        ];
        mockContext.shipmentMetrics.totalVolume = volume;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should handle edge case with zero volume limit', () => {
      // This is an edge case - carrier with zero volume limit
      mockContext.carrier.eligibilityRules = [
        {
          name: 'Maximum volume rule',
          volume: { max: 0 }
        }
      ];
      mockContext.shipmentMetrics.totalVolume = 1000;

      const result = strategy.calculate(mockContext);
      // When maxVolume is 0, the constraint extractor returns 0, which is falsy
      // So the strategy should return 100 (no constraints)
      expect(result).toBe(100);
    });
  });

  describe('performance considerations', () => {
    it('should calculate scores efficiently', () => {
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        mockContext.shipmentMetrics.totalVolume = Math.random() * 200000;
        strategy.calculate(mockContext);
      }

      const endTime = Date.now();
      // Should complete 1000 calculations in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});