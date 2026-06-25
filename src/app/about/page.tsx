import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, Truck, Sparkles, MessageCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Aussie Vape is an Australian-owned online vape store — curated range, fast dispatch, and friendly support for adult vapers.',
}

const VALUES = [
  { icon: ShieldCheck, title: 'Strictly 18+', copy: 'Every order is age-verified. We never market to minors and we comply with applicable product and advertising rules.' },
  { icon: Truck, title: 'Fast Dispatch', copy: 'Orders go out within one business day from our Australian warehouse, with free shipping on orders over $300.' },
  { icon: Sparkles, title: 'Curated Range', copy: 'We stock the disposables, pods, e-liquids and pouches customers actually ask for — from the brands you trust.' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 to-green-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">Australia&apos;s #1 Online Vape Store</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">About Aussie Vape</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
            An Australian-owned online vape store built for adult vapers who want a reliable range, fair prices, and fast dispatch.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Mission */}
        <section className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 leading-relaxed text-gray-600">
            We started Aussie Vape to make buying vapes online simple, honest and fast for Australian adults. That means a
            tightly curated catalogue, clear product information, fair pricing, and real human support over WhatsApp — never
            pushy upsells or confusing fine print. Whether you&apos;re switching from cigarettes or restocking your favourite
            disposable, we want it to be the easiest part of your day.
          </p>
        </section>

        {/* Values */}
        <section className="mt-16">
          <h2 className="text-center text-2xl font-bold text-gray-900">Our Values</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Promise strip */}
        <section className="mt-16 rounded-2xl bg-gray-50 px-6 py-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Our Promise</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 text-sm text-gray-600 sm:grid-cols-3">
            <div><p className="text-lg font-bold text-primary">Australia-wide</p><p className="mt-1">Fast, tracked shipping to every state &amp; territory</p></div>
            <div><p className="text-lg font-bold text-primary">2,000+ products</p><p className="mt-1">Disposables, pods, e-liquids, pouches &amp; accessories</p></div>
            <div><p className="text-lg font-bold text-primary">Real support</p><p className="mt-1">Talk to a human on WhatsApp, not a bot</p></div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Ready to shop?</h2>
          <p className="max-w-xl text-gray-600">Browse our full range of disposables, pod systems, e-liquids and more.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
              Shop All Products <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-gray-400">
              <MessageCircle className="h-4 w-4" /> Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
