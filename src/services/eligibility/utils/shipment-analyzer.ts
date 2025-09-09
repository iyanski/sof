import { Shipment } from "../../../types";
import { ShipmentMetrics } from "../interfaces";

// ===========================
// UTILITY SERVICES
// ===========================

export class ShipmentAnalyzer {
  static analyze(shipment: Shipment): ShipmentMetrics {
    const totalWeight = shipment.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
    const totalVolume = shipment.packages.reduce(
      (sum, pkg) => sum + (pkg.dimensions.length * pkg.dimensions.width * pkg.dimensions.height),
      0
    );

    let maxLength = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    for (const pkg of shipment.packages) {
      maxLength = Math.max(maxLength, pkg.dimensions.length);
      maxWidth = Math.max(maxWidth, pkg.dimensions.width);
      maxHeight = Math.max(maxHeight, pkg.dimensions.height);
    }

    return {
      totalWeight,
      totalVolume,
      maxDimensions: { length: maxLength, width: maxWidth, height: maxHeight },
    };
  }
}
