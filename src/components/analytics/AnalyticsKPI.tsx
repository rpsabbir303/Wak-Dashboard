import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function fmtMoney(n: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

function fmtPct(n: number) {
  const v = Math.abs(n)
  const s = v >= 10 ? v.toFixed(0) : v.toFixed(1)
  return `${n >= 0 ? '+' : '-'}${s}%`
}

export function AnalyticsKPI({
  title,
  value,
  changePct,
  loading,
  format = 'number',
  suffix,
}: {
  title: string
  value: number | undefined
  changePct: number | undefined
  loading?: boolean
  format?: 'number' | 'currency' | 'percent'
  suffix?: string
}) {
  const up = (changePct ?? 0) >= 0
  const TrendIcon = up ? TrendingUp : TrendingDown

  const valueNode =
    value === undefined
      ? '—'
      : format === 'currency'
        ? fmtMoney(value)
        : format === 'percent'
          ? `${value.toFixed(1)}%`
          : `${new Intl.NumberFormat().format(value)}${suffix ?? ''}`

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <Skeleton className="h-9 w-28" />
        ) : (
          <div className="text-2xl font-semibold tracking-tight tabular-nums">{valueNode}</div>
        )}

        {loading ? (
          <Skeleton className="h-4 w-24" />
        ) : changePct === undefined ? (
          <div className="text-muted-foreground text-xs">—</div>
        ) : (
          <div className={cn('inline-flex items-center gap-1 text-xs font-medium', up ? 'text-green-600' : 'text-red-600')}>
            <TrendIcon className="size-4" />
            <span>{fmtPct(changePct)}</span>
            <span className="text-muted-foreground font-normal">vs previous</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

