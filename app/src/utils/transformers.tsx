import type { ShipmentFormData, ShipmentRequest } from "../components/types"
import { convertToCm, convertToKg } from "./converters"

export const transformFormDataToShipmentRequest = (formData: ShipmentFormData): ShipmentRequest => {
  return {
    shipment: {
      originAddress: { country: formData.originCountry },
      destinationAddress: { country: formData.destinationCountry },
      packages: [{
        quantity: (formData.quantity * 1),
        weight: convertToKg(formData.weight, formData.weightUnit),
        dimensions: {
          length: convertToCm(formData.length, formData.dimensionUnit),
          width: convertToCm(formData.width, formData.dimensionUnit),
          height: convertToCm(formData.height, formData.dimensionUnit)
        }
      }]
    }
  }
}