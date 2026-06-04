import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AgeGate } from '@/components/common/age-gate'
import { AnnouncementBar } from '@/components/layout/announcement-bar'

export const metadata: Metadata = {
  title: "Aussie Vapes — Australia's #1 Online Vape Store",
  description:
    "Australia's leading online vape wholesale store. Shop disposables, pod systems, nicotine salts, e-liquids and accessories with fast AU-wide shipping.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-white antialiased">
        <AgeGate />
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
