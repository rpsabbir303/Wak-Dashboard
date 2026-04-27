import { useSelector } from 'react-redux'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import type { RootState } from '@/app/store'
import { useGetProfileQuery } from '@/features/api/userApi'
import { useDashboardViewModel } from '@/features/dashboard/useDashboardViewModel'
import { VendorDashboard } from './VendorDashboard'
import { ServiceDashboard } from './ServiceDashboard'
import type { UserRole } from '@/features/auth/authTypes'

export function DashboardOverview() {
  const authRole: UserRole | undefined = useSelector((s: RootState) => s.auth.user?.role)
  const { data: profile } = useGetProfileQuery()
  const role: UserRole | null = authRole ?? profile?.role ?? null

  const { data, meta, isLoading, isError, isDemo, refetch } = useDashboardViewModel(role)

  if ((isLoading && !data) || !role) {
    return (
      <div className="w-full space-y-6">
        <PageHeading role={role} />
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="bg-muted/30 border-border/60 h-40 rounded-xl border" />
          <div className="bg-muted/30 border-border/60 h-40 rounded-xl border" />
        </div>
      </div>
    )
  }

  if (isError && !data) {
    return (
      <div className="w-full space-y-6">
        <PageHeading role={role} />
        <Alert variant="destructive">
          <AlertTitle>Could not load dashboard</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            Data source is static demo right now. Try again.
            <Button type="button" size="sm" variant="secondary" onClick={() => void refetch()}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="w-full space-y-6">
      <PageHeading role={role} />
      {isDemo && (
        <Alert>
          <AlertTitle>Demo data</AlertTitle>
          <AlertDescription>Showing static sample data.</AlertDescription>
        </Alert>
      )}

      {role === 'vendor' && <VendorDashboard data={data} />}
      {role === 'service' && <ServiceDashboard data={data} meta={meta} />}
    </div>
  )
}

function PageHeading({ role }: { role: UserRole | null }) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard overview</h1>
      <p className="text-muted-foreground text-sm">
        {role === 'service'
          ? 'Service performance: jobs and earnings in one place.'
          : 'Business performance: products and deliveries in one place.'}
      </p>
    </div>
  )
}

