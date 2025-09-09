import { Loader } from 'rsuite'
import { styles } from './LoadingSpinner.styles'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  return (
    <div 
      style={styles.container}
      role="status"
      aria-label={message}
    >
      <Loader size={size} />
      <p style={styles.message}>
        {message}
      </p>
    </div>
  )
}

