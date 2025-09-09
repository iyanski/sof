import { Form, Message } from 'rsuite'
import type { FormFieldProps } from '../types'
import { styles } from './FormField.styles'

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
        {required && <span style={styles.required}>*</span>}
      </Form.ControlLabel>
      {children}
      {error && (
        <Message type="error" style={styles.errorMessage}>
          {error}
        </Message>
      )}
    </Form.Group>
  )
}

