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
  price: number;
  deliveryTime: number;
  environmentalImpact: number;
}

export interface EligibilityResult {
  isEligible: boolean;
  score: number; // 0-100
  primarySignal: number; // 0-100 (most important)
  secondarySignal: number; // 0-100 (tie-breaker)
  reasons: string[];
}