import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/site'
import { categoryOf } from '@/lib/blog-categories'
import { faqsFor } from '@/lib/blog-faqs'
import { FaqList } from '@/components/common/page-schema'
import type { Database } from '@/lib/supabase/database.types'

type Post = Database['public']['Tables']['blog_posts']['Row']

async function getPost(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .maybeSingle()
    return (data as Post | null) ?? null
  } catch {
    return null
  }
}

/** Other published posts, for the related-reading block (internal linking). */
async function getRelated(slug: string): Promise<Pick<Post, 'slug' | 'title' | 'excerpt'>[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('blog_posts')
      .select('slug, title, excerpt')
      .neq('slug', slug)
      .not('published_at', 'is', null)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(4)
    return (data as Pick<Post, 'slug' | 'title' | 'excerpt'>[] | null) ?? []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found' }
  const description = post.excerpt ?? undefined
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `${SITE_URL}/blog/${slug}`,
      images: post.cover_image ? [post.cover_image] : undefined,
      publishedTime: post.published_at ?? undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const related = await getRelated(slug)
  const faqs = faqsFor(slug)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.cover_image ? [post.cover_image] : undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at,
    author: { '@type': post.author ? 'Person' : 'Organization', name: post.author ?? 'VapeHub' },
    publisher: { '@type': 'Organization', name: 'VapeHub' },
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
  }

  const faqJsonLd = faqs.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

      <Link href="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <Link
        href={`/blog/category/${categoryOf(slug).slug}`}
        className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#7C3AED] hover:underline"
      >
        {categoryOf(slug).name}
      </Link>
      <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-gray-400">
        {post.author ? `By ${post.author} · ` : ''}
        {post.published_at ? new Date(post.published_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
      </p>

      {post.cover_image && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
          <Image src={post.cover_image} alt="" fill sizes="(max-width:768px) 100vw, 768px" className="object-cover" unoptimized priority />
        </div>
      )}

      {/* Content is authored in the admin editor (trusted). If you ever accept
          untrusted HTML, sanitize before rendering. */}
      <div
        className="prose prose-neutral mt-8 max-w-none prose-headings:font-bold prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* FAQ — also emitted as FAQPage structured data above */}
      {faqs.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8" aria-label="Frequently asked questions">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Frequently asked questions</h2>
          <FaqList items={faqs} />
        </section>
      )}

      {/* Shop CTA — turn readers into buyers */}
      <div className="mt-12 rounded-2xl border border-[#7C3AED]/20 bg-violet-50/60 px-6 py-8 text-center">
        <h2 className="text-lg font-bold text-gray-900">Ready to shop?</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-600">
          2,000+ products in stock in Australia, dispatched within one business day. Free shipping over $300.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="rounded-lg bg-[#7C3AED] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#6D28D9]">
            Shop All Products
          </Link>
          <Link href="/deals" className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-400">
            View Pack Deals
          </Link>
        </div>
      </div>

      {/* Related reading — internal linking depth */}
      {related.length > 0 && (
        <section className="mt-12 border-t border-gray-200 pt-8" aria-label="Related guides">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Related guides</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map(r => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#7C3AED]"
              >
                <p className="text-sm font-semibold text-gray-900 group-hover:text-[#7C3AED]">{r.title}</p>
                {r.excerpt && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{r.excerpt}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
