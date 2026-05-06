import { ProductGrid } from '@/components/shop/product-grid'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">All Products</h1>
        <p className="text-zinc-500">Browse our complete collection of vaping products</p>
      </div>
      <ProductGrid initialCategory={category} />
    </div>
  )
}
