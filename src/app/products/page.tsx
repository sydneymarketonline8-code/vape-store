import type { Metadata } from 'next'
import { ProductsBrowser } from '@/components/shop/products-browser'
import { parseProductsQuery, productsHeading } from '@/lib/products-params'
import { queryAllProducts } from '@/lib/products-query'

type RawParams = Record<string, string | string[] | undefined>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawParams>
}): Promise<Metadata> {
  const q = parseProductsQuery(await searchParams)
  const title = productsHeading(q)
  return {
    title,
    description: `Shop ${title.toLowerCase()} at Aussie Vape — fast AU-wide shipping, age-verified, and 30-day returns.`,
    alternates: { canonical: '/products' },
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawParams>
}) {
  const query = parseProductsQuery(await searchParams)
  const result = queryAllProducts(query)
  const heading = productsHeading(query)

  return (
    <ProductsBrowser
      query={query}
      heading={heading}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      items={result.items}
    />
  )
}
