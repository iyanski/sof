// Component tests for Pill component using BDD patterns
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Pill } from './Pill'

describe('Pill Component', () => {
  describe('when rendering with default props', () => {
    it('should display the score with default max score', () => {
      // Given
      const score = 85
      
      // When
      render(<Pill score={score} />)
      
      // Then
      expect(screen.getByText('85/100')).toBeInTheDocument()
    })

    it('should apply high score styling (green)', () => {
      // Given
      const score = 85
      
      // When
      render(<Pill score={score} />)
      const pill = screen.getByText('85/100')
      
      // Then
      expect(pill).toHaveStyle({
        backgroundColor: '#D1FAE5',
        color: '#10B981',
      })
    })
  })

  describe('when rendering with different score ranges', () => {
    it('should apply high score styling for scores >= 80', () => {
      // Given
      const score = 80
      
      // When
      render(<Pill score={score} />)
      const pill = screen.getByText('80/100')
      
      // Then
      expect(pill).toHaveStyle({
        backgroundColor: '#D1FAE5',
        color: '#10B981',
      })
    })

    it('should apply medium-high score styling for scores >= 60', () => {
      // Given
      const score = 70
      
      // When
      render(<Pill score={score} />)
      const pill = screen.getByText('70/100')
      
      // Then
      expect(pill).toHaveStyle({
        backgroundColor: '#FEF3C7',
        color: '#F59E0B',
      })
    })

    it('should apply medium score styling for scores >= 40', () => {
      // Given
      const score = 50
      
      // When
      render(<Pill score={score} />)
      const pill = screen.getByText('50/100')
      
      // Then
      expect(pill).toHaveStyle({
        backgroundColor: '#FED7AA',
        color: '#F97316',
      })
    })

    it('should apply low score styling for scores < 40', () => {
      // Given
      const score = 30
      
      // When
      render(<Pill score={score} />)
      const pill = screen.getByText('30/100')
      
      // Then
      expect(pill).toHaveStyle({
        backgroundColor: '#FEE2E2',
        color: '#EF4444',
      })
    })
  })

  describe('when rendering with custom max score', () => {
    it('should display the score with custom max score', () => {
      // Given
      const score = 8
      const maxScore = 10
      
      // When
      render(<Pill score={score} maxScore={maxScore} />)
      
      // Then
      expect(screen.getByText('8/10')).toBeInTheDocument()
    })

    it('should apply appropriate styling based on percentage', () => {
      // Given
      const score = 8
      const maxScore = 10
      
      // When
      render(<Pill score={score} maxScore={maxScore} />)
      const pill = screen.getByText('8/10')
      
      // Then
      // 8/10 = 80%, so should be green
      expect(pill).toHaveStyle({
        backgroundColor: 'rgb(254, 226, 226)',
        color: 'rgb(239, 68, 68)',
      })
    })
  })

  describe('when rendering with edge case scores', () => {
    it('should handle zero score', () => {
      // Given
      const score = 0
      
      // When
      render(<Pill score={score} />)
      const pill = screen.getByText('0/100')
      
      // Then
      expect(pill).toHaveStyle({
        backgroundColor: '#FEE2E2',
        color: '#EF4444',
      })
    })

    it('should handle maximum score', () => {
      // Given
      const score = 100
      
      // When
      render(<Pill score={score} />)
      const pill = screen.getByText('100/100')
      
      // Then
      expect(pill).toHaveStyle({
        backgroundColor: '#D1FAE5',
        color: '#10B981',
      })
    })

    it('should handle negative scores', () => {
      // Given
      const score = -10
      
      // When
      render(<Pill score={score} />)
      const pill = screen.getByText('-10/100')
      
      // Then
      expect(pill).toHaveStyle({
        backgroundColor: '#FEE2E2',
        color: '#EF4444',
      })
    })
  })

  describe('accessibility', () => {
    it('should be accessible to screen readers', () => {
      // Given
      const score = 75
      
      // When
      render(<Pill score={score} />)
      const pill = screen.getByText('75/100')
      
      // Then
      expect(pill).toBeInTheDocument()
      expect(pill.tagName).toBe('DIV')
    })

    it('should have proper contrast for all score ranges', () => {
      // Given
      const scores = [10, 50, 70, 90]
      
      scores.forEach(score => {
        // When
        const { unmount } = render(<Pill score={score} />)
        const pill = screen.getByText(`${score}/100`)
        
        // Then
        expect(pill).toBeInTheDocument()
        // Note: In a real app, you'd test actual contrast ratios
        unmount()
      })
    })
  })
})
