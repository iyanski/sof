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
