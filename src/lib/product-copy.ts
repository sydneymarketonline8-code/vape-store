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

export function buildProductDescription(p: Product): string {
  const noun = CATEGORY_NOUN[p.category] ?? 'vape product'
  const blurb = CATEGORY_BLURB[p.category] ?? ''
  const isPack = /\bpack\b/i.test(p.name)
  const brandPrefix =
    p.brand && p.brand !== 'OTHER' && !p.name.toUpperCase().startsWith(p.brand.toUpperCase())
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
