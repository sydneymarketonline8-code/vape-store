import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Top-level categories (parent_id IS NULL) for the Shop mega-menu.
// Cached for an hour; the client fetch uses force-cache + revalidate: 3600.
export const revalidate = 3600

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order')
      .is('parent_id', null)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return NextResponse.json({ categories: data ?? [] })
  } catch {
    // DB not reachable → empty list; the client falls back to its static taxonomy.
    return NextResponse.json({ categories: [] })
  }
}
