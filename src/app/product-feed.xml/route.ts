import { products } from '@/data/products'
import { productImage } from '@/lib/product-image'
import { buildProductDescription } from '@/lib/product-copy'
import { SITE_URL } from '@/lib/site'

// Regenerate at most hourly.
export const revalidate = 3600

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Google Merchant Center–format product feed (RSS 2.0 + g: namespace). Reusable
 * for Merchant Center, Bing Shopping and Meta catalogs. Note: vaping/nicotine
 * products are restricted on most ad platforms, and image_link must resolve to a
 * real photo (placeholder SVGs will be rejected) — see IMAGE_OVERRIDES.
 */
export async function GET() {
  const items = products
    .map(p => {
      const url = `${SITE_URL}/products/${p.slug}`
      const img = productImage(p)
      const imageLink = img.startsWith('http') ? img : `${SITE_URL}${img}`
      const availability = p.inStock ? 'in_stock' : 'out_of_stock'
      const regular = (p.originalPrice ?? p.price).toFixed(2)
      const onSale = p.originalPrice != null
      const shipPrice = p.price >= 300 ? '0.00' : '15.00'
      const description = buildProductDescription(p).slice(0, 4999)

      return `    <item>
      <g:id>${esc(p.sku ?? p.id)}</g:id>
      <title>${esc(p.name)}</title>
      <description>${esc(description)}</description>
      <link>${esc(url)}</link>
      <g:image_link>${esc(imageLink)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:price>${regular} AUD</g:price>${onSale ? `\n      <g:sale_price>${p.price.toFixed(2)} AUD</g:sale_price>` : ''}
      <g:brand>${esc(p.brand)}</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:adult>yes</g:adult>
      <g:product_type>${esc(p.category)}</g:product_type>
      <g:shipping>
        <g:country>AU</g:country>
        <g:service>Standard</g:service>
        <g:price>${shipPrice} AUD</g:price>
      </g:shipping>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Aussie Vape</title>
    <link>${SITE_URL}</link>
    <description>Aussie Vape product feed</description>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
