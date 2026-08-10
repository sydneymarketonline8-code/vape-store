'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SITE_TAGLINE } from '@/lib/site'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [status, setStatus] = useState<'checking' | 'ready' | 'invalid'>('checking')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    // The browser client auto-exchanges the recovery code/token from the URL into
    // a session. Confirm one exists so the user can set a new password.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus('ready')
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setStatus('ready')
    })
    const t = setTimeout(() => setStatus(s => (s === 'checking' ? 'invalid' : s)), 4000)
    return () => {
      sub.subscription.unsubscribe()
      clearTimeout(t)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setDone(true)
      setTimeout(() => router.push('/login'), 2500)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-4 inline-flex flex-col items-center">
            <span className="text-2xl font-black tracking-tight text-[#1B7A3E]">VAPESAU</span>
            <span className="text-xs text-gray-400">{SITE_TAGLINE}</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Set a new password</h1>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {done ? (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 className="h-8 w-8 text-[#1B7A3E]" />
                </span>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Password updated</h2>
              <p className="mt-2 text-sm text-gray-500">Redirecting you to login…</p>
            </div>
          ) : status === 'checking' ? (
            <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-gray-300" /></div>
          ) : status === 'invalid' ? (
            <div className="text-center">
              <p className="font-medium text-gray-900">This reset link is invalid or has expired.</p>
              <Link href="/forgot-password" className="mt-4 inline-block rounded-lg bg-[#1B7A3E] px-6 py-3 font-semibold text-white hover:bg-[#156331]">
                Request a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
              )}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">New password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-gray-900 placeholder-gray-400 focus:border-[#1B7A3E] focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B7A3E] py-3 font-semibold text-white transition-colors hover:bg-[#156331] disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
