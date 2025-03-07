import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { LoadingProvider } from './contexts/LoadingContext'
import { NofiticationProvider } from './contexts/NotificationContext'
import { CollapseProvider } from './contexts/CollapseContext'
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <LoadingProvider>
      <NofiticationProvider>
        <CollapseProvider>
          <BrowserRouter>
            <Toaster />
            <App />
          </BrowserRouter>
        </CollapseProvider>
      </NofiticationProvider>
    </LoadingProvider>
  </HelmetProvider>
)
