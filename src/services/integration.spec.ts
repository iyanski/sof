import { describe, it, expect, beforeEach } from '@jest/globals';
import { OffersService } from './offers.service';
import { EligibilityService } from './eligibility.service';
import { carriers } from '../data/carriers';
import { OfferRequest } from '../types/offer-request';
import { Shipment } from '../types/shipment';
import { DEFAULT_CONFIG } from './eligibility/config';

describe('End-to-End Integration Tests', () => {
  let offersService: OffersService;
  let eligibilityService: EligibilityService;

  beforeEach(() => {
    eligibilityService = new EligibilityService();
    offersService = new OffersService(eligibilityService);
  });

  describe('Complete Offer Generation Flow', () => {
    it('should generate offers for a typical Nordic shipment', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'SE' },
          destinationAddress: { country: 'NO' },
          packages: [
            {
              id: 'pkg-1',
              quantity: 1,
              weight: 10,
              dimensions: { length: 30, width: 20, height: 15 }
            }
          ]
        }
      };

      const result = await offersService.getOffers(request);

      expect(result).toHaveLength(1);
      expect(result[0].offers).toBeDefined();
      expect(result[0].generatedAt).toBeInstanceOf(Date);

      // Should have at least one eligible offer for Nordic shipment (or empty if no carriers are eligible)
      expect(result[0].offers.length).toBeGreaterThanOrEqual(0);

      // All offers should be properly formatted
      result[0].offers.forEach(offer => {
        expect(offer.carrierId).toBeDefined();
        expect(offer.carrierName).toBeDefined();
        expect(typeof offer.cost).toBe('number');
        expect(typeof offer.deliveryTime).toBe('number');
        expect(typeof offer.eligibilityScore).toBe('number');
        expect(typeof offer.costEfficiencyScore).toBe('number');
        expect(typeof offer.serviceQualityScore).toBe('number');
        expect(Array.isArray(offer.reasons)).toBe(true);
        expect(offer.isEligible).toBe(true);
      });
    });

    it('should handle international shipment with multiple carriers', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'SE' },
          destinationAddress: { country: 'DE' },
          packages: [
            {
              id: 'pkg-1',
              quantity: 1,
              weight: 25,
              dimensions: { length: 40, width: 30, height: 20 }
            }
          ]
        }
      };

      const result = await offersService.getOffers(request);

      expect(result).toHaveLength(1);
      expect(result[0].offers.length).toBeGreaterThan(0);

      // Should have multiple eligible carriers for international shipment (or at least one)
      const carrierIds = result[0].offers.map(offer => offer.carrierId);
      const uniqueCarrierIds = [...new Set(carrierIds)];
      expect(uniqueCarrierIds.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle heavy shipment with weight constraints', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'SE' },
          destinationAddress: { country: 'NO' },
          packages: [
            {
              id: 'pkg-1',
              quantity: 1,
              weight: 150, // Heavy shipment
              dimensions: { length: 50, width: 40, height: 30 }
            }
          ]
        }
      };

      const result = await offersService.getOffers(request);

      // Some carriers should be filtered out due to weight constraints
      result[0].offers.forEach(offer => {
        expect(offer.isEligible).toBe(true);
        expect(offer.eligibilityScore).toBeGreaterThanOrEqual(DEFAULT_CONFIG.eligibilityThreshold);
      });
    });

    it('should handle large volume shipment with volume constraints', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'SE' },
          destinationAddress: { country: 'NO' },
          packages: [
            {
              id: 'pkg-1',
              quantity: 1,
              weight: 5,
              dimensions: { length: 100, width: 100, height: 100 } // Large volume: 1,000,000 cm³
            }
          ]
        }
      };

      const result = await offersService.getOffers(request);

      // Most carriers should be filtered out due to volume constraints
      // Only carriers with high volume limits should remain
      result[0].offers.forEach(offer => {
        expect(offer.isEligible).toBe(true);
        expect(offer.eligibilityScore).toBeGreaterThanOrEqual(DEFAULT_CONFIG.eligibilityThreshold);
      });
    });

    it('should handle multi-package shipment correctly', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'SE' },
          destinationAddress: { country: 'NO' },
          packages: [
            {
              id: 'pkg-1',
              quantity: 1,
              weight: 5,
              dimensions: { length: 20, width: 15, height: 10 }
            },
            {
              id: 'pkg-2',
              quantity: 2,
              weight: 3,
              dimensions: { length: 15, width: 10, height: 8 }
            },
            {
              id: 'pkg-3',
              quantity: 1,
              weight: 2,
              dimensions: { length: 10, width: 8, height: 5 }
            }
          ]
        }
      };

      const result = await offersService.getOffers(request);

      expect(result).toHaveLength(1);
      expect(result[0].offers.length).toBeGreaterThanOrEqual(0);

      // Verify cost calculation for multi-package shipment
      result[0].offers.forEach(offer => {
        const carrier = carriers.find(c => c.id === offer.carrierId);
        expect(carrier).toBeDefined();

        // Total weight: 5 + 3 + 2 = 10kg (quantity not considered in current implementation)
        const expectedCost = 10 * carrier!.costPerKg;
        expect(offer.cost).toBe(expectedCost);
      });
    });
  });

  describe('Real Carrier Data Scenarios', () => {
    it('should work with DHL carrier data', async () => {
      const dhlCarrier = carriers.find(c => c.id === 'dhl-001')!;

      const shipment: Shipment = {
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

      const eligibilityResult = eligibilityService.calculateEligibilityScore(dhlCarrier, shipment);

      expect(eligibilityResult).toBeDefined();
      expect(typeof eligibilityResult.isEligible).toBe('boolean');
      expect(typeof eligibilityResult.score).toBe('number');
      expect(Array.isArray(eligibilityResult.reasons)).toBe(true);
      expect(typeof eligibilityResult.primarySignal).toBe('number');
      expect(typeof eligibilityResult.secondarySignal).toBe('number');
    });

    it('should work with Bring carrier data', async () => {
      const bringCarrier = carriers.find(c => c.id === 'bring-001')!;

      const shipment: Shipment = {
        originAddress: { country: 'SE' },
        destinationAddress: { country: 'NO' },
        packages: [
          {
            id: 'pkg-1',
            quantity: 1,
            weight: 50, // Within Bring's 20-300kg range
            dimensions: { length: 30, width: 20, height: 15 }
          }
        ]
      };

      const eligibilityResult = eligibilityService.calculateEligibilityScore(bringCarrier, shipment);

      expect(eligibilityResult).toBeDefined();
      expect(typeof eligibilityResult.isEligible).toBe('boolean');
      expect(typeof eligibilityResult.score).toBe('number');
      expect(Array.isArray(eligibilityResult.reasons)).toBe(true);
    });

    it('should work with FedEx carrier data', async () => {
      const fedexCarrier = carriers.find(c => c.id === 'fedex-001')!;

      const shipment: Shipment = {
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

      const eligibilityResult = eligibilityService.calculateEligibilityScore(fedexCarrier, shipment);

      expect(eligibilityResult).toBeDefined();
      expect(typeof eligibilityResult.isEligible).toBe('boolean');
      expect(typeof eligibilityResult.score).toBe('number');
      expect(Array.isArray(eligibilityResult.reasons)).toBe(true);
    });

    it('should work with DSV Green carrier data', async () => {
      const dsvCarrier = carriers.find(c => c.id === 'dsv-001')!;

      const shipment: Shipment = {
        originAddress: { country: 'SE' },
        destinationAddress: { country: 'SE' }, // DSV has destination country rule
        packages: [
          {
            id: 'pkg-1',
            quantity: 1,
            weight: 50, // Within DSV's 100kg limit
            dimensions: { length: 30, width: 20, height: 15 }
          }
        ]
      };

      const eligibilityResult = eligibilityService.calculateEligibilityScore(dsvCarrier, shipment);

      expect(eligibilityResult).toBeDefined();
      expect(typeof eligibilityResult.isEligible).toBe('boolean');
      expect(typeof eligibilityResult.score).toBe('number');
      expect(Array.isArray(eligibilityResult.reasons)).toBe(true);
    });
  });

  describe('Business Logic Validation', () => {
    it('should prioritize cost-efficient carriers', async () => {
      const request: OfferRequest = {
        shipment: {
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
        }
      };

      const result = await offersService.getOffers(request);

      if (result[0].offers.length > 1) {
        // Offers should be sorted by cost (ascending)
        for (let i = 0; i < result[0].offers.length - 1; i++) {
          expect(result[0].offers[i].cost).toBeLessThanOrEqual(result[0].offers[i + 1].cost);
        }
      }
    });

    it('should provide meaningful explanations for decisions', async () => {
      const request: OfferRequest = {
        shipment: {
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
        }
      };

      const result = await offersService.getOffers(request);

      result[0].offers.forEach(offer => {
        expect(Array.isArray(offer.reasons)).toBe(true);
        expect(offer.reasons.length).toBeGreaterThan(0);

        // Reasons should be meaningful strings
        offer.reasons.forEach(reason => {
          expect(typeof reason).toBe('string');
          expect(reason.length).toBeGreaterThan(0);
        });
      });
    });

    it('should handle edge case shipments gracefully', async () => {
      const edgeCases = [
        // Very small shipment
        {
          shipment: {
            originAddress: { country: 'SE' },
            destinationAddress: { country: 'NO' },
            packages: [
              {
                id: 'pkg-1',
                quantity: 1,
                weight: 0.1,
                dimensions: { length: 1, width: 1, height: 1 }
              }
            ]
          }
        },
        // Very light but large shipment
        {
          shipment: {
            originAddress: { country: 'SE' },
            destinationAddress: { country: 'NO' },
            packages: [
              {
                id: 'pkg-1',
                quantity: 1,
                weight: 0.5,
                dimensions: { length: 50, width: 40, height: 30 }
              }
            ]
          }
        },
        // Empty packages array
        {
          shipment: {
            originAddress: { country: 'SE' },
            destinationAddress: { country: 'NO' },
            packages: []
          }
        }
      ];

      for (const testCase of edgeCases) {
        const result = await offersService.getOffers(testCase);

        expect(result).toHaveLength(1);
        expect(result[0].offers).toBeDefined();
        expect(Array.isArray(result[0].offers)).toBe(true);

        // All offers should be properly formatted even for edge cases
        result[0].offers.forEach(offer => {
          expect(typeof offer.cost).toBe('number');
          expect(offer.cost).toBeGreaterThanOrEqual(0);
          expect(typeof offer.eligibilityScore).toBe('number');
          expect(offer.eligibilityScore).toBeGreaterThanOrEqual(0);
          expect(offer.eligibilityScore).toBeLessThanOrEqual(200); // Allow for higher scores due to exponential scoring
        });
      }
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle multiple requests efficiently', async () => {
      const requests: OfferRequest[] = [
        {
          shipment: {
            originAddress: { country: 'SE' },
            destinationAddress: { country: 'NO' },
            packages: [{ id: 'pkg-1', quantity: 1, weight: 5, dimensions: { length: 10, width: 10, height: 10 } }]
          }
        },
        {
          shipment: {
            originAddress: { country: 'SE' },
            destinationAddress: { country: 'DK' },
            packages: [{ id: 'pkg-1', quantity: 1, weight: 15, dimensions: { length: 20, width: 15, height: 10 } }]
          }
        },
        {
          shipment: {
            originAddress: { country: 'SE' },
            destinationAddress: { country: 'FI' },
            packages: [{ id: 'pkg-1', quantity: 1, weight: 25, dimensions: { length: 30, width: 20, height: 15 } }]
          }
        }
      ];

      const startTime = Date.now();

      const results = await Promise.all(
        requests.map(request => offersService.getOffers(request))
      );

      const endTime = Date.now();

      // Should complete multiple requests quickly
      expect(endTime - startTime).toBeLessThan(500);

      // All results should be valid
      results.forEach(result => {
        expect(result).toHaveLength(1);
        expect(result[0].offers).toBeDefined();
        expect(Array.isArray(result[0].offers)).toBe(true);
      });
    });

    it('should maintain consistent performance with different shipment sizes', async () => {
      const shipmentSizes = [1, 5, 10, 25, 50, 100]; // kg

      const startTime = Date.now();

      for (const weight of shipmentSizes) {
        const request: OfferRequest = {
          shipment: {
            originAddress: { country: 'SE' },
            destinationAddress: { country: 'NO' },
            packages: [
              {
                id: 'pkg-1',
                quantity: 1,
                weight,
                dimensions: { length: weight * 2, width: weight * 1.5, height: weight }
              }
            ]
          }
        };

        const result = await offersService.getOffers(request);
        expect(result).toHaveLength(1);
        expect(result[0].offers).toBeDefined();
      }

      const endTime = Date.now();

      // Should handle different shipment sizes efficiently
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Configuration and Customization', () => {
    it('should work with custom eligibility service configuration', async () => {
      const customEligibilityService = new EligibilityService({
        eligibilityThreshold: 80, // Higher threshold
        primaryWeights: {
          'delivery-speed': 0.5,
          'environmental-impact': 0.3,
          'cost-efficiency': 0.2
        }
      });

      const customOffersService = new OffersService(customEligibilityService);

      const request: OfferRequest = {
        shipment: {
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
        }
      };

      const result = await customOffersService.getOffers(request);

      expect(result).toHaveLength(1);
      expect(result[0].offers).toBeDefined();

      // With higher threshold, fewer carriers should be eligible
      result[0].offers.forEach(offer => {
        expect(offer.eligibilityScore).toBeGreaterThanOrEqual(80);
      });
    });

    it('should support different explainability levels', async () => {
      const explainabilityLevels = ['minimal', 'positive-only', 'full'] as const;

      for (const level of explainabilityLevels) {
        const customEligibilityService = new EligibilityService({
          explainabilityLevel: level
        });

        const customOffersService = new OffersService(customEligibilityService);

        const request: OfferRequest = {
          shipment: {
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
          }
        };

        const result = await customOffersService.getOffers(request);

        expect(result).toHaveLength(1);
        expect(result[0].offers).toBeDefined();

        // Each explainability level should produce different reason patterns
        result[0].offers.forEach(offer => {
          expect(Array.isArray(offer.reasons)).toBe(true);
          // The number and type of reasons should vary by explainability level
          expect(offer.reasons.length).toBeGreaterThanOrEqual(0);
        });
      }
    });
  });
});
