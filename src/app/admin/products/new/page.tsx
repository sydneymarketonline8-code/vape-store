import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AdminProductForm, type ProductFormValues } from '@/components/admin/admin-product-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Product' }

const EMPTY: ProductFormValues = {
  name: '', slug: '', brand: '', category: 'disposables', description: '', shortDescription: '',
  status: 'draft', featured: false, tags: '', price: '', compareAtPrice: '', cost: '',
  sku: '', inventoryQty: '', weight: '', length: '', width: '', height: '',
  metaTitle: '', metaDescription: '', specs: [],
}

export default function AdminNewProductPage() {
  return (
    <div>
      <Link href="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to Products
      </Link>
      <h1 className="mb-5 text-2xl font-bold text-neutral-900">New Product</h1>
      <AdminProductForm initial={EMPTY} isNew />
    </div>
  )
}
