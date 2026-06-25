import { ProductCardSkeleton } from '@/components/shop/product-card-skeleton'

export default function Loading() {
  return (
    <div>
      <div className="h-40 w-full animate-pulse bg-gradient-to-br from-emerald-600 to-green-800" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          <div className="hidden h-96 animate-pulse rounded-xl bg-gray-100 lg:block" />
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
