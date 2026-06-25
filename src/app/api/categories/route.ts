import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600

type Cat = { id: string; name: string; slug: string; sort_order: number; parent_id: string | null }
type CatNode = Cat & { children: CatNode[] }

// GET /api/categories — active categories as a parent → children tree.
// Cache-Control: public, max-age=3600.
export async function GET() {
  const headers = { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' }
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order, parent_id')
      .order('sort_order', { ascending: true })
    if (error) throw error

    const cats = (data ?? []) as Cat[]
    const byParent = new Map<string | null, CatNode[]>()
    for (const c of cats) {
      const key = c.parent_id ?? null
      byParent.set(key, [...(byParent.get(key) ?? []), { ...c, children: [] }])
    }
    const attach = (nodes: CatNode[]): CatNode[] =>
      nodes.map(n => ({ ...n, children: attach(byParent.get(n.id) ?? []) }))
    const tree = attach(byParent.get(null) ?? [])

    return NextResponse.json({ categories: tree }, { headers })
  } catch {
    // DB unreachable → empty list; the client falls back to its static taxonomy.
    return NextResponse.json({ categories: [] }, { headers })
  }
}
