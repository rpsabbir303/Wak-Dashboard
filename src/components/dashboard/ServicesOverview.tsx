import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Props = {
  total: number
  active: number
  topName: string
  topSales?: number
  isLoading?: boolean
  className?: string
}

export function ServicesOverview({ total, active, topName, topSales, isLoading, className }: Props) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-3', className)}>
      <Card className="bg-card text-card-foreground border-border/60 rounded-xl border py-0 shadow-sm">
        <CardHeader>
          <CardDescription>Total services</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {isLoading ? <Skeleton className="h-8 w-16" /> : total}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-card text-card-foreground border-border/60 rounded-xl border py-0 shadow-sm">
        <CardHeader>
          <CardDescription>Active services</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums text-primary">
            {isLoading ? <Skeleton className="h-8 w-16" /> : active}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-card text-card-foreground border-border/60 col-span-1 md:col-span-1 border py-0 shadow-sm">
        <CardHeader>
          <CardDescription>Top service</CardDescription>
          {isLoading ? (
            <Skeleton className="mt-2 h-6 w-40" />
          ) : (
            <>
              <CardTitle className="text-base font-semibold leading-tight">{topName}</CardTitle>
              {topSales !== undefined && (
                <p className="text-muted-foreground text-xs">Sales / bookings: {topSales}</p>
              )}
            </>
          )}
        </CardHeader>
      </Card>
    </div>
  )
}
