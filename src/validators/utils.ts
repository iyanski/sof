import { sanitizeFormData } from '../utils/security'

/**
 * Validation utility functions and helpers
 * These functions provide common validation operations and error handling
 */

/**
 * Validate form data against a schema
 */
export const validateFormData = (schema: any, formData: any) => {
  return schema.check(formData)
}

/**
 * Check if form data is valid without returning detailed errors
 */
export const isFormValid = (schema: any, formData: any): boolean => {
  const result = schema.check(formData)
  return result.hasError === false
}

/**
 * Get validation errors for a specific field
 */
export const getFieldError = (schema: any, formData: any, fieldName: string): string | null => {
  const result = schema.check(formData)
  if (result.hasError && result.error) {
    const fieldError = result.error.find((error: any) => error.field === fieldName)
    return fieldError ? fieldError.errorMessage : null
  }
  return null
}

/**
 * Get all validation errors as a flat object
 */
export const getAllErrors = (schema: any, formData: any): Record<string, string> => {
  const result = schema.check(formData)
  const errors: Record<string, string> = {}
  
  if (result.hasError && result.error) {
    result.error.forEach((error: any) => {
      if (error.field && error.errorMessage) {
        errors[error.field] = error.errorMessage
      }
    })
  }
  
  return errors
}

/**
 * Sanitize and validate form data using both security utils and schema validation
 */
export const sanitizeAndValidate = (schema: any, formData: any) => {
  // First sanitize the data
  const sanitizedData = sanitizeFormData(formData)
  
  // Then validate against schema
  const validationResult = validateFormData(schema, sanitizedData)
  
  return {
    data: sanitizedData,
    isValid: !validationResult.hasError,
    errors: validationResult.error || [],
    errorMap: getAllErrors(schema, sanitizedData)
  }
}

/**
 * Create a custom validation rule
 */
export const createCustomRule = (
  validator: (value: any) => boolean | string,
  errorMessage: string
) => {
  return (value: any) => {
    const result = validator(value)
    if (typeof result === 'string') {
      return result
    }
    return result ? true : errorMessage
  }
}

/**
 * Validate that two fields match (e.g., password confirmation)
 */
export const createMatchRule = (fieldName: string, errorMessage?: string) => {
  return (value: any, formData: any) => {
    const otherValue = formData[fieldName]
    const message = errorMessage || `${fieldName} does not match`
    return value === otherValue || message
  }
}

/**
 * Validate that a value is unique in a list
 */
export const createUniqueRule = (existingValues: any[], errorMessage?: string) => {
  return (value: any) => {
    const message = errorMessage || 'Value must be unique'
    return !existingValues.includes(value) || message
  }
}

/**
 * Validate email format
 */
export const emailRule = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value) || 'Please enter a valid email address'
}

/**
 * Validate phone number format
 */
export const phoneRule = (value: string) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(value.replace(/[\s\-\(\)]/g, '')) || 'Please enter a valid phone number'
}

/**
 * Validate URL format
 */
export const urlRule = (value: string) => {
  try {
    new URL(value)
    return true
  } catch {
    return 'Please enter a valid URL'
  }
}
