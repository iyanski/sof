// Custom test utilities for React Testing Library
import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'

// Custom render function with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const createMockOffer = (overrides = {}) => ({
  carrierId: 'test-carrier-1',
  carrierName: 'Test Carrier',
  cost: 100.50,
  deliveryTime: 3,
  eligibilityScore: 85,
  costEfficiencyScore: 75,
  serviceQualityScore: 90,
  reasons: [],
  isEligible: true,
  ...overrides,
})

export const createMockFormData = (overrides = {}) => ({
  originCountry: 'NO',
  destinationCountry: 'SE',
  weight: 5,
  weightUnit: 'kg',
  length: 30,
  width: 20,
  height: 15,
  dimensionUnit: 'cm',
  quantity: 1,
  ...overrides,
})

export const createMockShipmentRequest = (overrides = {}) => ({
  shipment: {
    originAddress: { country: 'NO' },
    destinationAddress: { country: 'SE' },
    packages: [{
      quantity: 1,
      weight: 5,
      dimensions: {
        length: 30,
        width: 20,
        height: 15,
      },
    }],
    ...overrides,
  },
})

// Mock API responses
export const mockApiResponses = {
  success: {
    offers: [
      createMockOffer({ carrierId: 'carrier-1', carrierName: 'FastShip' }),
      createMockOffer({ carrierId: 'carrier-2', carrierName: 'EcoLogistics' }),
    ],
  },
  error: {
    message: 'Network error',
    status: 500,
  },
  empty: {
    offers: [],
  },
}

// Helper functions for common test scenarios
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}

export const mockFetch = (response: any, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
  })
}

export const mockFetchError = (message = 'Network error') => {
  global.fetch = jest.fn().mockRejectedValue(new Error(message))
}
