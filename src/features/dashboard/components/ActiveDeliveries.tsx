import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'
import type { DashboardActiveDelivery } from '@/shared/types/api'
import { OrderStatusBadge } from '@/shared/components/status-badge'
import { cn } from '@/shared/utils/utils'

type Props = { items: DashboardActiveDelivery[]; isLoading?: boolean; className?: string }

export function ActiveDeliveries({ items, isLoading, className }: Props) {
  return (
    <Card className={cn('bg-card text-card-foreground border-border/60 rounded-xl border shadow-sm', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle>Active deliveries</CardTitle>
          <CardDescription>Driver assignments and state</CardDescription>
        </div>
        <Button asChild size="sm" variant="secondary" className="shrink-0">
          <Link to="/vendor/delivery-requests">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-36 w-full rounded-md" />
        ) : !items.length ? (
          <p className="text-muted-foreground py-6 text-center text-sm">No active deliveries</p>
        ) : (
          <ul className="space-y-3">
            {items.map((d) => (
              <li
                key={d.id}
                className="bg-muted/40 border-border/60 flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="font-mono text-sm font-medium">{d.orderId}</p>
                  <p className="text-muted-foreground text-xs">Driver: {d.driverName}</p>
                </div>
                <OrderStatusBadge status={d.status} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
