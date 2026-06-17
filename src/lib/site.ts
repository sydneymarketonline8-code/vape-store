// Store-wide contact + payment config.

// WhatsApp number in international format, digits only (no +, spaces or dashes).
// Override per-environment with NEXT_PUBLIC_WHATSAPP_NUMBER.
// NOTE: confirm this is the correct store WhatsApp number.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '61480831679'

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
