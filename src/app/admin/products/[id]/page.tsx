import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { products } from '@/data/products'
import { createClient } from '@/lib/supabase/server'
import { AdminProductForm, type ProductFormValues } from '@/components/admin/admin-product-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Product' }

const str = (v: unknown) => (v == null ? '' : String(v))

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Prefer the static catalogue; fall back to a Supabase row (editor-created).
  let initial: ProductFormValues | null = null
  const jsonP = products.find(p => p.id === id)
  if (jsonP) {
    initial = {
      id: jsonP.id, name: jsonP.name, slug: jsonP.slug, brand: jsonP.brand, category: jsonP.category,
      description: jsonP.description, shortDescription: jsonP.shortDescription, status: jsonP.inStock ? 'active' : 'sold_out',
      featured: jsonP.featured, tags: (jsonP.tags ?? []).join(', '),
      price: str(jsonP.price), compareAtPrice: str(jsonP.originalPrice), cost: '',
      sku: '', inventoryQty: jsonP.inStock ? '' : '0', weight: '', length: '', width: '', height: '',
      metaTitle: '', metaDescription: '', specs: [],
    }
  } else {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data: p } = await db.from('products').select('*').eq('id', id).maybeSingle()
    if (p) {
      initial = {
        id: p.id, name: p.name, slug: p.slug, brand: str(p.brand), category: p.category,
        description: str(p.description), shortDescription: str(p.short_description), status: p.status ?? 'active',
        featured: !!p.featured, tags: (p.tags ?? []).join(', '),
        price: str(p.price), compareAtPrice: str(p.original_price), cost: str(p.cost_price),
        sku: str(p.sku), inventoryQty: str(p.inventory_qty), weight: str(p.weight_lbs),
        length: str(p.length_in), width: str(p.width_in), height: str(p.height_in),
        metaTitle: str(p.meta_title), metaDescription: str(p.meta_description),
        specs: p.specs ? Object.entries(p.specs).map(([k, val]) => ({ key: k, value: String(val) })) : [],
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
