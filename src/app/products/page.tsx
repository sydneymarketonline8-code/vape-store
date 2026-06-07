import type { Metadata } from 'next'
import { ProductsClientPage } from '@/components/shop/products-client-page'

const CATEGORY_LABELS: Record<string, string> = {
  disposables: 'Disposable Vapes',
  mods: 'Pod Systems',
  'e-liquids': 'E-Liquids & Salts',
  accessories: 'Accessories',
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; sale?: string; packs?: string }>
}): Promise<Metadata> {
  const { category, brand, sale, packs } = await searchParams
  const title =
    brand ? `${brand} Vapes` :
    sale ? 'Sale & Clearance' :
    packs ? 'Bulk Vape Packs' :
    category && CATEGORY_LABELS[category] ? CATEGORY_LABELS[category] :
    'Shop All Vapes'
  return {
    title,
    description: `Shop ${title.toLowerCase()} at Aussie Vapes — fast AU-wide shipping, age-verified, and 30-day returns.`,
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; brand?: string; sale?: string; packs?: string }>
}) {
  const { category, brand, sale, packs } = await searchParams
  return (
    <ProductsClientPage
      initialCategory={category}
      initialBrand={brand}
      initialSale={sale === 'true'}
      initialPacks={packs === 'true'}
    />
  )
}
