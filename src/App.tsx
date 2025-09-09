import { Container } from 'rsuite'
import {
  Header,
  HeroSection,
  ShipmentForm,
  SubmissionModal,
  OffersList,
  useShipmentForm,
} from './components'
import './App.css'

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
    <Container style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Skip link for keyboard users */}
      <a 
        href="#main-content" 
        style={{
          position: 'absolute',
          top: '-40px',
          left: '6px',
          background: '#000',
          color: '#fff',
          padding: '8px',
          textDecoration: 'none',
          zIndex: 1000,
          borderRadius: '4px'
        }}
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
        style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem 2rem 1rem' }}
        role="main"
        aria-label="Shipment form and offers"
      >
        <HeroSection onScrollToForm={handleScrollToForm} />

        <section aria-labelledby="shipment-form-heading">
          <ShipmentForm
            formData={formData}
            isLoading={isLoading}
            formRef={formRef}
            onFormChange={handleFormChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
          />
        </section>

        <section aria-labelledby="offers-heading">
          <OffersList offers={offers} onSelectOffer={handleSelectOffer}/>
        </section>
      </main>
      
      <SubmissionModal
        isOpen={modalOpen}
        isSuccess={modalSuccess}
        message={modalMessage}
        selectedOffer={selectedOffer}
        formData={formData}
        onClose={handleCloseModal}
      />
    </Container>
  )
}

export default App
