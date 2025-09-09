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
          <Archive />
          <span style={{ fontWeight: 'bold' }}>New Shipment</span>
        </div>
      }
      bordered
      style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
      }}
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
            />
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
            />
          </Form.Group>
        </div>

        {/* Weight and Quantity */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem', 
          marginTop: '1.5rem' 
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
              />
              <Form.Control
                name="weightUnit"
                accepter={SelectPicker}
                data={UNIT_OPTIONS}
                style={{ width: '80px' }}
                disabled={isLoading}
              />
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
            />
          </Form.Group>
        </div>

        {/* Dimensions */}
        <Form.Group controlId="dimensions" style={{ marginTop: '1.5rem' }}>
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
              />
            </HStack.Item>
          </HStack>
          <HStack spacing={10} style={{ marginBottom: '10px' }} justifyContent="flex-start">
            <Form.Control
              name="length"
              accepter={InputNumber}
              placeholder="Length"
              disabled={isLoading}
            />
            <span>×</span>
            <Form.Control
              name="width"
              accepter={InputNumber}
              placeholder="Width"
              disabled={isLoading}
            />
            <span>×</span>
            <Form.Control
              name="height"
              accepter={InputNumber}
              placeholder="Height"
              disabled={isLoading}
            />
          </HStack>
        </Form.Group>

        {/* Advanced Options */}
        <AdvancedOptions
          formData={formData}
          disabled={isLoading}
        />

        {/* Actions */}
        <div style={{ 
          marginTop: '2rem', 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'flex-end' 
        }}>
          <Button
            appearance="subtle"
            onClick={onReset}
            disabled={isLoading}
            style={{ minWidth: '100px' }}
          >
            Reset
          </Button>
          <Button
            appearance="primary"
            color="blue"
            onClick={onSubmit}
            loading={isLoading}
            style={{ 
              backgroundColor: '#2563EB',
              minWidth: '140px'
            }}
          >
            {isLoading ? 'Getting Offers...' : 'Get Offers'}
          </Button>
        </div>
      </Form>
    </Panel>
  )
}
