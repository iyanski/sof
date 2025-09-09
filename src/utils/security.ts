// Security utilities for input sanitization and validation

// Type definitions for form data
export interface ShipmentFormData {
  originCountry: string
  destinationCountry: string
  weight: number
  weightUnit: string
  length: number
  width: number
  height: number
  dimensionUnit: string
  quantity: number
}

export interface SanitizedFormData {
  originCountry: string | null
  destinationCountry: string | null
  weight: number | null
  weightUnit: string | null
  length: number | null
  width: number | null
  height: number | null
  dimensionUnit: string | null
  quantity: number | null
}

export interface ShipmentRequest {
  shipment: {
    packages: Package[]
  }
}

export interface Package {
  weight: number
  quantity: number
  dimensions: {
    length: number
    width: number
    height: number
  }
}

export interface Offer {
  carrierId: string
  carrierName: string
  cost: number
  deliveryTime?: number
  eligibilityScore?: number
  costEfficiencyScore?: number
  serviceQualityScore?: number
  reasons?: string[]
  isEligible?: boolean
}

// Input validation constants
export const VALIDATION_LIMITS = {
  MAX_STRING_LENGTH: 100,
  MAX_NUMBER: 999999,
  MIN_NUMBER: 0,
  MAX_QUANTITY: 1000,
  MAX_WEIGHT: 1000, // kg
  MAX_DIMENSION: 500, // cm
} as const

// Allowed country codes (ISO 3166-1 alpha-2)
export const ALLOWED_COUNTRIES = [
  'NO', 'SE', 'DK', 'FI', 'DE', 'GB', 'US', 'CA'
] as const

// Allowed units
export const ALLOWED_WEIGHT_UNITS = ['kg', 'lbs'] as const
export const ALLOWED_DIMENSION_UNITS = ['cm', 'in'] as const

/**
 * Sanitize string input to prevent XSS attacks
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') {
    return ''
  }
  
  // Basic HTML tag removal and XSS prevention
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
  
  // Trim and limit length
  return sanitized.trim().slice(0, VALIDATION_LIMITS.MAX_STRING_LENGTH)
}

/**
 * Validate and sanitize country code
 */
export const validateCountryCode = (country: string): string | null => {
  const sanitized = sanitizeString(country)
  return ALLOWED_COUNTRIES.includes(sanitized as typeof ALLOWED_COUNTRIES[number]) ? sanitized : null
}

/**
 * Validate and sanitize weight unit
 */
export const validateWeightUnit = (unit: string): string | null => {
  const sanitized = sanitizeString(unit)
  return ALLOWED_WEIGHT_UNITS.includes(sanitized as typeof ALLOWED_WEIGHT_UNITS[number]) ? sanitized : null
}

/**
 * Validate and sanitize dimension unit
 */
export const validateDimensionUnit = (unit: string): string | null => {
  const sanitized = sanitizeString(unit)
  return ALLOWED_DIMENSION_UNITS.includes(sanitized as typeof ALLOWED_DIMENSION_UNITS[number]) ? sanitized : null
}

/**
 * Validate and sanitize numeric input
 */
export const validateNumber = (
  value: number, 
  min: number = VALIDATION_LIMITS.MIN_NUMBER, 
  max: number = VALIDATION_LIMITS.MAX_NUMBER
): number | null => {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return null
  }
  
  // Round to 2 decimal places to prevent precision issues
  const rounded = Math.round(value * 100) / 100
  
  if (rounded < min || rounded > max) {
    return null
  }
  
  return rounded
}

/**
 * Validate weight input
 */
export const validateWeight = (weight: number): number | null => {
  return validateNumber(weight, 0.1, VALIDATION_LIMITS.MAX_WEIGHT)
}

/**
 * Validate dimension input
 */
export const validateDimension = (dimension: number): number | null => {
  return validateNumber(dimension, 0.1, VALIDATION_LIMITS.MAX_DIMENSION)
}

/**
 * Validate quantity input
 */
export const validateQuantity = (quantity: number): number | null => {
  return validateNumber(quantity, 1, VALIDATION_LIMITS.MAX_QUANTITY)
}


/**
 * Sanitize and validate form data
 */
export const sanitizeFormData = (formData: ShipmentFormData): SanitizedFormData => {
  return {
    originCountry: validateCountryCode(formData.originCountry),
    destinationCountry: validateCountryCode(formData.destinationCountry),
    weight: validateWeight(formData.weight),
    weightUnit: validateWeightUnit(formData.weightUnit),
    length: validateDimension(formData.length),
    width: validateDimension(formData.width),
    height: validateDimension(formData.height),
    dimensionUnit: validateDimensionUnit(formData.dimensionUnit),
    quantity: validateQuantity(formData.quantity),
  }
}

/**
 * Check if form data is valid
 */
export const isFormDataValid = (formData: ShipmentFormData): boolean => {
  const sanitized = sanitizeFormData(formData)
  return Object.values(sanitized).every(value => value !== null)
}

/**
 * Generate CSRF token (for future use)
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Validate CSRF token (for future use)
 */
export const validateCSRFToken = (token: string, expectedToken: string): boolean => {
  if (!token || !expectedToken) return false
  return token === expectedToken
}

/**
 * Validate shipment request structure
 */
export const validateShipmentRequest = (request: ShipmentRequest): boolean => {
  if (!request || !request.shipment) {
    return false
  }
  
  const { shipment } = request
  
  // Validate packages array
  if (!shipment.packages || !Array.isArray(shipment.packages) || shipment.packages.length === 0) {
    return false
  }
  
  // Validate each package
  for (const pkg of shipment.packages) {
    if (!validatePackage(pkg)) {
      return false
    }
  }
  
  return true
}

/**
 * Validate individual package data
 */
export const validatePackage = (pkg: Package): boolean => {
  if (!pkg) return false
  
  // Validate weight
  if (typeof pkg.weight !== 'number' || pkg.weight <= 0 || pkg.weight > VALIDATION_LIMITS.MAX_WEIGHT) {
    return false
  }
  
  // Validate quantity
  if (typeof pkg.quantity !== 'number' || pkg.quantity <= 0 || pkg.quantity > VALIDATION_LIMITS.MAX_QUANTITY) {
    return false
  }
  
  // Validate dimensions
  if (!pkg.dimensions || 
      typeof pkg.dimensions.length !== 'number' || 
      typeof pkg.dimensions.width !== 'number' || 
      typeof pkg.dimensions.height !== 'number') {
    return false
  }
  
  // Validate dimension values
  if (pkg.dimensions.length <= 0 || pkg.dimensions.length > VALIDATION_LIMITS.MAX_DIMENSION ||
      pkg.dimensions.width <= 0 || pkg.dimensions.width > VALIDATION_LIMITS.MAX_DIMENSION ||
      pkg.dimensions.height <= 0 || pkg.dimensions.height > VALIDATION_LIMITS.MAX_DIMENSION) {
    return false
  }
  
  return true
}

/**
 * Validate offer response structure
 */
export const validateOfferResponse = (data: Offer[]): boolean => {
  if (!Array.isArray(data)) {
    return false
  }
  
  // Validate each offer
  for (const offer of data) {
    if (!validateOffer(offer)) {
      return false
    }
  }
  
  return true
}

/**
 * Validate individual offer data
 */
export const validateOffer = (offer: Offer): boolean => {
  if (!offer) return false
  
  // Required fields
  if (!offer.carrierId || !offer.carrierName || typeof offer.cost !== 'number') {
    return false
  }
  
  // Validate cost is positive
  if (offer.cost < 0) {
    return false
  }
  
  // Validate delivery time if present
  if (offer.deliveryTime !== undefined && (typeof offer.deliveryTime !== 'number' || offer.deliveryTime < 0)) {
    return false
  }
  
  return true
}
