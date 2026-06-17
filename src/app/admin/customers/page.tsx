import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Search } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Customers' }

type Profile = { id: string; first_name: string | null; last_name: string | null; email: string | null; role: string; created_at: string }

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  let pq = db.from('profiles').select('id, first_name, last_name, email, role, created_at').order('created_at', { ascending: false }).limit(200)
  if (q.trim()) pq = pq.or(`email.ilike.%${q.trim()}%,first_name.ilike.%${q.trim()}%,last_name.ilike.%${q.trim()}%`)
  const { data: profilesData } = await pq
  const profiles = (profilesData ?? []) as Profile[]

  // Aggregate orders per customer.
  const { data: ordersData } = await db.from('orders').select('user_id, total')
  const agg = new Map<string, { count: number; spent: number }>()
  for (const o of (ordersData ?? []) as { user_id: string | null; total: number }[]) {
    if (!o.user_id) continue
    const a = agg.get(o.user_id) ?? { count: 0, spent: 0 }
    a.count += 1
    a.spent += Number(o.total)
    agg.set(o.user_id, a)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Customers</h1>

      <form className="mb-4 max-w-md" action="/admin/customers">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input name="q" defaultValue={q} placeholder="Search name or email…"
            className="w-full rounded-lg border border-neutral-300 py-2 pl-10 pr-3 text-sm focus:border-primary focus:outline-none" />
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {profiles.length === 0 ? (
          <p className="p-8 text-center text-sm text-neutral-400">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-100 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                <tr><th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium">Orders</th><th className="px-5 py-3 font-medium">Total Spent</th><th className="px-5 py-3 font-medium">Joined</th><th className="px-5 py-3 font-medium">Role</th></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {profiles.map(p => {
                  const name = `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim() || '—'
                  const a = agg.get(p.id)
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-3">
                        <Link href={`/admin/customers/${p.id}`} className="font-medium text-neutral-900 hover:text-primary">{name}</Link>
                      </td>
                      <td className="px-5 py-3 text-neutral-600">{p.email}</td>
                      <td className="px-5 py-3 text-neutral-600">{a?.count ?? 0}</td>
                      <td className="px-5 py-3 font-medium text-neutral-900">{formatPrice(a?.spent ?? 0)}</td>
                      <td className="px-5 py-3 text-neutral-500">{new Date(p.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-5 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${p.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-neutral-100 text-neutral-600'}`}>{p.role}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
