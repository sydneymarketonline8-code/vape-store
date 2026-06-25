import { SITE_URL, WHATSAPP_NUMBER } from '@/lib/site'

/**
 * Site-wide structured data: the store as an Organization/OnlineStore, plus a
 * WebSite entry with a SearchAction (enables Google's sitelinks search box).
 */
export function SiteJsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Aussie Vape',
    url: SITE_URL,
    description:
      "Australia's online vape store. Shop disposables, pod systems, e-liquids, nicotine pouches and accessories with fast AU-wide shipping.",
    areaServed: { '@type': 'Country', name: 'Australia' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: `+${WHATSAPP_NUMBER}`,
      availableLanguage: 'English',
      areaServed: 'AU',
    },
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Aussie Vape',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  )
}
