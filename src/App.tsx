import { Container } from 'rsuite'
import { Suspense, lazy } from 'react'
import {
  Header,
  HeroSection,
  useShipmentForm,
  LoadingSpinner,
} from './components'
import './App.css'

// Lazy load components for better performance
const ShipmentForm = lazy(() => import('./components/forms/ShipmentForm').then(module => ({ default: module.ShipmentForm })))
const SubmissionModal = lazy(() => import('./components/modals/SubmissionModal').then(module => ({ default: module.SubmissionModal })))
const OffersList = lazy(() => import('./components/offers/OffersList').then(module => ({ default: module.OffersList })))

function App() {
  const {
    formData,
    isLoading,
    formRef,
    modalOpen,
    modalSuccess,
    modalMessage,
    offers,
    selectedOffer,
    offersRequested,
    handleFormChange,
    handleSubmit,
    handleReset,
    handleCloseModal,
    handleSelectOffer,
  } = useShipmentForm()

  const handleScrollToForm = () => {
    document.getElementById('shipment-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  console.log('Offers:', offers)

  return (
    <Container style={styles.container}>
      {/* Skip link for keyboard users */}
      <a 
        href="#main-content" 
        style={styles.skipLink}
        onFocus={(e) => e.target.style.top = '6px'}
        onBlur={(e) => e.target.style.top = '-40px'}
      >
        Skip to main content
      </a>

      <Header 
        title="Shipments & Offer Explorer"
        subtitle="Compare carriers. Find the best value. Ship smarter."
      />
      
      <main 
        id="main-content"
        style={styles.main}
        role="main"
        aria-label="Shipment form and offers"
      >
        <HeroSection onScrollToForm={handleScrollToForm} />

        <section aria-labelledby="shipment-form-heading">
          <Suspense fallback={<LoadingSpinner message="Loading shipment form..." />}>
            <ShipmentForm
              formData={formData}
              isLoading={isLoading}
              formRef={formRef}
              onFormChange={handleFormChange}
              onSubmit={handleSubmit}
              onReset={handleReset}
            />
          </Suspense>
        </section>

        {offersRequested && (
          <section aria-labelledby="offers-heading">
            <Suspense fallback={<LoadingSpinner message="Loading offers..." />}>
              <OffersList offers={offers} onSelectOffer={handleSelectOffer}/>
            </Suspense>
          </section>
        )}
      </main>
      
      <Suspense fallback={null}>
        <SubmissionModal
          isOpen={modalOpen}
          isSuccess={modalSuccess}
          message={modalMessage}
          selectedOffer={selectedOffer}
          formData={formData}
          onClose={handleCloseModal}
        />
      </Suspense>
    </Container>
  )
}

const styles = {
  container: {
    backgroundColor: '#F9FAFB',
    minHeight: '100vh'
  },
  skipLink: {
    position: 'absolute' as const,
    top: '-40px',
    left: '6px',
    background: '#000',
    color: '#fff',
    padding: '8px',
    textDecoration: 'none',
    zIndex: 1000,
    borderRadius: '4px'
  },
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 1rem 2rem 1rem'
  }
}

export default App
