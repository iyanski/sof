import { Form, Slider, InputNumber, Accordion } from 'rsuite'
import type { AdvancedOptionsProps } from './types'

export const AdvancedOptions: React.FC<AdvancedOptionsProps> = ({ 
  formData, 
  disabled = false 
}) => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <Accordion>
        <Accordion.Panel header="Advanced Options" eventKey="advanced">
          <div style={{ padding: '1rem', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
            <Form.Group controlId="speedVsCost">
              <Form.ControlLabel>Speed vs Cost Preference</Form.ControlLabel>
              <div style={{ padding: '0 1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '0.5rem' 
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    Cost Priority
                  </span>
                  <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                    Speed Priority
                  </span>
                </div>
                <Form.Control
                  name="speedVsCost"
                  accepter={Slider}
                  min={0}
                  max={100}
                  step={10}
                  disabled={disabled}
                />
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '0.5rem', 
                  fontSize: '0.875rem', 
                  color: '#6B7280' 
                }}>
                  {formData.speedVsCost}% Speed, {100 - formData.speedVsCost}% Cost
                </div>
              </div>
            </Form.Group>

            <Form.Group controlId="maxTransitDays">
              <Form.ControlLabel>Max Transit Days</Form.ControlLabel>
              <Form.Control
                name="maxTransitDays"
                accepter={InputNumber}
                placeholder="7"
                min={1}
                max={30}
                style={{ width: '120px' }}
                disabled={disabled}
              />
            </Form.Group>
          </div>
        </Accordion.Panel>
      </Accordion>
    </div>
  )
}
