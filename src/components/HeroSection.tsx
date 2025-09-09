import { Panel, Button } from 'rsuite'
import { ArrowRight } from '@rsuite/icons'
import type { HeroSectionProps } from './types'

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToForm }) => {
  return (
    <Panel 
      style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}
    >
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
        📦
      </div>
      <h2 style={{ 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: '#111827', 
        margin: '0 0 1rem 0' 
      }}>
        Enter shipment details to get offers
      </h2>
      <p style={{ color: '#6B7280', margin: '0 0 1.5rem 0' }}>
        Get personalized shipping quotes from multiple carriers in seconds
      </p>
      <Button 
        appearance="primary" 
        color="blue"
        size="lg"
        onClick={onScrollToForm}
        style={{ backgroundColor: '#2563EB' }}
      >
        Start New Shipment <ArrowRight />
      </Button>
    </Panel>
  )
}
