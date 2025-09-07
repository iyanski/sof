import { Carrier } from "../types";

export const carriers: Carrier[] = [
	{
		id: 'dhl-001',
		name: 'DHL',
		deliveryTime: 3,
		environmentalImpact: 5,
		eligibilityRules: [
			{
				weight: { max: 200 },
				volume: { max: 270 },
				dimensions: { maxLength: 270, maxWidth: 270, maxHeight: 270 },
				originAddress: { country: 'SE' },
			}
		]
	},
	{
		id: 'bring-001',
		name: 'Bring',
		deliveryTime: 2,
		environmentalImpact: 5,
		eligibilityRules: [
			{
				weight: { min: 20, max: 300 },
			}
		]
	},
	{
		id: 'fedex-001',
		name: 'FedEx',
		deliveryTime: 1,
		environmentalImpact: 10,
		eligibilityRules: [
			{
				weight: { max: 250 },
				volume: { max: 2000 },
			}
		]
	},
	{
		id: 'dsv-001',
		name: 'DSV',
		deliveryTime: 5,
		environmentalImpact: 1,
		eligibilityRules: [
			{
				destinationAddress: { country: 'SE' },
				weight: { max: 100 },
			}
		]
	}
]