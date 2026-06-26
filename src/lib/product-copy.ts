import type { Product } from '@/types'

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

export function buildProductDescription(p: Product): string {
  const { noun, blurb } = classify(p)
  const isPack = /\bpack\b/i.test(p.name)
  const brandPrefix =
    p.brand && !GENERIC_BRANDS.has(p.brand.toUpperCase()) && !p.name.toUpperCase().startsWith(p.brand.toUpperCase())
      ? ` from ${p.brand}`
      : ''
  const puffs = p.puffCount ? ` rated for ${p.puffCount.toLocaleString()} puffs` : ''
  const article = /^[aeiou]/i.test(noun) ? 'an' : 'a'

  const s1 = `The ${p.name} is ${article} ${noun}${puffs}${brandPrefix}, available now at Aussie Vape.`
  const s3 = isPack
    ? `Buy this multi-pack online for $${p.price.toFixed(2)} — pack pricing is already applied, so you pay less per device. Fast Australia-wide shipping, age-verified checkout (18+), and free delivery on orders over $300.`
    : `Buy online for $${p.price.toFixed(2)}, with multi-pack bundle deals available if you want to save more. Fast Australia-wide shipping, age-verified checkout (18+), and free delivery on orders over $300.`

  return [s1, blurb, s3].filter(Boolean).join(' ')
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

