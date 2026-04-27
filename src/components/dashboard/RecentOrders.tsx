import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardRecentOrder } from '@/features/api/types'
import { DashboardOrderStatusBadge } from '@/components/dashboard/dashboard-status-badge'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/formatCurrency'

type Props = { orders: DashboardRecentOrder[]; isLoading?: boolean; className?: string }

export function RecentOrders({ orders, isLoading, className }: Props) {
  return (
    <Card className={cn('bg-card text-card-foreground border-border/60 rounded-xl border shadow-sm', className)}>
      <CardHeader>
        <CardTitle>Recent orders</CardTitle>
        <CardDescription>Latest orders</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-md" />
        ) : !orders.length ? (
          <p className="text-muted-foreground py-8 text-center text-sm">No recent orders</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-sm">{o.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {o.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DashboardOrderStatusBadge statusKey={o.statusKey} label={o.displayStatus} />
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{formatCurrency(o.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
