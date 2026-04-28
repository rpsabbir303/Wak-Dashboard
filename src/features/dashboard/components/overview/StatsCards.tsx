import type { ComponentType } from 'react'
import { Card, CardContent } from '@/shared/ui/card'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/utils/utils'

export type StatCard = {
  key: string
  label: string
  value: string
  sub?: string
  icon: ComponentType<{ className?: string }>
}

export function StatsCards({
  items,
  isLoading,
  className,
}: {
  items: StatCard[]
  isLoading?: boolean
  className?: string
}) {
  return (
    <div className={cn('grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4', className)}>
      {items.map((s) => (
        <Card key={s.key} className="bg-card text-card-foreground border-border/60 rounded-xl border py-0 shadow-sm">
          <CardContent className="flex h-full items-start justify-between gap-3 p-6">
            <div className="min-w-0 space-y-1">
              <p className="text-muted-foreground text-sm font-medium">{s.label}</p>
              {isLoading ? (
                <Skeleton className="h-8 w-28" />
              ) : (
                <>
                  <p className="text-2xl font-semibold tabular-nums tracking-tight text-foreground">{s.value}</p>
                  {s.sub && <p className="text-muted-foreground text-xs">{s.sub}</p>}
                </>
              )}
            </div>
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
              <s.icon className="size-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

