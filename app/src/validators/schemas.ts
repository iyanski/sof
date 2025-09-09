import { Schema } from 'rsuite'
import {
  countrySchema,
  weightSchema,
  weightUnitSchema,
  dimensionSchema,
  dimensionUnitSchema,
  quantitySchema
} from './base'

/**
 * Organized validation schemas for different form types
 * Each schema is focused on a specific domain or use case
 */

// Shipment form validation schema
export const shipmentSchema = Schema.Model({
  // Route information
  originCountry: countrySchema,
  destinationCountry: countrySchema,
  
  // Package information
  weight: weightSchema,
  weightUnit: weightUnitSchema,
  quantity: quantitySchema,
  
  // Dimensions
  length: dimensionSchema,
  width: dimensionSchema,
  height: dimensionSchema,
  dimensionUnit: dimensionUnitSchema,
  
})

// Note: addressSchema, packageSchema, and userPreferencesSchema have been removed
// as they were not being used in the application. They can be re-added if needed
// for future features.
