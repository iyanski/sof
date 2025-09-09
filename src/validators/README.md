# Validation System Documentation

This directory contains a comprehensive, organized validation system using rsuite's Schema for form validation. The system is designed to be modular, reusable, and maintainable.

## Structure Overview

```
validators/
├── base.ts          # Base schemas for common field types
├── schemas.ts       # Organized schemas for different form types
├── utils.ts         # Validation utilities and helpers
├── index.ts         # Centralized exports
├── schema.ts        # Legacy file (deprecated)
└── README.md        # This documentation
```

## Quick Start

```typescript
import { shipmentSchema, validateFormData, isFormValid } from '../validators'

// Validate form data
const result = validateFormData(shipmentSchema, formData)
if (!result.hasError) {
  // Form is valid
}

// Quick validation check
const isValid = isFormValid(shipmentSchema, formData)
```

## Base Schemas (`base.ts`)

Base schemas provide reusable validation patterns for common field types:

### String Schemas
```typescript
import { createStringSchema } from '../validators'

const nameSchema = createStringSchema(true, 50) // required, max 50 chars
const optionalSchema = createStringSchema(false, 100) // optional, max 100 chars
```

### Number Schemas
```typescript
import { createNumberSchema } from '../validators'

const priceSchema = createNumberSchema(true, 0, 1000, 'Price')
// required, min 0, max 1000, field name "Price"
```

### Pre-built Schemas
- `countrySchema` - Country code validation
- `weightUnitSchema` - Weight unit validation (kg, lbs)
- `dimensionUnitSchema` - Dimension unit validation (cm, in)
- `weightSchema` - Weight validation (0.1 to MAX_WEIGHT)
- `dimensionSchema` - Dimension validation (0.1 to MAX_DIMENSION)
- `quantitySchema` - Quantity validation (1 to MAX_QUANTITY)

## Form Schemas (`schemas.ts`)

Organized schemas for different form types:

### Shipment Schema
```typescript
import { shipmentSchema } from '../validators'

// Complete shipment form validation
const result = shipmentSchema.check(formData)
```

### Address Schema
```typescript
import { addressSchema } from '../validators'

// Address validation for future use
const result = addressSchema.check(addressData)
```

### Package Schema
```typescript
import { packageSchema } from '../validators'

// Standalone package information validation
const result = packageSchema.check(packageData)
```

### User Preferences Schema
```typescript
import { userPreferencesSchema } from '../validators'

// User preference validation for future use
const result = userPreferencesSchema.check(preferencesData)
```

## Validation Utilities (`utils.ts`)

### Basic Validation
```typescript
import { validateFormData, isFormValid, getFieldError, getAllErrors } from '../validators'

// Validate against schema
const result = validateFormData(schema, formData)

// Quick validation check
const isValid = isFormValid(schema, formData)

// Get specific field error
const error = getFieldError(schema, formData, 'weight')

// Get all errors as object
const errors = getAllErrors(schema, formData)
```

### Sanitization and Validation
```typescript
import { sanitizeAndValidate } from '../validators'

const { data, isValid, errors, errorMap } = sanitizeAndValidate(schema, formData)
```

### Custom Rules
```typescript
import { createCustomRule, createMatchRule, createUniqueRule } from '../validators'

// Custom validation rule
const customRule = createCustomRule(
  (value) => value.length >= 8,
  'Password must be at least 8 characters'
)

// Match rule (e.g., password confirmation)
const matchRule = createMatchRule('password', 'Passwords do not match')

// Unique rule
const uniqueRule = createUniqueRule(existingValues, 'Value must be unique')
```

### Common Validation Rules
```typescript
import { emailRule, phoneRule, urlRule } from '../validators'

// Email validation
const emailSchema = Schema.Types.StringType()
  .isRequired('Email is required')
  .addRule(emailRule, 'Invalid email format')

// Phone validation
const phoneSchema = Schema.Types.StringType()
  .addRule(phoneRule, 'Invalid phone number')

// URL validation
const urlSchema = Schema.Types.StringType()
  .addRule(urlRule, 'Invalid URL')
```

## Usage Examples

### Basic Form Validation
```typescript
import { shipmentSchema, validateFormData } from '../validators'

const handleSubmit = (formData) => {
  const result = validateFormData(shipmentSchema, formData)
  
  if (result.hasError) {
    console.log('Validation errors:', result.error)
    return
  }
  
  // Proceed with form submission
  submitForm(formData)
}
```

### Real-time Validation
```typescript
import { getFieldError } from '../validators'

const handleFieldChange = (fieldName, value) => {
  const error = getFieldError(shipmentSchema, { ...formData, [fieldName]: value }, fieldName)
  
  if (error) {
    setFieldError(fieldName, error)
  } else {
    clearFieldError(fieldName)
  }
}
```

### Custom Schema Creation
```typescript
import { createStringSchema, createNumberSchema, createCustomRule } from '../validators'

const customSchema = Schema.Model({
  name: createStringSchema(true, 50),
  age: createNumberSchema(true, 0, 120, 'Age'),
  email: Schema.Types.StringType()
    .isRequired('Email is required')
    .addRule(emailRule, 'Invalid email format'),
  customField: Schema.Types.StringType()
    .addRule(createCustomRule(
      (value) => value.startsWith('custom-'),
      'Must start with "custom-"'
    ), 'Invalid format')
})
```

## Migration from Legacy Schema

The old `schema.ts` file is deprecated but still works for backward compatibility:

```typescript
// Old way (deprecated)
import { shipmentSchema } from '../validators/schema'

// New way (recommended)
import { shipmentSchema } from '../validators'
```

## Security Integration

The validation system integrates with the security utilities:

```typescript
import { sanitizeAndValidate } from '../validators'

// Automatically sanitizes input and validates
const { data, isValid, errors } = sanitizeAndValidate(shipmentSchema, rawFormData)
```

## Best Practices

1. **Use base schemas** for common field types to maintain consistency
2. **Create specific schemas** for different form types
3. **Use validation utilities** for common operations
4. **Sanitize input** before validation using `sanitizeAndValidate`
5. **Handle errors gracefully** using the provided error handling utilities
6. **Test validation** thoroughly, especially custom rules

## Testing

All validation schemas and utilities are thoroughly tested. Run tests with:

```bash
npm test -- --testPathPatterns="validators"
```

## Future Enhancements

- Add more pre-built schemas for common use cases
- Implement async validation for server-side checks
- Add validation caching for performance
- Create validation middleware for forms
