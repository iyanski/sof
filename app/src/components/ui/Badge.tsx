import React from 'react'
import { styles } from './Badge.styles'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'sm' 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#2563EB',
          color: '#FFFFFF'
        }
      case 'secondary':
        return {
          backgroundColor: '#6B7280',
          color: '#FFFFFF'
        }
      case 'success':
        return {
          backgroundColor: '#10B981',
          color: '#FFFFFF'
        }
      case 'warning':
        return {
          backgroundColor: '#F59E0B',
          color: '#FFFFFF'
        }
      case 'error':
        return {
          backgroundColor: '#EF4444',
          color: '#FFFFFF'
        }
      default:
        return {
          backgroundColor: '#2563EB',
          color: '#FFFFFF'
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          fontSize: '12px',
          padding: '4px 8px'
        }
      case 'md':
        return {
          fontSize: '14px',
          padding: '6px 12px'
        }
      default:
        return {
          fontSize: '12px',
          padding: '4px 8px'
        }
    }
  }

  return (
    <span
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...styles.badge
      }}
    >
      {children}
    </span>
  )
}

