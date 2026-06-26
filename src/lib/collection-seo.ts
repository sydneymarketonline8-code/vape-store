import type { Faq } from '@/components/common/page-schema'

// Honest, data-driven SEO content for the category pillar pages
// (/collections/[slug]). Counts, from-prices and brand lists are passed in from
// the real catalogue — no fabricated reviews, "#1" claims or invented prices.

interface Stats {
  count: number
  minPrice: number
  topBrands: string[]
}

export interface CollectionSeo {
  metaTitle: string
  metaDescription: string
  intro: string
  whyBuy: string
  faqs: Faq[]
}

// Per-category descriptor used to keep the copy accurate to each product type.
const NOTE: Record<string, { noun: string; trait: string }> = {
  disposables: { noun: 'disposable vapes', trait: 'ready to use out of the box — draw-activated, with no charging or refilling' },
  mods: { noun: 'pod systems & kits', trait: 'refillable and rechargeable, for a longer-lasting, more economical vape' },
  'e-liquids': { noun: 'e-liquids & nicotine salts', trait: 'made to refill pod systems and kits, in a range of flavours and strengths' },
  pouches: { noun: 'nicotine pouches', trait: 'tobacco-free and smoke-free — discreet and easy to use anywhere' },
  accessories: { noun: 'vape accessories', trait: 'the coils, chargers and spares that keep your kit running' },
}

const money = (n: number) => `$${n.toFixed(2)}`

export function buildCollectionSeo(slug: string, name: string, s: Stats): CollectionSeo {
  const note = NOTE[slug] ?? { noun: name.toLowerCase(), trait: 'genuine products at fair prices' }
  const brandList = s.topBrands.slice(0, 5).join(', ')
  const fromPrice = s.minPrice ? money(s.minPrice) : ''
  const countStr = s.count.toLocaleString()

  const metaTitle = `Buy ${name} Online Australia | Aussie Vape`.slice(0, 60)
  const metaDescription =
    `Shop ${countStr} ${note.noun} at Aussie Vape — ${s.topBrands.slice(0, 3).join(', ')} and more${fromPrice ? ` from ${fromPrice}` : ''}. Fast AU shipping, free over $300, age-verified.`.slice(0, 160)

  const intro =
    `Shop our full range of ${note.noun} at Aussie Vape — ${countStr} products${fromPrice ? ` from ${fromPrice}` : ''}${brandList ? `, including ${brandList}` : ''}. ${name} are ${note.trait}. Fast Australia-wide dispatch, free shipping on orders over $300, and an age-verified (18+) checkout. Buy more and save with multi-pack bundles.`

  const whyBuy =
    `Aussie Vape stocks ${countStr} ${note.noun} across the brands Australians actually buy, with fast dispatch from Australia and free shipping on orders over $300. Every order is age-verified (18+) and backed by our 30-day returns on unopened products. Want to pay less per device? Many best-sellers come in multi-pack bundles.`

  const faqs: Faq[] = [
    {
      q: `Where can I buy ${note.noun} online in Australia?`,
      a: `Aussie Vape (aussievape.com.au) stocks ${countStr} ${note.noun}${fromPrice ? ` from ${fromPrice}` : ''} with fast shipping Australia-wide. Orders over $300 ship free, and checkout is age-verified (18+).`,
    },
    {
      q: `How much do ${note.noun} cost in Australia?`,
      a: `${name} at Aussie Vape start${fromPrice ? ` from ${fromPrice}` : ' at a range of prices'}, and multi-pack bundles lower the price per device again. The current price is shown on each product page.`,
    },
    {
      q: `What brands of ${note.noun} does Aussie Vape stock?`,
      a: `${brandList || 'A range of leading brands'} and more — see the full list on our brands page. New stock is added regularly.`,
    },
    {
      q: `Do I need to be 18 to buy ${note.noun}?`,
      a: `Yes. Aussie Vape only sells to adults aged 18 and over, and orders are age-verified. Australian vaping rules are set by the TGA and vary by state — see our Vaping Laws page for the current position.`,
    },
  ]

  return { metaTitle, metaDescription, intro, whyBuy, faqs }
}
