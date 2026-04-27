import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Boxes, LayoutDashboard, Package, Settings, ShoppingCart, Truck, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { connectSocket } from '@/lib/socket'

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/services', label: 'Services', icon: Boxes },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/deliveries', label: 'Deliveries', icon: Truck },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    connectSocket()
  }, [])

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
            <Link to="/admin/dashboard" className="flex items-center gap-2 font-semibold text-primary" onClick={() => setMobileOpen(false)}>
              <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md text-sm">A</span>
              <span>Admin Panel</span>
            </Link>
            <p className="text-muted-foreground mt-1 text-xs">Full control dashboard (users, orders, deliveries).</p>
          </div>

          <Separator className="my-2" />
          <nav className="flex flex-col gap-0.5 px-2">
            {adminNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
              >
                <item.icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
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
                <LayoutDashboard className="size-5" />
              </Button>
              <h1 className="text-foreground min-w-0 flex-1 truncate text-base font-semibold md:text-lg">Admin</h1>
              <Button asChild variant="outline" size="sm">
                <Link to="/vendor/dashboard">Vendor view</Link>
              </Button>
            </div>
          </header>
          <main className="min-h-[calc(100svh-3.5rem)] w-full flex-1 px-6 lg:px-8 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

