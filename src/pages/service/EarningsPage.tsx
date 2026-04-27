import { EarningsPage as VendorEarningsPage } from '@/pages/vendor/EarningsPage'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useAppSelector } from '@/app/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export function EarningsPage() {
  const role = useAppSelector((s) => s.auth.user?.role)
  if (role === 'vendor') {
    return <VendorEarningsPage />
  }
  return <ServiceProviderEarningsPage />
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n)
}

function fmtDateTime(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

type Booking = {
  id: number
  service: string
  amount: number
  status: 'Completed' | 'Ongoing' | 'Pending'
  customerApproved: boolean
}

type Txn = {
  id: string
  type: 'Income' | 'Expense'
  title: string
  createdAt: string
  amount: number
}

function typeBadgeClass(t: Txn['type']) {
  return t === 'Income'
    ? 'bg-emerald-600 text-white border-emerald-600'
    : 'bg-red-600 text-white border-red-600'
}

function ServiceProviderEarningsPage() {
  // Static-only source (service provider).
  const bookings: Booking[] = [
    { id: 1, service: 'Web Development', amount: 250, status: 'Completed', customerApproved: true },
    { id: 2, service: 'API Integration', amount: 150, status: 'Completed', customerApproved: false },
  ]

  const connectedMethod: 'Stripe' | 'Bank' | 'Hubtel' = 'Stripe'

  const totalEarnings = useMemo(
    () =>
      bookings
        .filter((b) => b.status === 'Completed' && b.customerApproved)
        .reduce((sum, b) => sum + b.amount, 0),
    [bookings],
  )

  const pendingPayout = useMemo(
    () =>
      bookings
        .filter((b) => b.status === 'Completed' && !b.customerApproved)
        .reduce((sum, b) => sum + b.amount, 0),
    [bookings],
  )

  const [withdrawnAmount, setWithdrawnAmount] = useState(0)
  const availableBalance = Math.max(0, totalEarnings - withdrawnAmount)

  const [amount, setAmount] = useState('')
  const [txnSearch, setTxnSearch] = useState('')

  const minWithdraw = 50
  const amountNumber = useMemo(() => Number(amount), [amount])
  const canWithdraw =
    Number.isFinite(amountNumber) &&
    amountNumber >= minWithdraw &&
    amountNumber > 0 &&
    amountNumber <= availableBalance

  const baseIncomeTxns = useMemo<Txn[]>(
    () =>
      bookings
        .filter((b) => b.status === 'Completed' && b.customerApproved)
        .map((b) => ({
          id: `INC-${b.id}`,
          type: 'Income' as const,
          title: `Service payout approved · ${b.service}`,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * b.id).toISOString(),
          amount: b.amount,
        }))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [bookings],
  )

  const [withdrawTxns, setWithdrawTxns] = useState<Txn[]>([])

  const transactions = useMemo(() => {
    const all = [...withdrawTxns, ...baseIncomeTxns]
    const q = txnSearch.trim().toLowerCase()
    if (!q) return all
    return all.filter((t) => t.id.toLowerCase().includes(q))
  }, [baseIncomeTxns, txnSearch, withdrawTxns])

  function withdraw() {
    if (!amount.trim()) {
      toast.error('Enter an amount')
      return
    }
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) {
      toast.error('Enter a valid amount')
      return
    }
    if (amountNumber < minWithdraw) {
      toast.error(`Minimum withdraw: ${fmtMoney(minWithdraw)}`)
      return
    }
    if (amountNumber > availableBalance) {
      toast.error('Cannot exceed available balance')
      return
    }

    setWithdrawnAmount((p) => p + amountNumber)
    setWithdrawTxns((prev) => [
      {
        id: `WDR-${Date.now()}`,
        type: 'Expense',
        title: 'Withdrawal processed',
        createdAt: new Date().toISOString(),
        amount: amountNumber,
      },
      ...prev,
    ])

    toast.success('Withdrawal processed')
    setAmount('')
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Earnings &amp; Payouts</h1>
        <p className="text-muted-foreground text-sm">Track your earnings, available balance, and payout activity.</p>
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        Service provider earnings are counted only after customer approval.
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{fmtMoney(totalEarnings)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Approved completed bookings only</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{fmtMoney(availableBalance)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Ready to withdraw</div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pending Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">{fmtMoney(pendingPayout)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Completed but not yet approved</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Input
              value={txnSearch}
              onChange={(e) => setTxnSearch(e.target.value)}
              placeholder="Search Transaction ID"
              className="bg-white border border-gray-200 rounded-xl shadow-sm sm:max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">S.N</TableHead>
                <TableHead className="w-[110px]">Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[190px]">Date &amp; Time</TableHead>
                <TableHead className="w-[160px]">Transaction ID</TableHead>
                <TableHead className="w-[120px] text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length ? (
                transactions.map((t, idx) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>
                      <Badge className={typeBadgeClass(t.type)}>{t.type}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{t.title}</TableCell>
                    <TableCell className="text-muted-foreground">{fmtDateTime(t.createdAt)}</TableCell>
                    <TableCell className="font-mono text-xs">{t.id}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{fmtMoney(t.amount)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-900">Amount</div>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="Enter amount"
                className="bg-white border border-gray-200 rounded-xl shadow-sm"
              />
              <div className="text-xs text-muted-foreground">Minimum withdraw: $50</div>
            </div>

            <Button
              type="button"
              className="bg-[#895129] hover:bg-[#7b4723]"
              disabled={!canWithdraw}
              onClick={withdraw}
            >
              Withdraw Funds
            </Button>

            <div className="text-xs text-muted-foreground">
              Available: <span className="font-semibold">{fmtMoney(availableBalance)}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-gray-200 shadow-sm bg-white p-4">
              <div className="text-xs text-muted-foreground">Connected method</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">{connectedMethod}</div>
            </div>

            <Button type="button" variant="outline">
              Change Method
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

