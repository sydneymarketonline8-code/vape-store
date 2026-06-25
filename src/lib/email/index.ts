import { Resend } from 'resend'

// Transactional email via Resend. Templates are plain HTML strings (kept
// dependency-light instead of @react-email/components). All functions no-op
// safely when RESEND_API_KEY is unset, so callers never throw.
//
// Set in .env: RESEND_API_KEY, and optionally EMAIL_FROM.
// NOTE: these are ready to use but not yet wired into the order/auth flows —
// call them from /api/orders, the shipment update, signup, etc.

const FROM = process.env.EMAIL_FROM ?? 'Aussie Vape <orders@aussievape.com.au>'
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aussievape.com.au'

const money = (n: number) => `$${Number(n).toFixed(2)}`

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  return key ? new Resend(key) : null
}

async function send(to: string, subject: string, html: string) {
  const resend = getResend()
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipped "${subject}" to ${to}`)
    return { skipped: true as const }
  }
  const { data, error } = await resend.emails.send({ from: FROM, to, subject, html })
  if (error) {
    console.error('[email] send failed:', error)
    return { error }
  }
  return { data }
}

/** Wrap body content in a simple branded HTML shell. */
function layout(heading: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;color:#111827">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="text-align:center;padding:16px 0">
      <span style="font-size:22px;font-weight:800;letter-spacing:-.5px;color:#1B7A3E">AUSSIE VAPE</span>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:28px">
      <h1 style="margin:0 0 12px;font-size:20px;color:#111827">${heading}</h1>
      ${body}
    </div>
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin:18px 0 0">
      Aussie Vape · Australia's #1 Online Vape Store · For adults 18+ only
    </p>
  </div></body></html>`
}

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#1B7A3E;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px">${label}</a>`

// ── Types ────────────────────────────────────────────────────────────────────
interface OrderLike {
  id: string
  order_number?: string | null
  total: number
  email?: string | null
}
interface ItemLike {
  product_name: string
  quantity: number
  price: number
}
interface UserLike {
  email: string
  name?: string | null
}

// ── Templates ────────────────────────────────────────────────────────────────
export async function sendOrderConfirmation(order: OrderLike, items: ItemLike[], user: UserLike) {
  const ref = order.order_number ?? order.id.slice(0, 8).toUpperCase()
  const rows = items
    .map(
      i => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px">${i.product_name} × ${i.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;text-align:right">${money(i.price * i.quantity)}</td>
      </tr>`
    )
    .join('')
  const body = `
    <p style="font-size:14px;line-height:1.6;color:#4b5563">Hi ${user.name ?? 'there'}, thanks for your order <strong>${ref}</strong>. It's reserved as <strong>pending</strong> — we'll confirm payment with you on WhatsApp.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows}
      <tr><td style="padding:12px 0 0;font-weight:700">Total</td><td style="padding:12px 0 0;font-weight:700;text-align:right">${money(order.total)}</td></tr>
    </table>
    <p style="text-align:center;margin:8px 0">${btn(`${SITE}/order-confirmation/${order.id}`, 'View your order')}</p>`
  return send(user.email, `Order ${ref} received — Aussie Vape`, layout('Order received 🎉', body))
}

export async function sendShipmentNotification(order: OrderLike, trackingNumber: string, carrier: string) {
  const ref = order.order_number ?? order.id.slice(0, 8).toUpperCase()
  const body = `
    <p style="font-size:14px;line-height:1.6;color:#4b5563">Good news — your order <strong>${ref}</strong> is on its way!</p>
    <p style="font-size:14px;line-height:1.6;color:#4b5563">Carrier: <strong>${carrier}</strong><br/>Tracking number: <strong>${trackingNumber}</strong></p>
    <p style="text-align:center;margin:8px 0">${btn(`${SITE}/account/orders/${order.id}`, 'Track your order')}</p>`
  return send(order.email ?? '', `Your Aussie Vape order ${ref} has shipped`, layout('Your order has shipped 🚚', body))
}

export async function sendPasswordReset(email: string, resetUrl: string) {
  const body = `
    <p style="font-size:14px;line-height:1.6;color:#4b5563">We received a request to reset your Aussie Vape password. Click below to choose a new one. If you didn't request this, you can ignore this email.</p>
    <p style="text-align:center;margin:8px 0">${btn(resetUrl, 'Reset password')}</p>
    <p style="font-size:12px;color:#9ca3af;word-break:break-all">${resetUrl}</p>`
  return send(email, 'Reset your Aussie Vape password', layout('Reset your password', body))
}

export async function sendWelcomeEmail(user: UserLike) {
  const body = `
    <p style="font-size:14px;line-height:1.6;color:#4b5563">Welcome${user.name ? `, ${user.name}` : ''}! Your Aussie Vape account is ready. Browse 2,000+ disposables, pods, e-liquids and more, with fast Australia-wide delivery.</p>
    <p style="text-align:center;margin:8px 0">${btn(`${SITE}/products`, 'Start shopping')}</p>`
  return send(user.email, 'Welcome to Aussie Vape', layout('Welcome to Aussie Vape 👋', body))
}
