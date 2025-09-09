import { useState } from "react"
import type { ShipmentRequest, Offer, ApiError } from "../components/types"

export const useOffers = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<ApiError | null>(null)

  const postOffers = async (shipmentRequest: ShipmentRequest): Promise<Offer[]> => {
		setIsLoading(true)
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentRequest)
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }

		setError(null)
    setIsLoading(false)

    return response.json() as Promise<Offer[]>
  }

  return { postOffers, isLoading, error }
}