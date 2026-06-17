import { createClient } from '@/lib/supabase/server'
import { createClient as createPlainClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })

  const { fullName, phone, avatarUrl, currentPassword, newPassword, confirmPassword } = body

  // ── Profile fields ──
  const name = (fullName ?? '').trim()
  const [first, ...rest] = name.split(/\s+/)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {
    first_name: first || null,
    last_name: rest.join(' ') || null,
    phone: phone?.trim() || null,
  }
  if (typeof avatarUrl === 'string' && avatarUrl) update.avatar_url = avatarUrl

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { error: profileError } = await db.from('profiles').update(update).eq('id', user.id)
  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  // ── Optional password change ──
  if (newPassword) {
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match.' }, { status: 400 })
    }
    if (!currentPassword) {
      return NextResponse.json({ error: 'Enter your current password to change it.' }, { status: 400 })
    }

    // Verify current password with a throwaway client (doesn't touch our cookies).
    const verifier = createPlainClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error: verifyError } = await verifier.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })
    if (verifyError) {
      return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })
    }

    const { error: pwError } = await supabase.auth.updateUser({ password: newPassword })
    if (pwError) {
      return NextResponse.json({ error: pwError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
