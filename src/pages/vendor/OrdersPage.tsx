import { useState } from 'react'
import { toast } from 'sonner'
import { RequestDeliveryButton } from '@/components/delivery-request-dialog'
import { getOrderStatusOptions, OrderStatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useGetProductOrdersQuery,
  useGetServiceOrdersQuery,
  useUpdateProductOrderStatusMutation,
  useUpdateServiceOrderStatusMutation,
} from '@/features/api/orderApi'
import type { ProductOrder, ProductOrderStatus, ServiceOrderStatus } from '@/features/api/types'

export function OrdersPage() {
  const { data: productRows, isLoading: loadingP, isError: errP, refetch: refetchP } = useGetProductOrdersQuery()
  const { data: serviceRows, isLoading: loadingS, isError: errS, refetch: refetchS } = useGetServiceOrdersQuery()
  const [updateP] = useUpdateProductOrderStatusMutation()
  const [updateS] = useUpdateServiceOrderStatusMutation()
  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState<ProductOrder | null>(null)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-muted-foreground">Product and service order pipelines in one place.</p>
      </div>
      <Dialog
        open={detailOpen}
        onOpenChange={(o) => {
          setDetailOpen(o)
          if (!o) {
            setDetail(null)
          }
        }}
      >
        <DialogContent>
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>Order {detail.id}</DialogTitle>
              </DialogHeader>
              <div className="text-muted-foreground space-y-1 text-sm">
                <p>Product: {detail.productName}</p>
                <p>Customer: {detail.customerName}</p>
                <p>Quantity: {detail.quantity}</p>
                <p>
                  Total:{' '}
                  {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(detail.total)}
                </p>
                <p>Created: {new Date(detail.createdAt).toLocaleString()}</p>
                <p className="pt-2">
                  Status: <OrderStatusBadge status={detail.status} />
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Tabs defaultValue="products" className="w-full">
        <TabsList>
          <TabsTrigger value="products">Product orders</TabsTrigger>
          <TabsTrigger value="services">Service orders</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product orders</CardTitle>
              {errP && <p className="text-destructive text-sm">Failed to load product orders.</p>}
            </CardHeader>
            <CardContent>
              {loadingP ? (
                <Skeleton className="h-40" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(productRows ?? []).map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="max-w-xs">
                          <div className="font-medium">#{o.id}</div>
                          <div className="text-muted-foreground text-sm">{o.productName}</div>
                        </TableCell>
                        <TableCell>{o.customerName}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(o.total)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={o.status}
                            onValueChange={async (v) => {
                              try {
                                await updateP({ id: o.id, status: v as ProductOrderStatus }).unwrap()
                                toast.success('Status updated')
                                void refetchP()
                              } catch {
                                toast.error('Update failed')
                              }
                            }}
                          >
                            <SelectTrigger className="w-[12rem]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOrderStatusOptions(true).map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <OrderStatusBadge status={o.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap items-center justify-end gap-1">
                            <RequestDeliveryButton order={o} onSent={() => void refetchP()} />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setDetail(o)
                                setDetailOpen(true)
                              }}
                            >
                              Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!(productRows && productRows.length) && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-muted-foreground py-6 text-center">
                          No product orders from the API.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Service orders</CardTitle>
              {errS && <p className="text-destructive text-sm">Failed to load service orders.</p>}
            </CardHeader>
            <CardContent>
              {loadingS ? (
                <Skeleton className="h-40" />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(serviceRows ?? []).map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>
                          <div className="font-medium">#{o.id}</div>
                          <div className="text-muted-foreground text-sm">{o.serviceName}</div>
                        </TableCell>
                        <TableCell className="capitalize">{o.packageName}</TableCell>
                        <TableCell>
                          {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(o.total)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={o.status}
                            onValueChange={async (v) => {
                              try {
                                await updateS({ id: o.id, status: v as ServiceOrderStatus }).unwrap()
                                toast.success('Status updated')
                                void refetchS()
                              } catch {
                                toast.error('Update failed')
                              }
                            }}
                          >
                            <SelectTrigger className="w-[12rem]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getOrderStatusOptions(false).map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                    {!(serviceRows && serviceRows.length) && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-muted-foreground py-6 text-center">
                          No service orders.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
