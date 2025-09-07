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
}

export interface OfferRequest {
  shipment: Shipment;
  carriers?: Carrier[];
}

export interface Offer {
  carrierId: string;
  carrierName: string;
  price: number;
  deliveryTime: number;
  environmentalImpact: number;
}

export interface ScoringWeights {
  eligibility?: number;
  cost?: number;
  time?: number;
  environmentalImpact?: number;
}
