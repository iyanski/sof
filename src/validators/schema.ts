import { Schema } from 'rsuite'

// Define the validation schema for the shipment form
export const shipmentSchema = Schema.Model({
  originCountry: Schema.Types.StringType().isRequired('Origin country is required'),
  destinationCountry: Schema.Types.StringType().isRequired('Destination country is required'),
  weight: Schema.Types.NumberType()
    .isRequired('Weight is required')
    .min(0.1, 'Weight must be greater than 0'),
  weightUnit: Schema.Types.StringType().isRequired('Weight unit is required'),
  length: Schema.Types.NumberType()
    .isRequired('Length is required')
    .min(0.1, 'Length must be greater than 0'),
  width: Schema.Types.NumberType()
    .isRequired('Width is required')
    .min(0.1, 'Width must be greater than 0'),
  height: Schema.Types.NumberType()
    .isRequired('Height is required')
    .min(0.1, 'Height must be greater than 0'),
  dimensionUnit: Schema.Types.StringType().isRequired('Dimension unit is required'),
  quantity: Schema.Types.NumberType()
    .isRequired('Quantity is required')
    .min(1, 'Quantity must be at least 1'),
  speedVsCost: Schema.Types.NumberType()
    .range(0, 100, 'Speed vs Cost must be between 0 and 100'),
  maxTransitDays: Schema.Types.NumberType()
    .range(1, 30, 'Max transit days must be between 1 and 30')
})
