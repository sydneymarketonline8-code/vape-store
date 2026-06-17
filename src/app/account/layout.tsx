import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountSidebar } from '@/components/account/account-sidebar'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Middleware already guards /account, but guard here too for safety.
  if (!user) redirect('/login?redirect=/account')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, email, avatar_url')
    .eq('id', user.id)
    .maybeSingle<{ first_name: string | null; last_name: string | null; email: string | null; avatar_url: string | null }>()

  const first = profile?.first_name ?? ''
  const last = profile?.last_name ?? ''
  const email = profile?.email ?? user.email ?? ''
  const name = `${first} ${last}`.trim() || email.split('@')[0] || 'My Account'
  const initials = ((first[0] ?? '') + (last[0] ?? '') || email.slice(0, 2)).toUpperCase()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        <AccountSidebar name={name} email={email} initials={initials} avatarUrl={profile?.avatar_url ?? null} />
        <main className="mt-6 min-w-0 lg:mt-0">{children}</main>
      </div>
    </div>
  )
}
