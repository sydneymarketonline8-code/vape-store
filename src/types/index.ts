export type ProductCategory = 'disposables' | 'mods' | 'e-liquids' | 'pouches' | 'accessories'

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: ProductCategory
  price: number
  originalPrice?: number
  image: string
  images: string[]
  description: string
  shortDescription: string
  flavors?: string[]
  nicotineStrengths?: number[]
  inStock: boolean
  featured: boolean
  rating: number
  reviewCount: number
  tags: string[]
  puffCount?: number
  mlSize?: number
  // Forward-looking optional fields (present once products are sourced from the
  // Supabase schema; undefined for the current local-JSON catalogue).
  sku?: string
  inventoryQty?: number
  status?: 'active' | 'draft' | 'pre_order' | 'sold_out'
  videoUrl?: string
  manualUrl?: string
  specs?: Record<string, string>
}

export interface ProductReview {
  id: string
  productId: string
  reviewerName: string
  rating: number
  title?: string | null
  body: string
  createdAt: string
  verified?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selectedFlavor?: string
  selectedNicotine?: number
}

export interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, options?: { flavor?: string; nicotine?: number }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setOpen: (open: boolean) => void
}
