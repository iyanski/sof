// Constants and options for the shipment application
import type { SelectOption } from '../components/types'

export const COUNTRY_OPTIONS: SelectOption[] = [
  { label: 'Norway', value: 'NO' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Finland', value: 'FI' },
  { label: 'Germany', value: 'DE' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' }
]

export const UNIT_OPTIONS: SelectOption[] = [
  { label: 'kg', value: 'kg' },
  { label: 'lbs', value: 'lbs' }
]

export const DIMENSION_UNIT_OPTIONS: SelectOption[] = [
  { label: 'cm', value: 'cm' },
  { label: 'in', value: 'in' }
]

export const DEFAULT_FORM_DATA = {
  originCountry: 'NO',
  destinationCountry: 'SE',
  weight: 0,
  weightUnit: 'kg',
  length: 0,
  width: 0,
  height: 0,
  dimensionUnit: 'cm',
  quantity: 1,
} as const
