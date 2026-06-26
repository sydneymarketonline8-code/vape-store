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

/** Honest, data-driven SEO content for a Tier-3 series page (brand + exact puff count). */
export function buildSeriesSeo(
  brand: string,
  categoryName: string,
  puff: number,
  count: number,
  minPrice: number,
  slug: string
): CollectionSeo {
  const note = NOTE[slug] ?? { noun: categoryName.toLowerCase(), trait: 'genuine products at fair prices' }
  const fromPrice = minPrice ? money(minPrice) : ''
  const countStr = count.toLocaleString()
  const puffStr = `${puff.toLocaleString()}-puff`
  const label = `${brand} ${puff.toLocaleString()} Puffs`

  const metaTitle = `Buy ${brand} ${puff.toLocaleString()} Puffs Online Australia | Aussie Vape`.slice(0, 60)
  const metaDescription =
    `Shop ${countStr} ${brand} ${puffStr} ${note.noun}${fromPrice ? ` from ${fromPrice}` : ''} at Aussie Vape. Fast AU shipping, free over $300, age-verified (18+).`.slice(0, 160)

  const intro =
    `Shop the ${label} range at Aussie Vape — ${countStr} ${puffStr} ${note.noun}${fromPrice ? ` from ${fromPrice}` : ''}, in a choice of flavours. Fast Australia-wide dispatch, free shipping on orders over $300, and an age-verified (18+) checkout. Buy more and save with multi-pack bundles.`

  const whyBuy =
    `The ${label} line is rated for around ${puff.toLocaleString()} puffs per device. We stock ${countStr} flavours with fast dispatch from Australia and free shipping on orders over $300, every order age-verified (18+) and backed by 30-day returns on unopened products.`

  const faqs: Faq[] = [
    {
      q: `How many puffs does the ${brand} ${puff.toLocaleString()} have?`,
      a: `The ${label} is rated for up to around ${puff.toLocaleString()} puffs per device. Real-world usage depends on how often and how long you draw.`,
    },
    {
      q: `Where can I buy the ${brand} ${puff.toLocaleString()} in Australia?`,
      a: `The ${label} range is available at Aussie Vape — ${countStr} flavours${fromPrice ? ` from ${fromPrice}` : ''} with fast AU-wide shipping. Orders over $300 ship free.`,
    },
    {
      q: `How much is the ${brand} ${puff.toLocaleString()}?`,
      a: `It starts${fromPrice ? ` from ${fromPrice}` : ' at a range of prices'}, with multi-pack bundles bringing the price per device down further. The current price is on each product page.`,
    },
  ]

  return { metaTitle, metaDescription, intro, whyBuy, faqs }
}

/** Honest, data-driven SEO content for a brand cluster page (/collections/[slug]/[brand]). */
export function buildBrandCategorySeo(
  brand: string,
  categoryName: string,
  count: number,
  minPrice: number,
  puffCounts: number[],
  slug: string
): CollectionSeo {
  const note = NOTE[slug] ?? { noun: categoryName.toLowerCase(), trait: 'genuine products at fair prices' }
  const fromPrice = minPrice ? money(minPrice) : ''
  const countStr = count.toLocaleString()
  const puffNote =
    puffCounts.length >= 2
      ? ` available in ${puffCounts.slice(0, 4).map(p => `${p.toLocaleString()}-puff`).join(', ')} options`
      : puffCounts.length === 1
        ? ` rated for up to ${puffCounts[0].toLocaleString()} puffs`
        : ''

  const metaTitle = `Buy ${brand} ${categoryName} Online Australia | Aussie Vape`.slice(0, 60)
  const metaDescription =
    `Shop ${countStr} ${brand} ${note.noun}${fromPrice ? ` from ${fromPrice}` : ''} at Aussie Vape. Fast AU shipping, free over $300, age-verified (18+).`.slice(0, 160)

  const intro =
    `Shop the ${brand} range of ${note.noun} at Aussie Vape — ${countStr} products${fromPrice ? ` from ${fromPrice}` : ''}${puffNote}. Fast Australia-wide dispatch, free shipping on orders over $300, and an age-verified (18+) checkout. Buy more and save with multi-pack bundles.`

  const whyBuy =
    `We stock ${countStr} ${brand} ${note.noun} with fast dispatch from Australia and free shipping on orders over $300. Every order is age-verified (18+) and backed by our 30-day returns on unopened products. ${brand} multi-packs lower the price per device if you buy a few at once.`

  const faqs: Faq[] = [
    {
      q: `Where can I buy ${brand} ${note.noun} in Australia?`,
      a: `${brand} ${note.noun} are available at Aussie Vape (aussievape.com.au) — ${countStr} products${fromPrice ? ` from ${fromPrice}` : ''} with fast AU-wide shipping. Orders over $300 ship free.`,
    },
    {
      q: `How much do ${brand} ${note.noun} cost?`,
      a: `${brand} ${note.noun} at Aussie Vape start${fromPrice ? ` from ${fromPrice}` : ' at a range of prices'}, and multi-pack bundles bring the price per device down further. The current price is on each product page.`,
    },
    {
      q: `Is ${brand} available in Australia?`,
      a: `Yes — Aussie Vape stocks ${countStr} ${brand} ${note.noun}, with new stock added regularly. See the full ${brand} range on this page or our brands page.`,
    },
  ]

  return { metaTitle, metaDescription, intro, whyBuy, faqs }
}
