// Single source of truth for the header navigation + "Shop" mega-menu taxonomy.
// Top-level items render in the desktop nav row and the mobile drawer; the Shop
// item opens the full-width MegaMenuPanel built from SHOP_CATEGORIES.

export interface SubCategory {
  label: string
  href: string
}

export interface ShopCategory {
  /** matches the products.category / DB categories.slug */
  slug: string
  label: string
  href: string
  /** short tagline shown under the parent label in the mega panel */
  blurb: string
  subcategories: SubCategory[]
}

export interface NavItem {
  label: string
  href: string
  /** opens the Shop mega panel on hover/focus */
  mega?: boolean
  /** rendered in the accent colour (sales / promos) */
  highlight?: boolean
}

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    slug: 'disposables',
    label: 'Disposable Vapes',
    href: '/products?category=disposables',
    blurb: 'Ready-to-use, no refills',
    subcategories: [
      { label: 'All Disposables', href: '/products?category=disposables' },
      { label: 'Nicotine-Free', href: '/products?tag=nicotine-free' },
      { label: 'Lower Nicotine', href: '/products?tag=lower-nicotine' },
      { label: 'IGET', href: '/products?brand=IGET' },
      { label: 'Gunnpod', href: '/products?brand=GUNNPOD' },
      { label: 'HQD', href: '/products?brand=HQD' },
      { label: 'Lost Mary', href: '/products?brand=LOST MARY' },
    ],
  },
  {
    slug: 'mods',
    label: 'Pod Systems',
    href: '/products?category=mods',
    blurb: 'Refillable kits & devices',
    subcategories: [
      { label: 'All Pod Systems', href: '/products?category=mods' },
      { label: 'Starter Kits', href: '/products?tag=starter-kit' },
      { label: 'Pods & Coils', href: '/products?tag=pods-coils' },
      { label: 'Vaporesso', href: '/products?brand=VAPORESSO' },
      { label: 'SMOK', href: '/products?brand=SMOK' },
    ],
  },
  {
    slug: 'e-liquids',
    label: 'E-Liquids & Salts',
    href: '/products?category=e-liquids',
    blurb: 'Freebase & nic salts',
    subcategories: [
      { label: 'All E-Liquids', href: '/products?category=e-liquids' },
      { label: 'Nicotine Salts', href: '/products?tag=nic-salt' },
      { label: 'Freebase', href: '/products?tag=freebase' },
      { label: '30ml', href: '/products?tag=30ml' },
      { label: '60ml', href: '/products?tag=60ml' },
    ],
  },
  {
    slug: 'pouches',
    label: 'Pouches',
    href: '/products?category=pouches',
    blurb: 'Nicotine & caffeine pouches',
    subcategories: [
      { label: 'All Pouches', href: '/products?category=pouches' },
      { label: 'Nicotine-Free', href: '/products?category=pouches&tag=nicotine-free' },
    ],
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    href: '/products?category=accessories',
    blurb: 'Chargers, cases & spares',
    subcategories: [
      { label: 'All Accessories', href: '/products?category=accessories' },
      { label: 'Chargers', href: '/products?tag=charger' },
      { label: 'Cases', href: '/products?tag=case' },
      { label: 'Batteries', href: '/products?tag=battery' },
    ],
  },
]

export const NAV_ITEMS: NavItem[] = [
  { label: 'Shop', href: '/products', mega: true },
  { label: 'Sale', href: '/products?sale=true', highlight: true },
  { label: 'Deals', href: '/deals' },
  { label: 'New Arrivals', href: '/products?sort=new' },
  { label: 'Brands', href: '/brands' },
  { label: 'Affiliate', href: '/affiliate' },
]

// Links shown in the authenticated account dropdown + mobile drawer footer.
export const ACCOUNT_LINKS = [
  { label: 'My Orders', href: '/account/orders' },
  { label: 'Discount Coupons', href: '/account/coupons' },
  { label: 'Account Info', href: '/account' },
  { label: 'Referral Program', href: '/affiliate' },
  { label: 'Wishlist', href: '/wishlist' },
] as const
