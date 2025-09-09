import { Panel, Form, SelectPicker, InputNumber, Button, HStack } from 'rsuite'
import { Archive } from '@rsuite/icons'
import type { ShipmentFormProps } from './types'
import { COUNTRY_OPTIONS, UNIT_OPTIONS, DIMENSION_UNIT_OPTIONS } from '../data/constants'
import { AdvancedOptions } from './AdvancedOptions'
import { shipmentSchema } from '../validators/schema'

export const ShipmentForm: React.FC<ShipmentFormProps> = ({
  formData,
  isLoading,
  formRef,
  onFormChange,
  onSubmit,
  onReset
}) => {
  return (
    <Panel 
      id="shipment-form"
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Archive aria-hidden="true" />
          <h2 id="shipment-form-heading" style={{ fontWeight: 'bold', margin: 0 }}>New Shipment</h2>
        </div>
      }
      bordered
      style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}
      role="form"
      aria-labelledby="shipment-form-heading"
    >
      <Form 
        ref={formRef}
        fluid 
        model={shipmentSchema}
        formValue={formData}
        onChange={onFormChange}
        onSubmit={onSubmit}
      >
        {/* Origin and Destination */}
        <fieldset style={{ border: 'none', margin: 0, padding: 0 }}>
          <legend style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
            Route Information
          </legend>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem' 
          }}>
            <Form.Group controlId="originCountry">
              <Form.ControlLabel>Origin Country *</Form.ControlLabel>
              <Form.Control
                name="originCountry"
                accepter={SelectPicker}
                data={COUNTRY_OPTIONS}
                placeholder="Select origin country"
                style={{ width: '100%' }}
                disabled={isLoading}
                aria-required="true"
                aria-describedby="origin-country-help"
              />
              <div id="origin-country-help" style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Select the country where your shipment originates
              </div>
            </Form.Group>

            <Form.Group controlId="destinationCountry">
              <Form.ControlLabel>Destination Country *</Form.ControlLabel>
              <Form.Control
                name="destinationCountry"
                accepter={SelectPicker}
                data={COUNTRY_OPTIONS}
                placeholder="Select destination country"
                style={{ width: '100%' }}
                disabled={isLoading}
                aria-required="true"
                aria-describedby="destination-country-help"
              />
              <div id="destination-country-help" style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Select the country where your shipment will be delivered
              </div>
            </Form.Group>
          </div>
        </fieldset>

        {/* Weight and Quantity */}
        <fieldset style={{ border: 'none', margin: '1.5rem 0 0 0', padding: 0 }}>
          <legend style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
            Package Details
          </legend>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem'
          }}>
            <Form.Group controlId="weight">
              <Form.ControlLabel>Weight *</Form.ControlLabel>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Form.Control
                  name="weight"
                  accepter={InputNumber}
                  placeholder="0"
                  style={{ flex: 1 }}
                  disabled={isLoading}
                  aria-required="true"
                  aria-describedby="weight-help"
                />
                <Form.Control
                  name="weightUnit"
                  accepter={SelectPicker}
                  data={UNIT_OPTIONS}
                  style={{ width: '80px' }}
                  disabled={isLoading}
                  aria-label="Weight unit"
                />
              </div>
              <div id="weight-help" style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Enter the total weight of your package
              </div>
            </Form.Group>

            <Form.Group controlId="quantity">
              <Form.ControlLabel>Quantity *</Form.ControlLabel>
              <Form.Control
                name="quantity"
                accepter={InputNumber}
                placeholder="1"
                min={1}
                style={{ width: '100%' }}
                disabled={isLoading}
                aria-required="true"
                aria-describedby="quantity-help"
              />
              <div id="quantity-help" style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                Number of packages to ship
              </div>
            </Form.Group>
          </div>
        </fieldset>

        {/* Dimensions */}
        <fieldset style={{ border: 'none', margin: '1.5rem 0 0 0', padding: 0 }}>
          <legend style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
            Package Dimensions
          </legend>
          <Form.Group controlId="dimensions">
            <HStack spacing={10} style={{ marginBottom: '10px' }}>
              <HStack.Item>
                <Form.ControlLabel>Dimensions *</Form.ControlLabel>
              </HStack.Item>
              <HStack.Item>
                <Form.Control
                  name="dimensionUnit"
                  accepter={SelectPicker}
                  data={DIMENSION_UNIT_OPTIONS}
                  style={{ width: '80px' }}
                  disabled={isLoading}
                  aria-label="Dimension unit"
                />
              </HStack.Item>
            </HStack>
            <HStack spacing={10} style={{ marginBottom: '10px' }} justifyContent="flex-start">
              <Form.Control
                name="length"
                accepter={InputNumber}
                placeholder="Length"
                disabled={isLoading}
                aria-required="true"
                aria-label="Length"
              />
              <span aria-hidden="true">×</span>
              <Form.Control
                name="width"
                accepter={InputNumber}
                placeholder="Width"
                disabled={isLoading}
                aria-required="true"
                aria-label="Width"
              />
              <span aria-hidden="true">×</span>
              <Form.Control
                name="height"
                accepter={InputNumber}
                placeholder="Height"
                disabled={isLoading}
                aria-required="true"
                aria-label="Height"
              />
            </HStack>
            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
              Enter the length, width, and height of your package
            </div>
          </Form.Group>
        </fieldset>

        {/* Advanced Options */}
        <AdvancedOptions
          formData={formData}
          disabled={isLoading}
        />

        {/* Actions */}
        <div 
          style={{ 
            marginTop: '2rem', 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'flex-end' 
          }}
          role="group"
          aria-label="Form actions"
        >
          <Button
            appearance="subtle"
            onClick={onReset}
            disabled={isLoading}
            size="md"
            aria-label="Reset form to default values"
          >
            Reset
          </Button>
          <Button
            appearance="primary"
            color="blue"
            onClick={onSubmit}
            loading={isLoading}
            size="md"
            aria-label={isLoading ? 'Getting shipping offers, please wait' : 'Get shipping offers'}
            aria-describedby="submit-help"
          >
            {isLoading ? 'Getting Offers...' : 'Get Offers'}
          </Button>
        </div>
        <div id="submit-help" style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem', textAlign: 'right' }}>
          Click to compare offers from multiple carriers
        </div>
      </Form>
    </Panel>
  )
}
