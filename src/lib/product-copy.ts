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
