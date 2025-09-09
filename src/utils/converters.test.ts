// Unit tests for converter utility functions
import { convertToCm, convertToKg } from './converters'

describe('converters', () => {
  describe('convertToCm', () => {
    it('should convert inches to centimeters', () => {
      // Given
      const inches = 10
      const unit = 'in'
      
      // When
      const result = convertToCm(inches, unit)
      
      // Then
      expect(result).toBe(25.4)
    })

    it('should return centimeters as-is when unit is cm', () => {
      // Given
      const centimeters = 25.4
      const unit = 'cm'
      
      // When
      const result = convertToCm(centimeters, unit)
      
      // Then
      expect(result).toBe(25.4)
    })

    it('should handle zero values', () => {
      // Given
      const zero = 0
      const unit = 'in'
      
      // When
      const result = convertToCm(zero, unit)
      
      // Then
      expect(result).toBe(0)
    })

    it('should handle decimal values', () => {
      // Given
      const decimalInches = 5.5
      const unit = 'in'
      
      // When
      const result = convertToCm(decimalInches, unit)
      
      // Then
      expect(result).toBeCloseTo(13.97, 2)
    })
  })

  describe('convertToKg', () => {
    it('should convert pounds to kilograms', () => {
      // Given
      const pounds = 10
      const unit = 'lbs'
      
      // When
      const result = convertToKg(pounds, unit)
      
      // Then
      expect(result).toBeCloseTo(4.536, 3)
    })

    it('should return kilograms as-is when unit is kg', () => {
      // Given
      const kilograms = 4.536
      const unit = 'kg'
      
      // When
      const result = convertToKg(kilograms, unit)
      
      // Then
      expect(result).toBe(4.536)
    })

    it('should handle zero values', () => {
      // Given
      const zero = 0
      const unit = 'lbs'
      
      // When
      const result = convertToKg(zero, unit)
      
      // Then
      expect(result).toBe(0)
    })

    it('should handle decimal values', () => {
      // Given
      const decimalPounds = 2.5
      const unit = 'lbs'
      
      // When
      const result = convertToKg(decimalPounds, unit)
      
      // Then
      expect(result).toBeCloseTo(1.134, 3)
    })
  })
})
