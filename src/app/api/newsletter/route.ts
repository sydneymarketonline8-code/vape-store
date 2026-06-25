import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { ok, err, zodErr } from '@/lib/api/response'

const Body = z.object({ email: z.string().email() })

// POST /api/newsletter — subscribe an email address.
export async function POST(req: NextRequest) {
  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return zodErr(parsed.error)
  const email = parsed.data.email.trim().toLowerCase()

  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from('newsletter_subscribers').insert({ email })

  // Unique violation = already subscribed → treat as success.
  if (error && error.code !== '23505') return err(error.message, 500)
  return ok({ subscribed: true, email }, { status: 201 })
}
