import type { Metadata } from 'next'
import Link from 'next/link'
import { PageSchema } from '@/components/common/page-schema'
import { Crumb, H2 } from '@/components/common/page-ui'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Aussie Vape Terms of Service — eligibility (18+), orders and payment (PayID/crypto), pricing, shipping, returns and acceptable use for our Australian online vape store.',
  alternates: { canonical: '/terms' },
}

const UPDATED = '28 June 2026'

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name="Terms of Service" slug="/terms" />
      <Crumb name="Terms of Service" />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Terms of Service</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">
        These terms govern your use of Aussie Vape and any purchase you make from us. By using this website or placing an
        order, you agree to them.
      </p>
      <p className="mt-1 text-xs text-gray-400">Last updated: {UPDATED}</p>

      <div className="mt-8 max-w-3xl space-y-2 text-sm leading-relaxed text-gray-600">
        <H2>1. Eligibility (18+)</H2>
        <p>
          You must be at least 18 years of age to use this website or purchase any product. By placing an order you confirm
          that you are 18 or older. We operate an age-verified store and may require proof of age before dispatch or on
          delivery. See our <Link href="/vaping-laws" className="font-medium text-[#1B7A3E] hover:underline">Vaping Laws</Link> page.
        </p>

        <H2>2. Products &amp; pricing</H2>
        <p>
          All prices are in Australian dollars (AUD) and include GST where applicable. We try to keep product information,
          pricing and availability accurate, but errors can occur and stock is limited — we reserve the right to correct
          errors and to change or discontinue products at any time. Product descriptions are general information and do not
          make any health or therapeutic claims.
        </p>

        <H2>3. Orders &amp; payment</H2>
        <p>
          A minimum order of $250 applies. We accept <strong>PayID</strong> and <strong>cryptocurrency</strong>. After you
          place an order, we send the payment details to you (typically via WhatsApp) to confirm and lock in your order. An
          order is only accepted once payment has been confirmed. We may cancel or refuse an order — for example where stock
          is unavailable, where we cannot verify your age, or where we suspect fraud — and will refund any payment made for a
          cancelled order. See <Link href="/contact" className="font-medium text-[#1B7A3E] hover:underline">how payment works</Link>.
        </p>

        <H2>4. Shipping</H2>
        <p>
          We deliver within Australia only. Delivery timeframes are estimates, not guarantees. Full details, costs and
          timings are on our <Link href="/shipping" className="font-medium text-[#1B7A3E] hover:underline">Shipping Policy</Link> and{' '}
          <Link href="/vape-delivery" className="font-medium text-[#1B7A3E] hover:underline">Vape Delivery</Link> pages.
        </p>

        <H2>5. Returns &amp; refunds</H2>
        <p>
          Unopened products may be returned within 30 days, and faulty items are replaced or refunded, as set out in our{' '}
          <Link href="/returns" className="font-medium text-[#1B7A3E] hover:underline">Returns &amp; Refunds</Link> policy.
          Nothing in these terms limits any rights you have under the Australian Consumer Law.
        </p>

        <H2>6. Acceptable use</H2>
        <p>
          You agree not to use this website unlawfully, to attempt to gain unauthorised access to our systems, to disrupt the
          site, or to purchase products on behalf of anyone under 18. We may suspend or terminate access for any breach of
          these terms.
        </p>

        <H2>7. Intellectual property</H2>
        <p>
          The content on this website — including text, graphics, logos and layout — is owned by or licensed to Aussie Vape
          and may not be copied or reused without permission, except brand and product names which belong to their respective
          owners.
        </p>

        <H2>8. Limitation of liability</H2>
        <p>
          To the maximum extent permitted by law, Aussie Vape is not liable for any indirect or consequential loss arising
          from your use of the website or products. Vaping is not risk-free; we provide general information only and not
          health or medical advice. Nothing in these terms excludes any liability that cannot be excluded under the
          Australian Consumer Law.
        </p>

        <H2>9. Governing law</H2>
        <p>
          These terms are governed by the laws of Australia and the state or territory in which we operate, and you submit to
          the non-exclusive jurisdiction of its courts.
        </p>

        <H2>10. Changes &amp; contact</H2>
        <p>
          We may update these terms from time to time; the current version always applies. Questions? Visit our{' '}
          <Link href="/contact" className="font-medium text-[#1B7A3E] hover:underline">Contact</Link> page or email{' '}
          <a href="mailto:support@aussievape.com.au" className="font-medium text-[#1B7A3E] hover:underline">support@aussievape.com.au</a>.
        </p>
      </div>

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </div>
  )
}
