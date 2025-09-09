import type { CSSProperties } from 'react'

export const styles = {
  header: {
    backgroundColor: '#F9FAFB',
    padding: '2rem 0'
  } as CSSProperties,
  container: {
    textAlign: 'center' as const,
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem'
  } as CSSProperties,
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0 0 1rem 0',
    fontFamily: 'Inter, sans-serif'
  } as CSSProperties,
  subtitle: {
    fontSize: '1.25rem',
    color: '#6B7280',
    margin: '0 0 2rem 0',
    fontFamily: 'Inter, sans-serif'
  } as CSSProperties
}
