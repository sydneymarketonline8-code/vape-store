'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, Plus, Trash2, Info } from 'lucide-react'
import { SEARCH_CATEGORIES } from '@/lib/search'

export interface ProductFormValues {
  id?: string
  name: string
  slug: string
  brand: string
  category: string
  description: string
  shortDescription: string
  status: string
  featured: boolean
  tags: string
  price: string
  compareAtPrice: string
  cost: string
  sku: string
  inventoryQty: string
  weight: string
  length: string
  width: string
  height: string
  metaTitle: string
  metaDescription: string
  specs: { key: string; value: string }[]
}

const TABS = ['General', 'Pricing', 'Inventory', 'Specs', 'SEO'] as const
type Tab = typeof TABS[number]

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export function AdminProductForm({ initial, isNew }: { initial: ProductFormValues; isNew: boolean }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('General')
  const [v, setV] = useState<ProductFormValues>(initial)
  const [slugEdited, setSlugEdited] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setV(prev => ({ ...prev, [key]: value }))
  }
  function onName(name: string) {
    setV(prev => ({ ...prev, name, slug: slugEdited ? prev.slug : slugify(name) }))
  }

  async function save(publish: boolean) {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...v,
          status: publish ? 'active' : v.status,
          specs: Object.fromEntries(v.specs.filter(s => s.key).map(s => [s.key, s.value])),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) { setError(data.error ?? 'Save failed.'); return }
      setSaved(true)
      if (isNew && data.product?.id) router.push(`/admin/products/${data.product.id}`)
      else router.refresh()
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Network error.')
    } finally {
      setSaving(false)
    }
  }

  const input = 'w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary focus:outline-none'
  const label = 'mb-1 block text-sm font-medium text-neutral-700'

  return (
    <div>
      <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-800">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Saving writes to Supabase. The storefront reads the static catalogue, so changes won’t show live until products
        are migrated. Image &amp; variant editing are not built yet.
      </div>

      <div className="mb-5 flex flex-wrap gap-1 border-b border-neutral-200">
        {TABS.map(t => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium ${tab === t ? 'border-b-2 border-primary text-primary' : 'text-neutral-500 hover:text-neutral-900'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-2xl space-y-4">
        {tab === 'General' && (
          <>
            <div><label className={label}>Name</label><input className={input} value={v.name} onChange={e => onName(e.target.value)} /></div>
            <div><label className={label}>Slug</label><input className={input} value={v.slug} onChange={e => { setSlugEdited(true); set('slug', e.target.value) }} /></div>
            <div><label className={label}>Brand</label><input className={input} value={v.brand} onChange={e => set('brand', e.target.value)} /></div>
            <div><label className={label}>Description</label><textarea rows={5} className={input} value={v.description} onChange={e => set('description', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={label}>Category</label>
                <select className={input} value={v.category} onChange={e => set('category', e.target.value)}>
                  {SEARCH_CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={label}>Status</label>
                <select className={input} value={v.status} onChange={e => set('status', e.target.value)}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="pre_order">Pre-order</option>
                  <option value="sold_out">Sold out</option>
                </select>
              </div>
            </div>
            <div><label className={label}>Tags (comma separated)</label><input className={input} value={v.tags} onChange={e => set('tags', e.target.value)} /></div>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" checked={v.featured} onChange={e => set('featured', e.target.checked)} className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary" />
              Featured product
            </label>
          </>
        )}

        {tab === 'Pricing' && (
          <div className="grid grid-cols-2 gap-4">
            <div><label className={label}>Price</label><input type="number" step="0.01" className={input} value={v.price} onChange={e => set('price', e.target.value)} /></div>
            <div><label className={label}>Compare-at price</label><input type="number" step="0.01" className={input} value={v.compareAtPrice} onChange={e => set('compareAtPrice', e.target.value)} /></div>
            <div><label className={label}>Cost</label><input type="number" step="0.01" className={input} value={v.cost} onChange={e => set('cost', e.target.value)} /></div>
          </div>
        )}

        {tab === 'Inventory' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={label}>SKU</label><input className={input} value={v.sku} onChange={e => set('sku', e.target.value)} /></div>
              <div><label className={label}>Inventory qty</label><input type="number" className={input} value={v.inventoryQty} onChange={e => set('inventoryQty', e.target.value)} /></div>
            </div>
            <div><label className={label}>Weight (kg)</label><input type="number" step="0.01" className={input} value={v.weight} onChange={e => set('weight', e.target.value)} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className={label}>Length</label><input type="number" step="0.1" className={input} value={v.length} onChange={e => set('length', e.target.value)} /></div>
              <div><label className={label}>Width</label><input type="number" step="0.1" className={input} value={v.width} onChange={e => set('width', e.target.value)} /></div>
              <div><label className={label}>Height</label><input type="number" step="0.1" className={input} value={v.height} onChange={e => set('height', e.target.value)} /></div>
            </div>
          </>
        )}

        {tab === 'Specs' && (
          <div className="space-y-2">
            {v.specs.map((row, i) => (
              <div key={i} className="flex gap-2">
                <input className={input} placeholder="Key (e.g. Puffs)" value={row.key} onChange={e => set('specs', v.specs.map((s, j) => j === i ? { ...s, key: e.target.value } : s))} />
                <input className={input} placeholder="Value (e.g. 16000)" value={row.value} onChange={e => set('specs', v.specs.map((s, j) => j === i ? { ...s, value: e.target.value } : s))} />
                <button type="button" aria-label="Remove spec" onClick={() => set('specs', v.specs.filter((_, j) => j !== i))} className="rounded-lg border border-neutral-200 px-2 text-neutral-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => set('specs', [...v.specs, { key: '', value: '' }])} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              <Plus className="h-4 w-4" /> Add spec
            </button>
          </div>
        )}

        {tab === 'SEO' && (
          <>
            <div><label className={label}>Meta title</label><input className={input} value={v.metaTitle} onChange={e => set('metaTitle', e.target.value)} /></div>
            <div><label className={label}>Meta description</label><textarea rows={3} className={input} value={v.metaDescription} onChange={e => set('metaDescription', e.target.value)} /></div>
            <div className="rounded-lg border border-neutral-200 p-4">
              <p className="text-xs text-neutral-400">Search preview</p>
              <p className="mt-1 line-clamp-1 text-base text-blue-700">{v.metaTitle || v.name || 'Product title'}</p>
              <p className="text-xs text-green-700">aussievape.com.au › products › {v.slug || 'slug'}</p>
              <p className="line-clamp-2 text-sm text-neutral-600">{v.metaDescription || v.shortDescription || v.description}</p>
            </div>
          </>
        )}
      </div>

      {error && <p className="mt-4 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 flex gap-3">
        <button type="button" onClick={() => save(false)} disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:border-neutral-400 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
          Save
        </button>
        <button type="button" onClick={() => save(true)} disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60">
          Publish
        </button>
      </div>
    </div>
  )
}
