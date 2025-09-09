import type { CSSProperties } from 'react'

export const styles = {
  panel: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '2rem'
  } as CSSProperties,
  icon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  } as CSSProperties,
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0 0 1rem 0'
  } as CSSProperties,
  subtitle: {
    color: '#6B7280',
    margin: '0 0 1.5rem 0'
  } as CSSProperties,
  button: {
    backgroundColor: '#2563EB'
  } as CSSProperties
}
