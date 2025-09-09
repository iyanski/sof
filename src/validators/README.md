# Validation System Documentation

This directory contains a streamlined validation system using rsuite's Schema for form validation. The system is designed to be focused, maintainable, and production-ready.

## Structure Overview

```
validators/
├── base.ts          # Base schemas for common field types
├── schemas.ts       # Form-specific validation schemas
├── utils.ts         # Validation utilities (minimal)
├── index.ts         # Centralized exports
└── README.md        # This documentation
```

## Quick Start

```typescript
import { shipmentSchema } from '../validators'

// Validate form data using RSuite Schema
const result = shipmentSchema.check(formData)
if (result.hasError) {
  // Handle validation errors
  console.log('Validation errors:', result.error)
} else {
  // Form is valid, proceed with submission
}
```

## Available Schemas

### **Shipment Schema** (`schemas.ts`)
The main validation schema for shipment forms:

```typescript
import { shipmentSchema } from '../validators'

// Complete shipment form validation
const result = shipmentSchema.check(formData)
```

**Validates:**
- `originCountry` - Required country code
- `destinationCountry` - Required country code  
- `weight` - Required weight (0.1 to MAX_WEIGHT)
- `weightUnit` - Required weight unit (kg, lbs)
- `quantity` - Required quantity (1 to MAX_QUANTITY)
- `length` - Required dimension (0.1 to MAX_DIMENSION)
- `width` - Required dimension (0.1 to MAX_DIMENSION)
- `height` - Required dimension (0.1 to MAX_DIMENSION)
- `dimensionUnit` - Required dimension unit (cm, in)

## Base Schemas (`base.ts`)

Base schemas provide reusable validation patterns for common field types:

### **Pre-built Schemas**
- `countrySchema` - Country code validation (SE, NO, DK, etc.)
- `weightUnitSchema` - Weight unit validation (kg, lbs)
- `dimensionUnitSchema` - Dimension unit validation (cm, in)
- `weightSchema` - Weight validation (0.1 to MAX_WEIGHT)
- `dimensionSchema` - Dimension validation (0.1 to MAX_DIMENSION)
- `quantitySchema` - Quantity validation (1 to MAX_QUANTITY)

### **Internal Usage**
These base schemas are used internally by the `shipmentSchema` and are not exported directly. They provide consistent validation across the application.

## Security Integration

The validation system integrates with security utilities from `../utils/security`:

### **Available Security Validators**
- `validateShipmentRequest` - Validates complete shipment requests
- `validatePackage` - Validates individual package data
- `validateOfferResponse` - Validates API response data
- `validateOffer` - Validates individual offer data

```typescript
import { validateShipmentRequest, validateOfferResponse } from '../validators'

// Validate before API calls
if (!validateShipmentRequest(shipmentData)) {
  throw new Error('Invalid shipment request')
}

// Validate API responses
if (!validateOfferResponse(apiResponse)) {
  throw new Error('Invalid offer response')
}
```

## Usage Examples

### **Basic Form Validation**
```typescript
import { shipmentSchema } from '../validators'

const handleSubmit = (formData) => {
  const result = shipmentSchema.check(formData)
  
  if (result.hasError) {
    // Display validation errors
    setErrors(result.error)
    return
  }
  
  // Proceed with form submission
  submitForm(formData)
}
```

### **Real-time Field Validation**
```typescript
import { shipmentSchema } from '../validators'

const handleFieldChange = (fieldName, value) => {
  const fieldData = { ...formData, [fieldName]: value }
  const result = shipmentSchema.check(fieldData)
  
  if (result.hasError && result.error[fieldName]) {
    setFieldError(fieldName, result.error[fieldName])
  } else {
    clearFieldError(fieldName)
  }
}
```

### **Integration with RSuite Form**
```typescript
import { Form, Schema } from 'rsuite'
import { shipmentSchema } from '../validators'

const MyForm = () => {
  return (
    <Form
      model={shipmentSchema}
      onSubmit={handleSubmit}
    >
      {/* Form fields */}
    </Form>
  )
}
```

## Validation Rules

### **Country Validation**
- Must be a valid 2-character country code
- Supported countries: SE, NO, DK, FI, DE, AT, CH, PL, US, CA, GB

### **Weight Validation**
- Minimum: 0.1 kg
- Maximum: 1000 kg (configurable via VALIDATION_LIMITS)

### **Dimension Validation**
- Minimum: 0.1 cm
- Maximum: 200 cm (configurable via VALIDATION_LIMITS)

### **Quantity Validation**
- Minimum: 1
- Maximum: 100 (configurable via VALIDATION_LIMITS)

### **Unit Validation**
- Weight units: kg, lbs
- Dimension units: cm, in

## Error Handling

Validation errors are returned in a structured format:

```typescript
{
  hasError: true,
  error: {
    weight: "Weight must be at least 0.1",
    originCountry: "Country is required"
  }
}
```

## Configuration

Validation limits are configured in `../utils/security`:

```typescript
export const VALIDATION_LIMITS = {
  MAX_WEIGHT: 1000,
  MAX_DIMENSION: 200,
  MAX_QUANTITY: 100,
  MIN_NUMBER: 0.1,
  MAX_NUMBER: 10000
}
```

## Testing

All validation schemas are thoroughly tested. Run tests with:

```bash
npm test -- --testPathPattern="validators|security"
```

## Best Practices

1. **Use the main schema**: Always use `shipmentSchema` for form validation
2. **Validate early**: Validate data before API calls using security validators
3. **Handle errors gracefully**: Display validation errors clearly to users
4. **Test thoroughly**: Ensure all validation rules work as expected
5. **Keep it simple**: The current system is focused and production-ready

## Migration Notes

### **Removed Features**
The following features were removed to simplify the system:
- Individual base schema exports (now internal only)
- Complex validation utilities (simplified to core needs)
- Legacy schema files (consolidated into main schemas)
- Unused validation rules and helpers

### **Current Focus**
The validation system now focuses on:
- Core shipment form validation
- Security validation for API interactions
- Simple, maintainable code
- Production-ready reliability

## Future Enhancements

- Add more specific validation rules as needed
- Implement async validation for server-side checks
- Add validation caching for performance
- Create validation middleware for forms

---

**Note**: This validation system is designed to be minimal and focused. It provides all necessary validation for the current application while maintaining simplicity and reliability.