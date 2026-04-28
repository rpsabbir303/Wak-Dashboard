import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table'
import { SERVICE_DEMO } from '@/features/services'

const bookings = [
  { id: 1, customer: 'John', date: '2025-05-01', status: 'Completed', amount: 250 },
  { id: 2, customer: 'Alex', date: '2025-05-03', status: 'Ongoing', amount: 150 },
] as const

const fmtUsd = (n: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export function ServiceDetails() {
  const { id } = useParams()
  const serviceId = Number(id)

  const service = useMemo(() => SERVICE_DEMO.find((s) => s.id === serviceId), [serviceId])

  if (!service || !id || Number.isNaN(serviceId)) {
    return <div className="w-full text-sm text-muted-foreground">Service not found</div>
  }

  const totalBookings = bookings.length
  const totalEarnings = bookings.reduce((acc, b) => acc + b.amount, 0)
  const completedEarnings = bookings.filter((b) => b.status === 'Completed').reduce((acc, b) => acc + b.amount, 0)
  const pendingEarnings = totalEarnings - completedEarnings

  const statusCls =
    service.status === 'Active'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : 'border-zinc-200 bg-zinc-50 text-zinc-700'

  return (
    <div className="w-full space-y-6">
      {/* Top: Service info */}
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">{service.title}</CardTitle>
          <CardDescription>Service overview</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 text-sm">
            <div className="font-semibold tabular-nums">
              {fmtUsd(service.price)} <span className="text-muted-foreground font-medium">/ {service.type}</span>
            </div>
            <div className="text-muted-foreground">Delivery time: {service.delivery}</div>
          </div>
          <Badge variant="outline" className={statusCls}>
            {service.status}
          </Badge>
        </CardContent>
      </Card>

      {/* Below: two sections */}
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left → Bookings table */}
        <Card className="rounded-xl border-border/60 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Latest bookings for this service</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{b.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{b.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-border/60 bg-muted/20">
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{fmtUsd(b.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right → Earnings summary */}
        <div className="space-y-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Total Earnings</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold tabular-nums">{fmtUsd(totalEarnings)}</CardContent>
          </Card>
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Completed Earnings</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold tabular-nums">{fmtUsd(completedEarnings)}</CardContent>
          </Card>
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Pending Earnings</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold tabular-nums">{fmtUsd(pendingEarnings)}</CardContent>
          </Card>

          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold tabular-nums">{totalBookings}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

