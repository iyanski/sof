// Unit tests for transformer utility functions
import { transformFormDataToShipmentRequest } from './transformers'
import { createMockFormData } from '../test-utils'

describe('transformers', () => {
  describe('transformFormDataToShipmentRequest', () => {
    it('should transform form data to shipment request with default values', () => {
      // Given
      const formData = createMockFormData()
      
      // When
      const result = transformFormDataToShipmentRequest(formData)
      
      // Then
      expect(result).toEqual({
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
        },
      })
    })

    it('should convert weight from pounds to kilograms', () => {
      // Given
      const formData = createMockFormData({
        weight: 10,
        weightUnit: 'lbs',
      })
      
      // When
      const result = transformFormDataToShipmentRequest(formData)
      
      // Then
      expect(result.shipment.packages[0].weight).toBeCloseTo(4.536, 3)
    })

    it('should convert dimensions from inches to centimeters', () => {
      // Given
      const formData = createMockFormData({
        length: 10,
        width: 8,
        height: 6,
        dimensionUnit: 'in',
      })
      
      // When
      const result = transformFormDataToShipmentRequest(formData)
      
      // Then
      expect(result.shipment.packages[0].dimensions).toEqual({
        length: 25.4,
        width: 20.32,
        height: 15.24,
      })
    })

    it('should handle multiple quantities', () => {
      // Given
      const formData = createMockFormData({
        quantity: 3,
      })
      
      // When
      const result = transformFormDataToShipmentRequest(formData)
      
      // Then
      expect(result.shipment.packages[0].quantity).toBe(3)
    })

    it('should handle mixed unit conversions', () => {
      // Given
      const formData = createMockFormData({
        weight: 5,
        weightUnit: 'lbs',
        length: 12,
        width: 10,
        height: 8,
        dimensionUnit: 'in',
        quantity: 2,
      })
      
      // When
      const result = transformFormDataToShipmentRequest(formData)
      
      // Then
      expect(result).toEqual({
        shipment: {
          originAddress: { country: 'NO' },
          destinationAddress: { country: 'SE' },
          packages: [{
            quantity: 2,
            weight: 2.26796, // 5 lbs converted to kg
            dimensions: {
              length: 30.48, // 12 in converted to cm
              width: 25.4,   // 10 in converted to cm
              height: 20.32, // 8 in converted to cm
            },
          }],
        },
      })
    })

    it('should handle zero values', () => {
      // Given
      const formData = createMockFormData({
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        quantity: 0,
      })
      
      // When
      const result = transformFormDataToShipmentRequest(formData)
      
      // Then
      expect(result.shipment.packages[0]).toEqual({
        quantity: 0,
        weight: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
        },
      })
    })
  })
})
