import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { RevenueChartPoint } from '@/features/api/types'
import { cn } from '@/lib/utils'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Range = 'weekly' | 'monthly'

type Props = {
  weekly: RevenueChartPoint[]
  monthly: RevenueChartPoint[]
  mode?: 'product' | 'service' | 'both'
  isLoading?: boolean
  className?: string
}

export function RevenueChart({ weekly, monthly, mode = 'both', isLoading, className }: Props) {
  const [range, setRange] = useState<Range>('weekly')
  const data = range === 'weekly' ? weekly : monthly
  const has = data && data.length > 0

  return (
    <Card className={cn('bg-card text-card-foreground border-border/60 rounded-xl border shadow-sm', className)}>
      <CardHeader className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>
            {mode === 'product'
              ? 'Product revenue over time (toggle period)'
              : mode === 'service'
                ? 'Service revenue over time (toggle period)'
                : 'Product vs service (toggle period)'}
          </CardDescription>
        </div>
        <div className="bg-muted inline-flex rounded-lg p-1">
          {(['weekly', 'monthly'] as const).map((r) => (
            <Button
              key={r}
              type="button"
              variant={range === r ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setRange(r)}
            >
              {r === 'weekly' ? 'Weekly' : 'Monthly'}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-72 w-full rounded-lg" />
        ) : has ? (
          <div className="h-72 w-full min-h-[280px]">
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tickLine={false} className="text-xs" />
                <YAxis className="text-xs" width={48} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: '1px solid hsl(214.3 31.8% 91.4%)',
                    background: 'hsl(0 0% 100%)',
                  }}
                />
                {mode === 'both' ? <Legend /> : null}
                {mode !== 'service' ? (
                  <Line
                    type="monotone"
                    name="Product revenue"
                    dataKey="product"
                    stroke="#895129"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ) : null}
                {mode !== 'product' ? (
                  <Line
                    type="monotone"
                    name="Service revenue"
                    dataKey="service"
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ) : null}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-muted-foreground py-12 text-center text-sm">No chart data (connect analytics or enable demo).</p>
        )}
      </CardContent>
    </Card>
  )
}
