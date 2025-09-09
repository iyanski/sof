import { useState } from "react"
import type { ShipmentRequest, Offer, ApiError } from "../components/types"
import { validateShipmentRequest, validateOfferResponse } from "../validators"

export const useOffers = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<ApiError | null>(null)

  const postOffers = async (shipmentRequest: ShipmentRequest): Promise<Offer[]> => {
		setIsLoading(true)
		setError(null)

    try {
      // Validate request data before sending
      if (!validateShipmentRequest(shipmentRequest)) {
        throw new Error('Invalid shipment request data')
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
      if (!validateOfferResponse(data)) {
        throw new Error('Invalid offer response data')
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