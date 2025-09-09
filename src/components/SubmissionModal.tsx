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
      size={isSuccess ? "md" : "sm"}
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
          alignItems: 'flex-start', 
          gap: '1rem',
          padding: '1rem 0'
        }}>
          {isSuccess ? (
            <Check style={{ fontSize: '2rem', color: '#10B981', marginTop: '0.25rem' }} />
          ) : (
            <Close style={{ fontSize: '2rem', color: '#EF4444', marginTop: '0.25rem' }} />
          )}
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
