import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Gauge, Scale, Wrench } from 'lucide-react'
import { PageSchema, FaqList, HowToSteps, type Faq, type HowToStep } from '@/components/common/page-schema'
import { Crumb, H2, IconCard, Callout } from '@/components/common/page-ui'
import { CategoryIcon } from '@/components/icons/category-icons'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Beginners Guide — Vaping in Australia',
  description:
    'New to vaping? A plain-English guide to device types, nicotine strengths and how to use a disposable — for adult Australians. General info, not health advice.',
  alternates: { canonical: '/beginners-guide' },
}

const UPDATED = '2026-06-27'

const steps: HowToStep[] = [
  { name: 'Unpack it', text: 'Remove the disposable from its packaging and take off any silicone caps on the mouthpiece and base.' },
  { name: 'Inhale gently', text: 'Most disposables are draw-activated — just inhale on the mouthpiece, no buttons.' },
  { name: 'Take a slow draw', text: 'Draw slowly for 3–4 seconds rather than hard and fast.' },
  { name: 'Pace yourself', text: 'Wait around 30 seconds between puffs so the coil can re-saturate.' },
  { name: 'Store it safely', text: 'Keep it away from heat and water, and out of reach of children and pets.' },
]

const DEVICES = [
  { slug: 'disposables', name: 'Disposable vapes', href: '/collections/disposables', best: 'Best for: beginners & convenience', desc: 'Ready to use, nothing to charge or refill. The simplest place to start and great for trying flavours.' },
  { slug: 'mods', name: 'Pod systems & kits', href: '/collections/mods', best: 'Best for: regular vapers', desc: 'Rechargeable and refillable, so they cost less per puff over time, with more control over flavour and strength.' },
  { slug: 'pouches', name: 'Nicotine pouches', href: '/collections/pouches', best: 'Best for: no device, no vapour', desc: 'A smoke-free option placed under the lip — discreet and easy to use anywhere.' },
]

const faqs: Faq[] = [
  { q: 'What vape should I start with in Australia?', a: 'Most beginners start with a disposable — there is no setup, charging or refilling, so you can try flavours and nicotine strengths with the least fuss. If you vape regularly, a refillable pod system usually works out cheaper over time.' },
  { q: 'How do I use a disposable vape?', a: 'Unpack it, remove any silicone caps, then inhale gently on the mouthpiece — most disposables are draw-activated with no buttons. Draw slowly for a few seconds and pace yourself between puffs.' },
  { q: 'What nicotine strength should a beginner use?', a: 'Nicotine strength is shown in mg/mL. If you are unsure, start lower — you can move up if it is not enough. Nicotine-free options are also available. Strengths are listed on each product page where applicable.' },
  { q: 'Is vaping safe for beginners?', a: 'We cannot give medical advice and vaping is not risk-free. If you have health questions, speak to a doctor or pharmacist. This guide covers device types and how to choose; for the rules in Australia see our Vaping Laws page.' },
  { q: 'Can I buy vapes online in Australia?', a: 'Australian vaping rules changed in 2024 and are regulated by the TGA, and they continue to change. See our Vaping Laws page and your state or territory health authority for the current position. Aussie Vape is an age-verified store for adults 18+.' },
]

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Beginners Guide to Vaping in Australia',
  description: 'A plain-English guide to vape device types, nicotine strengths and how to use a disposable, for adult Australians.',
  author: { '@type': 'Organization', name: 'Aussie Vape', url: SITE_URL },
  publisher: { '@type': 'Organization', name: 'Aussie Vape', url: SITE_URL },
  datePublished: '2026-06-01',
  dateModified: UPDATED,
  mainEntityOfPage: `${SITE_URL}/beginners-guide`,
}

export default function BeginnersGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageSchema name="Beginners Guide" slug="/beginners-guide" faqs={faqs} howTo={{ name: 'How to use a disposable vape', steps }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Crumb name="Beginners Guide" />
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Beginners Guide to Vaping in Australia</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-gray-500">
        A plain-English introduction for adult Australians choosing their first setup. General information only — not health or medical advice.
      </p>

      <H2>What is vaping?</H2>
      <p className="max-w-2xl text-sm leading-relaxed text-gray-600">
        A vape heats e-liquid into an inhalable vapour. A battery powers a coil, the coil heats the e-liquid, and you draw the vapour through a
        mouthpiece. Devices range from simple all-in-one disposables to refillable pod systems you top up yourself.
      </p>

      <H2>Which type is right for you?</H2>
      <div className="grid gap-3 sm:grid-cols-3">
        {DEVICES.map(d => (
          <Link key={d.slug} href={d.href} className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#1B7A3E] hover:shadow-sm">
            <CategoryIcon slug={d.slug} className="h-10 w-10" />
            <p className="mt-3 text-sm font-bold text-gray-900 group-hover:text-[#1B7A3E]">{d.name}</p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[#1B7A3E]">{d.best}</p>
            <p className="mt-2 flex-1 text-sm text-gray-500">{d.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#1B7A3E]">Shop <ArrowRight className="h-3 w-3" /></span>
          </Link>
        ))}
      </div>

      <H2>Nicotine strength &amp; types</H2>
      <div className="grid gap-3 sm:grid-cols-2">
        <IconCard icon={Gauge} title="Strength (mg/mL)">
          Lower strengths suit lighter use; higher strengths deliver more per puff; nicotine-free options exist. If unsure, start lower.
        </IconCard>
        <IconCard icon={Scale} title="Salt vs freebase" href="/collections/e-liquids" cta="E-Liquids & Salts">
          Nicotine salt is smoother at higher strengths (common in pods/disposables); freebase gives a stronger throat hit.
        </IconCard>
      </div>

      <H2>How to use a disposable vape</H2>
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <HowToSteps steps={steps} />
      </div>

      <H2>Vaping &amp; the law in Australia</H2>
      <Callout icon={Scale} title="The rules changed in 2024">
        <p>
          You must be 18 or older. Vaping products are regulated by the TGA and the rules changed in 2024 — and continue to change. For the current
          position, see our <Link href="/vaping-laws" className="font-medium text-[#1B7A3E] hover:underline">Vaping Laws</Link> page and your state or territory health authority.
        </p>
      </Callout>

      <H2>Looking after your device</H2>
      <IconCard icon={Wrench} title="Care & storage">
        Keep devices away from heat and water, charge rechargeables with the correct cable, and store e-liquids and devices out of reach of children and pets.
      </IconCard>

      <H2>Beginner FAQ</H2>
      <FaqList items={faqs} />

      <p className="mt-8 text-xs text-gray-400">For adults 18+ only. Nicotine is an addictive chemical. General information only — not health advice.</p>
    </div>
  )
}
