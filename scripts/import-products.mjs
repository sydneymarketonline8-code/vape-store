import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const CSV_PATH  = 'c:/Users/BAHDEST/OneDrive/Desktop/Website 1/wc-product-export-10-5-2026-1778366869824.csv'
const JSON_PATH = resolve('./src/data/products-data.json')
const OUT_PATH  = resolve('./src/data/products.ts')
const PH_DIR    = resolve('./public/placeholders')

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

// ── Name cleaning ───────────────────────────────────────────────────────────
const ENTITIES = {
  '&amp;': '&', '&nbsp;': ' ', '&quot;': '"', '&#039;': "'", '&#39;': "'",
  '&apos;': "'", '&ndash;': '–', '&mdash;': '—', '&#8211;': '–', '&#8217;': '’',
  '&rsquo;': '’', '&lsquo;': '‘', '&hellip;': '…',
}
function decodeEntities(s) {
  return s.replace(/&[a-z0-9#]+;/gi, m => ENTITIES[m] ?? m)
}
function cleanName(raw) {
  let n = decodeEntities(raw)
  n = n.replace(/ /g, ' ')          // literal non-breaking spaces
  n = n.split(/\s*\|\s*/)[0]             // drop SEO suffix: "… | IGET Australia"
  n = n.replace(/\s*[–-]\s*/g, ' - ')    // normalise dash spacing
  n = n.replace(/\s+/g, ' ').trim()      // collapse whitespace
  return n
}

// ── Brand resolution ──────────────────────────────────────────────────────────
// Matched (longest-first) against the UPPERCASED clean name. Stored uppercase to
// match the site's brand styling; the product card uppercases brand regardless.
const KNOWN_BRANDS = [
  'ALFAKHER CROWN BAR', 'SUICIDE BUNNY', 'CLOUD NURDZ', 'SHOT CALLER',
  'FUNKY LAND', 'LUCKY WOLF', 'RIVAL BAR', 'BRISK BAR', 'WAKA SMASH',
  'JUICE HEAD', 'LOST MARY', 'GEEK BAR', 'VAPORESSO', 'GEEKVAPE',
  'MR FOG', 'ALIBARBAR', 'RABBEATS', 'X-QLUSIVE', 'CALIBARN', 'EBCREATE',
  'VAPEHUB', 'DRAGBAR', 'GUNNPOD', 'PUFFMI', 'LEAFBAR', 'ZOOVOO', 'SEREIN',
  'VAPSOLO', 'ADALYA', 'VEIIK', 'VOZOL', 'IBUFF', 'GOLIT', 'PANDA', 'PICCO',
  'FASTA', 'BANG', 'IGET', 'ELUX', 'RELX', 'YOOZ', 'OLIT', 'HIGO', 'BIMO',
  'PYRO', 'TESS', 'WAKA', 'HQD', 'JNR', 'KUZ', 'GROO', 'FISCO', 'WOTOFO',
  'FLONQ', 'FUME', 'YOVO', 'EVODRIP', 'EVODRIP SO', 'PALAX', 'BREEZE',
  'KATCHMI', 'XTRIME', 'SNATCH', 'ONYX', 'FEEN', 'POSH', 'CUBE', 'LOON',
  'FLOAT', 'GOAT', 'DOPE', 'RAZ', 'ZYN', 'VELO', 'KILLA', 'ZIMO', 'MOJO',
  'AMMO', 'SESH', 'BERSERKER', 'SMOK', 'VOOPOO', 'NAKED', 'CANNADIPS',
  'VAPORLAX', 'MONSTER', 'POD JUICE', 'PASSI',
].sort((a, b) => b.length - a.length)

// Map product sub-lines back to their parent brand.
const BRAND_ALIASES = { 'ALFAKHER CROWN BAR': 'ALFAKHER', 'EVODRIP SO': 'EVODRIP' }

const JUNK_BRAND = /^(disposable|nicotine|lower|nicotine-free|accessor|pouch|vaporizer|portable|cigarette|cream charger|vapes?|e-?liquid|vape juice|.*juice flavou?rs?$|.*pod kits?$|unknown|brand|other)\b|puffs?|^\d/i

function brandFromName(name) {
  const upper = name.toUpperCase()
  for (const b of KNOWN_BRANDS) {
    const re = new RegExp(`(^|[^A-Z0-9])${b.replace(/-/g, '\\-')}([^A-Z0-9]|$)`)
    if (re.test(upper)) return BRAND_ALIASES[b] ?? b
  }
  return null
}

function brandFromColumn(value) {
  if (!value) return null
  let last = value.split('>').pop().trim()
    .replace(/\s*vape juice$/i, '')
    .replace(/\s*vape$/i, '')
    .replace(/\s*(nicotine|caffeine)\s+pouches?$/i, '')
    .replace(/\s*vape pod kits?$/i, '')
    .replace(/\s*pouches?$/i, '')
    .trim()
  if (!last || JUNK_BRAND.test(last)) return null
  return last.toUpperCase()
}

function brandFallback(name) {
  // Leading segment up to first " - " or first number.
  let seg = name.split(' - ')[0].replace(/\d.*$/, '').trim()
  seg = seg.replace(/\b(vape|vapes|disposable)\b/gi, '').replace(/\s+/g, ' ').trim()
  if (!seg || JUNK_BRAND.test(seg)) return 'OTHER'
  return seg.toUpperCase()
}

function resolveBrand(name, row) {
  const raw =
    brandFromName(name) ||
    brandFromColumn(row['Brands']) ||
    brandFromColumn(row['Meta: rank_math_primary_product_brand']) ||
    brandFromColumn(row['Categories']) ||
    brandFallback(name)
  // Collapse a noisy brand that contains a known one, e.g.
  // "X-QLUSIVE X-POD 3800" → "X-QLUSIVE", "IGET BAR PRO" → "IGET".
  return brandFromName(raw) || raw
}

// ── Pricing ───────────────────────────────────────────────────────────────────
function extractPackCount(name) {
  const m = name.match(/(\d+)\s*[- ]?\s*pack/i)
  return m ? parseInt(m[1], 10) : undefined
}
function round2(x) { return Math.round(x * 100) / 100 }

// Per-unit price from puff count (single units only).
function unitPrice(puffCount) {
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

// Bulk discount per pack so multipacks are always cheaper-per-unit than a single,
// yet never cheaper in absolute terms (the old flat lookup made 3-packs < singles).
function packDiscount(count) {
  if (count >= 50) return 0.78
  if (count >= 20) return 0.82
  if (count >= 10) return 0.85
  if (count >= 5)  return 0.88
  return 0.92 // 3-pack
}

// Returns { price, originalPrice } for a unit or pack.
function priceFor(name, puffCount, salePrice) {
  const packCount = extractPackCount(name)
  const base = unitPrice(puffCount)
  if (packCount && packCount > 1) {
    const original = round2(base * packCount)
    let price = Math.round(base * packCount * packDiscount(packCount)) - 0.01
    if (price >= original) price = round2(original * 0.9)
    return { price: round2(price), originalPrice: original }
  }
  if (salePrice > 0) return { price: round2(salePrice) }
  return { price: base }
}

// ── Images ────────────────────────────────────────────────────────────────────
// The scraped aussievapes.com.au URLs are dead (the host 403s all external
// requests behind a WAF / hotlink protection, and served over http they also
// triggered mixed-content blocking). We self-host a branded SVG placeholder per
// brand under /public/placeholders so images never depend on an external host.
function placeholder(brand) {
  return `/placeholders/${slugify(brand) || 'product'}.svg`
}
function resolveImage(raw, brand) {
  const img = (raw || '').trim()
  // Keep a genuine external image only if it isn't a dead/placeholder host.
  if (img && !/aussievapes\.com\.au|placehold\.co/i.test(img)) {
    return img.replace(/^http:\/\//i, 'https://')
  }
  return placeholder(brand)
}

function brandSvg(text) {
  const t = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const fontSize = t.length > 16 ? 34 : t.length > 11 ? 44 : 56
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">` +
    `<rect width="600" height="600" fill="#1B7A3E"/>` +
    `<text x="300" y="318" fill="#ffffff" font-family="Arial,Helvetica,sans-serif" ` +
    `font-size="${fontSize}" font-weight="700" text-anchor="middle">${t}</text>` +
    `</svg>\n`
  )
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
  'HQD', 'JNR', 'KUZ', 'ELUX', 'RELX',
])

// ── Main ──────────────────────────────────────────────────────────────────────
const text = readFileSync(CSV_PATH, 'utf-8')
const rows = parseCSV(text)

const slugsSeen  = new Set()
const namesSeen  = new Set()
const featuredBy = new Set()
const products   = []

for (const row of rows) {
  const rawName = row['Name']?.trim()
  if (!rawName || shouldSkip(rawName)) continue
  const name = cleanName(rawName)
  if (!name) continue

  const nameKey = name.toLowerCase()
  if (namesSeen.has(nameKey)) continue
  namesSeen.add(nameKey)

  const id        = row['ID'] || String(products.length + 1)
  const brand     = resolveBrand(name, row)
  const category  = mapCategory(row['Categories'] || '')
  const image     = resolveImage((row['Images'] || '').split('|')[0], brand)
  const puffCount = extractPuffCount(name)
  const salePrice = parseFloat(row['Sale price'] || '0')
  const { price, originalPrice } = priceFor(name, puffCount, salePrice)

  // Unique slug
  let base = slugify(name) || `product-${id}`
  let slug = base
  let n = 1
  while (slugsSeen.has(slug)) { slug = `${base}-${++n}` }
  slugsSeen.add(slug)

  // Tags
  const tags = [category]
  if (brand && brand !== 'OTHER') tags.push(brand.toLowerCase().replace(/\s+/g, '-'))
  if (puffCount) tags.push(`${puffCount}-puffs`)
  if (extractPackCount(name)) tags.push('bundle')

  // Featured: first product from each priority brand
  const featured = FEATURED_BRANDS.has(brand) && !featuredBy.has(brand)
  if (featured) featuredBy.add(brand)

  const shortDesc = puffCount
    ? `Up to ${puffCount.toLocaleString()} puffs — ${brand}`
    : `${brand} — ${category}`

  products.push({
    id,
    slug,
    name,
    brand,
    category,
    price,
    ...(originalPrice ? { originalPrice } : {}),
    image,
    images: [image],
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

// ── Generate one self-hosted SVG placeholder per brand ───────────────────────
const brandBySlug = new Map()
for (const p of products) {
  const fileSlug = slugify(p.brand) || 'product'
  if (!brandBySlug.has(fileSlug)) brandBySlug.set(fileSlug, p.brand)
}
mkdirSync(PH_DIR, { recursive: true })
for (const [fileSlug, brand] of brandBySlug) {
  writeFileSync(resolve(PH_DIR, `${fileSlug}.svg`), brandSvg(brand), 'utf-8')
}

console.log(`✓ ${products.length} products written to ${OUT_PATH}`)
console.log(`  ${brandBySlug.size} brand placeholders written to ${PH_DIR}`)
console.log(`  Featured brands: ${[...featuredBy].join(', ')}`)

const cats = { disposables: 0, mods: 0, 'e-liquids': 0, accessories: 0 }
products.forEach(p => cats[p.category]++)
console.log('  Category breakdown:', cats)
