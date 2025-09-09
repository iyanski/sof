import React from 'react'
import { Card, Button, Tooltip, Whisper, Rate, ButtonToolbar } from 'rsuite'
import type { Offer } from './types'
import { Badge } from './Badge'
import { Pill } from './Pill'

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
      <div style={{ padding: '12px', minWidth: '200px' }}>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <strong>Eligibility:</strong>
            <span>{offer.eligibilityScore}/100</span>
          </div>
          <Rate 
            value={convertToRating(offer.eligibilityScore)} 
            size="xs" 
            readOnly 
            style={{ marginLeft: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <strong>Cost Efficiency:</strong>
            <span>{offer.costEfficiencyScore}/100</span>
          </div>
          <Rate 
            value={convertToRating(offer.costEfficiencyScore)} 
            size="xs" 
            readOnly 
            style={{ marginLeft: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <strong>Service Quality:</strong>
            <span>{offer.serviceQualityScore}/100</span>
          </div>
          <Rate 
            value={convertToRating(offer.serviceQualityScore)} 
            size="xs" 
            readOnly 
            style={{ marginLeft: '8px' }}
          />
        </div>
        
        <div style={{ marginTop: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <strong>Total Score:</strong>
            <span>{getTotalScore()}/100</span>
          </div>
          <Rate 
            value={convertToRating(getTotalScore())} 
            size="xs" 
            readOnly 
            style={{ marginLeft: '8px' }}
          />
        </div>
      </div>
    )
  }

  return (
    <Card
      style={{
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        marginBottom: '16px',
        opacity: offer.isEligible ? 1 : 0.6
      }}
      role="article"
      aria-labelledby={`offer-${offer.carrierId}-title`}
      aria-describedby={`offer-${offer.carrierId}-description`}
    >
      <Card.Body style={{ padding: '16px' }}>
        {/* Header with carrier info and badges */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '16px'
        }}>
          <div>
            <h3 
              id={`offer-${offer.carrierId}-title`}
              style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: 'bold',
                color: '#111827'
              }}
            >
              {offer.carrierName}
            </h3>
            <div 
              style={{ 
                display: 'flex', 
                gap: '8px', 
                marginTop: '8px',
                flexWrap: 'wrap'
              }}
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
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#F9FAFB',
            borderRadius: '6px'
          }}
          role="group"
          aria-label="Offer details"
        >
          <div>
            <div 
              style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                color: '#111827'
              }}
              aria-label={`Total cost: ${formatPrice(offer.cost)}`}
            >
              {formatPrice(offer.cost)}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#6B7280'
            }}>
              Total cost
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div 
              style={{ 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#111827'
              }}
              aria-label={`Delivery time: ${formatDeliveryTime(offer.deliveryTime)}`}
            >
              {formatDeliveryTime(offer.deliveryTime)}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#6B7280'
            }}>
              Delivery time
            </div>
          </div>
        </div>

        {/* Eligibility status */}
        {!offer.isEligible && offer.reasons.length > 0 && (
          <div 
            style={{ 
              marginBottom: '16px',
              padding: '8px 12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '6px'
            }}
            role="alert"
            aria-live="polite"
          >
            <div style={{ 
              fontSize: '14px', 
              color: '#DC2626',
              fontWeight: '500'
            }}>
              Not eligible:
            </div>
            <ul style={{ 
              margin: '4px 0 0 0', 
              paddingLeft: '16px',
              fontSize: '13px',
              color: '#DC2626'
            }}>
              {offer.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <ButtonToolbar 
          style={{ display: 'flex', justifyContent: 'flex-end' }}
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
