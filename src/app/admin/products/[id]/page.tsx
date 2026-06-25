import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { products } from '@/data/products'
import { createClient } from '@/lib/supabase/server'
import { AdminProductForm, type ProductFormValues } from '@/components/admin/admin-product-form'
import type { Database } from '@/lib/supabase/database.types'
import type { Metadata } from 'next'

type ProductRow = Database['public']['Tables']['products']['Row']

export const metadata: Metadata = { title: 'Edit Product' }

const str = (v: unknown) => (v == null ? '' : String(v))

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Prefer the Supabase row (source of truth now that products are seeded);
  // fall back to the static catalogue if a row somehow isn't in the DB.
  let initial: ProductFormValues | null = null
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
  const p = data as ProductRow | null
  if (p) {
    const specs =
      p.specs && typeof p.specs === 'object' && !Array.isArray(p.specs)
        ? Object.entries(p.specs as Record<string, unknown>).map(([k, val]) => ({ key: k, value: String(val) }))
        : []
    initial = {
      id: p.id, name: p.name, slug: p.slug, brand: str(p.brand), category: p.category,
      description: str(p.description), shortDescription: str(p.short_description), status: p.status ?? 'active',
      featured: !!p.featured, tags: (p.tags ?? []).join(', '),
      price: str(p.price), compareAtPrice: str(p.original_price), cost: str(p.cost_price),
      sku: str(p.sku), inventoryQty: str(p.inventory_qty), weight: str(p.weight_lbs),
      length: str(p.length_in), width: str(p.width_in), height: str(p.height_in),
      metaTitle: str(p.meta_title), metaDescription: str(p.meta_description),
      specs,
    }
  } else {
    const jsonP = products.find(pr => pr.id === id)
    if (jsonP) {
      initial = {
        id: jsonP.id, name: jsonP.name, slug: jsonP.slug, brand: jsonP.brand, category: jsonP.category,
        description: jsonP.description, shortDescription: jsonP.shortDescription, status: jsonP.inStock ? 'active' : 'sold_out',
        featured: jsonP.featured, tags: (jsonP.tags ?? []).join(', '),
        price: str(jsonP.price), compareAtPrice: str(jsonP.originalPrice), cost: '',
        sku: '', inventoryQty: jsonP.inStock ? '' : '0', weight: '', length: '', width: '', height: '',
        metaTitle: '', metaDescription: '', specs: [],
      }
    }
  }

  if (!initial) notFound()

  return (
    <div>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to Products
      </Link>
      <h1 className="mb-5 text-2xl font-bold text-neutral-900">{initial.name}</h1>
      <AdminProductForm initial={initial} isNew={false} />
    </div>
  )
}
