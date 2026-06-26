// Store-wide contact + payment config.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'

// Brand tagline / logo strapline. Deliberately differentiated from the sibling
// site aussievapes.com.au (see memory) — do NOT use "Australia's #1 / largest".
export const SITE_TAGLINE = 'Vape Deals, Bundles & Bulk Packs'

// WhatsApp number in international format, digits only (for wa.me links).
// Hardcoded (no env override) so a stale NEXT_PUBLIC_WHATSAPP_NUMBER in the
// host can't bring back a previous/banned number. To change it, edit here.
export const WHATSAPP_NUMBER = '61468228364'

export type PaymentMethod = 'payid' | 'crypto'

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; blurb: string }[] = [
  { id: 'payid', label: 'PayID', blurb: 'Instant bank transfer via PayID' },
  { id: 'crypto', label: 'Cryptocurrency', blurb: 'Pay with BTC, ETH, USDT & more' },
]

export function paymentMethodLabel(method?: string | null): string {
  return PAYMENT_METHODS.find(m => m.id === method)?.label ?? 'PayID or Cryptocurrency'
}

/** Build a wa.me deep link with a prefilled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
