import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import {
  useGetDeliveryRequestsQuery,
  useGetDriverQueueQuery,
  useRejectDeliveryMutation,
  useUpdateDeliveryStatusMutation,
} from '@/features/api/deliveryApi'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Delivery, DeliveryDriverStatus } from '@/features/api/types'
import { useGetProfileQuery } from '@/features/api/userApi'
import { useDeliveryRealtime } from '@/hooks/useDeliveryRealtime'
import { DeliveryTabs } from '@/components/delivery-management/DeliveryTabs'
import { DeliveryDetailsModal } from '@/components/delivery-management/DeliveryDetailsModal'
import { nextStatus } from '@/components/delivery-management/deliveryStatusUi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGetProductOrdersQuery, useGetServiceOrdersQuery } from '@/features/api/orderApi'

function sortByCreatedDesc(a: Delivery, b: Delivery) {
  return b.createdAt > a.createdAt ? 1 : -1
}

type Filters = {
  status: string
}

export function DeliveryRequestsPage() {
  const location = useLocation()
  const { data: profile } = useGetProfileQuery()
  const isDriver = profile?.role === 'driver' || new URLSearchParams(location.search).get('role') === 'driver'

  // Real-time readiness (socket is stubbed in demo mode).
  // listenDeliveryUpdates(): prepared alias for future custom subscriptions.
  function listenDeliveryUpdates() {
    useDeliveryRealtime()
  }
  listenDeliveryUpdates()

  const vendorQ = useGetDeliveryRequestsQuery(undefined, { skip: isDriver })
  const driverQ = useGetDriverQueueQuery(undefined, { skip: !isDriver })
  const { data, isLoading, isError } = isDriver ? driverQ : vendorQ

  const productOrdersQ = useGetProductOrdersQuery(undefined, { skip: isDriver })
  const serviceOrdersQ = useGetServiceOrdersQuery(undefined, { skip: isDriver })

  const [update, { isLoading: updating }] = useUpdateDeliveryStatusMutation()
  const [reject, { isLoading: rejecting }] = useRejectDeliveryMutation()
  const busy = updating || rejecting

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selected, setSelected] = useState<Delivery | null>(null)

  const [activeTab, setActiveTab] = useState<'local' | 'international'>('local')

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>({ status: '' })
  const [page, setPage] = useState(1)
  const itemsPerPage = 6

  const rows = useMemo(() => (data ?? []).slice().sort(sortByCreatedDesc), [data])

  const customerNameByOrderId = useMemo(() => {
    const map = new Map<string, string>()
    for (const o of productOrdersQ.data ?? []) map.set(o.id, o.customer?.name ?? o.customerName ?? '')
    for (const o of serviceOrdersQ.data ?? []) map.set(o.id, o.customer?.name ?? o.customerName ?? '')
    return map
  }, [productOrdersQ.data, serviceOrdersQ.data])

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase()

    let out = rows.filter((d) => {
      const status = String(d.deliveryStatus ?? '').toLowerCase()
      if (filters.status) {
        const f = filters.status.toLowerCase()
        const ok =
          (f === 'pending' && (status === 'pending' || status === 'requested')) ||
          (f === 'in_transit' && (status === 'in_transit' || status === 'picked_up')) ||
          status === f
        if (!ok) return false
      }

      if (q) {
        const customer = customerNameByOrderId.get(d.orderId)?.toLowerCase() ?? ''
        const orderId = (d.orderId ?? '').toLowerCase()
        if (!orderId.includes(q) && !customer.includes(q)) return false
      }

      return true
    })

    return out
  }, [rows, search, filters.status, customerNameByOrderId])

  const local = useMemo(() => filteredSorted.filter((d) => (d.type ?? 'local') !== 'international'), [filteredSorted])
  const international = useMemo(() => filteredSorted.filter((d) => d.type === 'international'), [filteredSorted])

  const activeRows = activeTab === 'local' ? local : international
  const totalPages = Math.max(1, Math.ceil(activeRows.length / itemsPerPage))
  const safePage = Math.min(page, totalPages)
  const paged = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage
    return activeRows.slice(start, start + itemsPerPage)
  }, [activeRows, safePage, itemsPerPage])

  useMemo(() => {
    if (page !== safePage) setPage(safePage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage])

  async function accept(d: Delivery) {
    if (d.driverStatus !== 'requested') return
    try {
      await update({ id: d.id, driverStatus: 'accepted', deliveryStatus: 'accepted' }).unwrap()
      toast.success('Accepted')
    } catch {
      toast.error('Accept failed')
    }
  }

  async function decline(d: Delivery) {
    if (d.driverStatus !== 'requested') return
    try {
      await reject(d.id).unwrap()
      toast.success('Rejected')
    } catch {
      toast.error('Reject failed')
    }
  }

  async function updateDeliveryStatus(d: Delivery, next: DeliveryDriverStatus) {
    try {
      await update({ id: d.id, driverStatus: next, deliveryStatus: next }).unwrap()
      toast.success('Status updated')
    } catch {
      toast.error('Could not update delivery')
    }
  }

  async function step(d: Delivery) {
    const n = nextStatus(d.driverStatus)
    if (!n) return
    await updateDeliveryStatus(d, n)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Delivery Management</h1>
        <p className="text-muted-foreground">Local deliveries and international shipments with a clean card UI.</p>
      </div>
      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>
            {isDriver ? 'Driver view: accept and update local deliveries.' : 'Vendor view: track local + international.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isError ? <p className="text-destructive mb-3 text-sm">Could not load deliveries.</p> : null}

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-3 mb-4 space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Search by Order ID or Customer name"
                  className="bg-white border border-gray-200 rounded-xl shadow-sm"
                />

                <select
                  className="h-9 bg-white border border-gray-200 rounded-xl shadow-sm px-3 text-sm"
                  value={filters.status}
                  onChange={(e) => {
                    setFilters((p) => ({ ...p, status: e.target.value }))
                    setPage(1)
                  }}
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="in_transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearch('')
                    setFilters({ status: '' })
                    setPage(1)
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <Skeleton className="h-40" />
          ) : (
            <DeliveryTabs
              local={activeTab === 'local' ? paged : local}
              international={activeTab === 'international' ? paged : international}
              isDriver={isDriver}
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v)
                setPage(1)
              }}
              busy={busy}
              onViewDetails={(d) => {
                setSelected(d)
                setDetailsOpen(true)
              }}
              onAccept={accept}
              onReject={decline}
              onStep={step}
            />
          )}

          {!isLoading ? (
            <div className="mt-5 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-semibold">
                  {activeRows.length ? (safePage - 1) * itemsPerPage + 1 : 0}–{Math.min(safePage * itemsPerPage, activeRows.length)}
                </span>{' '}
                of <span className="font-semibold">{activeRows.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  Prev
                </Button>
                <div className="text-sm text-gray-700">
                  Page <span className="font-semibold">{safePage}</span> / <span className="font-semibold">{totalPages}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <DeliveryDetailsModal
        open={detailsOpen}
        onOpenChange={(v) => {
          setDetailsOpen(v)
          if (!v) setSelected(null)
        }}
        delivery={selected}
      />
    </div>
  )
}
