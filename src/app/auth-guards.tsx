import { Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from './hooks'

export function RequireAuth() {
  // Demo-first: allow navigation without a backend/token.
  // Login still works for role switching, but it's not required to use the dashboard.
  useAppSelector((s) => s.auth.token)
  useLocation()
  return <Outlet />
}

export function GuestOnly() {
  useAppSelector((s) => s.auth.token)
  return <Outlet />
}
