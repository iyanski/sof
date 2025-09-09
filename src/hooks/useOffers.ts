import { useState } from "react"
import type { ShipmentRequest, Offer, ApiError } from "../components/types"

export const useOffers = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<ApiError | null>(null)

  const postOffers = async (shipmentRequest: ShipmentRequest): Promise<Offer[]> => {
		setIsLoading(true)
		setError(null)

    try {
      // Validate request data before sending
      if (!shipmentRequest || !shipmentRequest.shipment) {
        throw new Error('Invalid shipment request data')
      }

      // Additional security: validate package data
      const { shipment } = shipmentRequest
      if (!shipment.packages || !Array.isArray(shipment.packages) || shipment.packages.length === 0) {
        throw new Error('Invalid package data')
      }

      // Validate each package
      for (const pkg of shipment.packages) {
        if (typeof pkg.weight !== 'number' || pkg.weight <= 0 || pkg.weight > 1000) {
          throw new Error('Invalid package weight')
        }
        if (typeof pkg.quantity !== 'number' || pkg.quantity <= 0 || pkg.quantity > 1000) {
          throw new Error('Invalid package quantity')
        }
        if (!pkg.dimensions || typeof pkg.dimensions.length !== 'number' || 
            typeof pkg.dimensions.width !== 'number' || typeof pkg.dimensions.height !== 'number') {
          throw new Error('Invalid package dimensions')
        }
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // CSRF protection header
        },
        body: JSON.stringify(shipmentRequest),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(30000) // 30 second timeout
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed: ${response.status} ${response.statusText}. ${errorText}`)
      }

      const data = await response.json()
      
      // Validate response data structure
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format')
      }

      // Validate each offer in the response
      for (const offer of data) {
        if (!offer.carrierId || !offer.carrierName || typeof offer.cost !== 'number') {
          throw new Error('Invalid offer data received')
        }
      }

      setIsLoading(false)
      return data as Offer[]

    } catch (error) {
      setIsLoading(false)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setError({ message: errorMessage, status: 500 })
      throw error
    }
  }

  return { postOffers, isLoading, error }
}