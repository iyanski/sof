import React from 'react'
import { Card, Button, Tooltip, Whisper, Rate, ButtonToolbar } from 'rsuite'
import type { Offer } from '../types'
import { Badge } from '../ui/Badge'
import { Pill } from '../ui/Pill'
import { styles } from './OfferCard.styles'

interface OfferCardProps {
  offer: Offer
  onSelect: (offer: Offer) => void
  isBestValue?: boolean
  isFastest?: boolean
  isCheapest?: boolean
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onSelect,
  isBestValue = false,
  isFastest = false,
  isCheapest = false
}) => {
  const formatPrice = (cost: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      minimumFractionDigits: 2
    }).format(cost)
  }

  const formatDeliveryTime = (days: number) => {
    if (days === 1) return '1 day'
    return `${days} days`
  }

  const getTotalScore = () => {
    return Math.round(
      (offer.eligibilityScore + offer.costEfficiencyScore + offer.serviceQualityScore) / 3
    )
  }

  const getScoreTooltip = () => {
    const convertToRating = (score: number) => {
      // Convert 0-100 score to 0-5 rating scale
      return Math.round((score / 100) * 5 * 10) / 10 // Round to 1 decimal place
    }

    return (
      <div style={styles.tooltipContainer}>
        <div style={styles.tooltipSection}>
          <div style={styles.tooltipRow}>
            <strong>Eligibility:</strong>
            <span>{offer.eligibilityScore}/100</span>
          </div>
          <Rate 
            value={convertToRating(offer.eligibilityScore)} 
            size="xs" 
            readOnly 
            style={styles.tooltipRate}
          />
        </div>
        
        <div style={styles.tooltipSection}>
          <div style={styles.tooltipRow}>
            <strong>Cost Efficiency:</strong>
            <span>{offer.costEfficiencyScore}/100</span>
          </div>
          <Rate 
            value={convertToRating(offer.costEfficiencyScore)} 
            size="xs" 
            readOnly 
            style={styles.tooltipRate}
          />
        </div>
        
        <div style={styles.tooltipSection}>
          <div style={styles.tooltipRow}>
            <strong>Service Quality:</strong>
            <span>{offer.serviceQualityScore}/100</span>
          </div>
          <Rate 
            value={convertToRating(offer.serviceQualityScore)} 
            size="xs" 
            readOnly 
            style={styles.tooltipRate}
          />
        </div>
        
        <div style={styles.tooltipTotalSection}>
          <div style={styles.tooltipRow}>
            <strong>Total Score:</strong>
            <span>{getTotalScore()}/100</span>
          </div>
          <Rate 
            value={convertToRating(getTotalScore())} 
            size="xs" 
            readOnly 
            style={styles.tooltipRate}
          />
        </div>
      </div>
    )
  }

  return (
    <Card
      style={{
        ...styles.card,
        opacity: offer.isEligible ? 1 : 0.6
      }}
      role="article"
      aria-labelledby={`offer-${offer.carrierId}-title`}
      aria-describedby={`offer-${offer.carrierId}-description`}
    >
      <Card.Body style={styles.cardBody}>
        {/* Header with carrier info and badges */}
        <div style={styles.header}>
          <div>
            <h3 
              id={`offer-${offer.carrierId}-title`}
              style={styles.carrierName}
            >
              {offer.carrierName}
            </h3>
            <div 
              style={styles.badgesContainer}
              role="group"
              aria-label="Offer badges"
            >
              {isBestValue && <Badge variant="primary">Best Value</Badge>}
              {isFastest && <Badge variant="secondary">Fastest</Badge>}
              {isCheapest && <Badge variant="success">Cheapest</Badge>}
            </div>
          </div>
          
          {/* Score pill with tooltip */}
          <Whisper
            placement="top"
            trigger="hover"
            speaker={<Tooltip>{getScoreTooltip()}</Tooltip>}
          >
            <div 
              role="button"
              tabIndex={0}
              aria-label={`Overall score: ${getTotalScore()} out of 100. Hover for detailed breakdown.`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // Could trigger tooltip programmatically here
                }
              }}
            >
              <Pill score={getTotalScore()} />
            </div>
          </Whisper>
        </div>

        {/* Price and delivery info */}
        <div 
          id={`offer-${offer.carrierId}-description`}
          style={styles.detailsContainer}
          role="group"
          aria-label="Offer details"
        >
          <div>
            <div 
              style={styles.price}
              aria-label={`Total cost: ${formatPrice(offer.cost)}`}
            >
              {formatPrice(offer.cost)}
            </div>
            <div style={styles.priceLabel}>
              Total cost
            </div>
          </div>
          
          <div style={styles.deliveryContainer}>
            <div 
              style={styles.deliveryTime}
              aria-label={`Delivery time: ${formatDeliveryTime(offer.deliveryTime)}`}
            >
              {formatDeliveryTime(offer.deliveryTime)}
            </div>
            <div style={styles.deliveryLabel}>
              Delivery time
            </div>
          </div>
        </div>

        {/* Eligibility status */}
        {!offer.isEligible && offer.reasons.length > 0 && (
          <div 
            style={styles.eligibilityAlert}
            role="alert"
            aria-live="polite"
          >
            <div style={styles.eligibilityTitle}>
              Not eligible:
            </div>
            <ul style={styles.eligibilityReasons}>
              {offer.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <ButtonToolbar 
          style={styles.buttonToolbar}
          role="group"
          aria-label="Offer actions"
        >
          <Button
            appearance="primary"
            size="lg"
            onClick={() => onSelect(offer)}
            disabled={!offer.isEligible}
            aria-label={`Select ${offer.carrierName} carrier for ${formatPrice(offer.cost)}`}
            aria-describedby={!offer.isEligible ? `eligibility-${offer.carrierId}` : undefined}
          >
            Select Carrier
          </Button>
        </ButtonToolbar>
      </Card.Body>
    </Card>
  )
}

