export function AdminPlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">This module is wired in routing; next step is connecting it to `adminApi` and tables.</p>
    </div>
  )
}

