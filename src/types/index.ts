export interface Address {
  country: string;
}

export interface Package {
  id: string;
  quantity: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  }
}
export interface EligibilityRule {
  name?: string;
  weight?: {
    min?: number;
    max?: number;
  };
  volume?: {
    min?: number;
    max?: number;
  };
  dimensions?: {
    maxLength?: number;
    maxWidth?: number;
    maxHeight?: number;
  };
  originAddress?: Address;
  destinationAddress?: Address;
}

export interface Shipment {
  originAddress: Address;
  destinationAddress: Address;
  packages: Package[];
}

export interface Carrier {
  id: string;
  name: string;
  deliveryTime: number;
  environmentalImpact: number;
  costPerKg: number; // New field for cost calculation
  eligibilityRules: EligibilityRule[];
  supportedCountries: string[];
}

export interface OfferRequest {
  shipment: Shipment;
  carriers?: Carrier[];
}

export interface OfferResponse {
  offers: Offer[];
  generatedAt: Date;
}

export interface Offer {
  carrierId: string;
  carrierName: string;
  cost: number; // Calculated: totalWeight * costPerKg
  deliveryTime: number;
  eligibilityScore: number; // From eligibility service
  costEfficiencyScore: number; // New: cost efficiency score
  serviceQualityScore: number; // New: service quality score
  reasons: string[]; // Eligibility reasons
  isEligible: boolean;
}

export interface EligibilityResult {
  isEligible: boolean;
  score: number; // 0-100
  primarySignal: number; // 0-100 (most important)
  secondarySignal: number; // 0-100 (tie-breaker)
  reasons: string[];
  strategyScores: {
    // Primary strategy scores
    'delivery-speed': number;
    'environmental-impact': number;
    'cost-efficiency': number;
    // Secondary strategy scores
    'weight-efficiency': number;
    'dimension-efficiency': number;
    'capacity-utilization': number;
  };
}