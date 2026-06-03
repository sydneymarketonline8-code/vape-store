import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AgeGate } from '@/components/common/age-gate'

export const metadata: Metadata = {
  title: 'VapeStore — Premium Vaping Products',
  description:
    'Shop the best disposables, mods, e-liquids, and accessories. Free shipping on orders over $50. For adults 21+ only.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] antialiased font-sans">
        <AgeGate />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
