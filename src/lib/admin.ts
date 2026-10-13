/**
 * Admin email allowlist (client-safe). Emails aren't secret; the authoritative
 * access gate is the server-side isAdmin() in supabase/server.ts. This shared
 * copy lets the UI surface admin entry points — the account-menu link and the
 * post-login redirect — without a server round-trip.
 */
// info@ is the live admin account (its profiles.role is also 'admin'); it is
// listed here as well so the UI entry points appear and so admin access
// survives a profiles-table reset, which has already happened once.
//
// admin@ is reserved for a future dedicated account — harmless while unused,
// since an allowlisted address still has to exist in Supabase Auth to log in.
//
// admin@vapesau.com.au was REMOVED deliberately. That domain is suspended, so
// if it were ever re-registered by someone else they could sign up with that
// address and be granted admin instantly. Never allowlist a domain you do not
// control.
export const ADMIN_EMAILS = [
  'info@vapehubvapesaustralia.com',
  'admin@vapehubvapesaustralia.com',
]

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase())
}
