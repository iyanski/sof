import { Container, Content } from 'rsuite'
import { Header, HeroSection, ShipmentForm, SubmissionModal, useShipmentForm } from './components'
import './App.css'

function App() {
  const {
    formData,
    isLoading,
    formRef,
    modalOpen,
    modalSuccess,
    modalMessage,
    handleFormChange,
    handleSubmit,
    handleReset,
    handleCloseModal
  } = useShipmentForm()

  const handleScrollToForm = () => {
    document.getElementById('shipment-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Container style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <Header 
        title="Shipments & Offer Explorer"
        subtitle="Compare carriers. Find the best value. Ship smarter."
      />
      
      <Content style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem 2rem 1rem' }}>
        <HeroSection onScrollToForm={handleScrollToForm} />

        <ShipmentForm
          formData={formData}
          isLoading={isLoading}
          formRef={formRef}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onReset={handleReset}
        />
      </Content>
      
      <SubmissionModal
        isOpen={modalOpen}
        isSuccess={modalSuccess}
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </Container>
  )
}

export default App
