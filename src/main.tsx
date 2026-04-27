import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import App from './App'
import { store } from './app/store'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster position="top-right" richColors closeButton />
      <App />
    </Provider>
  </StrictMode>,
)
