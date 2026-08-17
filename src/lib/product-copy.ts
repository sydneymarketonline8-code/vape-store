import type { Product } from '@/types'
import { brandDescriptor } from '@/lib/brand-descriptors'
import { flavourCategory, significantFlavourTokens } from '@/lib/flavour-classify'

// Generates a unique, spec-driven product description so on-page copy doesn't
// duplicate the scraped catalogue text (which is shared with the sibling site
// aussievapes.com.au). Deterministic — varies by name/category/puffs/price — and
// written on this site's deals/bundles angle. Only uses fields that are actually
// populated (name, brand, category, puffCount, price); flavours/nicotine/ml are
// empty in the local catalogue.

const CATEGORY_NOUN: Record<string, string> = {
  disposables: 'disposable vape',
  mods: 'refillable pod system',
  'e-liquids': 'e-liquid',
  pouches: 'nicotine pouch',
  accessories: 'vaping accessory',
}

const CATEGORY_BLURB: Record<string, string> = {
  disposables: 'Draw-activated and ready to use straight out of the box — no charging, refilling or buttons.',
  mods: 'A refillable device built for a longer-lasting, more economical vape.',
  'e-liquids': 'Made to refill pod systems and vape kits with smooth, consistent flavour.',
  pouches: 'A smoke-free, tobacco-free way to enjoy nicotine — discreet and easy to use anywhere.',
  accessories: 'A practical addition to round out your vaping setup.',
}

// "Brands" that are really product-type labels — don't render "from X".
const GENERIC_BRANDS = new Set(['OTHER', 'CIGARETTES', 'CREAM CHARGERS'])

// The `accessories` category is a grab-bag: some items are cigarettes, cream
// chargers, dab devices or mis-filed nicotine pouches. Classify by brand/tag/name
// so the copy describes them accurately instead of "a vaping accessory".
function classify(p: Product): { noun: string; blurb: string } {
  const tags = (p.tags ?? []).map(t => t.toLowerCase())
  const brand = (p.brand ?? '').toUpperCase()
  const name = p.name.toLowerCase()

  if (brand === 'CIGARETTES' || tags.includes('cigarettes')) {
    return { noun: 'tobacco product', blurb: '' }
  }
  if (brand === 'CREAM CHARGERS' || tags.includes('cream-chargers')) {
    return { noun: 'cream charger', blurb: 'Nitrous oxide (N2O) chargers for use with whipped-cream dispensers.' }
  }
  if (tags.includes('lookah-seahorse') || /puffco|lookah|seahorse/.test(name)) {
    return { noun: 'concentrate vaporiser', blurb: 'A device built for concentrates and extracts.' }
  }
  if (brand === 'KILLA') {
    return { noun: 'nicotine pouch', blurb: CATEGORY_BLURB.pouches }
  }
  return { noun: CATEGORY_NOUN[p.category] ?? 'vape product', blurb: CATEGORY_BLURB[p.category] ?? '' }
}

/** Stable per-product number from the slug — picks copy variants deterministically. */
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

// Model/series words that appear in product names but aren't flavours.
const MODEL_WORDS = [
  'bar', 'plus', 'pro', 'max', 'king', 'legend', 'moon', 'one', 'goat', 'hot', 'xxl', 'box', 'cuvie',
  'slick', 'moss', 'lume', 'ingot', 'crown', 'shisha', 'mega', 'turbo', 'prime', 'eternity', 'zero',
  'pod', 'pods', 'only', 'device', 'base', 'battery', 'kit', 'puffs', 'puff', 'pack', 'nicotine',
  'pouches', 'juice', 'salt', 'salts', 'vape', 'disposable', 'edition', 'series', 'new', 'mix',
]

const FLAVOUR_PHRASE: Record<string, string> = {
  fruit: 'a fruit-forward flavour',
  ice: 'a chilled, menthol-cooled flavour',
  mint: 'a mint flavour',
  dessert: 'a sweet, dessert-style flavour',
  drink: 'a drink-inspired flavour',
  tobacco: 'a tobacco flavour',
  candy: 'a sweet, confectionery-style flavour',
}

/**
 * Unique, spec-driven product copy. Every product gets a different combination of
 * real figures (puff rating, days of use, cost per 1,000 puffs, per-device pack
 * price, saving) and a deterministically chosen sentence structure, so the ~2,000
 * product pages don't read as one template — near-duplicate copy at scale is a
 * common reason pages get crawled but not indexed. All numbers are derived from
 * the product's own data; nothing is invented.
 */
export function buildProductDescription(p: Product): string {
  const { noun, blurb } = classify(p)
  const h = hash(p.slug || p.name)
  const price = p.price
  const article = /^[aeiou]/i.test(noun) ? 'an' : 'a'
  const brandPrefix =
    p.brand && !GENERIC_BRANDS.has(p.brand.toUpperCase()) && !p.name.toUpperCase().startsWith(p.brand.toUpperCase())
      ? ` from ${p.brand}`
      : ''

  // Pack size, if this is a multi-pack.
  const packMatch = p.name.match(/(\d+)\s*[-\s]?pack\b/i)
  const packSize = packMatch ? Number(packMatch[1]) : 0
  const puffs = p.puffCount ?? 0

  const parts: string[] = []

  // ── Opening: three structures, chosen by hash ──────────────────────────────
  const puffPhrase = puffs ? ` rated for ${puffs.toLocaleString()} puffs` : ''
  const opener = h % 3
  if (opener === 0) {
    parts.push(`The ${p.name} is ${article} ${noun}${puffPhrase}${brandPrefix}, in stock now at VapesAU.`)
  } else if (opener === 1) {
    parts.push(`${p.name} — ${article} ${noun}${brandPrefix}${puffPhrase}, available to order online in Australia.`)
  } else {
    parts.push(`Looking for the ${p.name}? It's ${article} ${noun}${puffPhrase}${brandPrefix}, held in stock and dispatched from Australia.`)
  }

  // ── Brand context (32 brands have a distinct descriptor) ───────────────────
  const bd = p.brand ? brandDescriptor(p.brand) : null
  if (bd) parts.push(bd)

  // ── Flavour profile, read from the product name ────────────────────────────
  const flav = flavourCategory(p.name)
  const flavPhrase = FLAVOUR_PHRASE[flav]
  if (flavPhrase) {
    // Strip brand/model words so we describe the flavour, not the product name.
    const brandWords = new Set(
      `${p.brand ?? ''}`.toLowerCase().split(/[^a-z]+/).filter(Boolean).concat(MODEL_WORDS)
    )
    const tokens = significantFlavourTokens(p.name).filter(w => !brandWords.has(w))
    parts.push(
      tokens.length > 1
        ? `It's ${flavPhrase} blending ${tokens.slice(0, 3).join(', ')}.`
        : tokens.length === 1
          ? `It's ${flavPhrase} built around ${tokens[0]}.`
          : `It's ${flavPhrase}.`
    )
  }

  // ── Category context ───────────────────────────────────────────────────────
  if (blurb) parts.push(blurb)

  // ── Real, product-specific numbers ─────────────────────────────────────────
  if (puffs >= 400) {
    // Longevity at a stated, transparent assumption + cost efficiency.
    const days = Math.round(puffs / 300)
    const perK = (price / (puffs * (packSize || 1))) * 1000
    const life =
      days >= 60
        ? `around ${Math.round(days / 30)} months`
        : days >= 14
          ? `roughly ${Math.round(days / 7)} weeks`
          : `about ${days} days`
    parts.push(
      `At ${puffs.toLocaleString()} puffs${packSize ? ` per device` : ''}, that's ${life} for a typical user at around 300 puffs a day, and works out to about $${perK.toFixed(2)} per 1,000 puffs.`
    )
  }

  // ── Pack maths, or single-unit pricing ─────────────────────────────────────
  if (packSize > 1) {
    parts.push(
      `This ${packSize}-pack is $${price.toFixed(2)} — about $${(price / packSize).toFixed(2)} per device, with pack pricing already applied at checkout (no code needed).`
    )
  } else {
    parts.push(`Priced at $${price.toFixed(2)}${h % 2 === 0 ? ', with multi-pack bundles available if you want a lower price per device' : ' as a single unit — bulk packs are available on many lines'}.`)
  }

  // ── Genuine saving, only when there's a real original price ────────────────
  if (p.originalPrice && p.originalPrice > price) {
    const save = p.originalPrice - price
    const pct = Math.round((save / p.originalPrice) * 100)
    parts.push(`Currently reduced from $${p.originalPrice.toFixed(2)}, saving you $${save.toFixed(2)} (${pct}%).`)
  }

  // ── Closing: two variants ──────────────────────────────────────────────────
  parts.push(
    h % 2 === 0
      ? `Dispatched from our Australian warehouse within one business day, tracked, with free shipping on orders over $300. Age-verified (18+).`
      : `Ships Australia-wide with tracking, dispatched within one business day of payment. Free delivery over $300, age-verified checkout (18+).`
  )

  return parts.filter(Boolean).join(' ')
}

const TYPE_LABEL: Record<string, string> = {
  disposables: 'Disposable vape',
  mods: 'Pod system / kit',
  'e-liquids': 'E-liquid',
  pouches: 'Nicotine pouch',
  accessories: 'Accessory',
}

/**
 * Builds a spec table from data we can state truthfully — real per-product values
 * derived from the name/fields (puff count, capacity & nicotine where present in
 * the name, pack size, price per device) plus category-typical qualitative specs.
 * Deliberately omits figures we don't have (battery mAh, coil Ω, exact capacity)
 * rather than inventing them. If a product has admin-entered `specs`, use those.
 */
export function buildProductSpecs(p: Product): [string, string][] {
  if (p.specs && Object.keys(p.specs).length) return Object.entries(p.specs)

  const tags = (p.tags ?? []).map(t => t.toLowerCase())
  const { noun } = classify(p)
  const out: [string, string][] = []

  out.push(['Brand', p.brand && p.brand !== 'OTHER' ? p.brand : '—'])
  // Reuse the description classifier for an accurate type label (handles cigarettes,
  // cream chargers, dab devices & mis-filed pouches), else the category label.
  out.push(['Type', noun.charAt(0).toUpperCase() + noun.slice(1)])

  if (p.puffCount) out.push(['Puff Count', `Up to ${p.puffCount.toLocaleString()} puffs`])

  const ml = p.name.match(/(\d+(?:\.\d+)?)\s?ml\b/i)
  if (ml) out.push(['E-Liquid Capacity', `${ml[1]}mL`])

  const mg = p.name.match(/(\d{1,3})\s?mg\b/i)
  const nicFree = tags.includes('nicotine-free') || /nicotine[- ]free|\b0\s?mg\b/i.test(p.name)
  if (mg) out.push(['Nicotine Strength', `${mg[1]}mg`])
  else if (nicFree) out.push(['Nicotine', 'Nicotine-free'])
  else if (p.category === 'disposables' || p.category === 'pouches') out.push(['Nicotine Type', 'Nicotine salt'])

  const pack = p.name.match(/\b(\d+)\s*PACK\b/i)
  if (pack) {
    const n = Number(pack[1])
    out.push(['Pack Size', `${n}-pack`])
    if (n > 1) out.push(['Price Per Device', `$${(p.price / n).toFixed(2)}`])
  }

  if (p.category === 'disposables' && TYPE_LABEL[p.category]) {
    out.push(['Format', 'Prefilled, ready to use'])
    out.push(['Activation', 'Draw-activated (no buttons)'])
  } else if (p.category === 'mods') {
    out.push(['Format', 'Refillable pods / tank'])
  } else if (p.category === 'pouches') {
    out.push(['Use', 'Place under the upper lip — smoke-free'])
  } else if (p.category === 'e-liquids') {
    out.push(['Use', 'For refillable pod systems & kits'])
  }

  if (p.sku) out.push(['SKU', p.sku])
  return out
}

