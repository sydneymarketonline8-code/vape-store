import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const CSV_PATH  = 'c:/Users/BAHDEST/OneDrive/Desktop/Website 1/wc-product-export-10-5-2026-1778366869824.csv'
const JSON_PATH = resolve('./src/data/products-data.json')
const OUT_PATH  = resolve('./src/data/products.ts')

// ── CSV parser ────────────────────────────────────────────────────────────────
function parseCSVLine(line) {
  const result = []
  let current  = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') { inQuotes = !inQuotes; continue }
    if (ch === ',' && !inQuotes) { result.push(current); current = ''; continue }
    current += ch
  }
  result.push(current)
  return result
}

function parseCSV(text) {
  const lines   = text.replace(/\r/g, '').split('\n')
  const headers = parseCSVLine(lines[0])
  const rows    = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const vals = parseCSVLine(line)
    const row  = {}
    headers.forEach((h, idx) => { row[h.trim()] = (vals[idx] || '').trim() })
    rows.push(row)
  }
  return rows
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 90)
}

function extractPuffCount(name) {
  const m = name.match(/(\d[\d,]*)\s*puffs?/i)
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : undefined
}

function generatePrice(name, puffCount) {
  const n = name.toLowerCase()
  if (n.includes('100 pack')) return 399.99
  if (n.includes('50 pack'))  return 219.99
  if (n.includes('20 pack'))  return 99.99
  if (n.includes('10 pack'))  return 54.99
  if (n.includes('5 pack'))   return 34.99
  if (n.includes('3 pack'))   return 24.99
  if (!puffCount) return 14.99
  if (puffCount >= 25000) return 34.99
  if (puffCount >= 20000) return 29.99
  if (puffCount >= 16000) return 27.99
  if (puffCount >= 15000) return 24.99
  if (puffCount >= 12000) return 22.99
  if (puffCount >= 9000)  return 19.99
  if (puffCount >= 8000)  return 18.99
  if (puffCount >= 6000)  return 17.99
  if (puffCount >= 5000)  return 16.99
  if (puffCount >= 4000)  return 15.99
  if (puffCount >= 3000)  return 14.99
  if (puffCount >= 2000)  return 13.99
  return 12.99
}

function mapCategory(cat) {
  const c = cat.toLowerCase()
  if (c.includes('e-liquid') || c.includes('vape juice')) return 'e-liquids'
  if (
    c.includes('vape kit') || c.includes('vaporizer') ||
    c.includes('refillable') || c.includes('pod kit') || c.includes('vape tank')
  ) return 'mods'
  if (
    c.includes('pouch') || c.includes('cigarette') ||
    c.includes('cream charger') || c.includes('caffeine') ||
    c.includes('accessories > killa') || c.includes('accessories,')
  ) return 'accessories'
  // Accessories top-level only (not sub-categories that are vape-related)
  if (cat.trim() === 'Accessories') return 'accessories'
  return 'disposables'
}

function extractBrand(row) {
  const brandsCol = row['Brands'] || ''
  if (brandsCol) {
    const parts = brandsCol.split('>')
    return parts[parts.length - 1]
      .trim()
      .replace(/\s*vape$/i, '')
      .trim()
  }
  const cat = row['Categories'] || ''
  const first = cat.split('>')[0].trim().replace(/\s*vape$/i, '').trim()
  return first || 'Unknown'
}

const NON_VAPE_NAMES = ['Brown Cap', 'Quartz Watch', 'Retro Sunglasses', 'Snapback Cap']
function shouldSkip(name) {
  return NON_VAPE_NAMES.some(w => name.includes(w))
}

// ── Deterministic pseudo-random (avoids churn on re-run) ─────────────────────
function detRating(id)  { return Number((4 + (parseInt(id, 10) % 10) / 10).toFixed(1)) }
function detReviews(id) { return (parseInt(id, 10) % 450) + 50 }

// ── Featured set: first unique product per major brand ───────────────────────
const FEATURED_BRANDS = new Set([
  'IGET', 'ALFAKHER', 'ALIBARBAR', 'GUNNPOD', 'ADALYA',
  'HQD', 'JNR', 'Kuz', 'ELUX', 'RELX',
])

// ── Main ──────────────────────────────────────────────────────────────────────
const text = readFileSync(CSV_PATH, 'utf-8')
const rows = parseCSV(text)

const slugsSeen  = new Set()
const namesSeen  = new Set()
const featuredBy = new Set()
const products   = []

for (const row of rows) {
  const name = row['Name']?.trim()
  if (!name || shouldSkip(name)) continue

  const nameKey = name.toLowerCase()
  if (namesSeen.has(nameKey)) continue
  namesSeen.add(nameKey)

  const id       = row['ID'] || String(products.length + 1)
  const brand    = extractBrand(row)
  const catStr   = row['Categories'] || ''
  const category = mapCategory(catStr)
  const image    = (row['Images'] || '').split('|')[0].trim()
  const puffCount = extractPuffCount(name)
  const salePrice = parseFloat(row['Sale price'] || '0')
  const price    = salePrice > 0 ? salePrice : generatePrice(name, puffCount)

  // Unique slug
  let base = slugify(name) || `product-${id}`
  let slug = base
  let n = 1
  while (slugsSeen.has(slug)) { slug = `${base}-${++n}` }
  slugsSeen.add(slug)

  // Tags
  const tags = [category]
  if (brand && brand !== 'Unknown') tags.push(brand.toLowerCase().replace(/\s+/g, '-'))
  if (puffCount) tags.push(`${puffCount}-puffs`)
  if (name.toLowerCase().includes(' pack')) tags.push('bundle')

  // Featured: first product from each priority brand
  const brandKey = brand.toUpperCase()
  const featured = FEATURED_BRANDS.has(brandKey) && !featuredBy.has(brandKey)
  if (featured) featuredBy.add(brandKey)

  const shortDesc = puffCount
    ? `Up to ${puffCount.toLocaleString()} puffs — ${brand}`
    : `${brand} — ${category}`

  products.push({
    id,
    slug,
    name,
    brand: brand || 'Unknown',
    category,
    price: Math.round(price * 100) / 100,
    image: image || `https://placehold.co/600x600/111111/8b5cf6?text=${encodeURIComponent(brand)}`,
    images: [image || `https://placehold.co/600x600/111111/8b5cf6?text=${encodeURIComponent(brand)}`],
    description: `${name}. ${puffCount ? `Delivers up to ${puffCount.toLocaleString()} puffs of smooth, consistent vapour. ` : ''}Premium quality ${category === 'disposables' ? 'disposable vape' : category} from ${brand}.`,
    shortDescription: shortDesc,
    inStock: true,
    featured,
    rating: detRating(id),
    reviewCount: detReviews(id),
    tags,
    ...(puffCount ? { puffCount } : {}),
  })
}

// ── Write JSON data file (avoids TS "union too complex" on large literals) ────
writeFileSync(JSON_PATH, JSON.stringify(products, null, 2), 'utf-8')

// ── Write lightweight TypeScript wrapper ─────────────────────────────────────
const ts = `import { Product } from '@/types'
import rawData from './products-data.json'

// Auto-generated — do not edit manually. Re-run: node scripts/import-products.mjs

export const products = rawData as unknown as Product[]

export const getFeaturedProducts    = () => products.filter(p => p.featured)
export const getProductBySlug       = (slug: string) => products.find(p => p.slug === slug)
export const getProductsByCategory  = (category: string) => products.filter(p => p.category === category)
`

writeFileSync(OUT_PATH, ts, 'utf-8')
console.log(`✓ ${products.length} products written to ${OUT_PATH}`)
console.log(`  Featured brands: ${[...featuredBy].join(', ')}`)

const cats = { disposables: 0, mods: 0, 'e-liquids': 0, accessories: 0 }
products.forEach(p => cats[p.category]++)
console.log('  Category breakdown:', cats)
