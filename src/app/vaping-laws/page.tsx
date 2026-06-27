import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Scale, CalendarClock, MapPin, ExternalLink, AlertTriangle } from 'lucide-react'
import { PageSchema, FaqList, type Faq } from '@/components/common/page-schema'
import { Crumb, H2, IconCard, Callout } from '@/components/common/page-ui'

export const metadata: Metadata = {
  title: 'Vaping Laws in Australia',
  description:
    'A plain-English overview of Australian vaping regulations — age limits, the TGA framework and where to check the current rules. General info, not legal advice.',
  alternates: { canonical: '/vaping-laws' },
}

const UPDATED = '27 June 2026'

const faqs: Faq[] = [
  { q: 'Is vaping legal in Australia?', a: 'Vaping is regulated nationally by the Therapeutic Goods Administration (TGA), and you must be 18 or older. The rules around how vapes are sold and supplied changed in 2024 and continue to change. For the current legal position, check the TGA and your state or territory health authority. This page is general information, not legal advice.' },
  { q: 'What is the legal age to vape in Australia?', a: 'It is illegal to sell vaping products to anyone under 18 anywhere in Australia.' },
  { q: 'Do I need a prescription to buy nicotine vapes in Australia?', a: 'Australia moved to a pharmacy-based supply model for vaping products in 2024. Depending on the product and your circumstances, a prescription may or may not be required. Check the TGA and a pharmacist for the current requirements that apply to you.' },
  { q: 'Can I vape in public in Australia?', a: 'Public and indoor vaping rules vary by state and territory and are often similar to smoking laws. Check your local council and your state or territory rules before vaping in public spaces.' },
  { q: 'Are nicotine pouches legal in Australia?', a: 'Regulation of nicotine pouches in Australia has been changing. Check the TGA and your state or territory health authority for the current position before purchasing.' },
  { q: 'Where can I find the latest Australian vaping laws?', a: 'The most current and authoritative information is published by the Therapeutic Goods Administration (tga.gov.au) and the Australian Department of Health, plus your state or territory health department.' },
]

export default function VapingLawsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name="Vaping Laws" slug="/vaping-laws" faqs={faqs} />
      <Crumb name="Vaping Laws" />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Vaping Laws in Australia</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">
        Australian vaping regulations change over time. The summary below is general information only and is not legal advice.
      </p>
      <p className="mt-1 text-xs text-gray-400">Last updated: {UPDATED}</p>

      <div className="mt-8 space-y-3">
        <IconCard icon={ShieldCheck} title="Age restriction (18+)">
          It is illegal to sell vaping products to anyone under 18 in Australia. We enforce strict age verification on every order and may request proof of age before dispatch or on delivery.
        </IconCard>
        <IconCard icon={Scale} title="How vaping is regulated">
          Vaping and nicotine products are regulated nationally by the Therapeutic Goods Administration (TGA), alongside state and territory laws. Customers are responsible for understanding the regulations that apply where they live.
        </IconCard>
        <IconCard icon={CalendarClock} title="What changed in 2024">
          Vaping products moved towards a pharmacy-based supply model, with sales through general retailers restricted. Some lower-strength products may be supplied by pharmacists to adults 18+ without a prescription, while others can require one. These rules continue to evolve.
        </IconCard>
        <IconCard icon={MapPin} title="Where you can vape">
          Public and indoor vaping rules vary by state and territory, and are often aligned with smoking laws. There is no single national rule — check your local council and your state or territory health authority.
        </IconCard>
      </div>

      <H2>Stay informed</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        <a href="https://www.tga.gov.au" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#1B7A3E]">
          <ExternalLink className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-[#1B7A3E]" />
          <span className="text-sm font-medium text-gray-800 group-hover:text-[#1B7A3E]">Therapeutic Goods Administration (TGA)</span>
        </a>
        <a href="https://www.health.gov.au" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#1B7A3E]">
          <ExternalLink className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-[#1B7A3E]" />
          <span className="text-sm font-medium text-gray-800 group-hover:text-[#1B7A3E]">Australian Department of Health</span>
        </a>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        New to vaping? See our <Link href="/beginners-guide" className="font-medium text-[#1B7A3E] hover:underline">Beginners Guide</Link>.
      </p>

      <H2>Frequently asked questions</H2>
      <FaqList items={faqs} />

      <div className="mt-8">
        <Callout icon={AlertTriangle} title="Disclaimer" tone="amber">
          This page is for general informational purposes only and does not constitute legal advice. Vaping regulations in Australia change
          frequently — always check with the TGA and your state or territory health authority for the most current information. For adults 18+
          only. Nicotine is an addictive chemical.
        </Callout>
      </div>
    </div>
  )
}
