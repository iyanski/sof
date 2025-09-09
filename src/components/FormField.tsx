import { Form, Message } from 'rsuite'
import type { FormFieldProps } from './types'

interface FormFieldComponentProps extends FormFieldProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

export const FormField: React.FC<FormFieldComponentProps> = ({ 
  label, 
  error, 
  required = false,
  children,
  style
}) => {
  return (
    <Form.Group style={style}>
      <Form.ControlLabel>
        {label}
        {required && <span style={{ color: 'red', marginLeft: '2px' }}>*</span>}
      </Form.ControlLabel>
      {children}
      {error && (
        <Message type="error" style={{ marginTop: '0.5rem' }}>
          {error}
        </Message>
      )}
    </Form.Group>
  )
}
