import { RevenueChart as BaseRevenueChart } from '@/components/dashboard/RevenueChart'
import type { RevenueChartPoint } from '@/features/api/types'

export function RevenueChart({
  weekly,
  monthly,
  mode,
  isLoading,
  className,
}: {
  weekly: RevenueChartPoint[]
  monthly: RevenueChartPoint[]
  mode?: 'product' | 'service' | 'both'
  isLoading?: boolean
  className?: string
}) {
  return <BaseRevenueChart weekly={weekly} monthly={monthly} mode={mode} isLoading={isLoading} className={className} />
}

