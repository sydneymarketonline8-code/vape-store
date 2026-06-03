import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AgeGate } from '@/components/common/age-gate'
import { AnnouncementBar } from '@/components/layout/announcement-bar'

export const metadata: Metadata = {
  title: 'Aussie Vape — Premium Vapes & E-Cigarettes',
  description:
    "Australia's best online vape store. Shop disposables, mods, e-liquids and accessories with fast shipping.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Rajdhani for headings, Inter for body — loaded async so build never blocks */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col bg-[#0a0a0f] antialiased">
        <AgeGate />
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
