import { Schema } from 'rsuite'
import { 
  VALIDATION_LIMITS, 
  ALLOWED_COUNTRIES, 
  ALLOWED_WEIGHT_UNITS, 
  ALLOWED_DIMENSION_UNITS 
} from '../utils/security'

/**
 * Base validation schemas for common field types
 * These can be reused across different forms to maintain consistency
 */

// Common number validation with range (used internally by other schemas)
const createNumberSchema = (
  required = true, 
  min: number = VALIDATION_LIMITS.MIN_NUMBER, 
  max: number = VALIDATION_LIMITS.MAX_NUMBER,
  fieldName = 'Value'
) => {
  let schema = Schema.Types.NumberType()
  
  if (required) {
    schema = schema.isRequired(`${fieldName} is required`)
  }
  
  return schema
    .min(min, `${fieldName} must be at least ${min}`)
    .max(max, `${fieldName} cannot exceed ${max}`)
}

// Country code validation
export const countrySchema = Schema.Types.StringType()
  .isRequired('Country is required')
  .addRule((value: string) => {
    return ALLOWED_COUNTRIES.includes(value as typeof ALLOWED_COUNTRIES[number])
  }, 'Invalid country code')

// Weight unit validation
export const weightUnitSchema = Schema.Types.StringType()
  .isRequired('Weight unit is required')
  .addRule((value: string) => {
    return ALLOWED_WEIGHT_UNITS.includes(value as typeof ALLOWED_WEIGHT_UNITS[number])
  }, 'Invalid weight unit')

// Dimension unit validation
export const dimensionUnitSchema = Schema.Types.StringType()
  .isRequired('Dimension unit is required')
  .addRule((value: string) => {
    return ALLOWED_DIMENSION_UNITS.includes(value as typeof ALLOWED_DIMENSION_UNITS[number])
  }, 'Invalid dimension unit')

// Weight validation (0.1 to MAX_WEIGHT)
export const weightSchema = createNumberSchema(
  true, 
  0.1, 
  VALIDATION_LIMITS.MAX_WEIGHT, 
  'Weight'
)

// Dimension validation (0.1 to MAX_DIMENSION)
export const dimensionSchema = createNumberSchema(
  true, 
  0.1, 
  VALIDATION_LIMITS.MAX_DIMENSION, 
  'Dimension'
)

// Quantity validation (1 to MAX_QUANTITY)
export const quantitySchema = createNumberSchema(
  true, 
  1, 
  VALIDATION_LIMITS.MAX_QUANTITY, 
  'Quantity'
)

