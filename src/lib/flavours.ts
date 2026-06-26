import 'server-only'
import { products } from '@/data/products'
import type { Product } from '@/types'
import { flavourCategory, significantFlavourTokens } from '@/lib/flavour-classify'

// Each flavour is its own product (the catalogue has no flavour-variant data), so
// the "flavour range" for a product = its sibling SKUs: same brand + category +
// (same puff count, if any). The flavour name is derived by stripping the shared
// prefix/suffix common to the whole range — no fabricated colours or descriptions.

function commonPrefix(a: string[]): string {
  if (!a.length) return ''
  let p = a[0]
  for (const s of a) {
    let i = 0
    while (i < p.length && i < s.length && p[i] === s[i]) i++
    p = p.slice(0, i)
    if (!p) break
  }
  return p
}

function commonSuffix(a: string[]): string {
  if (!a.length) return ''
  let p = a[0]
  for (const s of a) {
    let i = 0
    while (i < p.length && i < s.length && p[p.length - 1 - i] === s[s.length - 1 - i]) i++
    p = p.slice(p.length - i)
    if (!p) break
  }
  return p
}

const titleCase = (s: string) => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
const popularity = (p: Product) => (p.featured ? 1_000_000 : 0) + (p.reviewCount ?? 0)

export interface FlavourSibling {
  product: Product
  label: string
}

export interface FlavourRange {
  rangeName: string
  currentLabel: string
  siblings: FlavourSibling[]
}

export function flavourRange(product: Product): FlavourRange | null {
  // Group = same brand + category, same puff count if the product has one,
  // excluding multi-packs (those are deal SKUs, not flavours).
  const group = products.filter(
    p =>
      p.brand === product.brand &&
      p.category === product.category &&
      (product.puffCount ? p.puffCount === product.puffCount : true) &&
      !/\bpack\b/i.test(p.name)
  )
  if (group.length < 3) return null

  const names = group.map(g => g.name)
  let pre = commonPrefix(names)
  let suf = commonSuffix(names)
  // Trim the prefix back to a word boundary and the suffix forward to one, so we
  // never cut a flavour word in half.
  const pcut = pre.lastIndexOf(' ')
  if (pcut >= 0) pre = pre.slice(0, pcut + 1)
  const scut = suf.indexOf(' ')
  if (scut >= 0) suf = suf.slice(scut)

  const extract = (name: string) => {
    const mid = name.slice(pre.length, name.length - suf.length).replace(/^[-\s]+|[-\s]+$/g, '')
    return mid ? titleCase(mid) : titleCase(name)
  }

  const rangeName =
    pre.replace(/[-\s]+$/, '').trim() + (product.puffCount ? ` ${product.puffCount.toLocaleString()}` : '')

  const siblings: FlavourSibling[] = group
    .filter(p => p.id !== product.id)
    .sort((a, b) => popularity(b) - popularity(a))
    .slice(0, 12)
    .map(p => ({ product: p, label: extract(p.name) }))

  if (!siblings.length) return null
  return { rangeName: rangeName || product.brand, currentLabel: extract(product.name), siblings }
}

/**
 * "You might also like" — the same flavour from OTHER brands. Matched on shared
 * significant flavour tokens (e.g. "grape", "mango"), then flavour category.
 * Keyword-derived, so best-effort — returns null when there's no clear match.
 */
export function crossBrandFlavours(product: Product): { label: string; items: Product[] } | null {
  const brandWords = new Set(product.brand.toLowerCase().split(/\s+/))
  const key = significantFlavourTokens(product.name).filter(t => !brandWords.has(t))
  const cat = flavourCategory(product.name)
  if (!key.length && cat === 'other') return null

  const scored = products
    .filter(p => p.brand !== product.brand && p.category === product.category && p.id !== product.id && !/\bpack\b/i.test(p.name))
    .map(p => {
      const ptoks = new Set(significantFlavourTokens(p.name))
      const overlap = key.filter(t => ptoks.has(t)).length
      const sameCat = flavourCategory(p.name) === cat ? 1 : 0
      return { p, score: overlap * 3 + sameCat }
    })
    // Require a real flavour-keyword overlap (score >= 3); fall back to none.
    .filter(x => x.score >= 3)
    .sort((a, b) => b.score - a.score || popularity(b.p) - popularity(a.p))

  // De-dupe by brand so the row shows variety, cap at 6.
  const seen = new Set<string>()
  const items: Product[] = []
  for (const { p } of scored) {
    if (seen.has(p.brand)) continue
    seen.add(p.brand)
    items.push(p)
    if (items.length >= 6) break
  }
  if (items.length < 2) return null

  const flavourWord = key[0] ? key[0][0].toUpperCase() + key[0].slice(1) : 'this flavour'
  return { label: `Love ${flavourWord}? Try these from other brands`, items }
}
