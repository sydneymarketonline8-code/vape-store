import type { Metadata } from 'next'
import Link from 'next/link'
import { products } from '@/data/products'

export const metadata: Metadata = {
  title: 'Shop by Brand',
  description: 'Browse all vape brands stocked at Aussie Vapes — IGET, HQD, Gunnpod, Alfakher, Lost Mary and many more.',
}

function getBrands() {
  const counts = new Map<string, number>()
  for (const p of products) {
    if (p.brand === 'OTHER') continue
    counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => a.brand.localeCompare(b.brand))
}

export default function BrandsPage() {
  const brands = getBrands()
  return (
    <div>
      <div className="border-b border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Shop by Brand</h1>
          <p className="mt-1 text-sm text-gray-500">{brands.length} brands available</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map(({ brand, count }) => (
            <Link
              key={brand}
              href={`/products?brand=${encodeURIComponent(brand)}`}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-all hover:border-[#1B7A3E] hover:shadow-sm"
            >
              <span className="text-sm font-semibold uppercase tracking-wide text-gray-800">{brand}</span>
              <span className="text-xs text-gray-400">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
