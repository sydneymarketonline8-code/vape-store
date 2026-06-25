import type { Metadata } from 'next'
import Link from 'next/link'
import { UserPlus, Share2, DollarSign, ArrowRight, Link2, Users } from 'lucide-react'
import { whatsappLink } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Affiliate Program',
  description: 'Earn commission promoting Aussie Vape. Sign up, share your link, and earn on every qualifying sale.',
}

// Default commission rate (matches affiliates.commission_rate default in the schema).
const COMMISSION_RATE = '10%'

const STEPS = [
  { icon: UserPlus, title: 'Sign Up', copy: 'Create a free account — you’ll get a unique referral code and link in your dashboard.' },
  { icon: Share2, title: 'Share', copy: 'Share your link with friends, followers or your community. Anyone who registers through it is credited to you.' },
  { icon: DollarSign, title: 'Earn', copy: `Earn ${COMMISSION_RATE} on every qualifying sale from people you refer. Track it all in your account.` },
]

export default function AffiliatePage() {
  const applyWa = whatsappLink('Hi Aussie Vape, I’d like to join the affiliate program.')

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        {/* Left */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Affiliate Program</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Earn with Aussie Vape</h1>
          <p className="mt-3 text-gray-600">
            Love our products? Get paid to share them. Earn <strong>{COMMISSION_RATE} on every qualifying sale</strong> from
            customers you refer — no cost to join.
          </p>

          <ol className="mt-8 space-y-5">
            {STEPS.map(({ icon: Icon, title, copy }, i) => (
              <li key={title} className="flex gap-4">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{title}</h3>
                  <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{copy}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark">
              Join the Affiliate Program <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={applyWa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:border-gray-400">
              Ask on WhatsApp
            </a>
          </div>
          <p className="mt-3 text-xs text-gray-400">Already have an account? Find your referral link under My Account → Referral Program.</p>
        </div>

        {/* Right — dashboard mock */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">Affiliate Dashboard</span>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">Active</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-400"><Users className="h-3.5 w-3.5" /> Referrals</div>
              <p className="mt-1 text-2xl font-bold text-gray-900">128</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-400"><DollarSign className="h-3.5 w-3.5" /> Earnings</div>
              <p className="mt-1 text-2xl font-bold text-gray-900">$1,940</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-400"><Link2 className="h-3.5 w-3.5" /> Your referral link</div>
            <p className="mt-1 break-all font-mono text-xs text-primary">aussievape.com.au/register?ref=VAPER128</p>
          </div>
          <div className="mt-3 space-y-2">
            {[['Order #AV-2041', '+$8.40'], ['Order #AV-2038', '+$31.10'], ['Order #AV-2033', '+$12.90']].map(([o, amt]) => (
              <div key={o} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs">
                <span className="text-gray-600">{o}</span>
                <span className="font-semibold text-green-600">{amt}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[11px] text-gray-400">Sample dashboard — figures for illustration.</p>
        </div>
      </div>
    </div>
  )
}
