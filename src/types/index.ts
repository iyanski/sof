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

export interface Shipment {
  id: string;
  originAddress: Address;
  destinationAddress: Address;
  packages: Package[];
}

export interface Carrier {
  id: string;
  name: string;
  maxWeight: number; // in kg
  maxDimensions: {
    length: number;
    width: number;
    height: number;
  };
  maxVolume?: number; // in cm3
  deliveryTime: number;
  environmentalImpact: number
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