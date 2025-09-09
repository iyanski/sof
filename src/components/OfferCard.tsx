import React from 'react'
import { Card, Button, Tooltip, Whisper } from 'rsuite'
import type { Offer } from './types'
import { Badge } from './Badge'
import { Pill } from './Pill'

interface OfferCardProps {
  offer: Offer
  onSelect: (offer: Offer) => void
  onDetails: (offer: Offer) => void
  isBestValue?: boolean
  isFastest?: boolean
  isCheapest?: boolean
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  onSelect,
  onDetails,
  isBestValue = false,
  isFastest = false,
  isCheapest = false
}) => {
  const formatPrice = (cost: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
    return (
      <div style={{ padding: '8px' }}>
        <div><strong>Eligibility:</strong> {offer.eligibilityScore}/100</div>
        <div><strong>Cost Efficiency:</strong> {offer.costEfficiencyScore}/100</div>
        <div><strong>Service Quality:</strong> {offer.serviceQualityScore}/100</div>
        <div style={{ marginTop: '4px', borderTop: '1px solid #e5e7eb', paddingTop: '4px' }}>
          <strong>Total:</strong> {getTotalScore()}/100
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
            <h3 style={{ 
              margin: 0, 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: '#111827'
            }}>
              {offer.carrierName}
            </h3>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              marginTop: '8px',
              flexWrap: 'wrap'
            }}>
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
            <div>
              <Pill score={getTotalScore()} />
            </div>
          </Whisper>
        </div>

        {/* Price and delivery info */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#F9FAFB',
          borderRadius: '6px'
        }}>
          <div>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold',
              color: '#111827'
            }}>
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
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#111827'
            }}>
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
          <div style={{ 
            marginBottom: '16px',
            padding: '8px 12px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px'
          }}>
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
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <Button
            appearance="ghost"
            size="sm"
            onClick={() => onDetails(offer)}
            style={{ minHeight: '44px' }}
          >
            Details
          </Button>
          <Button
            appearance="primary"
            size="sm"
            onClick={() => onSelect(offer)}
            disabled={!offer.isEligible}
            style={{ minHeight: '44px' }}
          >
            Select
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}
