import { describe, it, expect, beforeEach } from '@jest/globals';
import { CostEfficiencyStrategy } from './cost-efficiency.strategy';
import { ScoringContext, ShipmentMetrics } from '../../interfaces';
import { Carrier, Shipment } from '../../../../types';

describe('CostEfficiencyStrategy', () => {
  let strategy: CostEfficiencyStrategy;
  let mockContext: ScoringContext;
  let mockCarrier: Carrier;
  let mockShipment: Shipment;
  let mockShipmentMetrics: ShipmentMetrics;

  beforeEach(() => {
    strategy = new CostEfficiencyStrategy();

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
      expect(strategy.name).toBe('cost-efficiency');
    });
  });

  describe('calculate method - with pre-computed cost ranges', () => {
    it('should return 100 for lowest cost carrier', () => {
      mockContext.carrier.costPerKg = 10;
      mockContext.costRanges = { min: 10, max: 33 };

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 0 for highest cost carrier', () => {
      mockContext.carrier.costPerKg = 33;
      mockContext.costRanges = { min: 10, max: 33 };

      const result = strategy.calculate(mockContext);
      expect(result).toBe(0);
    });

    it('should return 50 for middle cost carrier', () => {
      mockContext.carrier.costPerKg = 21.5; // Middle of 10-33 range
      mockContext.costRanges = { min: 10, max: 33 };

      const result = strategy.calculate(mockContext);
      expect(result).toBe(50);
    });

    it('should handle fractional costs correctly', () => {
      mockContext.carrier.costPerKg = 15.5;
      mockContext.costRanges = { min: 10, max: 33 };

      const result = strategy.calculate(mockContext);
      // (33 - 15.5) / (33 - 10) = 17.5 / 23 = 0.76 * 100 = 76
      expect(result).toBe(76);
    });

    it('should handle edge case where min equals max', () => {
      mockContext.carrier.costPerKg = 15;
      mockContext.costRanges = { min: 15, max: 15 };

      const result = strategy.calculate(mockContext);
      // When min equals max, division by zero results in NaN, which becomes NaN when rounded
      expect(result).toBeNaN();
    });
  });

  describe('calculate method - with fallback cost ranges', () => {
    it('should use fallback ranges when no pre-computed ranges provided', () => {
      mockContext.carrier.costPerKg = 15;
      mockContext.costRanges = undefined; // No pre-computed ranges

      const result = strategy.calculate(mockContext);
      // Should use fallback ranges: min: 10, max: 33
      // (33 - 15) / (33 - 10) = 18 / 23 = 0.78 * 100 = 78
      expect(result).toBe(78);
    });

    it('should return 100 for competitive pricing with fallback ranges', () => {
      mockContext.carrier.costPerKg = 10;
      mockContext.costRanges = undefined;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 0 for premium pricing with fallback ranges', () => {
      mockContext.carrier.costPerKg = 33;
      mockContext.costRanges = undefined;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(0);
    });
  });

  describe('calculate method - cost normalization', () => {
    it('should normalize costs correctly across different ranges', () => {
      const testCases = [
        { costPerKg: 10, ranges: { min: 10, max: 20 }, expectedScore: 100 },
        { costPerKg: 15, ranges: { min: 10, max: 20 }, expectedScore: 50 },
        { costPerKg: 20, ranges: { min: 10, max: 20 }, expectedScore: 0 },
        { costPerKg: 5, ranges: { min: 5, max: 15 }, expectedScore: 100 },
        { costPerKg: 10, ranges: { min: 5, max: 15 }, expectedScore: 50 },
        { costPerKg: 15, ranges: { min: 5, max: 15 }, expectedScore: 0 }
      ];

      testCases.forEach(({ costPerKg, ranges, expectedScore }) => {
        mockContext.carrier.costPerKg = costPerKg;
        mockContext.costRanges = ranges;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should handle costs outside the range gracefully', () => {
      mockContext.carrier.costPerKg = 5; // Below minimum
      mockContext.costRanges = { min: 10, max: 20 };

      const result = strategy.calculate(mockContext);
      // (20 - 5) / (20 - 10) = 15 / 10 = 1.5 * 100 = 150
      expect(result).toBe(150);

      mockContext.carrier.costPerKg = 25; // Above maximum
      const result2 = strategy.calculate(mockContext);
      // (20 - 25) / (20 - 10) = -5 / 10 = -0.5 * 100 = -50
      expect(result2).toBe(-50);
    });
  });

  describe('getReasons method', () => {
    it('should return competitive pricing reason', () => {
      mockContext.carrier.costPerKg = 12;

      const result = strategy.getReasons(mockContext);
      expect(result).toContain('competitive pricing: 12 SEK/kg');
    });

    it('should return moderate pricing reason', () => {
      mockContext.carrier.costPerKg = 20;

      const result = strategy.getReasons(mockContext);
      expect(result).toContain('moderate pricing: 20 SEK/kg');
    });

    it('should return premium pricing reason', () => {
      mockContext.carrier.costPerKg = 30;

      const result = strategy.getReasons(mockContext);
      expect(result).toContain('premium pricing: 30 SEK/kg');
    });

    it('should handle edge case pricing tiers', () => {
      const testCases = [
        { costPerKg: 15, expectedLabel: 'competitive' },
        { costPerKg: 25, expectedLabel: 'moderate' },
        { costPerKg: 35, expectedLabel: 'premium' }
      ];

      testCases.forEach(({ costPerKg, expectedLabel }) => {
        mockContext.carrier.costPerKg = costPerKg;
        const result = strategy.getReasons(mockContext);
        expect(result[0]).toContain(`${expectedLabel} pricing: ${costPerKg} SEK/kg`);
      });
    });
  });

  describe('getPositiveReasons method', () => {
    it('should return reason only for competitive pricing', () => {
      mockContext.carrier.costPerKg = 12;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toContain('competitive pricing: 12 SEK/kg');
    });

    it('should return empty array for moderate pricing', () => {
      mockContext.carrier.costPerKg = 20;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array for premium pricing', () => {
      mockContext.carrier.costPerKg = 30;

      const result = strategy.getPositiveReasons(mockContext);
      expect(result).toEqual([]);
    });

    it('should handle boundary cases correctly', () => {
      // Exactly at competitive threshold
      mockContext.carrier.costPerKg = 15;
      const result1 = strategy.getPositiveReasons(mockContext);
      expect(result1).toContain('competitive pricing: 15 SEK/kg');

      // Just above competitive threshold
      mockContext.carrier.costPerKg = 15.1;
      const result2 = strategy.getPositiveReasons(mockContext);
      expect(result2).toEqual([]);
    });
  });

  describe('pricing label classification', () => {
    it('should classify costs correctly according to tiers', () => {
      const testCases = [
        { costPerKg: 5, expectedLabel: 'competitive' },
        { costPerKg: 10, expectedLabel: 'competitive' },
        { costPerKg: 15, expectedLabel: 'competitive' },
        { costPerKg: 16, expectedLabel: 'moderate' },
        { costPerKg: 20, expectedLabel: 'moderate' },
        { costPerKg: 25, expectedLabel: 'moderate' },
        { costPerKg: 26, expectedLabel: 'premium' },
        { costPerKg: 30, expectedLabel: 'premium' },
        { costPerKg: 50, expectedLabel: 'premium' }
      ];

      testCases.forEach(({ costPerKg, expectedLabel }) => {
        mockContext.carrier.costPerKg = costPerKg;
        const reasons = strategy.getReasons(mockContext);
        expect(reasons[0]).toContain(`${expectedLabel} pricing: ${costPerKg} SEK/kg`);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should work correctly with real carrier data', () => {
      const realCarriers = [
        { name: 'DHL', costPerKg: 10, expectedLabel: 'competitive' },
        { name: 'Bring', costPerKg: 15, expectedLabel: 'competitive' },
        { name: 'DSV', costPerKg: 20, expectedLabel: 'moderate' },
        { name: 'FedEx', costPerKg: 33, expectedLabel: 'premium' }
      ];

      realCarriers.forEach(({ name, costPerKg, expectedLabel }) => {
        mockContext.carrier.name = name;
        mockContext.carrier.costPerKg = costPerKg;

        const reasons = strategy.getReasons(mockContext);
        expect(reasons[0]).toContain(`${expectedLabel} pricing: ${costPerKg} SEK/kg`);
      });
    });

    it('should maintain consistent scoring across different scenarios', () => {
      const testScenarios = [
        { costPerKg: 10, ranges: { min: 10, max: 30 }, expectedScore: 100 },
        { costPerKg: 15, ranges: { min: 10, max: 30 }, expectedScore: 75 },
        { costPerKg: 20, ranges: { min: 10, max: 30 }, expectedScore: 50 },
        { costPerKg: 25, ranges: { min: 10, max: 30 }, expectedScore: 25 },
        { costPerKg: 30, ranges: { min: 10, max: 30 }, expectedScore: 0 }
      ];

      testScenarios.forEach(({ costPerKg, ranges, expectedScore }) => {
        mockContext.carrier.costPerKg = costPerKg;
        mockContext.costRanges = ranges;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero cost gracefully', () => {
      mockContext.carrier.costPerKg = 0;
      mockContext.costRanges = { min: 10, max: 20 };

      const result = strategy.calculate(mockContext);
      // (20 - 0) / (20 - 10) = 20 / 10 = 2 * 100 = 200
      expect(result).toBe(200);
    });

    it('should handle negative cost gracefully', () => {
      mockContext.carrier.costPerKg = -5;
      mockContext.costRanges = { min: 10, max: 20 };

      const result = strategy.calculate(mockContext);
      // (20 - (-5)) / (20 - 10) = 25 / 10 = 2.5 * 100 = 250
      expect(result).toBe(250);
    });

    it('should handle very large costs', () => {
      mockContext.carrier.costPerKg = 1000;
      mockContext.costRanges = { min: 10, max: 20 };

      const result = strategy.calculate(mockContext);
      // (20 - 1000) / (20 - 10) = -980 / 10 = -98 * 100 = -9800
      expect(result).toBe(-9800);
    });

    it('should handle decimal costs with precision', () => {
      mockContext.carrier.costPerKg = 15.75;
      mockContext.costRanges = { min: 10, max: 20 };

      const result = strategy.calculate(mockContext);
      // (20 - 15.75) / (20 - 10) = 4.25 / 10 = 0.425 * 100 = 42.5
      expect(result).toBe(43); // Rounded
    });
  });

  describe('performance considerations', () => {
    it('should calculate scores efficiently', () => {
      const startTime = Date.now();

      for (let i = 0; i < 1000; i++) {
        mockContext.carrier.costPerKg = Math.random() * 50;
        mockContext.costRanges = { min: 10, max: 30 };
        strategy.calculate(mockContext);
      }

      const endTime = Date.now();
      // Should complete 1000 calculations in less than 100ms
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
