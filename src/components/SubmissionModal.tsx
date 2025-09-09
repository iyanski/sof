import { Modal, Button, Card, Heading, Text } from 'rsuite'
import { Check, Close } from '@rsuite/icons'
import type { SubmissionModalProps } from './types'

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
    >
      <Modal.Header>
        <Modal.Title/>
      </Modal.Header>
      
      <Modal.Body>
        {isSuccess && selectedOffer && formData ? (
          <div style={{ padding: '1rem 0' }}>
            {/* Success Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              
              <div>
                <Heading level={3}>
                  Confirmation
                </Heading>
                <p style={{ margin: '0.25rem 0 0 0', color: '#6B7280' }}>
                  Please confirm your shipment with {selectedOffer.carrierName}.
                </p>
              </div>
            </div>

            {/* Shipment Details Card */}
            <Card style={{ marginBottom: '1rem' }}>
              <Card.Header>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>📦</span>
                  <strong>Shipment Details</strong>
                </div>
              </Card.Header>
              <Card.Body>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🚚</span>
                  <strong>Selected Carrier</strong>
                </div>
              </Card.Header>
              <Card.Body>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <strong>Carrier:</strong><br />
                    {selectedOffer.carrierName}
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap: '1rem',
            padding: '1rem 0'
          }}>
            <Close style={{ fontSize: '2rem', color: '#EF4444', marginTop: '0.25rem' }} />
            <div style={{ flex: 1 }}>
              <pre style={{ 
                margin: 0, 
                fontSize: '0.9rem', 
                lineHeight: '1.5',
                fontFamily: 'inherit',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}>
                {message}
              </pre>
            </div>
          </div>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button 
          appearance="primary" 
          onClick={onClose}
          style={{ backgroundColor: isSuccess ? '#10B981' : '#EF4444' }}
        >
          {isSuccess ? 'Continue' : 'Try Again'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
