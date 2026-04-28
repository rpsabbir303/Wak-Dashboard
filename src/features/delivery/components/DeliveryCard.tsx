import { ExternalLink } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import type { Delivery } from '@/shared/types/api'
import { badgeClassFor, labelFor, nextStatus } from '../utils/deliveryStatusUi'

export function DeliveryCard({
  delivery,
  isDriver,
  onViewDetails,
  onAccept,
  onReject,
  onStep,
  busy,
}: {
  delivery: Delivery
  isDriver: boolean
  onViewDetails: (d: Delivery) => void
  onAccept: (d: Delivery) => void
  onReject: (d: Delivery) => void
  onStep: (d: Delivery) => void
  busy?: boolean
}) {
  const canAccept = delivery.driverStatus === 'requested'
  const next = nextStatus(delivery.driverStatus)
  const canStep = Boolean(next) && delivery.driverStatus !== 'delivered'

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-base">
            Order <span className="font-mono">#{delivery.orderId}</span>
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={badgeClassFor('local', delivery.driverStatus)}>{labelFor('local', delivery.driverStatus)}</Badge>
            <Badge variant="outline">Local Delivery</Badge>
          </div>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => onViewDetails(delivery)}>
          <ExternalLink className="mr-2 size-4" />
          View details
        </Button>
      </CardHeader>

      <CardContent className="grid gap-4 text-sm">
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

        {isDriver ? (
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
            {canAccept ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  className="bg-[#895129] hover:bg-[#7b4723]"
                  disabled={busy}
                  onClick={() => onAccept(delivery)}
                >
                  Accept
                </Button>
                <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => onReject(delivery)}>
                  Reject
                </Button>
              </>
            ) : canStep ? (
              <Button type="button" variant="secondary" size="sm" disabled={busy} onClick={() => onStep(delivery)}>
                {next === 'picked_up'
                  ? 'Picked Up'
                  : next === 'in_transit'
                    ? 'Mark In Transit'
                    : next === 'delivered'
                      ? 'Mark Delivered'
                      : 'Next'}
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

