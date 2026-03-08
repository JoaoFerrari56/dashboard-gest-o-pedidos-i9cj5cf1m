import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'
import { getEstablishment } from '@/services/establishments'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  requireOnboarding?: boolean
}

export function ProtectedRoute({
  requireOnboarding = true,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const [hasEstablishment, setHasEstablishment] = useState<boolean | null>(null)
  const [checking, setChecking] = useState(true)
  const location = useLocation()

  useEffect(() => {
    let mounted = true

    async function verifyEstablishment() {
      if (loading) return

      if (!user) {
        if (mounted) setChecking(false)
        return
      }

      try {
        const { data } = await getEstablishment()
        if (mounted) {
          // An establishment is considered valid and fully onboarded only if it has a name and category
          const isValid = !!data && !!data.name && !!data.category
          setHasEstablishment(isValid)
          setChecking(false)
        }
      } catch (err) {
        if (mounted) {
          setHasEstablishment(false)
          setChecking(false)
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
        <Loader2 className="animate-spin text-brand-red w-8 h-8" />
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
