import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/account/profile-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Account Info' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, phone, avatar_url')
    .eq('id', user!.id)
    .maybeSingle<{ first_name: string | null; last_name: string | null; phone: string | null; avatar_url: string | null }>()

  const fullName = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Account Info</h1>
      <ProfileForm
        userId={user!.id}
        initialName={fullName}
        initialPhone={profile?.phone ?? ''}
        initialAvatar={profile?.avatar_url ?? null}
      />
    </div>
  )
}
