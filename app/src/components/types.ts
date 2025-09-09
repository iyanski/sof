// Shared types and interfaces for the shipment application
import type { FormInstance } from 'rsuite'

export interface ShipmentFormData {
  originCountry: string
  destinationCountry: string
  weight: number
  weightUnit: string
  length: number
  width: number
  height: number
  dimensionUnit: string
  quantity: number
}

export interface ShipmentRequest {
  shipment: {
    originAddress: { country: string }
    destinationAddress: { country: string }
    packages: Array<{
      id?: string
      quantity: number
      weight: number        // Always in kg
      dimensions: {         // Always in cm
        length: number      // Always in cm
        width: number       // Always in cm
        height: number      // Always in cm
      }
    }>
  }
}

export interface SelectOption {
  label: string
  value: string
}

export interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  disabled?: boolean
}

export interface ShipmentFormProps {
  formData: ShipmentFormData
  isLoading: boolean
  formRef: React.RefObject<FormInstance | null>
  onFormChange: (formValue: Record<string, unknown>) => void
  onSubmit: () => void
  onReset: () => void
}

export interface HeroSectionProps {
  onScrollToForm: () => void
}

export interface HeaderProps {
  title: string
  subtitle: string
}


export interface SubmissionModalProps {
  isOpen: boolean
  isSuccess: boolean
  onClose: () => void
  message: string
  selectedOffer?: Offer | null
  formData?: ShipmentFormData
}

export interface ApiError {
  message: string
  details?: string[]
  status?: number
}

export interface Offer {
  carrierId: string
  carrierName: string
  cost: number
  deliveryTime: number
  eligibilityScore: number
  costEfficiencyScore: number
  serviceQualityScore: number
  reasons: string[]
  isEligible: boolean
}