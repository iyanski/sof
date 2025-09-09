/**
 * Centralized validation exports
 * This file provides a clean API for all validation-related functionality
 */

// Note: Individual base schemas are used internally but not exported
// as they are only needed for building the main shipmentSchema

// Organized schemas for different form types
export {
  shipmentSchema
} from './schemas'

// Security validation functions
export {
  validateShipmentRequest,
  validatePackage,
  validateOfferResponse,
  validateOffer
} from '../utils/security'

// Legacy export for backward compatibility
export { shipmentSchema as default } from './schemas'
