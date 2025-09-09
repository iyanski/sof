import { Offer } from './offer';

export interface OfferResponse {
  offers: Offer[];
  generatedAt: Date;
}
