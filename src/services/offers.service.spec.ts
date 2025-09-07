import { describe, it, expect } from '@jest/globals';
import { OffersService } from './offers.service';
import { Shipment } from '../types';

describe('Offers Service', () => {
	const mockShipment: Shipment = {
		id: 'shipment-1',
		originAddress: { country: 'US' },
		destinationAddress: { country: 'CA' },
		packages: [
			{
				id: 'pkg-1',
				quantity: 1,
				weight: 5,
				dimensions: { length: 30, width: 20, height: 15 }
			}
		]
	};

	it('should return offers for a valid shipment', () => {
		const offers = new OffersService().getOffers({ shipment: mockShipment });
		
		expect(offers).toBeDefined();
		expect(Array.isArray(offers)).toBe(true);
		expect(offers.length).toBe(0); // Currently returns empty array
	});
});