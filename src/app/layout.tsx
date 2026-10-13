import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
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
import { SITE_URL } from '@/lib/site'

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true, variable: '--font-inter' })
// Distinctive display face for headings — paired with Inter for body.
const sora = Sora({ subsets: ['latin'], display: 'swap', variable: '--font-sora' })

// Positioning is deliberately differentiated from the sibling site aussievapes.com.au
// (which owns the "Australia's #1 / largest range" angle) to avoid SEO cannibalisation.
// This site leads with deals / bundles / bulk packs.
const DEFAULT_TITLE = 'VapeHub — Vape Deals, Bundles & Bulk Packs Australia'
const DEFAULT_DESC =
  'Save more with multi-pack bundles and bulk vape deals at VapeHub — disposables, pods, e-liquids and nicotine pouches. Buy more, save more, with fast AU-wide shipping.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: '%s — VapeHub',
  },
  description: DEFAULT_DESC,
  applicationName: 'VapeHub',
  alternates: { canonical: '/' },
  // Verification tokens are per-property (per-domain). The old ones belonged to
  // the suspended vapesau.com.au property and are dead, so they were removed.
  //
  // These are read from env so a new token needs no code change: set it in the
  // host and redeploy. Unset = the meta tag is simply omitted, which is the
  // right default — a wrong token is worse than none.
  //
  // Prefer DNS TXT verification for a Search Console *Domain* property: it
  // needs no deploy at all and covers apex, www and future subdomains. Use
  // these only for the meta-tag (URL-prefix) route.
  //   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION — Search Console HTML tag
  //   NEXT_PUBLIC_BING_SITE_VERIFICATION   — Bing Webmaster Tools (msvalidate.01)
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    siteName: 'VapeHub',
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
    <html lang="en-AU" className={`h-full ${inter.variable} ${sora.variable}`}>
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
