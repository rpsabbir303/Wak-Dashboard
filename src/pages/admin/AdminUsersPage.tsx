import { useMemo } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useGetUsersQuery, useUpdateUserStatusMutation } from '@/features/api/adminApi'

export function AdminUsersPage() {
  const q = useGetUsersQuery()
  const [update] = useUpdateUserStatusMutation()

  const rows = useMemo(() => (q.data ?? []).slice().sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1)), [q.data])

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Users</h1>
        <p className="text-muted-foreground text-sm">Approve vendors/providers and suspend accounts.</p>
      </div>

      <Card className="rounded-xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>All users</CardTitle>
        </CardHeader>
        <CardContent>
          {q.isLoading ? (
            <Skeleton className="h-40" />
          ) : q.isError ? (
            <p className="text-destructive text-sm">Failed to load users.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell>
                      <Select
                        value={u.status}
                        onValueChange={async (v) => {
                          try {
                            await update({ id: u.id, status: v as any }).unwrap()
                            toast.success('Updated')
                          } catch {
                            toast.error('Update failed')
                          }
                        }}
                      >
                        <SelectTrigger className="w-[12rem]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending_approval">Pending approval</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {!rows.length ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground py-6 text-center">
                      No users.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

