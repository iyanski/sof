import { Carrier, Shipment, EligibilityResult } from "../types";

export class EligibilityService {
	constructor() {}

	public calculateEligibilityScore(carrier: Carrier, shipment: Shipment): EligibilityResult {
    console.log('Calculating eligibility score for carrier:', carrier.name);
    console.log('Calculating eligibility score for shipment:', shipment);
    return {
      isEligible: false,
      score: 0,
      primarySignal: 0,
      secondarySignal: 0,
      reasons: []
    };
  }
}