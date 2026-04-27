import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type BookingStatus = 'Pending' | 'Ongoing' | 'Completed'

type BookingRow = {
  id: number
  service: string
  customer: string
  date: string
  amount: number
  status: BookingStatus
  customerApproved: boolean
}

const fmtUsd = (n: number) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

function StatusBadge({ status }: { status: BookingStatus }) {
  const cls =
    status === 'Completed'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : status === 'Ongoing'
        ? 'border-blue-200 bg-blue-50 text-blue-700'
        : 'border-zinc-200 bg-zinc-50 text-zinc-700'
  return (
    <Badge variant="outline" className={cn(cls)}>
      {status}
    </Badge>
  )
}

export function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([
    {
      id: 1,
      service: 'Full-Stack Web Development',
      customer: 'John Doe',
      date: '2025-05-01',
      amount: 250,
      status: 'Ongoing',
      customerApproved: false,
    },
  ])

  const [detailsId, setDetailsId] = useState<number | null>(null)
  const details = useMemo(() => bookings.find((b) => b.id === detailsId) ?? null, [bookings, detailsId])

  function setStatus(id: number, next: BookingStatus) {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b
        // If provider marks completed, keep approval false until customer approves.
        if (next === 'Completed') return { ...b, status: next, customerApproved: false }
        return { ...b, status: next }
      }),
    )
  }

  function approvalLabel(b: BookingRow) {
    if (b.status !== 'Completed') return null
    if (b.customerApproved) return 'Completed ✅'
    return 'Waiting for customer approval'
  }

  // Dev-only: simulate customer approval after provider sets Completed.
  useEffect(() => {
    const pending = bookings.filter((b) => b.status === 'Completed' && !b.customerApproved)
    if (!pending.length) return

    const timers = pending.map((b) =>
      window.setTimeout(() => {
        setBookings((prev) => prev.map((x) => (x.id === b.id ? { ...x, customerApproved: true } : x)))
      }, 3000),
    )

    return () => {
      for (const t of timers) window.clearTimeout(t)
    }
  }, [bookings])

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-muted-foreground text-sm">Track incoming and active bookings.</p>
      </div>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Bookings</CardTitle>
          <CardDescription>Update status and simulate customer approval.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Service Name</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((b) => {
                  const approval = approvalLabel(b)
                  return (
                    <TableRow key={b.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{b.service}</TableCell>
                      <TableCell>{b.customer}</TableCell>
                      <TableCell className="text-muted-foreground">{b.date}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{fmtUsd(b.amount)}</TableCell>
                      <TableCell>
                        <Select value={b.status} onValueChange={(v) => setStatus(b.id, v as BookingStatus)}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {b.status === 'Completed' ? (
                          b.customerApproved ? (
                            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                              {approval}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                              {approval}
                            </Badge>
                          )
                        ) : (
                          <StatusBadge status={b.status} />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="border-[#895129]/40 text-[#895129] hover:bg-[#895129]/10"
                          onClick={() => setDetailsId(b.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailsId != null} onOpenChange={(open) => (open ? null : setDetailsId(null))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking details</DialogTitle>
            <DialogDescription>Static demo view (no API)</DialogDescription>
          </DialogHeader>
          {details ? (
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-muted-foreground">Service</div>
                  <div className="font-medium">{details.service}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Customer</div>
                  <div className="font-medium">{details.customer}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Date</div>
                  <div className="font-medium">{details.date}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Amount</div>
                  <div className="font-medium tabular-nums">{fmtUsd(details.amount)}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={details.status} />
                {details.status === 'Completed' ? (
                  details.customerApproved ? (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      Completed ✅
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                      Waiting for customer approval
                    </Badge>
                  )
                ) : null}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Booking not found.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

