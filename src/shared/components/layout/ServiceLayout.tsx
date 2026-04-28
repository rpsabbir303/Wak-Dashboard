import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, CalendarDays, HandCoins, Home, LogOut, Menu, MessageCircle, Settings, Shield, Users, Wrench } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Separator } from '@/shared/ui/separator'
import { LogoutModal } from '@/shared/components/LogoutModal'
import { useAppDispatch } from '@/app/hooks'
import { logout } from '@/features/auth'
import { cn } from '@/shared/utils/utils'
import {
  getActiveServiceControllerPermissions,
  loadServiceControllers,
  setActiveServiceControllerPermissions,
} from '@/app/service-permission'

type MenuItem = { to: string; label: string; icon: typeof Home }

const serviceNav: MenuItem[] = [
  { to: '/service/dashboard', label: 'Dashboard', icon: Home },
  { to: '/service/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/service/services', label: 'Services', icon: Wrench },
  { to: '/service/messages', label: 'Messages', icon: MessageCircle },
  { to: '/service/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/service/earnings', label: 'Earnings & Payouts', icon: HandCoins },
  { to: '/service/customers', label: 'Customer management', icon: Users },
  { to: '/service/controllers', label: 'Controller management', icon: Shield },
  { to: '/service/settings/profile', label: 'Settings', icon: Settings },
]

function ServiceSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const activePerms = getActiveServiceControllerPermissions()
  const location = useLocation()
  const [openSettings, setOpenSettings] = useState(false)
  const settingsActive = location.pathname.startsWith('/service/settings')

  useEffect(() => {
    if (settingsActive) setOpenSettings(true)
  }, [settingsActive])

  const items = useMemo(() => {
    if (!activePerms) return serviceNav
    const allowed = new Set(activePerms)
    // Controllers do not manage controllers list.
    return serviceNav.filter((i) => {
      if (i.to === '/service/controllers') return false
      if (i.to === '/service/dashboard') return allowed.has('dashboard')
      if (i.to === '/service/services') return allowed.has('services')
      if (i.to === '/service/bookings') return allowed.has('bookings')
      if (i.to === '/service/customers') return allowed.has('customers')
      if (i.to === '/service/earnings') return allowed.has('earnings')
      if (i.to === '/service/analytics') return allowed.has('analytics')
      if (i.to === '/service/messages') return allowed.has('messages')
      if (i.to.startsWith('/service/settings')) return allowed.has('settings')
      return true
    })
  }, [activePerms])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-1 px-2">
          {items.map((item) => {
            if (item.to.startsWith('/service/settings')) {
              return (
                <div key={item.to} className="space-y-1">
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                      settingsActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                    onClick={() => setOpenSettings((v) => !v)}
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="size-4" />
                      Settings
                    </span>
                    <span className="text-xs">{openSettings ? '▾' : '▸'}</span>
                  </button>

                  <div
                    className={cn(
                      'overflow-hidden transition-[max-height,opacity] duration-200 ease-out',
                      openSettings ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
                    )}
                  >
                    <div className="flex flex-col gap-0.5 py-1">
                      {[
                        { to: '/service/settings/profile', label: 'Profile' },
                        { to: '/service/settings/security', label: 'Security' },
                        { to: '/service/settings/legal', label: 'Legal' },
                        { to: '/service/settings/support', label: 'Support' },
                      ].map((c) => (
                        <NavLink
                          key={c.to}
                          to={c.to}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-2 rounded-md py-1.5 text-xs font-medium transition',
                              'pl-8 pr-3',
                              isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                            )
                          }
                          onClick={() => onNavigate?.()}
                        >
                          <span className="size-2 rounded-full bg-current opacity-60" />
                          {c.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
                onClick={() => onNavigate?.()}
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

export function ServiceLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Dev/testing: activate a controller session via URL query: ?controller=<controllerId>
  useEffect(() => {
    const controllerId = new URLSearchParams(location.search).get('controller')
    if (!controllerId) return
    const list = loadServiceControllers()
    const ctrl = list.find((c) => c.id === controllerId)
    if (ctrl?.permissions?.length) {
      setActiveServiceControllerPermissions(ctrl.permissions)
    }
  }, [location.search])

  function handleLogout() {
    localStorage.removeItem('token')
    dispatch(logout())
    void navigate('/auth/login', { replace: true })
  }

  return (
    <div className="bg-background min-h-svh w-full text-foreground">
      <div className="flex w-full min-h-svh">
        {mobileOpen ? (
          <button
            type="button"
            className="bg-background/50 fixed inset-0 z-30 md:hidden"
            aria-label="Close"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            'bg-card z-40 flex w-64 shrink-0 flex-col border-r transition max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-0',
            'md:sticky md:top-0 md:h-svh',
            !mobileOpen && 'max-md:-translate-x-full max-md:shadow-none',
            mobileOpen && 'max-md:translate-x-0',
          )}
        >
          <div className="border-b px-4 py-4">
            <Link
              to="/service/dashboard"
              className="flex items-center gap-2 font-semibold text-primary"
              onClick={() => setMobileOpen(false)}
            >
              <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-sm">
                W
              </span>
              <span>Unified service</span>
            </Link>
          </div>

          <ServiceSidebar onNavigate={() => setMobileOpen(false)} />

          <Separator className="my-2" />
          <div className="p-2">
            <button
              type="button"
              className={cn(
                'flex w-full items-center gap-2 rounded-md py-2 text-sm font-medium transition',
                'px-3',
                'text-red-500 hover:bg-red-100 cursor-pointer',
              )}
              onClick={() => {
                setShowLogoutModal(true)
                setMobileOpen(false)
              }}
            >
              <LogOut className="size-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="bg-background/95 border-b">
            <div className="flex h-14 items-center gap-2 px-4">
              <Button
                className="md:hidden"
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
              <h1 className="text-foreground min-w-0 flex-1 truncate text-base font-semibold md:text-lg">Dashboard</h1>
            </div>
          </header>
          <main className="min-h-[calc(100svh-3.5rem)] w-full flex-1 px-6 lg:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>

      <LogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false)
          handleLogout()
        }}
      />
    </div>
  )
}

