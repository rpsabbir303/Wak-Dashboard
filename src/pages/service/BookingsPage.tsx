import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BookingsPage() {
  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-muted-foreground text-sm">Track incoming and active bookings.</p>
      </div>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent bookings</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Coming soon.</CardContent>
      </Card>
    </div>
  )
}

