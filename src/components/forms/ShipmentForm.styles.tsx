export const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  panel: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    marginBottom: '2rem'
  },
  fieldset: {
    border: 'none',
    margin: 0,
    padding: 0
  },
  fieldsetWithMargin: {
    border: 'none',
    margin: '1.5rem 0 0 0',
    padding: 0
  },
  legend: {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#374151'
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  gridContainerSmall: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem'
  },
  fullWidth: {
    width: '100%'
  },
  flexContainer: {
    display: 'flex',
    gap: '0.5rem'
  },
  flexItem: {
    flex: 1
  },
  unitWidth: {
    width: '80px'
  },
  hStackMargin: {
    marginBottom: '10px'
  },
  actionsContainer: {
    marginTop: '2rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
  }
}

