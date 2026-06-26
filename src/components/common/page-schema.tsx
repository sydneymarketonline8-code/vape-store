import { SITE_URL } from '@/lib/site'

export interface Faq {
  q: string
  a: string
}
export interface HowToStep {
  name: string
  text: string
}

/**
 * Emits BreadcrumbList + (optional) FAQPage + (optional) HowTo JSON-LD for a
 * support/policy page. Answer/step text must match what's rendered on the page.
 */
export function PageSchema({
  name,
  slug,
  faqs,
  howTo,
}: {
  name: string
  slug: string
  faqs?: Faq[]
  howTo?: { name: string; steps: HowToStep[] }
}) {
  const blocks: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${slug}` },
      ],
    },
  ]
  if (faqs?.length) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  if (howTo) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: howTo.name,
      step: howTo.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text })),
    })
  }
  return (
    <>
      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }} />
      ))}
    </>
  )
}

/** Visible FAQ list whose text matches the FAQPage schema. */
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200">
      {items.map(f => (
        <div key={f.q} className="p-4">
          <h3 className="text-sm font-semibold text-gray-900">{f.q}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{f.a}</p>
        </div>
      ))}
    </div>
  )
}

/** Numbered, visible HowTo steps that match the HowTo schema. */
export function HowToSteps({ steps }: { steps: HowToStep[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => (
        <li key={s.name} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-xs font-bold text-[#1B7A3E]">
            {i + 1}
          </span>
          <span className="text-sm leading-relaxed text-gray-600">
            <span className="font-semibold text-gray-900">{s.name}.</span> {s.text}
          </span>
        </li>
      ))}
    </ol>
  )
}
