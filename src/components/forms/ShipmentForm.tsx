import { Panel, Form, SelectPicker, InputNumber, Button, HStack, Heading } from 'rsuite'
import { Archive } from '@rsuite/icons'
import type { ShipmentFormProps } from '../types'
import { COUNTRY_OPTIONS, UNIT_OPTIONS, DIMENSION_UNIT_OPTIONS } from '../../data/constants'
import { shipmentSchema } from '../../validators'
import { styles } from './ShipmentForm.styles'

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
        <div style={styles.header}>
          <Archive aria-hidden="true" />
          <Heading level={4} id="shipment-form-heading">
            New Shipment
          </Heading>
        </div>
      }
      bordered
      style={styles.panel}
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
        <fieldset style={styles.fieldset}>
          <legend style={styles.legend}>
            Route Information
          </legend>
          <div style={styles.gridContainer}>
            <Form.Group controlId="originCountry">
              <Form.ControlLabel>Origin Country *</Form.ControlLabel>
              <Form.Control
                name="originCountry"
                accepter={SelectPicker}
                data={COUNTRY_OPTIONS}
                placeholder="Select origin country"
                style={styles.fullWidth}
                disabled={isLoading}
                aria-required="true"
                aria-describedby="origin-country-help"
              />
              <Form.HelpText id="origin-country-help">
                Select the country where your shipment originates
              </Form.HelpText>
            </Form.Group>

            <Form.Group controlId="destinationCountry">
              <Form.ControlLabel>Destination Country *</Form.ControlLabel>
              <Form.Control
                name="destinationCountry"
                accepter={SelectPicker}
                data={COUNTRY_OPTIONS}
                placeholder="Select destination country"
                style={styles.fullWidth}
                disabled={isLoading}
                aria-required="true"
                aria-describedby="destination-country-help"
              />
              <Form.HelpText id="destination-country-help">
                Select the country where your shipment will be delivered
              </Form.HelpText>
            </Form.Group>
          </div>
        </fieldset>

        {/* Weight and Quantity */}
        <fieldset style={styles.fieldsetWithMargin}>
          <legend style={styles.legend}>
            Package Details
          </legend>
          <div style={styles.gridContainerSmall}>
            <Form.Group controlId="weight">
              <Form.ControlLabel>Weight *</Form.ControlLabel>
              <div style={styles.flexContainer}>
                <Form.Control
                  name="weight"
                  accepter={InputNumber}
                  placeholder="0"
                  style={styles.flexItem}
                  disabled={isLoading}
                  aria-required="true"
                  aria-describedby="weight-help"
                />
                <Form.Control
                  name="weightUnit"
                  accepter={SelectPicker}
                  data={UNIT_OPTIONS}
                  style={styles.unitWidth}
                  disabled={isLoading}
                  aria-label="Weight unit"
                />
              </div>
              <Form.HelpText id="weight-help">
                Enter the total weight of your package
              </Form.HelpText>
            </Form.Group>

            <Form.Group controlId="quantity">
              <Form.ControlLabel>Quantity *</Form.ControlLabel>
              <Form.Control
                name="quantity"
                accepter={InputNumber}
                placeholder="1"
                min={1}
                style={styles.fullWidth}
                disabled={isLoading}
                aria-required="true"
                aria-describedby="quantity-help"
              />
              <Form.HelpText id="quantity-help">
                Number of packages to ship
              </Form.HelpText>
            </Form.Group>
          </div>
        </fieldset>

        {/* Dimensions */}
        <fieldset style={styles.fieldsetWithMargin}>
          <legend style={styles.legend}>
            Package Dimensions
          </legend>
          <Form.Group controlId="dimensions">
            <HStack spacing={10} style={styles.hStackMargin}>
              <HStack.Item>
                <Form.ControlLabel>Dimensions *</Form.ControlLabel>
              </HStack.Item>
              <HStack.Item>
                <Form.Control
                  name="dimensionUnit"
                  accepter={SelectPicker}
                  data={DIMENSION_UNIT_OPTIONS}
                  style={styles.unitWidth}
                  disabled={isLoading}
                  aria-label="Dimension unit"
                />
              </HStack.Item>
            </HStack>
            <HStack spacing={10} style={styles.hStackMargin} justifyContent="flex-start">
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
            <Form.HelpText>
              Enter the length, width, and height of your package
            </Form.HelpText>
          </Form.Group>
        </fieldset>


        {/* Actions */}
        <div 
          style={styles.actionsContainer}
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
        <Form.HelpText id="submit-help">
          Click to compare offers from multiple carriers
        </Form.HelpText>
      </Form>
    </Panel>
  )
}

