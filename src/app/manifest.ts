import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aussie Vape — Online Vape Store',
    short_name: 'Aussie Vape',
    description: "Australia's online vape store — disposables, pods, e-liquids, pouches & accessories.",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1B7A3E',
    categories: ['shopping'],
  }
}
