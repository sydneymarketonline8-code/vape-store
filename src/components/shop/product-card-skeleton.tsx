/** Loading placeholder matching ProductCard's footprint. */
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white">
      <div className="aspect-square rounded-t-xl bg-gray-100" />
      <div className="space-y-2 p-3">
        <div className="h-2.5 w-1/3 rounded bg-gray-100" />
        <div className="h-3.5 w-4/5 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-100" />
        <div className="h-5 w-1/3 rounded bg-gray-200" />
        <div className="h-9 w-full rounded-lg bg-gray-100" />
      </div>
    </div>
  )
}
