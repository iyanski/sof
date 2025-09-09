import { useState } from 'react'
import { Container, Header, Content, Panel, Button, ButtonGroup, Divider } from 'rsuite'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Container>
      <Header>
        <Panel>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
            <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
              <img src={viteLogo} className="logo" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
        </Panel>
      </Header>
      
      <Content>
        <Panel header="SOF - Shipment Offers & Logistics" bordered>
          <h2>Welcome to SOF API Frontend</h2>
          <p>This is a React application built with Vite and RSuite components.</p>
          
          <Divider />
          
          <Panel header="Interactive Demo" bordered>
            <p>Click the buttons below to test the counter functionality:</p>
            <ButtonGroup>
              <Button 
                appearance="primary" 
                color="blue"
                onClick={() => setCount((count) => count + 1)}
              >
                Increment
              </Button>
              <Button 
                appearance="subtle" 
                color="red"
                onClick={() => setCount(0)}
              >
                Reset
              </Button>
            </ButtonGroup>
            <p style={{ marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              Count: {count}
            </p>
          </Panel>
          
          <Divider />
          
          <Panel header="Development Info" bordered>
            <p>
              Edit <code>src/App.tsx</code> and save to test Hot Module Replacement (HMR)
            </p>
            <p>
              This app uses RSuite components for a professional UI/UX out of the box.
            </p>
          </Panel>
        </Panel>
      </Content>
    </Container>
  )
}

export default App
