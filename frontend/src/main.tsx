import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from '@/store'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/styles/global.css'
import App from './App.tsx'
import { getStoredTheme, applyTheme } from '@/styles/theme'

// Apply persisted theme before first render to avoid flash
applyTheme(getStoredTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
