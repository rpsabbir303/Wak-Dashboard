import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { Delivery } from '@/shared/types/api'
import { badgeClassFor, labelFor } from '../utils/deliveryStatusUi'
import { DeliveryTimeline } from './DeliveryTimeline'
import { LiveTrackingMap } from './LiveTrackingMap'

export function DeliveryDetailsModal({
  open,
  onOpenChange,
  delivery,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  delivery: Delivery | null
}) {
  if (!delivery) return null

  const isIntl = delivery.type === 'international'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Delivery details</DialogTitle>
          <DialogDescription>
            Order <span className="font-medium">#{delivery.orderId}</span> ·{' '}
            <span className="capitalize">{delivery.type ?? 'local'}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={badgeClassFor(delivery.type, delivery.deliveryStatus)}>
                  {labelFor(delivery.type, delivery.deliveryStatus)}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {delivery.type ?? 'local'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-muted-foreground">Pickup</div>
                  <div className="font-medium whitespace-pre-wrap break-words">{delivery.pickupLocation}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Drop</div>
                  <div className="font-medium whitespace-pre-wrap break-words">{delivery.dropLocation}</div>
                </div>
              </div>

              {!isIntl ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-muted-foreground">Driver</div>
                    <div className="font-medium">{delivery.driverName ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">ETA</div>
                    <div className="font-medium">{delivery.etaMinutes != null ? `${delivery.etaMinutes} min` : '—'}</div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <div className="text-muted-foreground">Courier</div>
                    <div className="font-medium">{delivery.courier ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Tracking ID</div>
                    <div className="font-medium font-mono text-xs">{delivery.trackingId ?? '—'}</div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="text-muted-foreground">Tracking status</div>
                    <div className="font-medium">{delivery.trackingStatus ?? labelFor(delivery.type, delivery.deliveryStatus)}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <DeliveryTimeline delivery={delivery} />
            </CardContent>
          </Card>

          {!isIntl ? (
            <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Live Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <LiveTrackingMap
                  pickupText={delivery.pickupLocation}
                  dropText={delivery.dropLocation}
                  driverText={delivery.driverName ?? ''}
                />
              </CardContent>
            </Card>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

