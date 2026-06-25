import type { Metadata } from 'next'
import Link from 'next/link'
import { FaqClient } from '@/components/common/faq-client'
import { FAQ_SECTIONS } from '@/data/faqs'

export const metadata: Metadata = {
  title: 'Help & FAQs',
  description: 'Answers about ordering, PayID/crypto payment, shipping, returns and products at Aussie Vape.',
}

export default function FaqPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_SECTIONS.flatMap(s =>
      s.items.map(i => ({
        '@type': 'Question',
        name: i.q,
        acceptedAnswer: { '@type': 'Answer', text: i.a },
      }))
    ),
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <nav className="mb-6 text-xs text-gray-400">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-gray-600">Help &amp; FAQs</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Help &amp; FAQs</h1>
      <p className="mt-3 leading-relaxed text-gray-500">Answers to the questions we hear most often. Still stuck? Message us on WhatsApp.</p>
      <div className="mt-8">
        <FaqClient />
      </div>
    </div>
  )
}
