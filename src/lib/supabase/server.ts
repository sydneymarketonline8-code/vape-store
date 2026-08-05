import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

/**
 * Service-role client — bypasses RLS. Use ONLY in trusted server code (never
 * expose to the browser) for operations the anon/auth policies don't cover,
 * e.g. creating orders at checkout. The caller is responsible for validation
 * and for setting fields like user_id correctly.
 */
export function createServiceClient() {
  return createSupabaseJsClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — cookies will be set by middleware
          }
        },
      },
    }
  )
}

/**
 * Accounts that are always treated as admin, regardless of their profiles.role.
 * Add more here, or via the ADMIN_EMAILS env var (comma-separated). The account
 * must still exist in Supabase Auth (be registered) so it can log in.
 */
const ADMIN_EMAILS = new Set(
  ['admin@vapesau.com.au', ...(process.env.ADMIN_EMAILS?.split(',') ?? [])]
    .map(e => e.trim().toLowerCase())
    .filter(Boolean),
)

/** True if the given user (defaults to the current session user) is an admin. */
export async function isAdmin(userId?: string): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Email allowlist — applies to the current session user.
  if (user?.email && ADMIN_EMAILS.has(user.email.toLowerCase()) && (!userId || userId === user.id)) {
    return true
  }

  const id = userId ?? user?.id
  if (!id) return false
  const { data } = await supabase.from('profiles').select('role').eq('id', id).maybeSingle()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any)?.role === 'admin'
}
