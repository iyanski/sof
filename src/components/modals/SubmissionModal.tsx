import { Modal, Button, Card, Heading } from 'rsuite'
import { Close } from '@rsuite/icons'
import type { SubmissionModalProps } from '../types'
import { sanitizeText } from '../../utils/xss-protection'
import { styles } from './SubmissionModal.styles'

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  isSuccess,
  onClose,
  message,
  selectedOffer,
  formData
}) => {
  return (
    <Modal 
      open={isOpen} 
      onClose={onClose}
      size={isSuccess ? "md" : "sm"}
      backdrop="static"
      aria-modal="true"
      aria-labelledby="modal-title"
      role="dialog"
    >
      <Modal.Header>
        <Modal.Title id="modal-title">
          {isSuccess ? 'Shipment Confirmation' : 'Error'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {isSuccess && selectedOffer && formData ? (
          <div style={styles.successContainer}>
            {/* Success Header */}
            <div style={styles.successHeader}>
              <div style={styles.successIcon} aria-hidden="true">✅</div>
              <div>
                <Heading level={3}>
                  Confirmation
                </Heading>
                <p style={styles.successMessage}>
                  Please confirm your shipment with {sanitizeText(selectedOffer.carrierName)}.
                </p>
              </div>
            </div>

            {/* Shipment Details Card */}
            <Card style={styles.cardMargin}>
              <Card.Header>
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon} aria-hidden="true">📦</span>
                  <strong>Shipment Details</strong>
                </div>
              </Card.Header>
              <Card.Body>
                <div style={styles.gridTwoColumns}>
                  <div>
                    <strong>Route:</strong><br />
                    {formData.originCountry} → {formData.destinationCountry}
                  </div>
                  <div>
                    <strong>Quantity:</strong><br />
                    {formData.quantity} package(s)
                  </div>
                  <div>
                    <strong>Weight:</strong><br />
                    {(formData.weight * formData.quantity).toLocaleString()} kg
                  </div>
                  <div>
                    <strong>Volume:</strong><br />
                    {(formData.length * formData.width * formData.height * formData.quantity).toLocaleString()} cm³
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Selected Carrier Card */}
            <Card>
              <Card.Header>
                <div style={styles.cardHeader}>
                  <span style={styles.cardIcon} aria-hidden="true">🚚</span>
                  <strong>Selected Carrier</strong>
                </div>
              </Card.Header>
              <Card.Body>
                <div style={styles.gridTwoColumns}>
                  <div>
                    <strong>Carrier:</strong><br />
                    {sanitizeText(selectedOffer.carrierName)}
                  </div>
                  <div>
                    <strong>Delivery Time:</strong><br />
                    {selectedOffer.deliveryTime === 1 ? '1 day' : `${selectedOffer.deliveryTime} days`}
                  </div>
                  <div>
                    <strong>Total Cost:</strong><br />
                    {new Intl.NumberFormat('sv-SE', {
                      style: 'currency',
                      currency: 'SEK',
                      minimumFractionDigits: 2
                    }).format(selectedOffer.cost)}
                  </div>
                  <div>
                    <strong>Eligibility Score:</strong><br />
                    {selectedOffer.eligibilityScore}/100
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ) : (
          <div style={styles.errorContainer}>
            <Close style={styles.errorIcon} aria-hidden="true" />
            <div style={styles.errorContent}>
              <div 
                style={styles.errorMessage}
                role="alert"
                aria-live="polite"
              >
                {sanitizeText(message)}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button 
          appearance="primary" 
          onClick={onClose}
          style={{
            backgroundColor: isSuccess ? '#10B981' : '#EF4444'
          }}
          aria-label={isSuccess ? 'Continue with shipment' : 'Try again'}
        >
          {isSuccess ? 'Continue' : 'Try Again'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

