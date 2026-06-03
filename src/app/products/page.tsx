import { ProductsClientPage } from '@/components/shop/products-client-page'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  return <ProductsClientPage initialCategory={category} />
}
