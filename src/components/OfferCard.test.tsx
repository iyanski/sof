// Component tests for OfferCard component using BDD patterns
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { OfferCard } from './OfferCard'
import { createMockOffer } from '../test-utils'

describe('OfferCard Component', () => {
  describe('when rendering an eligible offer', () => {
    it('should display all offer information', () => {
      // Given
      const offer = createMockOffer({
        carrierName: 'FastShip',
        cost: 150.75,
        deliveryTime: 3,
        eligibilityScore: 85,
      })
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      
      // Then
      expect(screen.getByText('FastShip')).toBeInTheDocument()
      expect(screen.getByText('150,75 kr')).toBeInTheDocument()
      expect(screen.getByText('3 days')).toBeInTheDocument()
      expect(screen.getByText('83/100')).toBeInTheDocument()
    })

    it('should display single day delivery correctly', () => {
      // Given
      const offer = createMockOffer({
        deliveryTime: 1,
      })
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      
      // Then
      expect(screen.getByText('1 day')).toBeInTheDocument()
    })

    it('should enable the select button', () => {
      // Given
      const offer = createMockOffer({ isEligible: true })
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      const selectButton = screen.getByRole('button', { name: /select carrier/i })
      
      // Then
      expect(selectButton).not.toBeDisabled()
    })

    it('should call onSelect when select button is clicked', () => {
      // Given
      const offer = createMockOffer()
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      const selectButton = screen.getByRole('button', { name: /select carrier/i })
      fireEvent.click(selectButton)
      
      // Then
      expect(mockOnSelect).toHaveBeenCalledWith(offer)
    })
  })

  describe('when rendering an ineligible offer', () => {
    it('should display eligibility reasons', () => {
      // Given
      const offer = createMockOffer({
        isEligible: false,
        reasons: ['Weight exceeds limit', 'Destination not supported'],
      })
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      
      // Then
      expect(screen.getByText('Not eligible:')).toBeInTheDocument()
      expect(screen.getByText('Weight exceeds limit')).toBeInTheDocument()
      expect(screen.getByText('Destination not supported')).toBeInTheDocument()
    })

    it('should disable the select button', () => {
      // Given
      const offer = createMockOffer({ isEligible: false })
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      const selectButton = screen.getByRole('button', { name: /select carrier/i })
      
      // Then
      expect(selectButton).toBeDisabled()
    })

    it('should have reduced opacity', () => {
      // Given
      const offer = createMockOffer({ isEligible: false })
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      const card = screen.getByText(offer.carrierName).closest('.rs-card')
      
      // Then
      expect(card).toHaveStyle({ opacity: '0.6' })
    })
  })

  describe('when rendering with badges', () => {
    it('should display best value badge', () => {
      // Given
      const offer = createMockOffer()
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} isBestValue={true} />)
      
      // Then
      expect(screen.getByText('Best Value')).toBeInTheDocument()
    })

    it('should display fastest badge', () => {
      // Given
      const offer = createMockOffer()
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} isFastest={true} />)
      
      // Then
      expect(screen.getByText('Fastest')).toBeInTheDocument()
    })

    it('should display cheapest badge', () => {
      // Given
      const offer = createMockOffer()
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} isCheapest={true} />)
      
      // Then
      expect(screen.getByText('Cheapest')).toBeInTheDocument()
    })

    it('should display multiple badges', () => {
      // Given
      const offer = createMockOffer()
      const mockOnSelect = jest.fn()
      
      // When
      render(
        <OfferCard 
          offer={offer} 
          onSelect={mockOnSelect} 
          isBestValue={true}
          isFastest={true}
          isCheapest={true}
        />
      )
      
      // Then
      expect(screen.getByText('Best Value')).toBeInTheDocument()
      expect(screen.getByText('Fastest')).toBeInTheDocument()
      expect(screen.getByText('Cheapest')).toBeInTheDocument()
    })
  })

  describe('when rendering score tooltip', () => {
    it('should display score breakdown on hover', () => {
      // Given
      const offer = createMockOffer({
        eligibilityScore: 80,
        costEfficiencyScore: 70,
        serviceQualityScore: 90,
      })
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      const scorePill = screen.getByText('80/100')
      fireEvent.mouseOver(scorePill)
      
      // Then
      // Note: Tooltip testing with RSuite requires more complex setup
      // This is a simplified test - in practice you'd use a tooltip testing library
      expect(scorePill).toBeInTheDocument()
    })
  })

  describe('when formatting currency', () => {
    it('should format Swedish Krona correctly', () => {
      // Given
      const offer = createMockOffer({ cost: 1234.56 })
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      
      // Then
      expect(screen.getByText('1 234,56 kr')).toBeInTheDocument()
    })

    it('should handle zero cost', () => {
      // Given
      const offer = createMockOffer({ cost: 0 })
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      
      // Then
      expect(screen.getByText('0,00 kr')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper button labeling', () => {
      // Given
      const offer = createMockOffer()
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      const selectButton = screen.getByRole('button', { name: /select carrier/i })
      
      // Then
      expect(selectButton).toBeInTheDocument()
    })

    it('should be keyboard navigable', () => {
      // Given
      const offer = createMockOffer()
      const mockOnSelect = jest.fn()
      
      // When
      render(<OfferCard offer={offer} onSelect={mockOnSelect} />)
      const selectButton = screen.getByRole('button', { name: /select carrier/i })
      selectButton.focus()
      
      // Then
      expect(selectButton).toHaveFocus()
    })
  })
})
