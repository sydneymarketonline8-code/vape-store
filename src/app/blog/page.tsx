import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Newspaper, ArrowRight } from 'lucide-react'
import { PageSchema } from '@/components/common/page-schema'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Vaping Blog & Guides',
  description:
    'Vaping guides, product news and tips for Australian vapers from the Aussie Vape team — device advice, deals and how-tos.',
  alternates: { canonical: '/blog' },
}

export const revalidate = 3600

type PostCard = {
  id: string; slug: string; title: string; excerpt: string | null
  cover_image: string | null; author: string | null; published_at: string | null
}

// When there are no posts yet, point readers at the genuine guides we do have.
const GUIDES = [
  { href: '/beginners-guide', title: 'Beginners Guide to Vaping', desc: 'Device types, nicotine strengths and how to use a disposable.' },
  { href: '/vaping-laws', title: 'Vaping Laws in Australia', desc: 'Age limits, the TGA framework and where to check the current rules.' },
  { href: '/deals', title: 'Vape Deals & Bundles', desc: 'Multi-pack deals and the biggest savings, updated regularly.' },
  { href: '/faq', title: 'Help & FAQs', desc: 'Ordering, PayID/crypto payment, shipping and returns answered.' },
]

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

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Aussie Vape Blog',
    description: 'Vaping guides, product news and tips for Australian vapers.',
    url: `${SITE_URL}/blog`,
    ...(posts.length
      ? {
          blogPost: posts.slice(0, 20).map(p => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `${SITE_URL}/blog/${p.slug}`,
            datePublished: p.published_at ?? undefined,
            author: { '@type': 'Organization', name: 'Aussie Vape' },
          })),
        }
      : {}),
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <PageSchema name="Blog" slug="/blog" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">The Aussie Vape Blog</h1>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Guides, product news and tips for Australian vapers — from choosing your first device to understanding the rules and
          finding the best deals.
        </p>
      </div>

      {posts.length === 0 ? (
        <div>
          <div className="mb-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-12 text-center">
            <Newspaper className="mb-3 h-10 w-10 text-gray-300" />
            <p className="font-medium text-gray-700">Articles are on the way</p>
            <p className="mt-1 text-sm text-gray-400">In the meantime, start with our guides below.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {GUIDES.map(g => (
              <Link key={g.href} href={g.href} className="group flex items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#1B7A3E]">{g.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">{g.desc}</p>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-gray-300 group-hover:text-[#1B7A3E]" />
              </Link>
            ))}
          </div>
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
