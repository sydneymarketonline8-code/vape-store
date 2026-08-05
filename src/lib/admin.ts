/**
 * Admin email allowlist (client-safe). Emails aren't secret; the authoritative
 * access gate is the server-side isAdmin() in supabase/server.ts. This shared
 * copy lets the UI surface admin entry points — the account-menu link and the
 * post-login redirect — without a server round-trip.
 */
export const ADMIN_EMAILS = ['admin@vapesau.com.au']

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase())
}
