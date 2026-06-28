import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aussie Vape — Vape Deals & Bulk Packs',
    short_name: 'Aussie Vape',
    description: 'Multi-pack bundles and bulk vape deals — disposables, pods, e-liquids & pouches with fast AU shipping.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1B7A3E',
    categories: ['shopping'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  }
}
