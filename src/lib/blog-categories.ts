/**
 * Blog categories.
 *
 * The blog_posts table has no category column, so categories are defined here
 * and mapped by post slug. Add a new post's slug to the relevant category when
 * you publish it; anything unmapped falls back to "Guides".
 */
export interface BlogCategory {
  slug: string
  name: string
  blurb: string
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: 'buying-guides',
    name: 'Buying Guides',
    blurb: 'Model comparisons, brand line-ups and how to pick the right device for you.',
  },
  {
    slug: 'nicotine-pouches',
    name: 'Nicotine Pouches',
    blurb: 'Strengths, flavours, brands and how to use tobacco-free nicotine pouches.',
  },
  {
    slug: 'deals-value',
    name: 'Deals & Value',
    blurb: 'Multi-pack maths, cost per puff, and how to get more for your money.',
  },
  {
    slug: 'vaping-basics',
    name: 'Vaping Basics',
    blurb: 'Plain-English explainers on devices, nicotine strengths and how vaping works.',
  },
]

/** Post slug → category slug. Unmapped posts default to "buying-guides". */
const POST_CATEGORY: Record<string, string> = {
  'iget-vapes-australia-range-guide': 'buying-guides',
  'fume-vape-australia-guide': 'buying-guides',
  'ibuff-shisha-vapes-australia-guide': 'buying-guides',
  'high-puff-disposable-vapes-australia': 'buying-guides',

  'zyn-flavours-strengths-guide-australia': 'nicotine-pouches',
  'nicotine-pouches-australia-guide': 'nicotine-pouches',
  'nicotine-pouches-beginners-guide-australia': 'nicotine-pouches',

  'vape-multi-packs-and-bundles-guide': 'deals-value',
  'disposable-vape-puff-counts-explained': 'deals-value',

  'disposable-vapes-vs-pod-systems': 'vaping-basics',
  'e-liquid-nicotine-strengths-explained': 'vaping-basics',
}

export function categoryOf(slug: string): BlogCategory {
  const cat = BLOG_CATEGORIES.find(c => c.slug === (POST_CATEGORY[slug] ?? 'buying-guides'))
  return cat ?? BLOG_CATEGORIES[0]
}

export function getCategory(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find(c => c.slug === slug)
}
