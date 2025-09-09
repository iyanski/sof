import { Modal, Button } from 'rsuite'
import { Check, Close } from '@rsuite/icons'
import type { SubmissionModalProps } from './types'

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  isSuccess,
  onClose,
  message
}) => {
  return (
    <Modal 
      open={isOpen} 
      onClose={onClose}
      size="sm"
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title>
          {isSuccess ? 'Success!' : 'Error'}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          padding: '1rem 0'
        }}>
          {isSuccess ? (
            <Check style={{ fontSize: '2rem', color: '#10B981' }} />
          ) : (
            <Close style={{ fontSize: '2rem', color: '#EF4444' }} />
          )}
          <div>
            <p style={{ margin: 0, fontSize: '1rem' }}>
              {message}
            </p>
          </div>
        </div>
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
