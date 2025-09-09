/**
 * Centralized validation exports
 * This file provides a clean API for all validation-related functionality
 */

// Base schemas for common field types
export {
  createStringSchema,
  createNumberSchema,
  countrySchema,
  weightUnitSchema,
  dimensionUnitSchema,
  weightSchema,
  dimensionSchema,
  quantitySchema
} from './base'

// Organized schemas for different form types
export {
  shipmentSchema,
  addressSchema,
  packageSchema,
  userPreferencesSchema
} from './schemas'

// Validation utilities and helpers
export {
  validateFormData,
  isFormValid,
  getFieldError,
  getAllErrors,
  sanitizeAndValidate,
  createCustomRule,
  createMatchRule,
  createUniqueRule,
  emailRule,
  phoneRule,
  urlRule
} from './utils'

// Security validation functions
export {
  validateShipmentRequest,
  validatePackage,
  validateOfferResponse,
  validateOffer
} from '../utils/security'

// Legacy export for backward compatibility
export { shipmentSchema as default } from './schemas'
