import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { getEstablishment } from '@/services/establishments'
import { Loader2, AlertCircle } from 'lucide-react'

interface ProtectedRouteProps {
  requireOnboarding?: boolean
}

export function ProtectedRoute({
  requireOnboarding = true,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [hasEstablishment, setHasEstablishment] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    let mounted = true

    async function verifyEstablishment() {
      if (loading) return

      if (!user) {
        if (mounted) {
          setHasEstablishment(false)
          setChecking(false)
        }
        return
      }

      try {
        setError(null)
        const { data, error: fetchError } = await getEstablishment()

        // Ignore PGRST116 (No rows found) as it just means the user hasn't onboarded yet
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }

        if (mounted) {
          const isValid = !!data && !!data.name && !!data.category
          setHasEstablishment(isValid)
          setChecking(false)
        }
      } catch (err: any) {
        console.error('Failed to verify establishment:', err)
        if (mounted) {
          setHasEstablishment(false)
          setChecking(false)

          if (err.message !== 'Not authenticated') {
            setError(
              'Não foi possível verificar os dados da sua conta. Verifique sua conexão e tente recarregar.',
            )
          }
        }
      }
    }

    verifyEstablishment()

    return () => {
      mounted = false
    }
  }, [user, loading])

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-brand-red w-8 h-8" />
          <p className="text-slate-500 text-sm font-medium animate-pulse">
            Carregando seus dados...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-sm text-center space-y-5">
          <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-brand-red" />
          </div>
          <p className="text-slate-700 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-brand-red text-white px-4 py-2.5 rounded-xl font-bold w-full hover:bg-red-700 transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  if (requireOnboarding && hasEstablishment === false) {
    return <Navigate to="/onboarding" replace />
  }

  if (
    !requireOnboarding &&
    hasEstablishment === true &&
    location.pathname === '/onboarding'
  ) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
