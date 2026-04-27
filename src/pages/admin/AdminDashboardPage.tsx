import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of platform health, growth, and operations.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {['Revenue', 'Orders', 'Users', 'Active deliveries'].map((t) => (
          <Card key={t} className="rounded-xl border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">{t}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tabular-nums">—</div>
              <div className="text-muted-foreground text-xs">Wire to admin analytics API</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

