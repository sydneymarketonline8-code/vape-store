/**
 * Admin email allowlist (client-safe). Emails aren't secret; the authoritative
 * access gate is the server-side isAdmin() in supabase/server.ts. This shared
 * copy lets the UI surface admin entry points — the account-menu link and the
 * post-login redirect — without a server round-trip.
 */
// Both are kept: the live admin account predates the domain change, and the
// new-domain address works the moment it's created.
export const ADMIN_EMAILS = ['admin@vapehubvapesaustralia.com', 'admin@vapesau.com.au']

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.trim().toLowerCase())
}
