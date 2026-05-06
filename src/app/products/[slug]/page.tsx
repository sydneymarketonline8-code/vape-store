import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/data/products'
import { ProductDetailClient } from '@/components/shop/product-detail-client'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  return <ProductDetailClient product={product} />
}
