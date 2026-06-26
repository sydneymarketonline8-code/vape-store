// Best-effort flavour classification from a product name (the catalogue has no
// structured flavour field). Keyword-based — a discovery aid, not an exact science.
// Client-safe: no catalogue import.

export const FLAVOUR_FILTERS: { id: string; label: string }[] = [
  { id: 'ice', label: 'Ice & Menthol' },
  { id: 'fruit', label: 'Fruit' },
  { id: 'mint', label: 'Mint' },
  { id: 'hookah', label: 'Hookah' },
  { id: 'drink', label: 'Drinks' },
  { id: 'dessert', label: 'Dessert' },
  { id: 'candy', label: 'Candy' },
  { id: 'tobacco', label: 'Tobacco' },
]

const FLAVOUR_LABEL: Record<string, string> = Object.fromEntries(FLAVOUR_FILTERS.map(f => [f.id, f.label]))
export const flavourFilterLabel = (id: string) => FLAVOUR_LABEL[id] ?? ''
export const isFlavourFilter = (id: string) => id in FLAVOUR_LABEL

// Ordered checks — earlier wins. Dessert before ice so "ice cream" isn't "ice".
const RULES: [string, RegExp][] = [
  ['dessert', /\b(ice ?cream|cream|custard|cake|vanilla|cookie|caramel|butterscotch|pudding|yogh?urt|donut|cheesecake)\b/],
  ['hookah', /\b(two ?apple|double ?apple|love ?66|shisha|hookah)\b/],
  ['drink', /\b(cola|lemonade|soda|energy|red ?bull|mojito|cocktail|cappuccino|coffee)\b/],
  ['ice', /\b(ice|iced|frozen|freeze|frost|menthol|arctic)\b/],
  ['mint', /\b(mint|spearmint|peppermint|wintergreen)\b/],
  ['candy', /\b(candy|gum|bubble ?gum|sherbet|lolly|skittle|rainbow)\b/],
  ['tobacco', /\b(tobacco|cigar|tabac)\b/],
  ['fruit', /\b(grape|apple|berr|strawberr|mango|watermelon|peach|lychee|banana|cherry|blueberr|raspberr|razz|passion|kiwi|pineapple|melon|currant|orange|lemon|lime|guava|pomegranate|coconut|fruit|tropical|pear|plum|grapefruit|cranberr|apricot)\b/],
]

export function flavourCategory(name: string): string {
  const n = name.toLowerCase()
  for (const [id, rx] of RULES) if (rx.test(n)) return id
  return 'other'
}

const TOKEN_STOP = new Set(['puffs', 'puff', 'pack', 'disposable', 'vape', 'bar', 'crown', 'box', 'hot', 'legend', 'goat', 'the', 'and', 'with', 'series', 'kit', 'pod'])
const GENERIC = new Set(['ice', 'iced', 'mint', 'menthol', 'cool', 'frozen', 'freeze', 'frost', 'arctic'])

/** Lowercase flavour-ish word tokens from a name (drops device/stop words & numbers). */
export function flavourTokens(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !TOKEN_STOP.has(w))
}

/** Tokens that identify the actual flavour (fruit/dessert noun), excluding generic ice/mint modifiers. */
export function significantFlavourTokens(name: string): string[] {
  return flavourTokens(name).filter(w => !GENERIC.has(w))
}
