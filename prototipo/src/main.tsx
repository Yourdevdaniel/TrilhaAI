import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { EstadoProvider } from './data/estado'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <EstadoProvider>
        <App />
      </EstadoProvider>
    </BrowserRouter>
  </StrictMode>,
)
