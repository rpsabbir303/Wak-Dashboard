import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardPage() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Service Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your bookings, services, and earnings.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">0</CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Month</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">$0</CardContent>
        </Card>
        <Card className="rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Rating</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">—</CardContent>
        </Card>
      </div>
    </div>
  )
}

