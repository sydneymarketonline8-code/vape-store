import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customer' }

type Profile = { id: string; first_name: string | null; last_name: string | null; email: string | null; phone: string | null; role: string; created_at: string }
type Order = { id: string; order_number: string | null; status: string; total: number; created_at: string }

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: profile } = (await db.from('profiles').select('*').eq('id', id).maybeSingle()) as { data: Profile | null }
  if (!profile) notFound()

  const { data: ordersData } = await db.from('orders').select('id, order_number, status, total, created_at').eq('user_id', id).order('created_at', { ascending: false })
  const orders = (ordersData ?? []) as Order[]
  const totalSpent = orders.reduce((s, o) => s + Number(o.total), 0)
  const name = `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || profile.email || '—'

  return (
    <div>
      <Link href="/admin/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to Customers
      </Link>

      <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
        <p className="mt-1 text-sm text-neutral-500">{profile.email}{profile.phone ? ` · ${profile.phone}` : ''}</p>
        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <div><span className="text-neutral-400">Orders:</span> <span className="font-semibold text-neutral-900">{orders.length}</span></div>
          <div><span className="text-neutral-400">Total spent:</span> <span className="font-semibold text-neutral-900">{formatPrice(totalSpent)}</span></div>
          <div><span className="text-neutral-400">Joined:</span> <span className="font-semibold text-neutral-900">{new Date(profile.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
          <div><span className="text-neutral-400">Role:</span> <span className="font-semibold capitalize text-neutral-900">{profile.role}</span></div>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-bold text-neutral-900">Order History</h2>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-400">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-100 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr><th className="px-5 py-3 font-medium">Order #</th><th className="px-5 py-3 font-medium">Date</th><th className="px-5 py-3 font-medium">Total</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3 font-mono text-neutral-900">{o.order_number ?? o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-3 text-neutral-500">{new Date(o.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-5 py-3 font-medium text-neutral-900">{formatPrice(o.total)}</td>
                  <td className="px-5 py-3"><OrderStatusBadge status={o.status} /></td>
                  <td className="px-5 py-3 text-right"><Link href={`/admin/orders/${o.id}`} className="text-xs font-medium text-primary hover:underline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
