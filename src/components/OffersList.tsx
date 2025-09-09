import React from 'react'
import type { Offer } from './types'
import { OfferCard } from './OfferCard'
import { Content, Heading } from 'rsuite'

interface OffersListProps {
  offers: Offer[]
  onSelectOffer?: (offer: Offer) => void
}

export const OffersList: React.FC<OffersListProps> = ({ 
  offers, 
  onSelectOffer,
}) => {
  // Calculate which offers have special badges
  const getOfferBadges = (offers: Offer[]) => {
    if (offers.length === 0) return {}

    const eligibleOffers = offers.filter(offer => offer.isEligible)
    
    if (eligibleOffers.length === 0) return {}

    // Find cheapest offer
    const cheapest = eligibleOffers.reduce((min, offer) => 
      offer.cost < min.cost ? offer : min
    )

    // Find fastest offer
    const fastest = eligibleOffers.reduce((min, offer) => 
      offer.deliveryTime < min.deliveryTime ? offer : min
    )

    // Find best value (highest total score)
    const bestValue = eligibleOffers.reduce((max, offer) => {
      const totalScore = (offer.eligibilityScore + offer.costEfficiencyScore + offer.serviceQualityScore) / 3
      const maxTotalScore = (max.eligibilityScore + max.costEfficiencyScore + max.serviceQualityScore) / 3
      return totalScore > maxTotalScore ? offer : max
    })

    return {
      [cheapest.carrierId]: { isCheapest: true },
      [fastest.carrierId]: { isFastest: true },
      [bestValue.carrierId]: { isBestValue: true }
    }
  }

  const offerBadges = getOfferBadges(offers)

  const handleSelectOffer = (offer: Offer) => {
    if (onSelectOffer) {
      onSelectOffer(offer)
    } else {
      console.log('Selected offer:', offer)
    }
  }

  return (
    <Content>
      <Heading 
        level={4}
        id="offers-heading"
        style={{ marginBottom: '1.5rem' }}
      >
        Available Offers
      </Heading>
      
      {offers?.length > 0 ? (
        <div 
          role="region"
          aria-labelledby="offers-heading"
          aria-live="polite"
        >
          {offers.map((offer: Offer) => (
            <OfferCard
              key={offer.carrierId}
              offer={offer}
              onSelect={handleSelectOffer}
              isBestValue={offerBadges[offer.carrierId]?.isBestValue || false}
              isFastest={offerBadges[offer.carrierId]?.isFastest || false}
              isCheapest={offerBadges[offer.carrierId]?.isCheapest || false}
            />
          ))}
        </div>
      ) : (
        <div 
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: '#6B7280'
          }}
          role="status"
          aria-live="polite"
        >
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>
            No offers available
          </p>
          <p style={{ fontSize: '14px' }}>
            Try adjusting your shipment details or filters
          </p>
        </div>
      )}
    </Content>
  )
}