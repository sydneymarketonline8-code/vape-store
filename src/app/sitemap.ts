import type { MetadataRoute } from 'next'
import { products } from '@/data/products'
import { COLLECTIONS } from '@/lib/collections'
import { brandCategoryParams } from '@/lib/collections-query'
import { createServiceClient } from '@/lib/supabase/server'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'

// Public, indexable routes only (admin/account/checkout/search are excluded).
const STATIC_PATHS = [
  '', '/products', '/categories', '/deals', '/about', '/affiliate', '/where-to-buy', '/brands',
  '/blog', '/faq', '/shipping', '/returns', '/contact', '/wholesale',
  '/beginners-guide', '/vaping-laws', '/order-tracking', '/login', '/register',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map(p => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: p === '' ? 'daily' : 'weekly',
    priority: p === '' ? 1 : 0.6,
  }))

  const collectionEntries: MetadataRoute.Sitemap = COLLECTIONS.map(c => ({
    url: `${SITE}/collections/${c.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Tier-2 brand cluster pages (brand × category, ≥5 products).
  const brandClusterEntries: MetadataRoute.Sitemap = brandCategoryParams(5).map(({ slug, brand }) => ({
    url: `${SITE}/collections/${slug}/${brand}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const productEntries: MetadataRoute.Sitemap = products.map(p => ({
    url: `${SITE}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Published blog posts (best-effort — empty if the table/DB isn't reachable).
  let blogEntries: MetadataRoute.Sitemap = []
  try {
    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .not('published_at', 'is', null)
      .lte('published_at', now.toISOString())
    blogEntries = ((data ?? []) as { slug: string; updated_at: string | null }[]).map(b => ({
      url: `${SITE}/blog/${b.slug}`,
      lastModified: b.updated_at ? new Date(b.updated_at) : now,
      changeFrequency: 'monthly',
      priority: 0.5,
    }))
  } catch {
    blogEntries = []
  }

  return [...staticEntries, ...collectionEntries, ...brandClusterEntries, ...blogEntries, ...productEntries]
}
