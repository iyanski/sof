export const styles = {
  successContainer: {
    padding: '1rem 0'
  },
  successHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  successIcon: {
    fontSize: '2rem'
  },
  successMessage: {
    margin: '0.25rem 0 0 0',
    color: '#6B7280'
  },
  cardMargin: {
    marginBottom: '1rem'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  cardIcon: {
    fontSize: '1.2rem'
  },
  gridTwoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 0'
  },
  errorIcon: {
    fontSize: '2rem',
    color: '#EF4444',
    marginTop: '0.25rem'
  },
  errorContent: {
    flex: 1
  },
  errorMessage: {
    margin: 0,
    fontSize: '0.9rem',
    lineHeight: '1.5',
    fontFamily: 'inherit',
    whiteSpace: 'pre-wrap' as const,
    wordWrap: 'break-word' as const
  }
}

