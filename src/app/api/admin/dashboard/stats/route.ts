import { createClient, isAdmin } from '@/lib/supabase/server'
import { ok, forbidden } from '@/lib/api/response'

function pct(curr: number, prev: number): number | null {
  if (prev === 0) return curr > 0 ? 100 : null
  return Math.round(((curr - prev) / prev) * 100)
}

// GET /api/admin/dashboard/stats — KPI numbers for the admin dashboard.
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.id))) return forbidden()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const now = new Date()
  const startThis = new Date(now.getFullYear(), now.getMonth(), 1)
  const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const { data: ordersData } = await db
    .from('orders')
    .select('total, created_at')
    .gte('created_at', startLast.toISOString())
  const orders = (ordersData ?? []) as { total: number; created_at: string }[]
  const thisM = orders.filter(o => new Date(o.created_at) >= startThis)
  const lastM = orders.filter(o => { const d = new Date(o.created_at); return d >= startLast && d < startThis })

  const revThis = thisM.reduce((s, o) => s + Number(o.total), 0)
  const revLast = lastM.reduce((s, o) => s + Number(o.total), 0)

  const { count: custThis } = await db.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', startThis.toISOString())
  const { count: custLast } = await db.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', startLast.toISOString()).lt('created_at', startThis.toISOString())

  return ok({
    revenue: { value: revThis, change: pct(revThis, revLast) },
    orders: { value: thisM.length, change: pct(thisM.length, lastM.length) },
    newCustomers: { value: custThis ?? 0, change: pct(custThis ?? 0, custLast ?? 0) },
    avgOrderValue: {
      value: thisM.length ? revThis / thisM.length : 0,
      change: pct(thisM.length ? revThis / thisM.length : 0, lastM.length ? revLast / lastM.length : 0),
    },
  })
}
