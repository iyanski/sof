// Component tests for Badge component using BDD patterns
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Badge } from './Badge'

describe('Badge Component', () => {
  describe('when rendering with default props', () => {
    it('should display the provided text', () => {
      // Given
      const badgeText = 'Test Badge'
      
      // When
      render(<Badge>{badgeText}</Badge>)
      
      // Then
      expect(screen.getByText(badgeText)).toBeInTheDocument()
    })

    it('should have primary variant styling by default', () => {
      // Given
      const badgeText = 'Primary Badge'
      
      // When
      render(<Badge>{badgeText}</Badge>)
      const badge = screen.getByText(badgeText)
      
      // Then
      expect(badge).toHaveStyle({
        backgroundColor: '#2563EB',
        color: '#FFFFFF',
      })
    })

    it('should have small size styling by default', () => {
      // Given
      const badgeText = 'Small Badge'
      
      // When
      render(<Badge>{badgeText}</Badge>)
      const badge = screen.getByText(badgeText)
      
      // Then
      expect(badge).toHaveStyle({
        fontSize: '12px',
        padding: '4px 8px',
      })
    })
  })

  describe('when rendering with different variants', () => {
    it('should apply secondary variant styling', () => {
      // Given
      const badgeText = 'Secondary Badge'
      
      // When
      render(<Badge variant="secondary">{badgeText}</Badge>)
      const badge = screen.getByText(badgeText)
      
      // Then
      expect(badge).toHaveStyle({
        backgroundColor: '#6B7280',
        color: '#FFFFFF',
      })
    })

    it('should apply success variant styling', () => {
      // Given
      const badgeText = 'Success Badge'
      
      // When
      render(<Badge variant="success">{badgeText}</Badge>)
      const badge = screen.getByText(badgeText)
      
      // Then
      expect(badge).toHaveStyle({
        backgroundColor: '#10B981',
        color: '#FFFFFF',
      })
    })

    it('should apply warning variant styling', () => {
      // Given
      const badgeText = 'Warning Badge'
      
      // When
      render(<Badge variant="warning">{badgeText}</Badge>)
      const badge = screen.getByText(badgeText)
      
      // Then
      expect(badge).toHaveStyle({
        backgroundColor: '#F59E0B',
        color: '#FFFFFF',
      })
    })

    it('should apply error variant styling', () => {
      // Given
      const badgeText = 'Error Badge'
      
      // When
      render(<Badge variant="error">{badgeText}</Badge>)
      const badge = screen.getByText(badgeText)
      
      // Then
      expect(badge).toHaveStyle({
        backgroundColor: '#EF4444',
        color: '#FFFFFF',
      })
    })
  })

  describe('when rendering with different sizes', () => {
    it('should apply medium size styling', () => {
      // Given
      const badgeText = 'Medium Badge'
      
      // When
      render(<Badge size="md">{badgeText}</Badge>)
      const badge = screen.getByText(badgeText)
      
      // Then
      expect(badge).toHaveStyle({
        fontSize: '14px',
        padding: '6px 12px',
      })
    })
  })

  describe('when rendering with complex content', () => {
    it('should render React elements as children', () => {
      // Given
      const badgeContent = (
        <span>
          <strong>Bold</strong> text
        </span>
      )
      
      // When
      render(<Badge>{badgeContent}</Badge>)
      
      // Then
      expect(screen.getByText('Bold')).toBeInTheDocument()
      expect(screen.getByText('text')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should be accessible to screen readers', () => {
      // Given
      const badgeText = 'Accessible Badge'
      
      // When
      render(<Badge>{badgeText}</Badge>)
      const badge = screen.getByText(badgeText)
      
      // Then
      expect(badge).toBeInTheDocument()
      // Badge should be readable by screen readers
      expect(badge.tagName).toBe('SPAN')
    })
  })
})
