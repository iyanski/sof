import { useState, useRef, useEffect } from 'react'
import type { FormInstance } from 'rsuite'
import type { ShipmentFormData, Offer } from '../components/types'
import { DEFAULT_FORM_DATA } from '../data/constants'
import { transformFormDataToShipmentRequest } from '../utils/transformers'
import { useOffers } from './useOffers'

export const useShipmentForm = () => {
  const { postOffers, isLoading } = useOffers()
  const [formData, setFormData] = useState<ShipmentFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [offers, setOffers] = useState<Offer[]>([])
  const formRef = useRef<FormInstance>(null)

  const handleFormChange = (formValue: Record<string, unknown>) => {
    setFormData(formValue as unknown as ShipmentFormData)
    // Clear errors when form changes
    setErrors({})
  }

  useEffect(() => {
    console.log('Offers:', offers)
  }, [offers])

  const handleSubmit = async () => {
    if (!formRef.current) return
    
    // Check if form is valid using Schema
    if (!formRef.current.check()) {
      return
    }

    try {
      const shipmentRequest = transformFormDataToShipmentRequest(formData)
      const offersResponse: Offer[] = await postOffers(shipmentRequest)

      setOffers(offersResponse || [])
    } catch (error) {
      // Show error modal
      console.error('Error submitting shipment request:', error)
      setModalSuccess(false)
      setModalMessage('There was an error submitting your request. Please try again or contact support if the problem persists.')
      setModalOpen(true)
    }
  }

  const handleReset = () => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  return {
    formData,
    errors,
    isLoading,
    offers,
    formRef,
    modalOpen,
    modalSuccess,
    modalMessage,
    handleFormChange,
    handleSubmit,
    handleReset,
    handleCloseModal
  }
}
