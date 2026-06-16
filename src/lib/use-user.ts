'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AccountUser } from '@/components/layout/account-menu'

/**
 * Client-side auth state for the header. Reading the session here (rather than
 * in a Server Component) keeps `cookies()` out of the render path so the rest
 * of the site can stay statically rendered. Re-runs on auth changes.
 */
export function useUser(): AccountUser | null {
  const [user, setUser] = useState<AccountUser | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let active = true

    async function load() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        if (active) setUser(null)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', authUser.id)
        .single<{ first_name: string | null; last_name: string | null; email: string | null }>()

      if (!active) return

      const first = profile?.first_name ?? ''
      const last = profile?.last_name ?? ''
      const email = profile?.email ?? authUser.email ?? ''
      const name = `${first} ${last}`.trim() || email.split('@')[0] || 'Account'
      const initials = (first[0] ?? '') + (last[0] ?? '') || email.slice(0, 2)

      setUser({ name, email, initials: initials.toUpperCase() })
    }

    load()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => load())

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return user
}
