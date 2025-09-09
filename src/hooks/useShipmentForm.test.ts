// Integration tests for useShipmentForm hook using BDD patterns
import { renderHook, act } from '@testing-library/react'
import { useShipmentForm } from './useShipmentForm'
import { createMockFormData, mockFetch, mockFetchError } from '../test-utils'

// Mock the useOffers hook
const mockPostOffers = jest.fn()
jest.mock('./useOffers', () => ({
  useOffers: jest.fn(() => ({
    postOffers: mockPostOffers,
    isLoading: false,
    error: null,
  })),
}))

describe('useShipmentForm Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when initializing', () => {
    it('should have default form data', () => {
      // Given & When
      const { result } = renderHook(() => useShipmentForm())
      
      // Then
      expect(result.current.formData).toEqual({
        originCountry: 'NO',
        destinationCountry: 'SE',
        weight: 0,
        weightUnit: 'kg',
        length: 0,
        width: 0,
        height: 0,
        dimensionUnit: 'cm',
        quantity: 1,
        speedVsCost: 50,
        maxTransitDays: 7,
      })
    })

    it('should have empty offers array', () => {
      // Given & When
      const { result } = renderHook(() => useShipmentForm())
      
      // Then
      expect(result.current.offers).toEqual([])
    })

    it('should have modal closed by default', () => {
      // Given & When
      const { result } = renderHook(() => useShipmentForm())
      
      // Then
      expect(result.current.modalOpen).toBe(false)
      expect(result.current.modalSuccess).toBe(false)
      expect(result.current.modalMessage).toBe('')
    })
  })

  describe('when handling form changes', () => {
    it('should update form data when handleFormChange is called', () => {
      // Given
      const { result } = renderHook(() => useShipmentForm())
      const newFormData = createMockFormData({
        weight: 10,
        quantity: 2,
      })
      
      // When
      act(() => {
        result.current.handleFormChange(newFormData)
      })
      
      // Then
      expect(result.current.formData).toEqual(newFormData)
    })

    it('should clear errors when form changes', () => {
      // Given
      const { result } = renderHook(() => useShipmentForm())
      
      // When
      act(() => {
        result.current.handleFormChange(createMockFormData())
      })
      
      // Then
      expect(result.current.errors).toEqual({})
    })
  })

  describe('when resetting the form', () => {
    it('should reset form data to default values', () => {
      // Given
      const { result } = renderHook(() => useShipmentForm())
      
      // First, change the form data
      act(() => {
        result.current.handleFormChange(createMockFormData({
          weight: 15,
          quantity: 3,
        }))
      })
      
      // When
      act(() => {
        result.current.handleReset()
      })
      
      // Then
      expect(result.current.formData).toEqual({
        originCountry: 'NO',
        destinationCountry: 'SE',
        weight: 0,
        weightUnit: 'kg',
        length: 0,
        width: 0,
        height: 0,
        dimensionUnit: 'cm',
        quantity: 1,
        speedVsCost: 50,
        maxTransitDays: 7,
      })
    })

    it('should clear errors when resetting', () => {
      // Given
      const { result } = renderHook(() => useShipmentForm())
      
      // When
      act(() => {
        result.current.handleReset()
      })
      
      // Then
      expect(result.current.errors).toEqual({})
    })
  })

  describe('when selecting an offer', () => {
    it('should set selected offer and show success modal', () => {
      // Given
      const { result } = renderHook(() => useShipmentForm())
      const mockOffer = {
        carrierId: 'test-carrier',
        carrierName: 'Test Carrier',
        cost: 100,
        deliveryTime: 3,
        eligibilityScore: 85,
        costEfficiencyScore: 75,
        serviceQualityScore: 90,
        reasons: [],
        isEligible: true,
      }
      
      // When
      act(() => {
        result.current.handleSelectOffer(mockOffer)
      })
      
      // Then
      expect(result.current.selectedOffer).toEqual(mockOffer)
      expect(result.current.modalOpen).toBe(true)
      expect(result.current.modalSuccess).toBe(true)
      expect(result.current.modalMessage).toBe('Your shipment has been confirmed!')
    })
  })

  describe('when closing modal', () => {
    it('should close modal and clear selected offer', () => {
      // Given
      const { result } = renderHook(() => useShipmentForm())
      const mockOffer = {
        carrierId: 'test-carrier',
        carrierName: 'Test Carrier',
        cost: 100,
        deliveryTime: 3,
        eligibilityScore: 85,
        costEfficiencyScore: 75,
        serviceQualityScore: 90,
        reasons: [],
        isEligible: true,
      }
      
      // First, select an offer
      act(() => {
        result.current.handleSelectOffer(mockOffer)
      })
      
      // When
      act(() => {
        result.current.handleCloseModal()
      })
      
      // Then
      expect(result.current.modalOpen).toBe(false)
      expect(result.current.selectedOffer).toBeNull()
    })
  })

  describe('when handling form submission', () => {
    it('should not submit if form is invalid', () => {
      // Given
      const { result } = renderHook(() => useShipmentForm())
      const mockFormRef = {
        current: {
          check: jest.fn().mockReturnValue(false),
        },
      }
      
      // When
      act(() => {
        result.current.handleSubmit()
      })
      
      // Then
      expect(mockFormRef.current.check).not.toHaveBeenCalled()
    })

    it('should handle successful form submission', async () => {
      // Given
      const mockOffers = [
        {
          carrierId: 'carrier-1',
          carrierName: 'FastShip',
          cost: 100,
          deliveryTime: 3,
          eligibilityScore: 85,
          costEfficiencyScore: 75,
          serviceQualityScore: 90,
          reasons: [],
          isEligible: true,
        },
      ]

      mockPostOffers.mockResolvedValue(mockOffers)

      const { result } = renderHook(() => useShipmentForm())

      // Mock the form ref to return true for validation
      result.current.formRef.current = {
        check: jest.fn().mockReturnValue(true),
      } as any

      // When
      await act(async () => {
        await result.current.handleSubmit()
      })

      // Then
      expect(mockPostOffers).toHaveBeenCalled()
      expect(result.current.offers).toEqual(mockOffers)
    })

    it('should handle form submission errors', async () => {
      // Given
      mockPostOffers.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useShipmentForm())

      // Mock the form ref to return true for validation
      result.current.formRef.current = {
        check: jest.fn().mockReturnValue(true),
      } as any

      // When
      await act(async () => {
        await result.current.handleSubmit()
      })

      // Then
      expect(mockPostOffers).toHaveBeenCalled()
      expect(result.current.modalOpen).toBe(true)
      expect(result.current.modalSuccess).toBe(false)
      expect(result.current.modalMessage).toContain('error submitting your request')
    })
  })
})
