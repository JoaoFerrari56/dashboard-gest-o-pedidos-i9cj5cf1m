import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SearchProvider } from '@/contexts/SearchContext'
import { AuthProvider } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Layout from './components/Layout'
import Index from './pages/Index'
import OrderManager from './pages/OrderManager'
import Atendimento from './pages/Atendimento'
import Cardapio from './pages/Cardapio'
import Placeholder from './pages/Placeholder'
import NotFound from './pages/NotFound'
import PublicMenu from './pages/PublicMenu'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'

const App = () => (
  <AuthProvider>
    <BrowserRouter
      future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
    >
      <SearchProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/visualizacao-cardapio" element={<PublicMenu />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected Onboarding Route (Requires login, but NOT onboarding completion) */}
            <Route element={<ProtectedRoute requireOnboarding={false} />}>
              <Route path="/onboarding" element={<Onboarding />} />
            </Route>

            {/* Fully Protected Dashboard Routes (Requires login AND onboarding completion) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/pedidos" element={<OrderManager />} />
                <Route path="/atendimento" element={<Atendimento />} />
                <Route path="/cardapio" element={<Cardapio />} />
                <Route path="/cupons" element={<Placeholder />} />
                <Route path="/disparos" element={<Placeholder />} />
                <Route path="/financeiro" element={<Placeholder />} />
                <Route path="/configuracoes" element={<Placeholder />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </SearchProvider>
    </BrowserRouter>
  </AuthProvider>
)

export default App
