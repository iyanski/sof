import { describe, it, expect, beforeEach } from '@jest/globals';
import { OffersService } from './offers.service';
import { EligibilityService } from './eligibility.service';
import { carriers } from '../data/carriers';
import { OfferRequest, Shipment } from '../types';
import { DEFAULT_CONFIG } from './eligibility/config';

describe('OffersService', () => {
  let offersService: OffersService;
  let eligibilityService: EligibilityService;

  beforeEach(() => {
    eligibilityService = new EligibilityService();
    offersService = new OffersService(eligibilityService);
  });

  describe('getOffers', () => {
    it('should return offers for eligible carriers only', async () => {
      const request: OfferRequest = {
        shipment: {
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
        }
      };

      const result = await offersService.getOffers(request);

      expect(result).toHaveLength(1);
      expect(result[0].offers).toBeDefined();
      expect(result[0].generatedAt).toBeInstanceOf(Date);

      // All returned offers should be eligible
      result[0].offers.forEach(offer => {
        expect(offer.isEligible).toBe(true);
        expect(offer.eligibilityScore).toBeGreaterThanOrEqual(DEFAULT_CONFIG.eligibilityThreshold);
      });
    });

    it('should return empty offers when no carriers are eligible', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'US' }, // Not supported by any carrier
          destinationAddress: { country: 'US' },
          packages: [
            {
              id: 'pkg-1',
              quantity: 1,
              weight: 5,
              dimensions: { length: 5, width: 5, height: 5 }
            }
          ]
        }
      };

      const result = await offersService.getOffers(request);

      expect(result).toHaveLength(1);
      expect(result[0].offers).toHaveLength(0);
    });

    it('should sort offers by cost ascending, then by eligibility score descending', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'SE' },
          destinationAddress: { country: 'NO' },
          packages: [
            {
              id: 'pkg-1',
              quantity: 1,
              weight: 10, // 10kg shipment
              dimensions: { length: 10, width: 10, height: 10 }
            }
          ]
        }
      };

      const result = await offersService.getOffers(request);
      const offers = result[0].offers;

      if (offers.length > 1) {
        // Verify cost sorting (ascending)
        for (let i = 0; i < offers.length - 1; i++) {
          expect(offers[i].cost).toBeLessThanOrEqual(offers[i + 1].cost);

          // If costs are equal, verify eligibility score sorting (descending)
          if (offers[i].cost === offers[i + 1].cost) {
            expect(offers[i].eligibilityScore).toBeGreaterThanOrEqual(offers[i + 1].eligibilityScore);
          }
        }
      }
    });

    it('should calculate correct cost for each offer', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'SE' },
          destinationAddress: { country: 'NO' },
          packages: [
            {
              id: 'pkg-1',
              quantity: 1,
              weight: 20, // 20kg shipment
              dimensions: { length: 20, width: 20, height: 20 }
            }
          ]
        }
      };

      const result = await offersService.getOffers(request);
      const offers = result[0].offers;

      offers.forEach(offer => {
        const carrier = carriers.find(c => c.id === offer.carrierId);
        expect(carrier).toBeDefined();

        const expectedCost = 20 * carrier!.costPerKg;
        expect(offer.cost).toBe(expectedCost);
      });
    });

    it('should include all required offer fields', async () => {
      const request: OfferRequest = {
        shipment: {
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
        }
      };

      const result = await offersService.getOffers(request);
      const offers = result[0].offers;

      if (offers.length > 0) {
        const offer = offers[0];

        expect(offer.carrierId).toBeDefined();
        expect(offer.carrierName).toBeDefined();
        expect(typeof offer.cost).toBe('number');
        expect(typeof offer.deliveryTime).toBe('number');
        expect(typeof offer.eligibilityScore).toBe('number');
        expect(typeof offer.costEfficiencyScore).toBe('number');
        expect(typeof offer.serviceQualityScore).toBe('number');
        expect(Array.isArray(offer.reasons)).toBe(true);
        expect(typeof offer.isEligible).toBe('boolean');
      }
    });

    it('should handle multiple packages in shipment', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'SE' },
          destinationAddress: { country: 'NO' },
          packages: [
            {
              id: 'pkg-1',
              quantity: 1,
              weight: 5,
              dimensions: { length: 5, width: 5, height: 5 }
            },
            {
              id: 'pkg-2',
              quantity: 2,
              weight: 3,
              dimensions: { length: 3, width: 3, height: 3 }
            }
          ]
        }
      };

      const result = await offersService.getOffers(request);
      const offers = result[0].offers;

      if (offers.length > 0) {
        const offer = offers[0];
        const carrier = carriers.find(c => c.id === offer.carrierId);

        // Total weight: 5 + 3 = 8kg (quantity is not considered in current implementation)
        const expectedCost = 8 * carrier!.costPerKg;
        expect(offer.cost).toBe(expectedCost);
      }
    });

    it('should handle zero weight shipment gracefully', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'SE' },
          destinationAddress: { country: 'NO' },
          packages: [
            {
              id: 'pkg-1',
              quantity: 1,
              weight: 0,
              dimensions: { length: 1, width: 1, height: 1 }
            }
          ]
        }
      };

      const result = await offersService.getOffers(request);
      const offers = result[0].offers;

      offers.forEach(offer => {
        expect(offer.cost).toBe(0);
      });
    });

    it('should handle empty packages array', async () => {
      const request: OfferRequest = {
        shipment: {
          originAddress: { country: 'SE' },
          destinationAddress: { country: 'NO' },
          packages: []
        }
      };

      const result = await offersService.getOffers(request);
      const offers = result[0].offers;

      offers.forEach(offer => {
        expect(offer.cost).toBe(0);
      });
    });
  });

  describe('cost calculation', () => {
    it('should calculate cost correctly for different carriers', async () => {
      const shipment: Shipment = {
        originAddress: { country: 'SE' },
        destinationAddress: { country: 'NO' },
        packages: [
          {
            id: 'pkg-1',
            quantity: 1,
            weight: 10,
            dimensions: { length: 10, width: 10, height: 10 }
          }
        ]
      };

      const request: OfferRequest = { shipment };
      const result = await offersService.getOffers(request);
      const offers = result[0].offers;

      // Verify cost calculation for each carrier
      offers.forEach(offer => {
        const carrier = carriers.find(c => c.id === offer.carrierId);
        const expectedCost = 10 * carrier!.costPerKg;
        expect(offer.cost).toBe(expectedCost);
      });
    });

    it('should handle fractional weights correctly', async () => {
      const shipment: Shipment = {
        originAddress: { country: 'SE' },
        destinationAddress: { country: 'NO' },
        packages: [
          {
            id: 'pkg-1',
            quantity: 1,
            weight: 2.5,
            dimensions: { length: 5, width: 5, height: 5 }
          }
        ]
      };

      const request: OfferRequest = { shipment };
      const result = await offersService.getOffers(request);
      const offers = result[0].offers;

      offers.forEach(offer => {
        const carrier = carriers.find(c => c.id === offer.carrierId);
        const expectedCost = 2.5 * carrier!.costPerKg;
        expect(offer.cost).toBe(expectedCost);
      });
    });
  });

  describe('service quality score calculation', () => {
    it('should calculate service quality score correctly', async () => {
      const request: OfferRequest = {
        shipment: {
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
        }
      };

      const result = await offersService.getOffers(request);
      const offers = result[0].offers;

      offers.forEach(offer => {
        expect(typeof offer.serviceQualityScore).toBe('number');
        expect(offer.serviceQualityScore).toBeGreaterThanOrEqual(0);
        expect(offer.serviceQualityScore).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('performance optimization', () => {
    it('should pre-compute cost ranges efficiently', async () => {
      const request: OfferRequest = {
        shipment: {
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
        }
      };

      const startTime = Date.now();
      const result = await offersService.getOffers(request);
      const endTime = Date.now();

      // Should complete quickly (less than 100ms for small dataset)
      expect(endTime - startTime).toBeLessThan(100);
      expect(result).toBeDefined();
    });
  });

  describe('integration with eligibility service', () => {
    it('should pass cost ranges to eligibility service', async () => {
      const request: OfferRequest = {
        shipment: {
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
        }
      };

      // Mock the eligibility service to verify cost ranges are passed
      const mockCalculateEligibilityScore = jest.spyOn(eligibilityService, 'calculateEligibilityScore');

      await offersService.getOffers(request);

      // Verify that calculateEligibilityScore was called with cost ranges
      expect(mockCalculateEligibilityScore).toHaveBeenCalledWith(
        expect.any(Object), // carrier
        expect.any(Object), // shipment
        expect.objectContaining({
          min: expect.any(Number),
          max: expect.any(Number)
        }) // costRanges
      );

      mockCalculateEligibilityScore.mockRestore();
    });

    it('should only include eligible carriers in offers', async () => {
      const request: OfferRequest = {
        shipment: {
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
        }
      };

      const result = await offersService.getOffers(request);
      const offers = result[0].offers;

      // All offers should be from eligible carriers
      offers.forEach(offer => {
        expect(offer.isEligible).toBe(true);
        expect(offer.eligibilityScore).toBeGreaterThanOrEqual(DEFAULT_CONFIG.eligibilityThreshold);
      });
    });
  });
});
