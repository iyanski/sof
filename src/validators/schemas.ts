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

// Address validation schema (for future use)
export const addressSchema = Schema.Model({
  country: countrySchema,
  city: Schema.Types.StringType()
    .isRequired('City is required')
    .maxLength(50, 'City name cannot exceed 50 characters'),
  postalCode: Schema.Types.StringType()
    .isRequired('Postal code is required')
    .maxLength(10, 'Postal code cannot exceed 10 characters'),
  addressLine1: Schema.Types.StringType()
    .isRequired('Address line 1 is required')
    .maxLength(100, 'Address line cannot exceed 100 characters'),
  addressLine2: Schema.Types.StringType()
    .maxLength(100, 'Address line cannot exceed 100 characters')
})

// Package validation schema (standalone package info)
export const packageSchema = Schema.Model({
  weight: weightSchema,
  weightUnit: weightUnitSchema,
  length: dimensionSchema,
  width: dimensionSchema,
  height: dimensionSchema,
  dimensionUnit: dimensionUnitSchema,
  quantity: quantitySchema
})

// User preferences schema (for future use)
export const userPreferencesSchema = Schema.Model({
  preferredCarriers: Schema.Types.ArrayType()
    .of(Schema.Types.StringType())
    .maxLength(10, 'Cannot select more than 10 preferred carriers')
})
