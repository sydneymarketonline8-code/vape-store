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

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true, variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.aussievape.com.au'),
  title: {
    default: "Aussie Vape — Australia's #1 Online Vape Store",
    template: '%s — Aussie Vape',
  },
  description:
    "Australia's leading online vape wholesale store. Shop disposables, pod systems, nicotine salts, e-liquids and accessories with fast AU-wide shipping.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <body className="flex min-h-full flex-col bg-white font-sans antialiased">
        <GoogleTagManager />
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
