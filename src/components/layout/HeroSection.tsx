import { Panel, Button } from 'rsuite'
import { ArrowRight } from '@rsuite/icons'
import type { HeroSectionProps } from '../types'
import { styles } from './HeroSection.styles'

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToForm }) => {
  return (
    <Panel 
      style={styles.panel}
    >
      <div style={styles.icon}>
        📦
      </div>
      <h2 style={styles.title}>
        Enter shipment details to get offers
      </h2>
      <p style={styles.subtitle}>
        Get personalized shipping quotes from multiple carriers in seconds
      </p>
      <Button 
        appearance="primary" 
        color="blue"
        size="lg"
        onClick={onScrollToForm}
        style={styles.button}
      >
        Start New Shipment <ArrowRight />
      </Button>
    </Panel>
  )
}

