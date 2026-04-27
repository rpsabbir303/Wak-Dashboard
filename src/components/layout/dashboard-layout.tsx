import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  Circle,
  Home,
  LogOut,
  Menu,
  Package,
  Shield,
  Settings,
  ShoppingCart,
  Wallet,
  Truck,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LogoutModal } from '@/components/common/LogoutModal'
import { useAppDispatch } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { useGetProfileQuery } from '@/features/api/userApi'
import { connectSocket } from '@/lib/socket'
import { cn } from '@/lib/utils'

type MenuItem = { to: string; label: string; icon: typeof Home }

const vendorNav: MenuItem[] = [
  { to: '/vendor/dashboard', label: 'Dashboard', icon: Home },
  { to: '/vendor/products', label: 'Products', icon: Package },
  { to: '/vendor/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/vendor/delivery-requests', label: 'Delivery requests', icon: Truck },
  { to: '/vendor/earnings', label: 'Earnings & Payouts', icon: Wallet },
  { to: '/vendor/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/vendor/customers', label: 'Customer management', icon: Users },
  { to: '/vendor/controllers', label: 'Controller management', icon: Shield },
]

export function VendorLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isError } = useGetProfileQuery()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [openSettings, setOpenSettings] = useState(false)

  useEffect(() => {
    connectSocket()
  }, [])

  const settingsActive = location.pathname.startsWith('/vendor/settings')

  useEffect(() => {
    if (settingsActive) setOpenSettings(true)
  }, [settingsActive])

  function handleLogout() {
    localStorage.removeItem('token')
    dispatch(logout())
    void navigate('/auth/login', { replace: true })
  }

  return (
    <div className="bg-background min-h-svh w-full text-foreground">
      <div className="flex w-full min-h-svh">
        {mobileOpen ? <button type="button" className="bg-background/50 fixed inset-0 z-30 md:hidden" aria-label="Close" onClick={() => setMobileOpen(false)} /> : null}
        <aside
          className={cn(
            'bg-card z-40 flex w-64 shrink-0 flex-col border-r transition max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-0',
            'md:sticky md:top-0 md:h-svh',
            !mobileOpen && 'max-md:-translate-x-full max-md:shadow-none',
            mobileOpen && 'max-md:translate-x-0',
          )}
        >
          <div className="border-b px-4 py-4">
            <Link to="/vendor/dashboard" className="flex items-center gap-2 font-semibold text-primary" onClick={() => setMobileOpen(false)}>
              <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-sm">W</span>
              <span>Unified vendor</span>
            </Link>
            {isError && (
              <p className="text-muted-foreground mt-1 text-xs">Set auth token in Settings to load your profile.</p>
            )}
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto">
              <nav className="flex flex-col gap-1 px-2">
                {vendorNav.map((item) => {
                  if (item.to !== '/vendor/controllers') {
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
                        onClick={() => setMobileOpen(false)}
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </NavLink>
                    )
                  }

                  return (
                    <div key={item.to} className="space-y-1">
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                            isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                          )
                        }
                        onClick={() => setMobileOpen(false)}
                      >
                        <item.icon className="size-4" />
                        {item.label}
                      </NavLink>

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
                        {openSettings ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                      </button>

                      <div
                        className={cn(
                          'overflow-hidden transition-[max-height,opacity] duration-200 ease-out',
                          openSettings ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
                        )}
                      >
                        <div className="flex flex-col gap-0.5 py-1">
                          {[
                            { to: '/vendor/settings/profile', label: 'Profile' },
                            { to: '/vendor/settings/security', label: 'Security' },
                            { to: '/vendor/settings/legal', label: 'Legal' },
                            { to: '/vendor/settings/support', label: 'Support' },
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
                              onClick={() => setMobileOpen(false)}
                            >
                              <Circle className="size-2 fill-current opacity-70" />
                              {c.label}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </nav>
            </div>

            <div className="border-t p-2">
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
