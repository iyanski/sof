import { describe, it, expect, beforeEach } from '@jest/globals';
import { EnvironmentalImpactStrategy } from './environmental-impact.strategy';
import { ScoringContext, ShipmentMetrics } from '../../interfaces';
import { Carrier, Shipment } from '../../../../types';

describe('EnvironmentalImpactStrategy', () => {
  let strategy: EnvironmentalImpactStrategy;
  let mockContext: ScoringContext;
  let mockCarrier: Carrier;
  let mockShipment: Shipment;
  let mockShipmentMetrics: ShipmentMetrics;

  beforeEach(() => {
    strategy = new EnvironmentalImpactStrategy();

    mockCarrier = {
      id: 'test-carrier',
      name: 'Test Carrier',
      deliveryTime: 3,
      environmentalImpact: 5,
      costPerKg: 15,
      eligibilityRules: [],
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
          dimensions: { length: 20, width: 15, height: 10 }
        }
      ]
    };

    mockShipmentMetrics = {
      totalWeight: 10,
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
      expect(strategy.name).toBe('environmental-impact');
    });
  });

  describe('calculate method - tiered scoring', () => {
    it('should return 100 for very low environmental impact (≤2)', () => {
      mockContext.carrier.environmentalImpact = 1;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 for exactly 2 environmental impact', () => {
      mockContext.carrier.environmentalImpact = 2;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 80 for moderate environmental impact (≤4)', () => {
      mockContext.carrier.environmentalImpact = 3;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(80);
    });

    it('should return 80 for exactly 4 environmental impact', () => {
      mockContext.carrier.environmentalImpact = 4;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(80);
    });

    it('should return 60 for higher environmental impact (≤6)', () => {
      mockContext.carrier.environmentalImpact = 5;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(60);
    });

    it('should return 60 for exactly 6 environmental impact', () => {
      mockContext.carrier.environmentalImpact = 6;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(60);
    });

    it('should return 40 for high environmental impact (≤8)', () => {
      mockContext.carrier.environmentalImpact = 7;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(40);
    });

    it('should return 40 for exactly 8 environmental impact', () => {
      mockContext.carrier.environmentalImpact = 8;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(40);
    });

    it('should return 20 for very high environmental impact (>8)', () => {
      mockContext.carrier.environmentalImpact = 10;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(20);
    });

    it('should return 20 for extremely high environmental impact', () => {
      mockContext.carrier.environmentalImpact = 50;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(20);
    });
  });

  describe('calculate method - boundary values', () => {
    it('should handle fractional environmental impact correctly', () => {
      const testCases = [
        { impact: 1.5, expectedScore: 100 }, // Between 1 and 2
        { impact: 2.5, expectedScore: 80 },  // Between 2 and 4
        { impact: 4.5, expectedScore: 60 },  // Between 4 and 6
        { impact: 6.5, expectedScore: 40 },  // Between 6 and 8
        { impact: 8.5, expectedScore: 20 }   // Above 8
      ];

      testCases.forEach(({ impact, expectedScore }) => {
        mockContext.carrier.environmentalImpact = impact;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should handle edge cases at tier boundaries', () => {
      const testCases = [
        { impact: 2.0, expectedScore: 100 },
        { impact: 2.1, expectedScore: 80 },
        { impact: 4.0, expectedScore: 80 },
        { impact: 4.1, expectedScore: 60 },
        { impact: 6.0, expectedScore: 60 },
        { impact: 6.1, expectedScore: 40 },
        { impact: 8.0, expectedScore: 40 },
        { impact: 8.1, expectedScore: 20 }
      ];

      testCases.forEach(({ impact, expectedScore }) => {
        mockContext.carrier.environmentalImpact = impact;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });

  describe('getReasons method', () => {
    it('should return empty array for low environmental impact', () => {
      const lowImpactValues = [1, 2, 3, 4];

      lowImpactValues.forEach(impact => {
        mockContext.carrier.environmentalImpact = impact;

        const result = strategy.getReasons(mockContext);
        expect(result).toEqual([]);
      });
    });

    it('should return reason for moderate environmental impact', () => {
      mockContext.carrier.environmentalImpact = 5;

      const result = strategy.getReasons(mockContext);
      expect(result).toEqual([]); // No reason for impact <= 6
    });

    it('should return reason for high environmental impact', () => {
      mockContext.carrier.environmentalImpact = 7;

      const result = strategy.getReasons(mockContext);
      expect(result).toEqual(['Environmental impact 7 is higher than optimal']);
    });

    it('should return reason for very high environmental impact', () => {
      mockContext.carrier.environmentalImpact = 10;

      const result = strategy.getReasons(mockContext);
      expect(result).toEqual(['Environmental impact 10 is higher than optimal']);
    });

    it('should include correct impact value in reason message', () => {
      const testCases = [
        { impact: 5, expectedReason: null }, // No reason for impact <= 6
        { impact: 6, expectedReason: null }, // No reason for impact <= 6
        { impact: 7, expectedReason: 'Environmental impact 7 is higher than optimal' },
        { impact: 8, expectedReason: 'Environmental impact 8 is higher than optimal' },
        { impact: 9, expectedReason: 'Environmental impact 9 is higher than optimal' },
        { impact: 15, expectedReason: 'Environmental impact 15 is higher than optimal' }
      ];

      testCases.forEach(({ impact, expectedReason }) => {
        mockContext.carrier.environmentalImpact = impact;

        const result = strategy.getReasons(mockContext);
        if (expectedReason) {
          expect(result).toEqual([expectedReason]);
        } else {
          expect(result).toEqual([]);
        }
      });
    });
  });

  describe('getPositiveReasons method', () => {
    it('should return reason for very low environmental impact', () => {
      mockContext.carrier.environmentalImpact = 1;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toEqual(['low environmental impact: 1']);
    });

    it('should return reason for low environmental impact', () => {
      mockContext.carrier.environmentalImpact = 2;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toEqual(['low environmental impact: 2']);
    });

    it('should return reason for moderate environmental impact', () => {
      mockContext.carrier.environmentalImpact = 4;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toEqual(['good environmental impact: 4']);
    });

    it('should return empty array for high environmental impact', () => {
      mockContext.carrier.environmentalImpact = 7;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array for very high environmental impact', () => {
      mockContext.carrier.environmentalImpact = 10;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toEqual([]);
    });

    it('should handle boundary cases correctly', () => {
      // Exactly at moderate threshold
      mockContext.carrier.environmentalImpact = 6;
      const result1 = strategy.getPositiveReasons(mockContext);
      expect(result1).toEqual(['acceptable environmental impact: 6']);

      // Just above moderate threshold
      mockContext.carrier.environmentalImpact = 6.1;
      const result2 = strategy.getPositiveReasons(mockContext);
      expect(result2).toEqual([]);
    });
  });

  describe('environmental impact classification', () => {
    it('should classify environmental impact correctly', () => {
      const testCases = [
        { impact: 1, expectedClassification: 'low' },
        { impact: 2, expectedClassification: 'low' },
        { impact: 3, expectedClassification: 'good' },
        { impact: 4, expectedClassification: 'good' },
        { impact: 5, expectedClassification: 'acceptable' },
        { impact: 6, expectedClassification: 'acceptable' },
        { impact: 7, expectedClassification: 'higher than optimal' },
        { impact: 8, expectedClassification: 'higher than optimal' },
        { impact: 9, expectedClassification: 'higher than optimal' },
        { impact: 15, expectedClassification: 'higher than optimal' }
      ];

      testCases.forEach(({ impact, expectedClassification }) => {
        mockContext.carrier.environmentalImpact = impact;

        if (expectedClassification === 'low' || expectedClassification === 'good' || expectedClassification === 'acceptable') {
          const positiveReasons = strategy.getPositiveReasons(mockContext);
          expect(positiveReasons[0]).toContain(`${expectedClassification} environmental impact: ${impact}`);
        } else {
          const reasons = strategy.getReasons(mockContext);
          expect(reasons[0]).toContain(`Environmental impact ${impact} is ${expectedClassification}`);
        }
      });
    });
  });

  describe('integration scenarios', () => {
    it('should work correctly with real carrier data', () => {
      const realCarriers = [
        { name: 'DSV Green', environmentalImpact: 1, expectedScore: 100 },
        { name: 'DHL', environmentalImpact: 5, expectedScore: 60 },
        { name: 'Bring', environmentalImpact: 7, expectedScore: 40 },
        { name: 'FedEx', environmentalImpact: 10, expectedScore: 20 }
      ];

      realCarriers.forEach(({ name, environmentalImpact, expectedScore }) => {
        mockContext.carrier.name = name;
        mockContext.carrier.environmentalImpact = environmentalImpact;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should maintain consistent scoring across different scenarios', () => {
      const testScenarios = [
        { impact: 0.5, expectedScore: 100, description: 'Excellent environmental performance' },
        { impact: 1, expectedScore: 100, description: 'Very low environmental impact' },
        { impact: 2, expectedScore: 100, description: 'Low environmental impact' },
        { impact: 3, expectedScore: 80, description: 'Moderate environmental impact' },
        { impact: 4, expectedScore: 80, description: 'Moderate environmental impact' },
        { impact: 5, expectedScore: 60, description: 'Higher environmental impact' },
        { impact: 6, expectedScore: 60, description: 'Higher environmental impact' },
        { impact: 7, expectedScore: 40, description: 'High environmental impact' },
        { impact: 8, expectedScore: 40, description: 'High environmental impact' },
        { impact: 9, expectedScore: 20, description: 'Very high environmental impact' },
        { impact: 15, expectedScore: 20, description: 'Extremely high environmental impact' }
      ];

      testScenarios.forEach(({ impact, expectedScore }) => {
        mockContext.carrier.environmentalImpact = impact;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should handle carriers with different environmental impact ranges', () => {
      const testCarriers = [
        { impact: 0.1, expectedScore: 100, description: 'Carbon neutral' },
        { impact: 1, expectedScore: 100, description: 'Very eco-friendly' },
        { impact: 2, expectedScore: 100, description: 'Eco-friendly' },
        { impact: 3, expectedScore: 80, description: 'Moderately eco-friendly' },
        { impact: 4, expectedScore: 80, description: 'Standard environmental impact' },
        { impact: 5, expectedScore: 60, description: 'Higher environmental impact' },
        { impact: 6, expectedScore: 60, description: 'Significant environmental impact' },
        { impact: 7, expectedScore: 40, description: 'High environmental impact' },
        { impact: 8, expectedScore: 40, description: 'Very high environmental impact' },
        { impact: 9, expectedScore: 20, description: 'Extremely high environmental impact' },
        { impact: 20, expectedScore: 20, description: 'Maximum environmental impact' }
      ];

      testCarriers.forEach(({ impact, expectedScore }) => {
        mockContext.carrier.environmentalImpact = impact;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero environmental impact', () => {
      mockContext.carrier.environmentalImpact = 0;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should handle negative environmental impact gracefully', () => {
      mockContext.carrier.environmentalImpact = -1;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should handle very large environmental impact values', () => {
      mockContext.carrier.environmentalImpact = 1000;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(20);
    });

    it('should handle decimal environmental impact with precision', () => {
      const testCases = [
        { impact: 1.9, expectedScore: 100 },
        { impact: 2.1, expectedScore: 80 },
        { impact: 9.1, expectedScore: 20 }
      ];

      testCases.forEach(({ impact, expectedScore }) => {
        mockContext.carrier.environmentalImpact = impact;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });

  describe('performance considerations', () => {
    it('should calculate scores efficiently', () => {
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        mockContext.carrier.environmentalImpact = Math.random() * 20;
        strategy.calculate(mockContext);
      }

      const endTime = Date.now();
      // Should complete 1000 calculations in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});