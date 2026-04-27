import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

export function RequireRole({ role }: { role: 'admin' | 'vendor' | 'service' | 'driver' }) {
  const loc = useLocation()
  const user = useAppSelector((s) => s.auth.user)
  const urlRole = new URLSearchParams(loc.search).get('role')

  const ok = user?.role === role || urlRole === role
  if (!ok) {
    return <Navigate to="/vendor/dashboard" replace />
  }
  return <Outlet />
}

