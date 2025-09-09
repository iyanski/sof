import { Shipment } from './shipment';
import { Carrier } from './carrier';

export interface OfferRequest {
  shipment: Shipment;
  carriers?: Carrier[];
}
