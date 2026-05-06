import Link from 'next/link'
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'
import { getFeaturedProducts } from '@/data/products'
import { HeroBg } from '@/components/common/hero-bg'

export default function HomePage() {
  const featured = getFeaturedProducts()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[88vh] flex items-center">
        <HeroBg />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-400">
              ✦ New arrivals just dropped
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight mb-6">
              PREMIUM
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
                VAPING
              </span>
              <br />
              EXPERIENCE
            </h1>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl leading-relaxed">
              Discover the finest disposables, mods, and e-liquids. Free shipping on orders over
              $50. For adults 21+ only.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-4 font-semibold text-white hover:bg-violet-500 transition-all hover:gap-3 active:scale-95"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products?category=disposables"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-all"
              >
                View Disposables
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $50' },
              { icon: Shield, title: 'Age Verified Store', desc: 'Strictly 21+ only' },
              { icon: Headphones, title: '24/7 Support', desc: 'Always here to help' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 px-8 py-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20">
                  <Icon className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{title}</p>
                  <p className="text-xs text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Shop by Category</h2>
          <p className="text-zinc-500">Find exactly what you&apos;re looking for</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Disposables',
              desc: '50+ products',
              href: '/products?category=disposables',
              gradient: 'from-violet-600/20 to-violet-900/20',
              border: 'border-violet-800/30',
            },
            {
              label: 'Mods & Kits',
              desc: '30+ products',
              href: '/products?category=mods',
              gradient: 'from-blue-600/20 to-blue-900/20',
              border: 'border-blue-800/30',
            },
            {
              label: 'E-Liquids',
              desc: '100+ flavors',
              href: '/products?category=e-liquids',
              gradient: 'from-emerald-600/20 to-emerald-900/20',
              border: 'border-emerald-800/30',
            },
            {
              label: 'Accessories',
              desc: 'Coils, cases & more',
              href: '/products?category=accessories',
              gradient: 'from-orange-600/20 to-orange-900/20',
              border: 'border-orange-800/30',
            },
          ].map(cat => (
            <Link
              key={cat.label}
              href={cat.href}
              className={`group relative overflow-hidden rounded-2xl border ${cat.border} bg-gradient-to-br ${cat.gradient} p-6 hover:scale-[1.02] transition-transform`}
            >
              <h3 className="font-bold text-white text-lg mb-1">{cat.label}</h3>
              <p className="text-sm text-zinc-400">{cat.desc}</p>
              <ArrowRight className="mt-4 h-4 w-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Featured Products</h2>
              <p className="text-zinc-500">Our most popular picks</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Banner */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-violet-800/30 bg-gradient-to-r from-violet-900/20 to-blue-900/20 p-10 text-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Trusted by 10,000+ Vapers
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto mb-8 leading-relaxed">
            &quot;Hands-down the best vape shop online. Fast shipping, great selection, and the
            products are always legit. Never buying from anywhere else.&quot;
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
