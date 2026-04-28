import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useCreateProductMutation, useGetProductQuery, useUpdateProductMutation } from '@/features/products'
import { Skeleton } from '@/shared/ui/skeleton'
import { ProductForm, type ProductFormValues } from '@/features/products/components/ProductForm'

type Props = { mode: 'create' | 'edit' }

export function ProductFormPage({ mode }: Props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading } = useGetProductQuery(id ?? '', { skip: mode === 'create' || !id })
  const [create, { isLoading: isCreating }] = useCreateProductMutation()
  const [update, { isLoading: isUpdating }] = useUpdateProductMutation()

  useEffect(() => {
    // keep any future side-effects here
  }, [data, mode])

  const isBusy = isCreating || isUpdating
  if (mode === 'edit' && (isLoading || !id)) {
    return (
      <div className="w-full space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const initialValues: Partial<ProductFormValues> | undefined =
    mode === 'edit' && data
      ? {
          name: data.name,
          category: data.category ?? '',
          price: String(data.price ?? ''),
          discount: data.discount != null ? String(data.discount) : '',
          description: data.description ?? '',
          descriptionPointsText: (data.descriptionPoints ?? []).map((s) => `• ${s}`).join('\n'),
          active: data.active ?? true,
          stock: String(data.stock ?? 0),
          existingImageUrls: data.imageUrls ?? [],
          newFiles: [],
          mainImageIndex: data.mainImageIndex ?? 0,
          highlights: data.highlights ?? [],
        }
      : undefined

  return (
    <ProductForm
      mode={mode}
      isBusy={isBusy}
      initialValues={initialValues}
      onCancel={() => navigate(-1)}
      onSubmit={async (v) => {
        const formData = v.toFormData()
        try {
          if (mode === 'create') {
            await create(formData).unwrap()
            toast.success('Product created')
            void navigate('/vendor/products')
            return
          }
          if (id) {
            await update({ id, data: formData }).unwrap()
            toast.success('Product updated')
            void navigate('/vendor/products')
          }
        } catch {
          toast.error('Save failed')
        }
      }}
    />
  )
}
