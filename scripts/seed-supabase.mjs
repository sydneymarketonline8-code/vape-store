/**
 * Seed products from the generated JSON into Supabase.
 *
 * Usage:
 *   1. Create .env.local with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *   2. node scripts/seed-supabase.mjs
 *
 * Uses the service role key so it bypasses RLS.
 * Safe to re-run — upserts on product id.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load env from .env.local manually (no dotenv dependency needed)
try {
  const env = readFileSync('.env.local', 'utf-8')
  for (const line of env.split('\n')) {
    const [key, ...vals] = line.split('=')
    if (key && !key.startsWith('#')) {
      process.env[key.trim()] = vals.join('=').trim().replace(/^["']|["']$/g, '')
    }
  }
} catch {
  console.warn('No .env.local found — relying on process env')
}

const SUPABASE_URL         = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const products = JSON.parse(
  readFileSync(resolve('./src/data/products-data.json'), 'utf-8')
)

// Map camelCase JS fields → snake_case Supabase columns
function toRow(p) {
  return {
    id:                p.id,
    slug:              p.slug,
    name:              p.name,
    brand:             p.brand,
    category:          p.category,
    price:             p.price,
    original_price:    p.originalPrice ?? null,
    image:             p.image,
    images:            p.images ?? [p.image],
    description:       p.description,
    short_description: p.shortDescription,
    flavors:           p.flavors ?? null,
    nicotine_strengths: p.nicotineStrengths ?? null,
    in_stock:          p.inStock,
    featured:          p.featured,
    rating:            p.rating,
    review_count:      p.reviewCount,
    tags:              p.tags,
    puff_count:        p.puffCount ?? null,
    ml_size:           p.mlSize ?? null,
  }
}

const BATCH = 100
let inserted = 0

for (let i = 0; i < products.length; i += BATCH) {
  const batch = products.slice(i, i + BATCH).map(toRow)

  const res = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: 'POST',
    headers: {
      apikey:         SERVICE_ROLE_KEY,
      Authorization:  `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer:         'resolution=merge-duplicates',
    },
    body: JSON.stringify(batch),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`Batch ${i / BATCH + 1} failed:`, err)
    process.exit(1)
  }

  inserted += batch.length
  process.stdout.write(`\r✓ ${inserted}/${products.length} products seeded...`)
}

console.log(`\n\n🎉 Done! ${inserted} products upserted into Supabase.`)
