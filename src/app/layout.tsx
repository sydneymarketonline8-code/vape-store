import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AgeGate } from '@/components/common/age-gate'
import { AnnouncementBar } from '@/components/layout/announcement-bar'
import { WishlistSync } from '@/components/common/wishlist-sync'
import { WhatsAppFab } from '@/components/common/whatsapp-fab'
import { ChromeGate } from '@/components/layout/chrome-gate'
import { GoogleTagManager, ChatWidget } from '@/components/common/analytics'
import { SiteJsonLd } from '@/components/common/site-jsonld'

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true, variable: '--font-inter' })
// Distinctive display face for headings (geometric, modern) — paired with Inter for body.
const outfit = Outfit({ subsets: ['latin'], display: 'swap', variable: '--font-outfit' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'
// Positioning is deliberately differentiated from the sibling site aussievapes.com.au
// (which owns the "Australia's #1 / largest range" angle) to avoid SEO cannibalisation.
// This site leads with deals / bundles / bulk packs.
const DEFAULT_TITLE = 'Aussie Vape — Vape Deals, Bundles & Bulk Packs Australia'
const DEFAULT_DESC =
  'Save more with multi-pack bundles and bulk vape deals at Aussie Vape — disposables, pods, e-liquids and nicotine pouches. Buy more, save more, with fast AU-wide shipping.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s — Aussie Vape',
  },
  description: DEFAULT_DESC,
  applicationName: 'Aussie Vape',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'Aussie Vape',
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`h-full ${inter.variable} ${outfit.variable}`}>
      <body className="flex min-h-full flex-col bg-white font-sans antialiased">
        <GoogleTagManager />
        <SiteJsonLd />
        <AgeGate />
        <WishlistSync />
        <ChromeGate>
          <AnnouncementBar />
          <Header />
        </ChromeGate>
        <main className="flex-1">{children}</main>
        <ChromeGate>
          <Footer />
          <WhatsAppFab />
        </ChromeGate>
        <ChatWidget />
      </body>
    </html>
  )
}
