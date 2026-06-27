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

      {/* FAQ with a very faint diagonal-line backdrop */}
      <div className="relative mt-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #111827 0, #111827 1px, transparent 1px, transparent 11px)' }}
        />
        <div className="relative">
          <FaqClient />
        </div>
      </div>

      {/* Still have questions? CTA */}
      <div className="mt-12 border-t border-neutral-200 py-16 text-center">
        <h2 className="text-xl font-bold uppercase tracking-wider text-neutral-900">Still Have Questions?</h2>
        <p className="mt-2 text-sm text-neutral-500">Our Australian-based team is here to help via WhatsApp and email.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="bg-neutral-900 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-neutral-700"
          >
            Contact Support
          </Link>
          <Link
            href="/products"
            className="border-2 border-neutral-900 bg-white px-6 py-3 text-sm font-bold uppercase tracking-wider text-neutral-900 transition-colors hover:bg-neutral-100"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  )
}
