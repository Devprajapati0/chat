import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CssBaseline } from '@mui/material'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import store, { persistor } from './store/store.js'
import { PersistGate } from 'redux-persist/integration/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <CssBaseline />
          <div onContextMenu={e => e.preventDefault()} >
            <App />
          </div>
        </HelmetProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
