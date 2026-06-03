import { Product } from '@/types'
import rawData from './products-data.json'

// Auto-generated — do not edit manually. Re-run: node scripts/import-products.mjs

export const products = rawData as unknown as Product[]

export const getFeaturedProducts    = () => products.filter(p => p.featured)
export const getProductBySlug       = (slug: string) => products.find(p => p.slug === slug)
export const getProductsByCategory  = (category: string) => products.filter(p => p.category === category)
