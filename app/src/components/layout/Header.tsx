import { Header as RSuiteHeader } from 'rsuite'
import type { HeaderProps } from '../types'
import { styles } from './Header.styles'

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <RSuiteHeader style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          {title}
        </h1>
        <p style={styles.subtitle}>
          {subtitle}
        </p>
      </div>
    </RSuiteHeader>
  )
}

