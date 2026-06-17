import Link from 'next/link'
import Image from 'next/image'
import { products as allProducts } from '@/data/products'
import { formatPrice } from '@/lib/utils'
import { SEARCH_CATEGORIES } from '@/lib/search'
import { Plus, Search, Pencil, Info } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Products' }

const PAGE_SIZE = 20

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>
}) {
  const { q = '', category = '', page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const ql = q.trim().toLowerCase()

  let list = allProducts
  if (category) list = list.filter(p => p.category === category)
  if (ql) list = list.filter(p => p.name.toLowerCase().includes(ql) || p.id.toLowerCase().includes(ql) || p.brand.toLowerCase().includes(ql))

  const total = list.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const pageItems = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const buildHref = (next: Record<string, string | number>) => {
    const sp = new URLSearchParams()
    const merged = { q, category, page, ...next }
    if (merged.q) sp.set('q', String(merged.q))
    if (merged.category) sp.set('category', String(merged.category))
    if (Number(merged.page) > 1) sp.set('page', String(merged.page))
    return `/admin/products${sp.toString() ? `?${sp}` : ''}`
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        <Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Products are served from the static catalogue ({allProducts.length} items). The editor saves to Supabase
        and won’t change the live storefront until the catalogue is migrated to the database.
      </div>

      {/* Search + category */}
      <form className="mb-4 flex flex-wrap gap-2" action="/admin/products">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input name="q" defaultValue={q} placeholder="Search name, SKU or brand…"
            className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none" />
        </div>
        <select name="category" defaultValue={category} aria-label="Filter by category"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none">
          <option value="">All categories</option>
          {SEARCH_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
        <button type="submit" className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">Filter</button>
      </form>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr><th className="px-4 py-3 font-medium">Image</th><th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">SKU</th><th className="px-4 py-3 font-medium">Category</th><th className="px-4 py-3 font-medium">Price</th><th className="px-4 py-3 font-medium">Inventory</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 text-right font-medium">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {pageItems.map(p => (
                <tr key={p.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded border border-neutral-100 bg-neutral-50">
                      <Image src={p.image} alt="" fill sizes="40px" className="object-contain p-0.5" unoptimized />
                    </div>
                  </td>
                  <td className="max-w-xs px-4 py-2"><p className="line-clamp-1 text-neutral-900">{p.name}</p></td>
                  <td className="px-4 py-2 font-mono text-xs text-neutral-500">{p.id}</td>
                  <td className="px-4 py-2 capitalize text-neutral-600">{p.category}</td>
                  <td className="px-4 py-2 font-medium text-neutral-900">{formatPrice(p.price)}</td>
                  <td className="px-4 py-2 text-neutral-600">{p.inStock ? 'In stock' : '0'}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${p.inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {p.inStock ? 'active' : 'sold out'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/admin/products/${p.id}`} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-neutral-500">
        <span>{total} products</span>
        <div className="flex gap-2">
          {page > 1 && <Link href={buildHref({ page: page - 1 })} className="rounded-lg border border-neutral-200 px-3 py-1.5 hover:border-neutral-300">Previous</Link>}
          <span className="px-2 py-1.5">Page {page} of {totalPages}</span>
          {page < totalPages && <Link href={buildHref({ page: page + 1 })} className="rounded-lg border border-neutral-200 px-3 py-1.5 hover:border-neutral-300">Next</Link>}
        </div>
      </div>
    </div>
  )
}
