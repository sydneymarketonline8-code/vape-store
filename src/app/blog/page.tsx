import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Newspaper } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Vaping guides, product news and tips from the Aussie Vape team.',
}

export const revalidate = 3600

type PostCard = {
  id: string; slug: string; title: string; excerpt: string | null
  cover_image: string | null; author: string | null; published_at: string | null
}

export default async function BlogIndexPage() {
  let posts: PostCard[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_image, author, published_at')
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
    posts = (data ?? []) as PostCard[]
  } catch {
    posts = []
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">The Aussie Vape Blog</h1>
        <p className="mt-3 text-gray-600">Guides, product news and tips for Australian vapers.</p>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <Newspaper className="mb-3 h-10 w-10 text-gray-300" />
          <p className="font-medium text-gray-700">No posts yet</p>
          <p className="mt-1 text-sm text-gray-400">Check back soon — we&apos;re working on some good ones.</p>
        </div>
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
                  {post.author ? `${post.author} · ` : ''}
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
