import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { OrderStatusBadge } from '@/components/account/order-status-badge'
import { Sparkline } from '@/components/admin/sparkline'
import { ArrowDownRight, ArrowUpRight, DollarSign, ShoppingCart, UserPlus, Receipt } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

type OrderRow = { id: string; order_number: string | null; total: number; status: string; created_at: string; email: string | null; address: { name?: string } | null }

function pctChange(curr: number, prev: number): number | null {
  if (prev === 0) return curr > 0 ? 100 : null
  return Math.round(((curr - prev) / prev) * 100)
}

function KpiCard({ label, value, change, series, icon: Icon }: {
  label: string; value: string; change: number | null; series: number[]
  icon: React.ComponentType<{ className?: string }>
}) {
  const up = (change ?? 0) >= 0
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</span>
        <Icon className="h-4 w-4 text-neutral-300" />
      </div>
      <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        {change == null ? (
          <span className="text-xs text-neutral-400">vs last month</span>
        ) : (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? 'text-green-600' : 'text-red-600'}`}>
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(change)}% <span className="font-normal text-neutral-400">vs last month</span>
          </span>
        )}
        <div className="w-20">
          <Sparkline data={series} className={up ? 'text-primary' : 'text-red-400'} />
        </div>
      </div>
    </div>
  )
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const now = new Date()
  const startThis = new Date(now.getFullYear(), now.getMonth(), 1)
  const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Orders since start of last month (covers this + last month).
  const { data: ordersData } = await db
    .from('orders')
    .select('id, order_number, total, status, created_at, email, address')
    .gte('created_at', startLast.toISOString())
    .order('created_at', { ascending: false })
  const orders = (ordersData ?? []) as OrderRow[]

  const thisMonth = orders.filter(o => new Date(o.created_at) >= startThis)
  const lastMonth = orders.filter(o => {
    const d = new Date(o.created_at)
    return d >= startLast && d < startThis
  })

  const revThis = thisMonth.reduce((s, o) => s + Number(o.total), 0)
  const revLast = lastMonth.reduce((s, o) => s + Number(o.total), 0)
  const aovThis = thisMonth.length ? revThis / thisMonth.length : 0
  const aovLast = lastMonth.length ? revLast / lastMonth.length : 0

  // New customers this/last month.
  const { count: custThis } = await db.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', startThis.toISOString())
  const { count: custLast } = await db.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', startLast.toISOString()).lt('created_at', startThis.toISOString())

  // Daily revenue series for this month (sparkline).
  const daysInMonth = now.getDate()
  const daily = Array.from({ length: daysInMonth }, () => 0)
  for (const o of thisMonth) daily[new Date(o.created_at).getDate() - 1] += Number(o.total)
  const dailyCount = Array.from({ length: daysInMonth }, () => 0)
  for (const o of thisMonth) dailyCount[new Date(o.created_at).getDate() - 1] += 1

  // Recent orders.
  const recent = orders.slice(0, 10)

  // Low stock (products in Supabase with inventory_qty < 5).
  const { data: lowStock } = await db
    .from('products')
    .select('id, name, sku, inventory_qty')
    .lt('inventory_qty', 5)
    .order('inventory_qty', { ascending: true })
    .limit(10)

  // Top products by quantity sold.
  const { data: items } = await db.from('order_items').select('product_name, quantity').limit(2000)
  const qtyByName = new Map<string, number>()
  for (const it of (items ?? []) as { product_name: string; quantity: number }[]) {
    qtyByName.set(it.product_name, (qtyByName.get(it.product_name) ?? 0) + it.quantity)
  }
  const topProducts = [...qtyByName.entries()].map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 5)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Revenue (this month)" value={formatPrice(revThis)} change={pctChange(revThis, revLast)} series={daily} icon={DollarSign} />
        <KpiCard label="Orders (this month)" value={String(thisMonth.length)} change={pctChange(thisMonth.length, lastMonth.length)} series={dailyCount} icon={ShoppingCart} />
        <KpiCard label="New Customers" value={String(custThis ?? 0)} change={pctChange(custThis ?? 0, custLast ?? 0)} series={dailyCount} icon={UserPlus} />
        <KpiCard label="Avg. Order Value" value={formatPrice(aovThis)} change={pctChange(aovThis, aovLast)} series={daily} icon={Receipt} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent orders */}
        <div className="rounded-xl border border-neutral-200 bg-white xl:col-span-2">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
            <h2 className="font-semibold text-neutral-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-neutral-400">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                  <tr><th className="px-5 py-2.5 font-medium">Order #</th><th className="px-5 py-2.5 font-medium">Customer</th><th className="px-5 py-2.5 font-medium">Total</th><th className="px-5 py-2.5 font-medium">Status</th><th className="px-5 py-2.5 font-medium">Date</th><th className="px-5 py-2.5" /></tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recent.map(o => (
                    <tr key={o.id} className="hover:bg-neutral-50">
                      <td className="px-5 py-2.5 font-mono text-neutral-900">{o.order_number ?? o.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-5 py-2.5 text-neutral-600">{o.address?.name ?? o.email ?? '—'}</td>
                      <td className="px-5 py-2.5 font-medium text-neutral-900">{formatPrice(o.total)}</td>
                      <td className="px-5 py-2.5"><OrderStatusBadge status={o.status} /></td>
                      <td className="px-5 py-2.5 text-neutral-500">{new Date(o.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</td>
                      <td className="px-5 py-2.5 text-right"><Link href={`/admin/orders/${o.id}`} className="text-xs font-medium text-primary hover:underline">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-5 py-3"><h2 className="font-semibold text-neutral-900">Top Products</h2></div>
          {topProducts.length === 0 ? (
            <p className="p-6 text-sm text-neutral-400">No sales data yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3 px-5 py-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-500">{i + 1}</span>
                  <span className="line-clamp-1 flex-1 text-sm text-neutral-700">{p.name}</span>
                  <span className="text-sm font-semibold text-neutral-900">{p.qty}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Low stock */}
      <div className="mt-6 rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 px-5 py-3"><h2 className="font-semibold text-neutral-900">Low Stock Alerts</h2></div>
        {!lowStock || lowStock.length === 0 ? (
          <p className="p-6 text-sm text-neutral-400">No low-stock products. (Inventory tracking requires products in Supabase.)</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
                <tr><th className="px-5 py-2.5 font-medium">Product</th><th className="px-5 py-2.5 font-medium">SKU</th><th className="px-5 py-2.5 font-medium">Stock</th><th className="px-5 py-2.5" /></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {(lowStock as { id: string; name: string; sku: string | null; inventory_qty: number }[]).map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="px-5 py-2.5 text-neutral-900">{p.name}</td>
                    <td className="px-5 py-2.5 font-mono text-xs text-neutral-500">{p.sku ?? '—'}</td>
                    <td className="px-5 py-2.5"><span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">{p.inventory_qty}</span></td>
                    <td className="px-5 py-2.5 text-right"><Link href={`/admin/products/${p.id}`} className="text-xs font-medium text-primary hover:underline">Edit</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
