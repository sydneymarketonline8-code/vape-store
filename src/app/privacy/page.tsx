import type { Metadata } from 'next'
import Link from 'next/link'
import { PageSchema } from '@/components/common/page-schema'
import { Crumb, H2 } from '@/components/common/page-ui'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Aussie Vape collects, uses and protects your personal information — orders, delivery, payment (PayID/crypto), cookies and analytics, and your privacy rights under Australian law.',
  alternates: { canonical: '/privacy' },
}

const UPDATED = '28 June 2026'

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name="Privacy Policy" slug="/privacy" />
      <Crumb name="Privacy Policy" />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Privacy Policy</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">
        Your privacy matters. This policy explains what personal information Aussie Vape collects, how we use it, and the
        choices you have. It is written to align with the Australian Privacy Principles.
      </p>
      <p className="mt-1 text-xs text-gray-400">Last updated: {UPDATED}</p>

      <div className="mt-8 max-w-3xl space-y-2 text-sm leading-relaxed text-gray-600">
        <H2>Information we collect</H2>
        <p>
          To process orders and run the store we may collect: your name, email address, phone number and delivery address;
          your order and account details; messages you send us (including over WhatsApp and email); and technical data such as
          your device, browser and pages viewed, collected via cookies and analytics.
        </p>

        <H2>Payment information</H2>
        <p>
          We accept <strong>PayID</strong> and <strong>cryptocurrency</strong>. Payments are arranged directly with you (for
          example via WhatsApp) — we do <strong>not</strong> collect or store your card numbers or bank login details on this
          website.
        </p>

        <H2>How we use your information</H2>
        <p>
          We use your information to process and deliver orders, verify age and eligibility (18+), provide customer support,
          prevent fraud, meet legal obligations, and — only if you opt in — send you marketing such as new-product alerts and
          offers. You can unsubscribe from marketing at any time.
        </p>

        <H2>Who we share it with</H2>
        <p>
          We share information only as needed to run the store: with delivery and logistics partners to ship your order, and
          with service providers who help us operate the website (such as hosting and analytics). We do <strong>not</strong>{' '}
          sell your personal information. We may disclose information where required by law.
        </p>

        <H2>Cookies &amp; analytics</H2>
        <p>
          We use cookies and similar technologies to keep the site working (for example your cart and age-verification
          choice), to understand how the site is used, and to improve it. This may include third-party tools such as Google
          Tag Manager/Analytics and an on-site chat widget. You can control cookies through your browser settings, though some
          features may not work without them.
        </p>

        <H2>Data security &amp; retention</H2>
        <p>
          We take reasonable steps to protect your information from misuse, loss and unauthorised access. We keep personal
          information only for as long as needed for the purposes above or as required by law, then delete or de-identify it.
        </p>

        <H2>Your rights</H2>
        <p>
          You can ask to access or correct the personal information we hold about you, or request its deletion, by contacting
          us. We will respond in line with Australian privacy law.
        </p>

        <H2>Children</H2>
        <p>
          This website and our products are intended for adults 18 and over only. We do not knowingly collect information from
          anyone under 18.
        </p>

        <H2>Contact &amp; changes</H2>
        <p>
          We may update this policy from time to time; the current version always applies. To make a privacy request or ask a
          question, visit our <Link href="/contact" className="font-medium text-[#1B7A3E] hover:underline">Contact</Link> page
          or email <a href="mailto:support@aussievape.com.au" className="font-medium text-[#1B7A3E] hover:underline">support@aussievape.com.au</a>.
        </p>
      </div>

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </div>
  )
}
