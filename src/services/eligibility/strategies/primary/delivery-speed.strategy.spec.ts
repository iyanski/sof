import { describe, it, expect } from '@jest/globals';
import { DeliverySpeedStrategy } from './delivery-speed.strategy';
import { ScoringContext, ShipmentMetrics } from '../../interfaces';
import { Carrier, Shipment } from '../../../../types';

describe('DeliverySpeedStrategy', () => {
  let strategy: DeliverySpeedStrategy;
  let mockContext: ScoringContext;
  let mockCarrier: Carrier;
  let mockShipment: Shipment;
  let mockShipmentMetrics: ShipmentMetrics;

  beforeEach(() => {
    strategy = new DeliverySpeedStrategy();

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
      expect(strategy.name).toBe('delivery-speed');
    });
  });

  describe('calculate method - tiered scoring', () => {
    it('should return 100 for 1 day delivery', () => {
      mockContext.carrier.deliveryTime = 1;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 100 for less than 1 day delivery', () => {
      mockContext.carrier.deliveryTime = 0.5;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should return 80 for 2 days delivery', () => {
      mockContext.carrier.deliveryTime = 2;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(80);
    });

    it('should return 60 for 3 days delivery', () => {
      mockContext.carrier.deliveryTime = 3;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(60);
    });

    it('should return 40 for 4 days delivery', () => {
      mockContext.carrier.deliveryTime = 4;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(40);
    });

    it('should return 20 for 5 days delivery', () => {
      mockContext.carrier.deliveryTime = 5;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(20);
    });

    it('should return 20 for more than 5 days delivery', () => {
      mockContext.carrier.deliveryTime = 10;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(20);
    });
  });

  describe('calculate method - boundary values', () => {
    it('should handle fractional delivery times correctly', () => {
      const testCases = [
        { deliveryTime: 1.5, expectedScore: 80 }, // Between 1 and 2
        { deliveryTime: 2.5, expectedScore: 60 }, // Between 2 and 3
        { deliveryTime: 3.5, expectedScore: 40 }, // Between 3 and 4
        { deliveryTime: 4.5, expectedScore: 20 }, // Between 4 and 5
      ];

      testCases.forEach(({ deliveryTime, expectedScore }) => {
        mockContext.carrier.deliveryTime = deliveryTime;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should handle edge cases at tier boundaries', () => {
      const testCases = [
        { deliveryTime: 1.0, expectedScore: 100 },
        { deliveryTime: 1.1, expectedScore: 80 },
        { deliveryTime: 2.0, expectedScore: 80 },
        { deliveryTime: 2.1, expectedScore: 60 },
        { deliveryTime: 3.0, expectedScore: 60 },
        { deliveryTime: 3.1, expectedScore: 40 },
        { deliveryTime: 4.0, expectedScore: 40 },
        { deliveryTime: 4.1, expectedScore: 20 },
        { deliveryTime: 5.0, expectedScore: 20 },
      ];

      testCases.forEach(({ deliveryTime, expectedScore }) => {
        mockContext.carrier.deliveryTime = deliveryTime;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });

  describe('getReasons method', () => {
    it('should return empty array for fast delivery times', () => {
      const fastDeliveryTimes = [1, 2, 3];

      fastDeliveryTimes.forEach(deliveryTime => {
        mockContext.carrier.deliveryTime = deliveryTime;

        const result = strategy.getReasons(mockContext);
        expect(result).toEqual([]);
      });
    });

    it('should return reason for slow delivery times', () => {
      mockContext.carrier.deliveryTime = 4;

      const result = strategy.getReasons(mockContext);
      expect(result).toEqual(['Delivery time 4 days is slower than optimal']);
    });

    it('should return reason for very slow delivery times', () => {
      mockContext.carrier.deliveryTime = 7;

      const result = strategy.getReasons(mockContext);
      expect(result).toEqual(['Delivery time 7 days is slower than optimal']);
    });

    it('should include correct delivery time in reason message', () => {
      const testCases = [
        { deliveryTime: 4, expectedReason: 'Delivery time 4 days is slower than optimal' },
        { deliveryTime: 5, expectedReason: 'Delivery time 5 days is slower than optimal' },
        { deliveryTime: 10, expectedReason: 'Delivery time 10 days is slower than optimal' },
      ];

      testCases.forEach(({ deliveryTime, expectedReason }) => {
        mockContext.carrier.deliveryTime = deliveryTime;

        const result = strategy.getReasons(mockContext);
        expect(result).toEqual([expectedReason]);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should work correctly with real-world carrier data', () => {
      // Test with actual carrier data from carriers.ts
      const carriers = [
        { name: 'FedEx', deliveryTime: 1, expectedScore: 100 },
        { name: 'Bring', deliveryTime: 2, expectedScore: 80 },
        { name: 'DHL', deliveryTime: 3, expectedScore: 60 },
        { name: 'DSV', deliveryTime: 5, expectedScore: 20 },
      ];

      carriers.forEach(({ name, deliveryTime, expectedScore }) => {
        mockContext.carrier.name = name;
        mockContext.carrier.deliveryTime = deliveryTime;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should maintain consistent scoring across different scenarios', () => {
      const testScenarios = [
        { deliveryTime: 0.5, expectedScore: 100, description: 'Same day delivery' },
        { deliveryTime: 1, expectedScore: 100, description: '1 day delivery' },
        { deliveryTime: 2, expectedScore: 80, description: '2 day delivery' },
        { deliveryTime: 3, expectedScore: 60, description: '3 day delivery' },
        { deliveryTime: 4, expectedScore: 40, description: '4 day delivery' },
        { deliveryTime: 5, expectedScore: 20, description: '5 day delivery' },
        { deliveryTime: 7, expectedScore: 20, description: '7 day delivery' },
      ];

      testScenarios.forEach(({ deliveryTime, expectedScore }) => {
        mockContext.carrier.deliveryTime = deliveryTime;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });

    it('should handle carriers with different delivery time ranges', () => {
      // Test with carriers that might have different delivery time scales
      const testCarriers = [
        { deliveryTime: 0.1, expectedScore: 100, description: 'Express delivery' },
        { deliveryTime: 1, expectedScore: 100, description: 'Standard fast delivery' },
        { deliveryTime: 2, expectedScore: 80, description: 'Standard delivery' },
        { deliveryTime: 3, expectedScore: 60, description: 'Economy delivery' },
        { deliveryTime: 4, expectedScore: 40, description: 'Budget delivery' },
        { deliveryTime: 5, expectedScore: 20, description: 'Slow delivery' },
        { deliveryTime: 14, expectedScore: 20, description: 'Very slow delivery' },
      ];

      testCarriers.forEach(({ deliveryTime, expectedScore }) => {
        mockContext.carrier.deliveryTime = deliveryTime;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle zero delivery time', () => {
      mockContext.carrier.deliveryTime = 0;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should handle negative delivery time gracefully', () => {
      mockContext.carrier.deliveryTime = -1;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(100);
    });

    it('should handle very large delivery times', () => {
      mockContext.carrier.deliveryTime = 100;

      const result = strategy.calculate(mockContext);
      expect(result).toBe(20);
    });

    it('should handle decimal delivery times', () => {
      const testCases = [
        { deliveryTime: 1.9, expectedScore: 80 },
        { deliveryTime: 2.1, expectedScore: 60 },
        { deliveryTime: 3.9, expectedScore: 40 },
        { deliveryTime: 4.1, expectedScore: 20 },
      ];

      testCases.forEach(({ deliveryTime, expectedScore }) => {
        mockContext.carrier.deliveryTime = deliveryTime;

        const result = strategy.calculate(mockContext);
        expect(result).toBe(expectedScore);
      });
    });
  });
});
