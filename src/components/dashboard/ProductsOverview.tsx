import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type Props = {
  total: number
  lowStockCount: number
  topName: string
  topSales?: number
  isLoading?: boolean
  className?: string
}

export function ProductsOverview({ total, lowStockCount, topName, topSales, isLoading, className }: Props) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-3', className)}>
      <Card className="bg-card text-card-foreground border-border/60 rounded-xl border py-0 shadow-sm">
        <CardHeader>
          <CardDescription>Total products</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {isLoading ? <Skeleton className="h-8 w-16" /> : total}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card
        className={cn(
          'rounded-xl border py-0 shadow-sm',
          lowStockCount > 0
            ? 'border-destructive/40 bg-destructive/5'
            : 'bg-card text-card-foreground border-border/60',
        )}
      >
        <CardHeader>
          <CardDescription className={lowStockCount > 0 ? 'text-destructive' : undefined}>Low stock items</CardDescription>
          <CardTitle
            className={cn(
              'text-2xl font-semibold tabular-nums',
              lowStockCount > 0 ? 'text-destructive' : 'text-foreground',
            )}
          >
            {isLoading ? <Skeleton className="h-8 w-12" /> : lowStockCount}
          </CardTitle>
        </CardHeader>
        {lowStockCount > 0 && (
          <CardContent className="text-destructive text-xs">Review inventory soon</CardContent>
        )}
      </Card>
      <Card className="bg-card text-card-foreground border-border/60 rounded-xl border py-0 shadow-sm">
        <CardHeader>
          <CardDescription>Top product</CardDescription>
          {isLoading ? (
            <Skeleton className="mt-2 h-6 w-40" />
          ) : (
            <>
              <CardTitle className="text-base font-semibold leading-tight">{topName}</CardTitle>
              {topSales !== undefined && <p className="text-muted-foreground text-xs">Units sold: {topSales}</p>}
            </>
          )}
        </CardHeader>
      </Card>
    </div>
  )
}
