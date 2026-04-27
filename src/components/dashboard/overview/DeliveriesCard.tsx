import { ActiveDeliveries } from '@/components/dashboard/ActiveDeliveries'
import type { DashboardActiveDelivery } from '@/features/api/types'

export function DeliveriesCard({
  items,
  isLoading,
  className,
}: {
  items: DashboardActiveDelivery[]
  isLoading?: boolean
  className?: string
}) {
  return <ActiveDeliveries items={items} isLoading={isLoading} className={className} />
}

