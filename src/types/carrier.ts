import { EligibilityRule } from './eligibility-rule';

export interface Carrier {
  id: string;
  name: string;
  deliveryTime: number;
  environmentalImpact: number;
  costPerKg: number; // New field for cost calculation
  eligibilityRules: EligibilityRule[];
  supportedCountries: string[];
}
