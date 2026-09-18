import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import './index.css'
import App from './App.jsx'

// Create a query client instance with optimal caching defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes before background refetching
      refetchOnWindowFocus: false, // Prevents unnecessary re-fetches on tab switches
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <QueryClientProvider client={queryClient}>
      <BrowserRouter> 
        <App /> 
      </BrowserRouter> 
    </QueryClientProvider>
  </StrictMode>
)