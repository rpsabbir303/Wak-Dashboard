import type { Delivery } from '@/shared/types/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'

export function DeliveryStatusCard({ delivery }: { delivery: Delivery }) {
  const isIntl = delivery.type === 'international'

  return (
    <Card className="rounded-xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle>Delivery status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {delivery.type ?? 'local'}
          </Badge>
          <span className="text-muted-foreground">·</span>
          <span className="font-medium capitalize">{delivery.deliveryStatus}</span>
        </div>

        {!isIntl ? (
          <>
            <div>
              <div className="text-muted-foreground">Driver</div>
              <div className="font-medium">{delivery.driverName ?? '—'}</div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="text-muted-foreground">ETA</div>
                <div className="font-medium">{delivery.etaMinutes != null ? `${delivery.etaMinutes} min` : '—'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium capitalize">{delivery.driverStatus}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div className="text-muted-foreground">Courier</div>
              <div className="font-medium">{delivery.courier ?? '—'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Tracking ID</div>
              <div className="font-medium">{delivery.trackingId ?? '—'}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-muted-foreground">Tracking status</div>
              <div className="font-medium">{delivery.trackingStatus ?? '—'}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

