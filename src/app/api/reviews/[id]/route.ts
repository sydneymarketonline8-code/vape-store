import { NextRequest } from 'next/server'
import { z } from 'zod'
import { createClient, isAdmin } from '@/lib/supabase/server'
import { ok, err, zodErr, forbidden } from '@/lib/api/response'

const Body = z.object({ status: z.enum(['approved', 'rejected', 'pending']) })

// PUT /api/reviews/[id] — admin: approve / reject a review.
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return forbidden()

  const parsed = Body.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return zodErr(parsed.error)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('reviews')
    .update({ status: parsed.data.status })
    .eq('id', id)
    .select()
    .single()
  if (error) return err(error.message, 400)
  return ok({ review: data })
}
