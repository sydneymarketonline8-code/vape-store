import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { products, getProductBySlug, getProductsByCategory } from '@/data/products'
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

  const description = product.shortDescription || product.description.slice(0, 155)
  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: product.name,
      description,
      type: 'website',
      url: `${SITE_URL}/products/${slug}`,
      images: [product.image],
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

  const rating = product.rating
  const reviewCount = product.reviewCount
  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: categoryLabel, href: `/collections/${product.category}` },
    { name: product.name, href: `/products/${slug}` },
  ]

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
    image: product.images?.length ? product.images : [product.image],
    description: product.shortDescription || product.description.slice(0, 200),
    brand: { '@type': 'Brand', name: product.brand },
    ...(reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount,
      },
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <ProductGallery product={product} />
          <ProductInfo product={product} rating={rating} reviewCount={reviewCount} breadcrumbs={breadcrumbs} />
        </div>

        <ProductTabs product={product} rating={rating} reviewCount={reviewCount} />

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
