// Security utilities for input sanitization and validation

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
  return ALLOWED_COUNTRIES.includes(sanitized as any) ? sanitized : null
}

/**
 * Validate and sanitize weight unit
 */
export const validateWeightUnit = (unit: string): string | null => {
  const sanitized = sanitizeString(unit)
  return ALLOWED_WEIGHT_UNITS.includes(sanitized as any) ? sanitized : null
}

/**
 * Validate and sanitize dimension unit
 */
export const validateDimensionUnit = (unit: string): string | null => {
  const sanitized = sanitizeString(unit)
  return ALLOWED_DIMENSION_UNITS.includes(sanitized as any) ? sanitized : null
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
export const sanitizeFormData = (formData: any) => {
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
export const isFormDataValid = (formData: any): boolean => {
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
