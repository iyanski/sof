import { carriers } from "../data/carriers";
import { Carrier, Offer, OfferRequest, OfferResponse, Package, Shipment } from "../types";
import { EligibilityService } from "./eligibility.service";
import { DEFAULT_STRATEGY_THRESHOLDS } from "./eligibility/config";

export class OffersService {
  constructor(
		private readonly eligibilityService: EligibilityService
  ) {}

  async getOffers(request: OfferRequest): Promise<OfferResponse[]> {
    const offers: Offer[] = [];

    const relevantCarriers = carriers;

    // Pre-compute cost ranges once for all carriers (O(n) instead of O(n²))
    const costRanges = this.getCostRanges();

    for (const carrier of relevantCarriers) {
      const eligibilityResult = this.eligibilityService.calculateEligibilityScore(carrier, request.shipment, costRanges);

      // Debug logging
      // console.log(`${carrier.name} eligibility details:`, {
      //   isEligible: eligibilityResult.isEligible,
      //   score: eligibilityResult.score,
      //   reasons: eligibilityResult.reasons,
      //   strategyScores: eligibilityResult.strategyScores
      // });

      // Only include eligible carriers
      if (eligibilityResult.isEligible) {
        const totalWeight = this.calculateTotalWeight(request.shipment);
        const cost = this.calculateCost(carrier, totalWeight);

        // Extract scoring signals from eligibility result (no duplication!)
        const costEfficiencyScore = eligibilityResult.strategyScores['cost-efficiency'];
        const serviceQualityScore = this.calculateServiceQualityScore(eligibilityResult.strategyScores);

        const offer: Offer = {
          carrierId: carrier.id,
          carrierName: carrier.name,
          cost,
          deliveryTime: carrier.deliveryTime,
          eligibilityScore: eligibilityResult.score,
          costEfficiencyScore,
          serviceQualityScore,
          reasons: eligibilityResult.reasons,
          isEligible: eligibilityResult.isEligible
        };

        offers.push(offer);
      }
    }

    // Sort offers by cost (ascending) and then by eligibility score (descending)
    offers.sort((a, b) => {
      if (a.cost !== b.cost) {
        return a.cost - b.cost;
      }
      return b.eligibilityScore - a.eligibilityScore;
    });

    return [{
      offers,
      generatedAt: new Date()
    }]
  }

  private calculateTotalWeight(shipment: Shipment): number {
    return shipment.packages.reduce((total: number, pkg: Package) => total + pkg.weight, 0);
  }

  private calculateCost(carrier: Carrier, totalWeight: number): number {
    return totalWeight * carrier.costPerKg;
  }

  private getCostRanges(): { min: number; max: number } {
    const costs = carriers.map(c => c.costPerKg);
    return {
      min: Math.min(...costs),
      max: Math.max(...costs)
    };
  }

  private calculateServiceQualityScore(strategyScores: { 'delivery-speed': number; 'environmental-impact': number; [key: string]: number }): number {
    // Calculate service quality score combining delivery speed and environmental impact
    // This provides a holistic view of service quality for the offer
    const deliveryScore = strategyScores['delivery-speed'];
    const environmentalScore = strategyScores['environmental-impact'];
    const weights = DEFAULT_STRATEGY_THRESHOLDS.serviceQuality;

    return Math.round((deliveryScore * weights.deliveryWeight) + (environmentalScore * weights.environmentalWeight));
  }
}
