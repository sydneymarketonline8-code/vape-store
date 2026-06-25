import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  // Order creation runs with the service role (RLS would otherwise block guest
  // inserts). user_id is taken from the authenticated session, not the client.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any

  const { data: { user } } = await supabase.auth.getUser()

  const body = await request.json()
  const { items, total, email, address, paymentMethod } = body

  if (!items?.length) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const payment = paymentMethod === 'crypto' || paymentMethod === 'payid' ? paymentMethod : null

  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({
      user_id: user?.id ?? null,
      status: 'pending',
      total,
      email,
      // Payment method rides inside the address jsonb so checkout never depends
      // on a dedicated column existing (manual PayID/crypto, settled via WhatsApp).
      address: { ...(address ?? {}), paymentMethod: payment },
    })
    .select()
    .single()

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 })
  }

  const orderItems = items.map((item: {
    product: { id: string; name: string; price: number }
    quantity: number
    selectedFlavor?: string
    selectedNicotine?: number
  }) => ({
    order_id:          order.id,
    product_id:        item.product.id,
    product_name:      item.product.name,
    quantity:          item.quantity,
    price:             item.product.price,
    selected_flavor:   item.selectedFlavor  ?? null,
    selected_nicotine: item.selectedNicotine ?? null,
  }))

  const { error: itemsError } = await db.from('order_items').insert(orderItems)

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  return NextResponse.json({ order }, { status: 201 })
}

export async function GET() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data: orders, error } = await db
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders })
}
