import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Package, LogOut, User } from 'lucide-react'

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:    'bg-amber-50 border-amber-200 text-amber-700',
    processing: 'bg-blue-50 border-blue-200 text-blue-700',
    shipped:    'bg-violet-50 border-violet-200 text-violet-700',
    delivered:  'bg-green-50 border-green-200 text-green-700',
    cancelled:  'bg-red-50 border-red-200 text-red-700',
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[status] ?? styles.pending}`}>
      {status}
    </span>
  )
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  type OrderItem = { id: string; product_name: string; quantity: number; price: number }
  type Order = {
    id: string; status: string; total: number; email: string
    created_at: string; address: unknown; order_items: OrderItem[]
  }

  const profileRes = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  const ordersRes  = await supabase
    .from('orders')
    .select('*, order_items(id, product_name, quantity, price)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const profile = profileRes.data as { first_name?: string; last_name?: string } | null
  const orders  = (ordersRes.data ?? []) as Order[]
  const name    = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user.email

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 border border-green-200">
            <User className="h-6 w-6 text-[#1B7A3E]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition-colors hover:border-red-200 hover:text-red-500"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </form>
      </div>

      {/* Order history */}
      <section>
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-gray-900">
          <Package className="h-5 w-5 text-[#1B7A3E]" />
          Order History
        </h2>

        {!orders?.length ? (
          <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-gray-200" />
            <p className="font-medium text-gray-500">No orders yet</p>
            <p className="mt-1 text-sm text-gray-400">Your orders will appear here once placed.</p>
            <Link
              href="/products"
              className="mt-5 inline-flex items-center gap-1 rounded-lg bg-[#1B7A3E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#156331]"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const items = order.order_items ?? []
              return (
                <div key={order.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {/* Order header */}
                  <div className="flex flex-col gap-2 border-b border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-gray-700">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{new Date(order.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-50 px-6">
                    {items.slice(0, 3).map(item => (
                      <div key={item.id} className="flex items-center justify-between py-3">
                        <p className="text-sm text-gray-700">
                          {item.product_name}{' '}
                          <span className="text-gray-400">× {item.quantity}</span>
                        </p>
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="py-3 text-xs text-gray-400">
                        + {items.length - 3} more item{items.length - 3 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  {/* View button */}
                  <div className="px-6 py-3">
                    <Link
                      href={`/order-confirmation/${order.id}`}
                      className="text-sm font-medium text-[#1B7A3E] hover:underline"
                    >
                      View details →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
