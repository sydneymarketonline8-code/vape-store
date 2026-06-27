import type { Metadata } from 'next'
import Link from 'next/link'
import { Tag, Package, Truck, Boxes, Store } from 'lucide-react'
import { PageSchema, FaqList, HowToSteps, type Faq, type HowToStep } from '@/components/common/page-schema'
import { Crumb, H2, IconCard, Callout } from '@/components/common/page-ui'
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

const BENEFITS = [
  { icon: Tag, title: 'Trade pricing', desc: 'Competitive per-unit rates that scale with volume.' },
  { icon: Package, title: 'Bulk packs', desc: 'Best-sellers in multi-unit packs at a lower per-device price.', href: '/deals', cta: 'Pack deals' },
  { icon: Truck, title: 'Fast dispatch', desc: 'Orders ship from our Australian warehouse, Australia-wide.' },
  { icon: Boxes, title: 'Full range', desc: 'Access the same 2,000+ product catalogue, including multi-packs.' },
]

const faqs: Faq[] = [
  { q: 'Does Aussie Vape supply vapes to retailers?', a: 'Yes. We supply convenience stores, tobacconists and registered Australian businesses with popular disposable, pod and pouch brands at trade pricing. Email wholesale@aussievape.com.au with your business details for a quote.' },
  { q: 'How do I apply for a wholesale account?', a: 'Email wholesale@aussievape.com.au with your business name, ABN and the products you’re interested in. We’ll reply with trade pricing and how to place your first order.' },
  { q: 'What is the minimum order for wholesale?', a: 'Wholesale pricing is tied to volume, so minimums depend on the products and quantities. Tell us what you need in your enquiry and we’ll quote accordingly. (A $250 minimum applies to standard retail orders.)' },
  { q: 'How do I pay for a wholesale order?', a: 'Wholesale orders are paid by PayID or cryptocurrency, the same as retail orders. We confirm the details with you directly once your quote is accepted.' },
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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name="Bulk & Wholesale" slug="/wholesale" faqs={faqs} howTo={{ name: 'How to open an Aussie Vape wholesale account', steps }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <Crumb name="Bulk & Wholesale" />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Bulk &amp; Wholesale Vapes Australia</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">
        Buying for a store or in volume? We offer trade pricing and bulk vape packs with fast Australia-wide dispatch.
      </p>

      <Callout icon={Store} title="Who it's for">
        Convenience stores, tobacconists, online resellers and registered Australian businesses looking to stock popular disposable, pod and nicotine-pouch brands at competitive trade rates.
      </Callout>

      <H2>Why buy wholesale with us</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        {BENEFITS.map(({ icon, title, desc, href, cta }) => (
          <IconCard key={title} icon={icon} title={title} href={href} cta={cta}>
            {desc}
          </IconCard>
        ))}
      </div>

      <H2>Brands available wholesale</H2>
      <div className="flex flex-wrap gap-2">
        {WHOLESALE_BRANDS.map(b => (
          <Link
            key={b}
            href={`/products?brand=${encodeURIComponent(b)}`}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
          >
            {b}
          </Link>
        ))}
      </div>
      <p className="mt-3 text-sm text-gray-500">
        See the full list on our <Link href="/brands" className="font-medium text-[#1B7A3E] hover:underline">brands</Link> page.
      </p>

      <H2>How to open a wholesale account</H2>
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <HowToSteps steps={steps} />
        <p className="mt-4 text-sm text-gray-500">
          Email <a href="mailto:wholesale@aussievape.com.au" className="font-medium text-[#1B7A3E] hover:underline">wholesale@aussievape.com.au</a> to get started.
        </p>
      </div>

      <H2>Wholesale FAQ</H2>
      <FaqList items={faqs} />

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical.</p>
    </div>
  )
}
