import { Address } from './address';
import { Package } from './package';

export interface Shipment {
  originAddress: Address;
  destinationAddress: Address;
  packages: Package[];
}
