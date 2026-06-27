import { IMAGE_OVERRIDES } from '@/data/image-overrides'

/** Minimal shape needed to resolve an image — keeps this client-safe. */
interface ImageProduct {
  slug: string
  image: string
  images?: string[]
}

/**
 * Primary product image: a real override from IMAGE_OVERRIDES if one exists for
 * this slug, otherwise the catalogue (placeholder) image.
 */
export function productImage(product: ImageProduct): string {
  const o = IMAGE_OVERRIDES[product.slug]
  if (Array.isArray(o)) return o[0] ?? product.image
  return o ?? product.image
}

/**
 * Gallery images: real overrides if present (array = full gallery, string =
 * single), otherwise the catalogue images / image.
 */
export function productImages(product: ImageProduct): string[] {
  const o = IMAGE_OVERRIDES[product.slug]
  if (Array.isArray(o)) return o.length ? o : [product.image]
  if (typeof o === 'string') return [o]
  return product.images?.length ? product.images : [product.image]
}
