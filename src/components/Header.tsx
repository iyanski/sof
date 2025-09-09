import { Header as RSuiteHeader } from 'rsuite'
import type { HeaderProps } from './types'

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <RSuiteHeader style={{ backgroundColor: '#F9FAFB', padding: '2rem 0' }}>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '0 1rem' 
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#111827', 
          margin: '0 0 1rem 0',
          fontFamily: 'Inter, sans-serif'
        }}>
          {title}
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#6B7280', 
          margin: '0 0 2rem 0',
          fontFamily: 'Inter, sans-serif'
        }}>
          {subtitle}
        </p>
      </div>
    </RSuiteHeader>
  )
}
