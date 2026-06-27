/**
 * Australian states & territories for the /vape-delivery location pages.
 *
 * These are genuine **delivery** landing pages for an online-only store — not
 * fake "physical store" pages. Each page is differentiated by real, non-duplicate
 * content: the state's capital and major regions we deliver to, a realistic
 * delivery estimate, and that state/territory's own health authority (vaping
 * public-area rules are enforced at state level). This keeps them useful and
 * avoids Google's "doorway pages" problem. No physical address is implied.
 */
export interface StateInfo {
  slug: string
  abbr: string
  name: string
  capital: string
  /** Major cities / regions served, for unique on-page content + internal context. */
  cities: string[]
  /** Realistic delivery window after dispatch (metro fast end; regional slower). */
  deliveryDays: string
  /** The state/territory health authority that publishes local vaping rules. */
  health: { name: string; url: string }
}

export const STATES: StateInfo[] = [
  {
    slug: 'nsw',
    abbr: 'NSW',
    name: 'New South Wales',
    capital: 'Sydney',
    cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast', 'Maitland', 'Wagga Wagga', 'Coffs Harbour', 'Port Macquarie', 'Tamworth', 'Dubbo'],
    deliveryDays: '2–5 business days',
    health: { name: 'NSW Health', url: 'https://www.health.nsw.gov.au' },
  },
  {
    slug: 'vic',
    abbr: 'VIC',
    name: 'Victoria',
    capital: 'Melbourne',
    cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo', 'Shepparton', 'Melton', 'Mildura', 'Warrnambool', 'Traralgon', 'Wodonga'],
    deliveryDays: '2–5 business days',
    health: { name: 'Department of Health Victoria', url: 'https://www.health.vic.gov.au' },
  },
  {
    slug: 'qld',
    abbr: 'QLD',
    name: 'Queensland',
    capital: 'Brisbane',
    cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville', 'Cairns', 'Toowoomba', 'Mackay', 'Rockhampton', 'Bundaberg', 'Hervey Bay'],
    deliveryDays: '2–6 business days',
    health: { name: 'Queensland Health', url: 'https://www.health.qld.gov.au' },
  },
  {
    slug: 'wa',
    abbr: 'WA',
    name: 'Western Australia',
    capital: 'Perth',
    cities: ['Perth', 'Mandurah', 'Bunbury', 'Geraldton', 'Kalgoorlie', 'Albany', 'Busselton', 'Karratha', 'Broome'],
    deliveryDays: '4–7 business days',
    health: { name: 'WA Department of Health', url: 'https://www.health.wa.gov.au' },
  },
  {
    slug: 'sa',
    abbr: 'SA',
    name: 'South Australia',
    capital: 'Adelaide',
    cities: ['Adelaide', 'Mount Gambier', 'Whyalla', 'Murray Bridge', 'Port Augusta', 'Port Pirie', 'Gawler', 'Victor Harbor'],
    deliveryDays: '3–6 business days',
    health: { name: 'SA Health', url: 'https://www.sahealth.sa.gov.au' },
  },
  {
    slug: 'tas',
    abbr: 'TAS',
    name: 'Tasmania',
    capital: 'Hobart',
    cities: ['Hobart', 'Launceston', 'Devonport', 'Burnie', 'Kingston', 'Ulverstone'],
    deliveryDays: '4–7 business days',
    health: { name: 'Tasmanian Department of Health', url: 'https://www.health.tas.gov.au' },
  },
  {
    slug: 'act',
    abbr: 'ACT',
    name: 'Australian Capital Territory',
    capital: 'Canberra',
    cities: ['Canberra', 'Belconnen', 'Tuggeranong', 'Gungahlin', 'Woden Valley'],
    deliveryDays: '2–5 business days',
    health: { name: 'ACT Health', url: 'https://www.health.act.gov.au' },
  },
  {
    slug: 'nt',
    abbr: 'NT',
    name: 'Northern Territory',
    capital: 'Darwin',
    cities: ['Darwin', 'Palmerston', 'Alice Springs', 'Katherine', 'Nhulunbuy', 'Tennant Creek'],
    deliveryDays: '5–8 business days',
    health: { name: 'NT Health', url: 'https://health.nt.gov.au' },
  },
]

export function getState(slug: string): StateInfo | undefined {
  return STATES.find(s => s.slug === slug)
}
