// Security utilities tests
import {
  sanitizeString,
  validateCountryCode,
  validateWeightUnit,
  validateDimensionUnit,
  validateNumber,
  validateWeight,
  validateDimension,
  validateQuantity,
  sanitizeFormData,
  isFormDataValid,
  generateCSRFToken,
  validateCSRFToken,
  validateShipmentRequest,
  validatePackage,
  validateOfferResponse,
  validateOffer,
  type Package,
  type ShipmentRequest,
  type Offer
} from './security'

describe('Security Utilities', () => {
  describe('sanitizeString', () => {
    it('should remove HTML tags and scripts', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World'
      const result = sanitizeString(maliciousInput)
      expect(result).toBe('Hello World')
    })

    it('should limit string length', () => {
      const longString = 'a'.repeat(200)
      const result = sanitizeString(longString)
      expect(result.length).toBeLessThanOrEqual(100)
    })

    it('should handle non-string input', () => {
      expect(sanitizeString(null as unknown as string)).toBe('')
      expect(sanitizeString(123 as unknown as string)).toBe('')
      expect(sanitizeString(undefined as unknown as string)).toBe('')
    })
  })

  describe('validateCountryCode', () => {
    it('should accept valid country codes', () => {
      expect(validateCountryCode('NO')).toBe('NO')
      expect(validateCountryCode('SE')).toBe('SE')
      expect(validateCountryCode('US')).toBe('US')
    })

    it('should reject invalid country codes', () => {
      expect(validateCountryCode('XX')).toBeNull()
      expect(validateCountryCode('invalid')).toBeNull()
      expect(validateCountryCode('')).toBeNull()
    })

    it('should sanitize input before validation', () => {
      expect(validateCountryCode('<script>NO</script>')).toBeNull()
    })
  })

  describe('validateWeightUnit', () => {
    it('should accept valid weight units', () => {
      expect(validateWeightUnit('kg')).toBe('kg')
      expect(validateWeightUnit('lbs')).toBe('lbs')
    })

    it('should reject invalid weight units', () => {
      expect(validateWeightUnit('grams')).toBeNull()
      expect(validateWeightUnit('invalid')).toBeNull()
    })
  })

  describe('validateDimensionUnit', () => {
    it('should accept valid dimension units', () => {
      expect(validateDimensionUnit('cm')).toBe('cm')
      expect(validateDimensionUnit('in')).toBe('in')
    })

    it('should reject invalid dimension units', () => {
      expect(validateDimensionUnit('meters')).toBeNull()
      expect(validateDimensionUnit('invalid')).toBeNull()
    })
  })

  describe('validateNumber', () => {
    it('should accept valid numbers within range', () => {
      expect(validateNumber(50, 0, 100)).toBe(50)
      expect(validateNumber(0.5, 0, 1)).toBe(0.5)
    })

    it('should reject numbers outside range', () => {
      expect(validateNumber(150, 0, 100)).toBeNull()
      expect(validateNumber(-10, 0, 100)).toBeNull()
    })

    it('should reject invalid numbers', () => {
      expect(validateNumber(NaN)).toBeNull()
      expect(validateNumber(Infinity)).toBeNull()
      expect(validateNumber(-Infinity)).toBeNull()
    })

    it('should round to 2 decimal places', () => {
      expect(validateNumber(1.234567)).toBe(1.23)
    })
  })

  describe('validateWeight', () => {
    it('should accept valid weights', () => {
      expect(validateWeight(10)).toBe(10)
      expect(validateWeight(0.5)).toBe(0.5)
      expect(validateWeight(1000)).toBe(1000)
    })

    it('should reject invalid weights', () => {
      expect(validateWeight(0)).toBeNull()
      expect(validateWeight(1001)).toBeNull()
      expect(validateWeight(-10)).toBeNull()
    })
  })

  describe('validateDimension', () => {
    it('should accept valid dimensions', () => {
      expect(validateDimension(10)).toBe(10)
      expect(validateDimension(0.5)).toBe(0.5)
      expect(validateDimension(500)).toBe(500)
    })

    it('should reject invalid dimensions', () => {
      expect(validateDimension(0)).toBeNull()
      expect(validateDimension(501)).toBeNull()
      expect(validateDimension(-10)).toBeNull()
    })
  })

  describe('validateQuantity', () => {
    it('should accept valid quantities', () => {
      expect(validateQuantity(1)).toBe(1)
      expect(validateQuantity(100)).toBe(100)
      expect(validateQuantity(1000)).toBe(1000)
    })

    it('should reject invalid quantities', () => {
      expect(validateQuantity(0)).toBeNull()
      expect(validateQuantity(1001)).toBeNull()
      expect(validateQuantity(-10)).toBeNull()
    })
  })

  describe('sanitizeFormData', () => {
    it('should sanitize all form fields', () => {
      const formData = {
        originCountry: '<script>NO</script>',
        destinationCountry: 'SE',
        weight: 10,
        weightUnit: 'kg',
        length: 20,
        width: 15,
        height: 10,
        dimensionUnit: 'cm',
        quantity: 1,
      }

      const result = sanitizeFormData(formData)
      expect(result.originCountry).toBeNull() // Should be null due to sanitization
      expect(result.destinationCountry).toBe('SE')
      expect(result.weight).toBe(10)
    })
  })

  describe('isFormDataValid', () => {
    it('should return true for valid form data', () => {
      const validFormData = {
        originCountry: 'NO',
        destinationCountry: 'SE',
        weight: 10,
        weightUnit: 'kg',
        length: 20,
        width: 15,
        height: 10,
        dimensionUnit: 'cm',
        quantity: 1,
      }

      expect(isFormDataValid(validFormData)).toBe(true)
    })

    it('should return false for invalid form data', () => {
      const invalidFormData = {
        originCountry: 'XX', // Invalid country
        destinationCountry: 'SE',
        weight: 10,
        weightUnit: 'kg',
        length: 20,
        width: 15,
        height: 10,
        dimensionUnit: 'cm',
        quantity: 1,
      }

      expect(isFormDataValid(invalidFormData)).toBe(false)
    })
  })

  describe('CSRF Token', () => {
    it('should generate valid CSRF token', () => {
      const token = generateCSRFToken()
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.length).toBe(64) // 32 bytes = 64 hex chars
    })

    it('should validate CSRF token correctly', () => {
      const token = generateCSRFToken()
      expect(validateCSRFToken(token, token)).toBe(true)
      expect(validateCSRFToken(token, 'different-token')).toBe(false)
      expect(validateCSRFToken('', '')).toBe(false)
    })
  })

  describe('validatePackage', () => {
    it('should accept valid package data', () => {
      const validPackage = {
        weight: 10,
        quantity: 1,
        dimensions: { length: 30, width: 20, height: 15 }
      }
      expect(validatePackage(validPackage)).toBe(true)
    })

    it('should reject invalid package data', () => {
      expect(validatePackage(null as unknown as Package)).toBe(false)
      expect(validatePackage({} as unknown as Package)).toBe(false)
      expect(validatePackage({ weight: 0 } as unknown as Package)).toBe(false)
      expect(validatePackage({ weight: 10, quantity: 0 } as unknown as Package)).toBe(false)
      expect(validatePackage({ weight: 10, quantity: 1 } as unknown as Package)).toBe(false) // missing dimensions
    })
  })

  describe('validateShipmentRequest', () => {
    it('should accept valid shipment request', () => {
      const validRequest = {
        shipment: {
          packages: [{
            weight: 10,
            quantity: 1,
            dimensions: { length: 30, width: 20, height: 15 }
          }]
        }
      }
      expect(validateShipmentRequest(validRequest)).toBe(true)
    })

    it('should reject invalid shipment request', () => {
      expect(validateShipmentRequest(null as unknown as ShipmentRequest)).toBe(false)
      expect(validateShipmentRequest({} as unknown as ShipmentRequest)).toBe(false)
      expect(validateShipmentRequest({ shipment: {} } as unknown as ShipmentRequest)).toBe(false)
      expect(validateShipmentRequest({ shipment: { packages: [] } } as unknown as ShipmentRequest)).toBe(false)
    })
  })

  describe('validateOffer', () => {
    it('should accept valid offer data', () => {
      const validOffer = {
        carrierId: 'carrier-1',
        carrierName: 'Test Carrier',
        cost: 100.50,
        deliveryTime: 3
      }
      expect(validateOffer(validOffer)).toBe(true)
    })

    it('should reject invalid offer data', () => {
      expect(validateOffer(null as unknown as Offer)).toBe(false)
      expect(validateOffer({} as unknown as Offer)).toBe(false)
      expect(validateOffer({ carrierId: 'carrier-1' } as unknown as Offer)).toBe(false) // missing name
      expect(validateOffer({ carrierId: 'carrier-1', carrierName: 'Test' } as unknown as Offer)).toBe(false) // missing cost
      expect(validateOffer({ carrierId: 'carrier-1', carrierName: 'Test', cost: -10 } as unknown as Offer)).toBe(false) // negative cost
    })
  })

  describe('validateOfferResponse', () => {
    it('should accept valid offer response', () => {
      const validResponse = [
        {
          carrierId: 'carrier-1',
          carrierName: 'Test Carrier',
          cost: 100.50
        }
      ]
      expect(validateOfferResponse(validResponse)).toBe(true)
    })

    it('should reject invalid offer response', () => {
      expect(validateOfferResponse(null as unknown as Offer[])).toBe(false)
      expect(validateOfferResponse({} as unknown as Offer[])).toBe(false)
      expect(validateOfferResponse([])).toBe(true) // empty array is valid
      expect(validateOfferResponse([{} as unknown as Offer])).toBe(false) // invalid offer
    })
  })
})
