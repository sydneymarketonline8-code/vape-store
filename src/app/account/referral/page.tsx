import { createClient } from '@/lib/supabase/server'
import { SITE_URL } from '@/lib/site'
import { CopyButton } from '@/components/account/copy-button'
import { Users, Mail, MessageCircle, Link2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Referral Program' }

export default async function ReferralPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any

  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code')
    .eq('id', user!.id)
    .maybeSingle<{ referral_code: string | null }>()

  const code = profile?.referral_code ?? '—'
  const { count } = await db
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('referred_by', user!.id)
  const totalReferrals = count ?? 0

  const referralLink = `${SITE_URL}/register?ref=${code}`
  const shareMsg = `Join Aussie Vape and shop premium vapes — register with my link: ${referralLink}`
  const waShare = `https://wa.me/?text=${encodeURIComponent(shareMsg)}`
  const emailShare = `mailto:?subject=${encodeURIComponent('Shop Aussie Vape')}&body=${encodeURIComponent(shareMsg)}`

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Referral Program</h1>

      {/* Referral code box */}
      <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-6 text-center">
        <p className="text-sm font-medium text-gray-600">Your referral code</p>
        <p className="my-2 font-mono text-3xl font-black tracking-widest text-primary">{code}</p>
        <p className="mx-auto max-w-md break-all text-xs text-gray-500">{referralLink}</p>
        <div className="mt-4 flex justify-center">
          <CopyButton value={referralLink} label="Copy Link" />
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            <Users className="h-4 w-4" /> Total Referrals
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalReferrals}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Earnings</div>
          <p className="mt-2 text-3xl font-bold text-gray-900">$0.00</p>
          <p className="mt-1 text-[11px] text-gray-400">Commission coming soon</p>
        </div>
      </div>

      {/* Share */}
      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-base font-bold text-gray-900">Share your link</h2>
        <div className="flex flex-wrap gap-3">
          <a href={waShare} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          <a href={emailShare} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-400">
            <Mail className="h-4 w-4" /> Email
          </a>
          <CopyButton value={referralLink} label="Copy Link" className="px-4 py-2.5 text-sm" />
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
          <Link2 className="h-3.5 w-3.5" />
          Friends who register with your link are credited to you automatically.
        </p>
      </div>
    </div>
  )
}
