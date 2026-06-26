import type { Metadata } from 'next'
import Link from 'next/link'
import { InfoPage, Section, L } from '@/components/common/info-page'
import { PageSchema, FaqList, HowToSteps, type Faq, type HowToStep } from '@/components/common/page-schema'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Bulk & Wholesale Vapes Australia',
  description:
    'Buy vapes wholesale in Australia — trade pricing and bulk packs for retailers and businesses. Email us your ABN and product list for a quote.',
  alternates: { canonical: '/wholesale' },
}

const WHOLESALE_BRANDS = ['IGET', 'ALFAKHER', 'GUNNPOD', 'HQD', 'ALIBARBAR', 'LOST MARY', 'KUZ', 'JNR']

const steps: HowToStep[] = [
  { name: 'Email us', text: 'Send your business details and the products you’re after to wholesale@aussievape.com.au.' },
  { name: 'Include your ABN', text: 'Add your ABN and business name so we can confirm you’re a registered Australian business.' },
  { name: 'Get a quote', text: 'Our team replies with trade pricing for the products and quantities you need.' },
  { name: 'Place your order', text: 'Confirm your order and pay via PayID or crypto; we dispatch from our Australian warehouse.' },
]

const faqs: Faq[] = [
  {
    q: 'Does Aussie Vape supply vapes to retailers?',
    a: 'Yes. We supply convenience stores, tobacconists and registered Australian businesses with popular disposable, pod and pouch brands at trade pricing. Email wholesale@aussievape.com.au with your business details for a quote.',
  },
  {
    q: 'How do I apply for a wholesale account?',
    a: 'Email wholesale@aussievape.com.au with your business name, ABN and the products you’re interested in. We’ll reply with trade pricing and how to place your first order.',
  },
  {
    q: 'What is the minimum order for wholesale?',
    a: 'Wholesale pricing is tied to volume, so minimums depend on the products and quantities. Tell us what you need in your enquiry and we’ll quote accordingly. (A $250 minimum applies to standard retail orders.)',
  },
  {
    q: 'How do I pay for a wholesale order?',
    a: 'Wholesale orders are paid by PayID or cryptocurrency, the same as retail orders. We confirm the details with you directly once your quote is accepted.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Wholesale Vape Supply',
  serviceType: 'Wholesale vape supply',
  areaServed: { '@type': 'Country', name: 'Australia' },
  provider: { '@type': 'Organization', name: 'Aussie Vape', url: SITE_URL },
  url: `${SITE_URL}/wholesale`,
}

export default function WholesalePage() {
  return (
    <InfoPage
      title="Bulk & Wholesale Vapes Australia"
      intro="Buying for a store or in volume? We offer trade pricing and bulk vape packs with fast Australia-wide dispatch."
    >
      <PageSchema name="Bulk & Wholesale" slug="/wholesale" faqs={faqs} howTo={{ name: 'How to open an Aussie Vape wholesale account', steps }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      <Section heading="Who it's for">
        <p>Convenience stores, tobacconists, online resellers and registered Australian businesses looking to stock popular disposable, pod and nicotine-pouch brands at competitive trade rates.</p>
      </Section>

      <Section heading="Why buy wholesale with us">
        <p><strong>Trade pricing</strong> — competitive per-unit rates that scale with volume.</p>
        <p><strong>Bulk packs</strong> — many best-sellers come in multi-unit packs at a lower per-device price. Browse current <L href="/deals">bulk vape packs</L>.</p>
        <p><strong>Fast dispatch</strong> — orders ship from our Australian warehouse, Australia-wide.</p>
        <p><strong>Full range</strong> — access the same 2,000+ product catalogue, including multi-packs.</p>
      </Section>

      <Section heading="Brands available wholesale">
        <p>Popular brands we stock include:</p>
        <div className="flex flex-wrap gap-2">
          {WHOLESALE_BRANDS.map(b => (
            <Link
              key={b}
              href={`/products?brand=${encodeURIComponent(b)}`}
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
            >
              {b}
            </Link>
          ))}
        </div>
        <p>See the full list on our <L href="/brands">brands</L> page.</p>
      </Section>

      <Section heading="How to open a wholesale account">
        <HowToSteps steps={steps} />
        <p>
          Email <a href="mailto:wholesale@aussievape.com.au" className="text-[#1B7A3E] hover:underline">wholesale@aussievape.com.au</a> to get started.
        </p>
      </Section>

      <Section heading="Wholesale FAQ">
        <FaqList items={faqs} />
      </Section>

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </InfoPage>
  )
}
