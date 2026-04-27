import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import type { RootState } from '@/app/store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetProfileQuery } from '@/features/api/userApi'
import { useCreateServiceMutation, useGetServiceQuery, useUpdateServiceMutation } from '@/features/api/serviceApi'
import { ServiceForm, type ServiceFormValues } from '@/components/services/ServiceForm'

type Props = { mode: 'create' | 'edit' }

function normalizeRole(v: unknown): 'vendor' | 'service' | null {
  return v === 'service' ? 'service' : v === 'vendor' ? 'vendor' : null
}

export function ServiceFormPage({ mode }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()

  const authRole = useSelector((s: RootState) => s.auth.user?.role)
  const { data: profile } = useGetProfileQuery()
  const role = useMemo(() => normalizeRole(authRole) ?? normalizeRole(profile?.role), [authRole, profile?.role])

  // service-provider-only
  if (role && role !== 'service') {
    return (
      <Alert variant="destructive">
        <AlertTitle>Access restricted</AlertTitle>
        <AlertDescription className="flex flex-wrap items-center gap-2">
          Service Management is only available for Service Provider role.
          <Button type="button" size="sm" variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const svcQ = useGetServiceQuery(id ?? '', { skip: mode === 'create' || !id })
  const [create, { isLoading: isCreating }] = useCreateServiceMutation()
  const [update, { isLoading: isUpdating }] = useUpdateServiceMutation()
  const isBusy = isCreating || isUpdating

  if (mode === 'edit' && (svcQ.isLoading || !id)) {
    return (
      <div className="w-full space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const initialValues: Partial<ServiceFormValues> | undefined =
    mode === 'edit' && svcQ.data
      ? {
          title: svcQ.data.title,
          category: svcQ.data.category ?? '',
          price: svcQ.data.price != null ? String(svcQ.data.price) : '',
          pricingType: svcQ.data.pricingType ?? 'fixed',
          deliveryTimeDays: svcQ.data.deliveryTimeDays != null ? String(svcQ.data.deliveryTimeDays) : '1',
          about: svcQ.data.about ?? svcQ.data.description ?? '',
          imagePreviewUrl: svcQ.data.imageUrl ?? '',
          services: svcQ.data.services ?? [],
          technologies: svcQ.data.technologies ?? { frontend: '', backend: '', database: '' },
          benefits: svcQ.data.benefits ?? [],
        }
      : undefined

  return (
    <ServiceForm
      mode={mode}
      isBusy={isBusy}
      initialValues={initialValues}
      onCancel={() => navigate(-1)}
      onSubmit={async (v) => {
        const formData = v.toFormData()
        try {
          if (mode === 'create') {
            await create(formData).unwrap()
            toast.success('Service created')
            void navigate('/vendor/services')
            return
          }
          if (id) {
            await update({ id, data: formData }).unwrap()
            toast.success('Service updated')
            void navigate(`/vendor/services/${id}`)
          }
        } catch {
          toast.error('Save failed')
        }
      }}
    />
  )
}

