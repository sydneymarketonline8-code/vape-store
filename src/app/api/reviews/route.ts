import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/reviews?productId=ID → approved reviews for a product.
export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId')
  if (!productId) return NextResponse.json({ reviews: [] })

  try {
    const supabase = await createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any
    const { data, error } = await db
      .from('reviews')
      .select('id, product_id, reviewer_name, rating, title, body, created_at')
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) throw error

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviews = (data ?? []).map((r: any) => ({
      id: r.id,
      productId: r.product_id,
      reviewerName: r.reviewer_name,
      rating: r.rating,
      title: r.title,
      body: r.body,
      createdAt: r.created_at,
      verified: false,
    }))
    return NextResponse.json({ reviews })
  } catch {
    // Table missing / DB unreachable → empty list (don't break the page).
    return NextResponse.json({ reviews: [] })
  }
}

// POST /api/reviews → insert a review (pending approval). Requires auth.
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'You must be signed in to leave a review.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })

  const { productId, rating, reviewerName, title } = body
  const reviewBody = body.body

  const ratingNum = Number(rating)
  if (!productId || !Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json({ error: 'A product and a rating of 1–5 are required.' }, { status: 400 })
  }
  if (!reviewBody?.trim()) {
    return NextResponse.json({ error: 'Please write your review.' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data, error } = await db
    .from('reviews')
    .insert({
      product_id: productId,
      user_id: user.id,
      reviewer_name: (reviewerName?.trim() || user.email?.split('@')[0] || 'Anonymous').slice(0, 80),
      rating: ratingNum,
      title: title?.trim() || null,
      body: reviewBody.trim(),
      status: 'pending', // hidden until an admin approves
    })
    .select('id, product_id, reviewer_name, rating, title, body, created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(
    {
      review: {
        id: data.id,
        productId: data.product_id,
        reviewerName: data.reviewer_name,
        rating: data.rating,
        title: data.title,
        body: data.body,
        createdAt: data.created_at,
        verified: false,
      },
    },
    { status: 201 }
  )
}
