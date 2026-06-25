import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'

export const revalidate = 3600

type Cat = { id: string; name: string; slug: string; sort_order: number; parent_id: string | null }
type CatNode = Cat & { children: CatNode[] }

// Cached category tree — tagged 'categories', revalidated hourly. Bust it with
// revalidateTag('categories') when categories change in the admin.
const getCategoryTree = unstable_cache(
  async (): Promise<CatNode[]> => {
    const supabase = createServiceClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('categories')
      .select('id, name, slug, sort_order, parent_id')
      .order('sort_order', { ascending: true })

    const cats = (data ?? []) as Cat[]
    const byParent = new Map<string | null, CatNode[]>()
    for (const c of cats) {
      const key = c.parent_id ?? null
      byParent.set(key, [...(byParent.get(key) ?? []), { ...c, children: [] }])
    }
    const attach = (nodes: CatNode[]): CatNode[] =>
      nodes.map(n => ({ ...n, children: attach(byParent.get(n.id) ?? []) }))
    return attach(byParent.get(null) ?? [])
  },
  ['category-tree'],
  { tags: ['categories'], revalidate: 3600 }
)

// GET /api/categories — active categories as a parent → children tree.
export async function GET() {
  const headers = { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' }
  try {
    const tree = await getCategoryTree()
    return NextResponse.json({ categories: tree }, { headers })
  } catch {
    return NextResponse.json({ categories: [] }, { headers })
  }
}
