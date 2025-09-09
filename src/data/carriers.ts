import { Carrier } from "../types/carrier";

export const carriers: Carrier[] = [
  {
    id: 'dhl-001',
    name: 'DHL',
    deliveryTime: 3,
    environmentalImpact: 5,
    costPerKg: 14,
    eligibilityRules: [
      {
        name: 'Maximum weight rule',
        weight: { max: 200 },
      }, {
        name: 'Origin address rule',
        originAddress: { country: 'SE' },
      }
    ],
    supportedCountries: ['SE', 'NO', 'DK', 'FI', 'DE', 'AT', 'CH', 'PL']
  },
  {
    id: 'bring-001',
    name: 'Bring',
    deliveryTime: 2,
    environmentalImpact: 7, // Updated to match your requirements
    costPerKg: 18,
    eligibilityRules: [
      {
        name: 'Weight rule',
        weight: { min: 20, max: 300 },
      }
    ],
    supportedCountries: ['SE', 'NO', 'DK', 'FI', 'DE', 'AT', 'CH', 'PL']
  },
  {
    id: 'fedex-001',
    name: 'FedEx Express',
    deliveryTime: 1,
    environmentalImpact: 10,
    costPerKg: 15,
    eligibilityRules: [
      {
        name: 'Maximum weight rule',
        weight: { max: 250 },
      }, {
        name: 'Maximum volume rule',
        volume: { max: 2000 },
      }
    ],
    supportedCountries: ['SE', 'NO', 'DK', 'FI', 'DE', 'AT', 'CH', 'PL']
  },
  {
    id: 'dsv-001',
    name: 'DSV Green',
    deliveryTime: 5,
    environmentalImpact: 1,
    costPerKg: 17,
    eligibilityRules: [
      {
        name: 'Maximum weight rule',
        weight: { max: 100 },
      }, {
        name: 'Destination address rule',
        destinationAddress: { country: 'SE' },
        weight: { max: 100 },
      }
    ],
    supportedCountries: ['SE', 'NO', 'DK', 'FI', 'DE', 'AT', 'CH', 'PL']
  }
]