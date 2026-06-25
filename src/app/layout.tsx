import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'
const DEFAULT_TITLE = "Aussie Vape — Australia's #1 Online Vape Store"
const DEFAULT_DESC =
  "Australia's leading online vape store. Shop disposables, pod systems, nicotine salts, e-liquids and accessories with fast AU-wide shipping."

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
    <html lang="en" className={`h-full ${inter.variable}`}>
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
