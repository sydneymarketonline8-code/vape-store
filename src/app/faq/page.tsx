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

      {/* FAQ accordion — clean white, no background texture */}
      <div className="mt-8">
        <FaqClient />
      </div>

      {/* Still have questions? — on-brand, compact card */}
      <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
        <h2 className="text-lg font-bold text-gray-900">Still have questions?</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          Our Australian-based team is here to help via WhatsApp and email.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-[#1B7A3E] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#156331]"
          >
            Contact Support
          </Link>
          <Link
            href="/products"
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-400"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  )
}
