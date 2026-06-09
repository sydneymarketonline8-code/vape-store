import type { Metadata } from 'next'
import { ProductsClientPage } from '@/components/shop/products-client-page'

const CATEGORY_LABELS: Record<string, string> = {
  disposables: 'Disposable Vapes',
  mods: 'Pod Systems & Kits',
  'e-liquids': 'E-Liquids & Salts',
  pouches: 'Nicotine Pouches',
  accessories: 'Accessories',
}

const TAG_LABELS: Record<string, string> = {
  'nicotine-free': 'Nicotine-Free Vapes',
  'lower-nicotine': 'Lower Nicotine Vapes',
}

type ProductsSearchParams = {
  category?: string
  brand?: string
  tag?: string
  sale?: string
  packs?: string
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>
}): Promise<Metadata> {
  const { category, brand, tag, sale, packs } = await searchParams
  const title =
    brand ? `${brand} Vapes` :
    sale ? 'Sale & Clearance' :
    packs ? 'Bulk Vape Packs' :
    tag && TAG_LABELS[tag] ? TAG_LABELS[tag] :
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
  searchParams: Promise<ProductsSearchParams>
}) {
  const { category, brand, tag, sale, packs } = await searchParams
  return (
    <ProductsClientPage
      initialCategory={category}
      initialBrand={brand}
      initialTag={tag}
      initialSale={sale === 'true'}
      initialPacks={packs === 'true'}
    />
  )
}
