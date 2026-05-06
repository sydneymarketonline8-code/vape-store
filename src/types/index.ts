export type ProductCategory = 'disposables' | 'mods' | 'e-liquids' | 'accessories'

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
