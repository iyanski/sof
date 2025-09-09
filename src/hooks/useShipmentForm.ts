import { useState, useRef, useEffect } from 'react'
import type { FormInstance } from 'rsuite'
import type { ShipmentFormData } from '../components/types'
import { DEFAULT_FORM_DATA } from '../data/constants'
import { transformFormDataToShipmentRequest } from '../utils/transformers'
import { useOffers } from './useOffers'

export const useShipmentForm = () => {
  const { postOffers, isLoading, error: responseError } = useOffers()
  const [formData, setFormData] = useState<ShipmentFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const formRef = useRef<FormInstance>(null)

  const handleFormChange = (formValue: Record<string, unknown>) => {
    setFormData(formValue as unknown as ShipmentFormData)
    // Clear errors when form changes
    setErrors({})
  }

  useEffect(() => {
    console.log(responseError)
  }, [responseError])

  const handleSubmit = async () => {
    if (!formRef.current) return
    
    // Check if form is valid using Schema
    if (!formRef.current.check()) {
      return
    }

    // Simulate API call
    try {
      // await new Promise(resolve => setTimeout(resolve, 2000))
      // TODO: Navigate to offers page or call actual API

      const shipmentRequest = transformFormDataToShipmentRequest(formData)
      console.log('Shipment request:', shipmentRequest)
      const offers = await postOffers(shipmentRequest)
      console.log('Offers:', offers)

      // Show success modal
      setModalSuccess(true)
      setModalMessage('Your shipment request has been submitted successfully! We will process your request and get back to you with offers shortly.')
      setModalOpen(true)
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
