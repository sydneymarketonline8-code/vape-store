import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { products, getProductBySlug, getProductsByCategory } from '@/data/products'
import { createServiceClient } from '@/lib/supabase/server'
import { buildProductDescription } from '@/lib/product-copy'
import { productImages } from '@/lib/product-image'
import { flavourRange, crossBrandFlavours } from '@/lib/flavours'
import { FlavourRange } from '@/components/shop/flavour-range'
import { ProductGallery } from '@/components/shop/product-gallery'
import { ProductInfo } from '@/components/shop/product-info'
import { ProductTabs } from '@/components/shop/product-tabs'
import { ProductCard } from '@/components/shop/product-card'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'

const CATEGORY_LABELS: Record<string, string> = {
  disposables: 'Disposable Vapes',
  mods: 'Pod Systems & Kits',
  'e-liquids': 'E-Liquids & Salts',
  pouches: 'Nicotine Pouches',
  accessories: 'Accessories',
}

// ISR: revalidate hourly. Featured products are pre-rendered at build; the rest
// of the ~2k catalogue is generated on-demand and cached (dynamicParams = true).
export const revalidate = 3600

export function generateStaticParams() {
  return products
    .filter(p => p.featured)
    .slice(0, 50)
    .map(p => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }

  // Unique, deals-angled metadata that doesn't duplicate the sibling site's
  // scraped product copy (differentiation vs aussievapes.com.au). Distinct title
  // structure ("…— Buy Online Australia") + price/bundle-led description.
  const price = `$${product.price.toFixed(2)}`
  const title = `${product.name} — Buy Online Australia | Aussie Vape`
  const description = `Buy ${product.name} online at Aussie Vape — ${price}, with fast AU-wide shipping and multi-pack deals. Age-verified (18+).`
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/products/${slug}`,
      images: productImages(product),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  // Use ONLY real, approved customer reviews for the rating — never the scraped
  // placeholder numbers in the catalogue JSON (fabricated aggregateRating risks a
  // Google structured-data manual action). Service client = cookie-free, so the
  // page stays statically rendered. 0 reviews → no rating shown, no schema rating.
  let rating = 0
  let reviewCount = 0
  type ReviewRow = { reviewer_name: string; rating: number; title: string | null; body: string; created_at: string }
  let reviewRows: ReviewRow[] = []
  // Real admin-entered specs (DB) override the derived ones — see buildProductSpecs.
  let dbSpecs: Record<string, string> | null = null
  try {
    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data: rows } = await db
      .from('reviews')
      .select('reviewer_name, rating, title, body, created_at')
      .eq('product_id', product.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    reviewRows = (rows ?? []) as ReviewRow[]
    reviewCount = reviewRows.length
    rating = reviewCount ? Math.round((reviewRows.reduce((s, r) => s + r.rating, 0) / reviewCount) * 10) / 10 : 0

    const { data: prow } = await db.from('products').select('specs').eq('id', product.id).maybeSingle()
    if (prow?.specs && typeof prow.specs === 'object' && Object.keys(prow.specs).length) {
      dbSpecs = prow.specs as Record<string, string>
    }
  } catch {
    rating = 0
    reviewCount = 0
  }

  // Overlay real DB specs onto the JSON product (don't mutate the shared array).
  const displayProduct = dbSpecs ? { ...product, specs: dbSpecs } : product

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: categoryLabel, href: `/collections/${product.category}` },
    { name: product.name, href: `/products/${slug}` },
  ]

  // Sibling flavour SKUs (same brand + puff range) — the data-true "flavour range".
  const range = flavourRange(product)
  // Same flavour from other brands (keyword-matched).
  const crossBrand = crossBrandFlavours(product)

  // Related: same category, deterministic pseudo-shuffle (SSG-safe), 4 items.
  const related = getProductsByCategory(product.category)
    .filter(p => p.id !== product.id)
    .sort((a, b) => ((Number(a.id) * 7 + 13) % 97) - ((Number(b.id) * 7 + 13) % 97))
    .slice(0, 4)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku ?? product.id,
    image: productImages(product),
    description: buildProductDescription(product),
    brand: { '@type': 'Brand', name: product.brand },
    // Only emitted with REAL approved reviews — never fabricated rating/review markup.
    ...(reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
      review: reviewRows.slice(0, 10).map(r => ({
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        author: { '@type': 'Person', name: r.reviewer_name },
        datePublished: r.created_at,
        ...(r.title ? { name: r.title } : {}),
        reviewBody: r.body,
      })),
    }),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'AUD',
      price: product.price.toFixed(2),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/products/${slug}`,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.href}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="mx-auto max-w-7xl px-4 py-8 pb-24 sm:px-6 lg:px-8 lg:pb-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery product={product} />
          <ProductInfo product={product} rating={rating} reviewCount={reviewCount} breadcrumbs={breadcrumbs} />
        </div>

        <ProductTabs product={displayProduct} rating={rating} reviewCount={reviewCount} />

        {range && <FlavourRange rangeName={range.rangeName} currentLabel={range.currentLabel} siblings={range.siblings} />}

        {crossBrand && (
          <section className="mt-14" aria-label="You might also like">
            <h2 className="mb-5 text-xl font-bold text-gray-900">{crossBrand.label}</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {crossBrand.items.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-gray-900">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
