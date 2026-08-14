import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Newspaper } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PageSchema } from '@/components/common/page-schema'
import { SITE_URL } from '@/lib/site'
import { BLOG_CATEGORIES, getCategory, categoryOf } from '@/lib/blog-categories'

export const revalidate = 3600
export const dynamicParams = false

export function generateStaticParams() {
  return BLOG_CATEGORIES.map(c => ({ category: c.slug }))
}

type PostCard = {
  id: string; slug: string; title: string; excerpt: string | null
  cover_image: string | null; author: string | null; published_at: string | null
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) return {}
  return {
    title: `${cat.name} — Vaping Guides`,
    description: `${cat.blurb} Expert guides for Australian vapers from VapesAU.`,
    alternates: { canonical: `/blog/category/${cat.slug}` },
  }
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const cat = getCategory(category)
  if (!cat) notFound()

  let posts: PostCard[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image, author, published_at')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
    posts = ((data ?? []) as PostCard[]).filter(p => categoryOf(p.slug).slug === cat.slug)
  } catch {
    posts = []
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <PageSchema name={cat.name} slug={`/blog/category/${cat.slug}`} />

      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#1B7A3E]">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[#1B7A3E]">Blog</Link>
        <span>/</span>
        <span className="text-gray-600">{cat.name}</span>
      </nav>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{cat.name}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">{cat.blurb}</p>
      </div>

      {/* Other categories */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <Link href="/blog" className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]">
          All posts
        </Link>
        {BLOG_CATEGORIES.filter(c => c.slug !== cat.slug).map(c => (
          <Link
            key={c.slug}
            href={`/blog/category/${c.slug}`}
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-[#1B7A3E] hover:text-[#1B7A3E]"
          >
            {c.name}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="py-12 text-center text-gray-500">No posts in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
              <div className="relative aspect-[16/9] bg-gray-100">
                {post.cover_image ? (
                  <Image src={post.cover_image} alt="" fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-500 to-green-800"><Newspaper className="h-10 w-10 text-white/70" /></div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 group-hover:text-primary">{post.title}</h2>
                {post.excerpt && <p className="mt-2 line-clamp-3 flex-1 text-sm text-gray-600">{post.excerpt}</p>}
                <p className="mt-4 text-xs text-gray-400">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
