import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

type AppRole = 'admin' | 'vendor' | 'service_provider' | 'driver'

const roleHome: Record<AppRole, string> = {
  admin: '/admin/dashboard',
  vendor: '/vendor/dashboard',
  service_provider: '/service/dashboard',
  driver: '/driver/queue',
}

export function RequireRole({ role }: { role: AppRole }) {
  const loc = useLocation()
  const user = useAppSelector((s) => s.auth.user)
  const urlRole = new URLSearchParams(loc.search).get('role') as AppRole | null

  const actualRole = (user?.role as AppRole | undefined) ?? (urlRole ?? undefined)

  const ok = actualRole === role
  if (!ok) {
    if (actualRole && roleHome[actualRole]) {
      return <Navigate to={roleHome[actualRole]} replace />
    }
    return <Navigate to="/auth/login" replace />
  }
  return <Outlet />
}

