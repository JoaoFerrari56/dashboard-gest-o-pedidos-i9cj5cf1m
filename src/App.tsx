import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SearchProvider } from '@/contexts/SearchContext'
import Layout from './components/Layout'
import Index from './pages/Index'
import OrderManager from './pages/OrderManager'
import Atendimento from './pages/Atendimento'
import Placeholder from './pages/Placeholder'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter
    future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
  >
    <SearchProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/pedidos" element={<OrderManager />} />
            <Route path="/atendimento" element={<Atendimento />} />
            <Route path="/cardapio" element={<Placeholder />} />
            <Route path="/cupons" element={<Placeholder />} />
            <Route path="/disparos" element={<Placeholder />} />
            <Route path="/financeiro" element={<Placeholder />} />
            <Route path="/configuracoes" element={<Placeholder />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </SearchProvider>
  </BrowserRouter>
)

export default App
