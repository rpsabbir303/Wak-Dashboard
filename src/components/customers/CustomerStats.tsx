import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CustomerLifetimeValue } from '@/features/api/types'

function fmtMoney(n: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      </CardContent>
    </Card>
  )
}

export function CustomerStats({ ltv }: { ltv: CustomerLifetimeValue }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Spend" value={fmtMoney(ltv.totalSpend)} />
        <StatCard label="Total Orders" value={new Intl.NumberFormat().format(ltv.totalOrders)} />
        <StatCard label="Average Order Value" value={fmtMoney(ltv.aov)} />
        <StatCard label="Points" value={new Intl.NumberFormat().format(ltv.points)} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Last 30 days orders" value={new Intl.NumberFormat().format(ltv.last30DaysOrders)} />
        <StatCard label="Abandoned carts" value={new Intl.NumberFormat().format(ltv.abandonedCarts)} />
        <StatCard label="Refunds" value={new Intl.NumberFormat().format(ltv.refunds)} />
        <StatCard label="Refunded amount" value={fmtMoney(ltv.refundedAmount)} />
      </div>
    </div>
  )
}

