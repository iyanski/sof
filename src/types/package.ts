import { Address } from './address';

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
