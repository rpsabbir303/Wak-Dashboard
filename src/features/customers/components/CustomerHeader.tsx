import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import type { CustomerDetails, CustomerTag } from '@/shared/types/api'
import { ArrowLeft } from 'lucide-react'

function initials(name: string) {
  const parts = name.split(' ').filter(Boolean)
  const a = parts[0]?.[0] ?? 'C'
  const b = parts[1]?.[0] ?? ''
  return `${a}${b}`.toUpperCase()
}

function tagLabel(t: CustomerTag) {
  if (t === 'premium') return 'Premium'
  if (t === 'vip') return 'VIP'
  return 'Repeat Buyer'
}

function tagClass(t: CustomerTag) {
  if (t === 'vip') return 'bg-[#895129] text-white border-[#895129]'
  if (t === 'premium') return 'bg-[#895129] text-white border-[#895129]'
  return 'bg-emerald-600 text-white border-emerald-600'
}

export function CustomerHeader({
  customer,
  onBack,
}: {
  customer: CustomerDetails
  onBack: () => void
}) {
  return (
    <Card className="rounded-xl border-border/60 bg-card/50 shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="size-12 ring-1 ring-border">
            <AvatarImage src={customer.avatarUrl} alt={customer.name} />
            <AvatarFallback className="text-sm font-semibold">{initials(customer.name)}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-xl font-semibold tracking-tight truncate">{customer.name}</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(customer.tags ?? []).map((t) => (
                  <Badge key={t} className={tagClass(t)}>
                    {tagLabel(t)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-muted-foreground text-sm">
              <span className="font-medium text-foreground">Email:</span> {customer.email ?? '—'}{' '}
              <span className="mx-2 text-border">•</span>
              <span className="font-medium text-foreground">Phone:</span> {customer.phone ?? '—'}{' '}
              <span className="mx-2 text-border">•</span>
              <span className="font-medium text-foreground">Country:</span> {customer.country ?? '—'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 size-4" />
            Back
          </Button>
        </div>
      </div>
    </Card>
  )
}

