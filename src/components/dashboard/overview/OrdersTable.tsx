import { RecentOrders } from '@/components/dashboard/RecentOrders'
import type { DashboardRecentOrder } from '@/features/api/types'

export function OrdersTable({
  orders,
  isLoading,
  className,
}: {
  orders: DashboardRecentOrder[]
  isLoading?: boolean
  className?: string
}) {
  return <RecentOrders orders={orders} isLoading={isLoading} className={className} />
}

