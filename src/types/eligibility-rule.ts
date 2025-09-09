import { Address } from './address';

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
